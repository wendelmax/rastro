import * as path from 'node:path';
import * as fs from 'node:fs';
import * as cdk from 'aws-cdk-lib';
import { aws_apigatewayv2 as apigwv2, aws_apigatewayv2_authorizers as authorizers, aws_apigatewayv2_integrations as integrations, aws_cloudfront as cloudfront, aws_cloudfront_origins as origins, aws_cognito as cognito, aws_ec2 as ec2, aws_iam as iam, aws_lambda as lambda, aws_rds as rds, aws_s3 as s3, aws_secretsmanager as secrets, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface RastroStackProps extends cdk.StackProps {
  environmentName: string;
}

export class RastroStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RastroStackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: `rastro-${props.environmentName}`,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: { minLength: 8, requireLowercase: true, requireUppercase: true, requireDigits: true },
      removalPolicy: props.environmentName === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });
    const userPoolClient = userPool.addClient('MobileClient', { generateSecret: false });
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [{ name: 'isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED, cidrMask: 24 }],
    });

    const database = new rds.DatabaseCluster(this, 'Database', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_16_6 }),
      writer: rds.ClusterInstance.serverlessV2('writer'),
      serverlessV2MinCapacity: props.environmentName === 'prod' ? 0.5 : 0.5,
      serverlessV2MaxCapacity: props.environmentName === 'prod' ? 8 : 2,
      defaultDatabaseName: 'rastro',
      credentials: rds.Credentials.fromGeneratedSecret('rastroadmin'),
      enableDataApi: true,
      removalPolicy: props.environmentName === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      deletionProtection: props.environmentName === 'prod',
    });

    const mediaBucket = new s3.Bucket(this, 'MediaBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      autoDeleteObjects: props.environmentName !== 'prod',
      removalPolicy: props.environmentName === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      cors: [{ allowedMethods: [s3.HttpMethods.PUT], allowedOrigins: ['*'], allowedHeaders: ['*'] }],
    });
    const distribution = new cloudfront.Distribution(this, 'MediaDistribution', {
      defaultBehavior: { origin: origins.S3BucketOrigin.withOriginAccessControl(mediaBucket) },
    });

    const api = new apigwv2.HttpApi(this, 'Api', {
      apiName: `rastro-${props.environmentName}`,
      corsPreflight: { allowHeaders: ['content-type', 'authorization'], allowMethods: [apigwv2.CorsHttpMethod.ANY], allowOrigins: ['*'] },
    });
    const authorizer = new authorizers.HttpJwtAuthorizer('CognitoAuthorizer', userPool.userPoolProviderUrl, { jwtAudience: [userPoolClient.userPoolClientId] });
    const lambdaEnvironment = {
      AURORA_CLUSTER_ARN: database.clusterArn,
      AURORA_SECRET_ARN: database.secret?.secretArn ?? '',
      AURORA_DATABASE: 'rastro',
      MEDIA_BUCKET: mediaBucket.bucketName,
    };
    const builtBackendPath = path.join(__dirname, '../../backend/dist');
    const backendPath = fs.existsSync(builtBackendPath) ? builtBackendPath : path.join(__dirname, '../../backend');
    const createHandler = (id: string, handler: string) => new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_24_X,
      code: lambda.Code.fromAsset(backendPath),
      handler,
      timeout: Duration.seconds(15),
      memorySize: 512,
      environment: lambdaEnvironment,
    });
    const trailHandler = createHandler('TrailHandler', 'src/handlers/trails.handler');
    const activityHandler = createHandler('ActivityHandler', 'src/handlers/activities.handler');
    const mediaHandler = createHandler('MediaHandler', 'src/handlers/media.handler');
    const pointHandler = createHandler('PointHandler', 'src/handlers/points.handler');
    const handlers = [trailHandler, activityHandler, mediaHandler, pointHandler];
    for (const handler of handlers) {
      database.secret?.grantRead(handler);
      mediaBucket.grantPut(handler);
      handler.addToRolePolicy(new iam.PolicyStatement({ actions: ['rds-data:ExecuteStatement', 'rds-data:BeginTransaction', 'rds-data:CommitTransaction', 'rds-data:RollbackTransaction'], resources: [database.clusterArn] }));
    }
    const publicIntegration = new integrations.HttpLambdaIntegration('TrailIntegration', trailHandler);
    const activityIntegration = new integrations.HttpLambdaIntegration('ActivityIntegration', activityHandler);
    const mediaIntegration = new integrations.HttpLambdaIntegration('MediaIntegration', mediaHandler);
    const pointIntegration = new integrations.HttpLambdaIntegration('PointIntegration', pointHandler);
    api.addRoutes({ path: '/v1/trails', methods: [apigwv2.HttpMethod.GET], integration: publicIntegration });
    api.addRoutes({ path: '/v1/trails', methods: [apigwv2.HttpMethod.PUT], integration: publicIntegration, authorizer });
    api.addRoutes({ path: '/v1/trails/{id}', methods: [apigwv2.HttpMethod.GET], integration: publicIntegration });
    api.addRoutes({ path: '/v1/private/trails/{id}', methods: [apigwv2.HttpMethod.GET], integration: publicIntegration, authorizer });
    api.addRoutes({ path: '/v1/trails/{trailId}/points', methods: [apigwv2.HttpMethod.GET], integration: pointIntegration });
    api.addRoutes({ path: '/v1/points', methods: [apigwv2.HttpMethod.PUT], integration: pointIntegration, authorizer });
    api.addRoutes({ path: '/v1/activities/sync', methods: [apigwv2.HttpMethod.POST], integration: activityIntegration, authorizer });
    api.addRoutes({ path: '/v1/media/presign', methods: [apigwv2.HttpMethod.POST], integration: mediaIntegration, authorizer });

    new secrets.Secret(this, 'RuntimeConfig', { secretName: `rastro/${props.environmentName}/runtime`, generateSecretString: { secretStringTemplate: JSON.stringify({ environment: props.environmentName }), generateStringKey: 'placeholder' } });
    new cdk.CfnOutput(this, 'ApiUrl', { value: api.apiEndpoint });
    new cdk.CfnOutput(this, 'CognitoUserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'CognitoClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'MediaDistributionDomain', { value: distribution.distributionDomainName });
  }
}
