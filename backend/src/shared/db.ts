import type { SqlParameter } from '@aws-sdk/client-rds-data';

declare function require(name: string): { RDSDataClient: new (config: { region?: string }) => AwsDataClient; ExecuteStatementCommand: new (input: Record<string, unknown>) => unknown };

interface AwsDataClient {
  send(command: unknown): Promise<{ records?: unknown[][]; columnMetadata?: Array<{ name?: string | null }> }>;
}

export interface SqlExecutor {
  query(sql: string, parameters?: SqlParameter[]): Promise<unknown[]>;
  execute(sql: string, parameters?: SqlParameter[]): Promise<unknown>;
}

export class RdsDataApiExecutor implements SqlExecutor {
  private readonly client: AwsDataClient;

  constructor(
    private readonly resourceArn = requiredEnv('AURORA_CLUSTER_ARN'),
    private readonly secretArn = requiredEnv('AURORA_SECRET_ARN'),
    private readonly database = process.env.AURORA_DATABASE ?? 'rastro',
  ) {
    const { RDSDataClient } = require('@aws-sdk/client-rds-data');
    this.client = new RDSDataClient({ region: process.env.AWS_REGION });
  }

  async query(sql: string, parameters: SqlParameter[] = []): Promise<unknown[]> {
    const { ExecuteStatementCommand } = require('@aws-sdk/client-rds-data');
    const result = await this.client.send(new ExecuteStatementCommand({
      resourceArn: this.resourceArn,
      secretArn: this.secretArn,
      database: this.database,
      sql,
      parameters,
      includeResultMetadata: true,
    }));
    return mapRecords(result.records ?? [], result.columnMetadata ?? []);
  }

  async execute(sql: string, parameters: SqlParameter[] = []): Promise<unknown> {
    const { ExecuteStatementCommand } = require('@aws-sdk/client-rds-data');
    return this.client.send(new ExecuteStatementCommand({
      resourceArn: this.resourceArn,
      secretArn: this.secretArn,
      database: this.database,
      sql,
      parameters,
    }));
  }
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function mapRecords(records: unknown[][], columns: Array<{ name?: string | null }>): unknown[] {
  return records.map((record) => Object.fromEntries(record.map((field, index) => [
    columns[index]?.name ?? `column_${index}`,
    fieldValue(field as Record<string, unknown>),
  ])));
}

function fieldValue(field: Record<string, unknown>): unknown {
  if ('stringValue' in field) {
    const value = field.stringValue;
    try { return typeof value === 'string' && (value.startsWith('{') || value.startsWith('[')) ? JSON.parse(value) : value; } catch { return value; }
  }
  return field.longValue ?? field.doubleValue ?? field.booleanValue ?? null;
}

export function createDefaultSqlExecutor(): SqlExecutor {
  return new RdsDataApiExecutor();
}
