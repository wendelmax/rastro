export interface HttpApiEvent {
  version: string;
  routeKey: string;
  rawPath: string;
  rawQueryString: string;
  headers: Record<string, string | undefined>;
  body?: string;
  pathParameters?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
  requestContext: {
    http: { method: string; path: string };
    authorizer?: { jwt?: { claims?: Record<string, string | undefined> } };
  };
}

export interface HttpResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

export class UnauthorizedError extends Error {}

export function requireUserId(event: HttpApiEvent): string {
  const userId = event.requestContext.authorizer?.jwt?.claims?.sub;
  if (!userId) throw new UnauthorizedError('authentication required');
  return userId;
}

export function optionalUserId(event: HttpApiEvent): string | undefined {
  return event.requestContext.authorizer?.jwt?.claims?.sub;
}

export function parseBody<T>(event: HttpApiEvent): T {
  if (!event.body) throw new Error('request body is required');
  return JSON.parse(event.body) as T;
}

export function jsonResponse(statusCode: number, payload: unknown): HttpResponse {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  };
}

export function errorResponse(error: unknown): HttpResponse {
  if (error instanceof UnauthorizedError) return jsonResponse(401, { message: error.message });
  if (error instanceof SyntaxError) return jsonResponse(400, { message: 'invalid JSON body' });
  if (error instanceof Error && error.message === 'request body is required') {
    return jsonResponse(400, { message: error.message });
  }
  return jsonResponse(500, { message: 'internal server error' });
}
