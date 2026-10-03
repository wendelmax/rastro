#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { RastroStack } from '../lib/rastro-stack';

const app = new cdk.App();
new RastroStack(app, 'RastroStack', {
  environmentName: app.node.tryGetContext('environmentName') ?? process.env.RASTRO_ENV ?? 'dev',
});
