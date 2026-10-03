export interface ApiResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

export type ApiFetcher = (input: string, init?: RequestInit) => Promise<ApiResponse>;

export class ApiHttpError extends Error {
  constructor(public readonly status: number, public readonly payload: unknown) {
    super(`AWS API request failed with status ${status}`);
    this.name = 'ApiHttpError';
  }
}

export class ApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly getAccessToken: () => string | null,
    private readonly fetcher: ApiFetcher = (input, init) => fetch(input, init),
  ) {}

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = this.getAccessToken();
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const response = await this.fetcher(`${this.baseUrl.replace(/\/$/, '')}${path}`, {
      ...init,
      headers,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new ApiHttpError(response.status, payload);
    return payload as T;
  }
}
