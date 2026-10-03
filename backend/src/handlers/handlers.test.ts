import { handleActivities } from './activities';
import { handleMedia } from './media';
import { handleReports } from './reports';
import { handleTrails } from './trails';
import type { HttpApiEvent } from '../shared/http';
import type { SqlExecutor } from '../shared/db';

function event(overrides: Partial<HttpApiEvent> = {}): HttpApiEvent {
  return {
    version: '2.0',
    routeKey: '$default',
    rawPath: '/v1/trails',
    rawQueryString: '',
    headers: {},
    requestContext: {
      http: { method: 'GET', path: '/v1/trails' },
      authorizer: { jwt: { claims: { sub: 'user-1' } } },
    },
    ...overrides,
  };
}

describe('AWS Lambda handlers', () => {
  it('lists only public trails for an unauthenticated request', async () => {
    const db: SqlExecutor = {
      query: jest.fn().mockResolvedValue([{ id: 'trail-1', visibility: 'public' }]),
      execute: jest.fn(),
    };

    const response = await handleTrails(event({
      requestContext: { http: { method: 'GET', path: '/v1/trails' } },
    }), db);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ items: [{ id: 'trail-1', visibility: 'public' }] });
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining("visibility = 'public'"), expect.any(Array));
  });

  it('rejects activity writes without a Cognito subject', async () => {
    const db: SqlExecutor = { query: jest.fn(), execute: jest.fn() };
    const response = await handleActivities(event({
      rawPath: '/v1/activities/sync',
      requestContext: { http: { method: 'POST', path: '/v1/activities/sync' }, authorizer: undefined },
      body: JSON.stringify({ activity: { id: 'activity-1' } }),
    }), db);

    expect(response.statusCode).toBe(401);
    expect(db.execute).not.toHaveBeenCalled();
  });

  it('binds activity ownership to the JWT subject and uses an idempotent write', async () => {
    const db: SqlExecutor = { query: jest.fn(), execute: jest.fn().mockResolvedValue([]) };
    const response = await handleActivities(event({
      rawPath: '/v1/activities/sync',
      requestContext: { http: { method: 'POST', path: '/v1/activities/sync' }, authorizer: { jwt: { claims: { sub: 'user-1' } } } },
      body: JSON.stringify({ activity: { id: 'activity-1', status: 'finished' }, authorId: 'attacker' }),
    }), db);

    expect(response.statusCode).toBe(200);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('ON CONFLICT (id)'), expect.arrayContaining([
      expect.objectContaining({ name: ':author_id', value: { stringValue: 'user-1' } }),
    ]));
  });

  it('publishes reports with ownership bound to the JWT subject', async () => {
    const db: SqlExecutor = { query: jest.fn(), execute: jest.fn().mockResolvedValue([]) };
    const response = await handleReports(event({
      rawPath: '/v1/reports',
      requestContext: { http: { method: 'POST', path: '/v1/reports' }, authorizer: { jwt: { claims: { sub: 'user-1' } } } },
      body: JSON.stringify({
        id: 'report:activity-1', activityId: 'activity-1', authorId: 'attacker', title: 'Trilha boa',
        description: 'Passagem tranquila', visibility: 'public', status: 'published',
      }),
    }), db);

    expect(response.statusCode).toBe(200);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('ON CONFLICT (id)'), expect.arrayContaining([
      expect.objectContaining({ name: ':author_id', value: { stringValue: 'user-1' } }),
    ]));
  });

  it('rejects unsupported media before requesting an S3 URL', async () => {
    const presigner = { createUploadUrl: jest.fn() };
    const response = await handleMedia(event({
      rawPath: '/v1/media/presign',
      requestContext: { http: { method: 'POST', path: '/v1/media/presign' }, authorizer: { jwt: { claims: { sub: 'user-1' } } } },
      body: JSON.stringify({ contentType: 'application/pdf', sizeBytes: 100 }),
    }), presigner);

    expect(response.statusCode).toBe(400);
    expect(presigner.createUploadUrl).not.toHaveBeenCalled();
  });
});
