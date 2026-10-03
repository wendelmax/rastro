import { ApiClient } from './api-client';

describe('ApiClient', () => {
  it('adds a bearer token and parses successful JSON responses', async () => {
    const fetcher = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'trail-1' }),
    });
    const client = new ApiClient('https://api.example.com', () => 'token-1', fetcher);

    await expect(client.request<{ id: string }>('/trails/trail-1')).resolves.toEqual({ id: 'trail-1' });
    const [, request] = fetcher.mock.calls[0] as [string, RequestInit];
    expect((request.headers as Headers).get('Authorization')).toBe('Bearer token-1');
  });

  it('throws a typed HTTP error on unauthorized responses', async () => {
    const fetcher = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' }),
    });
    const client = new ApiClient('https://api.example.com', () => null, fetcher);

    await expect(client.request('/trails')).rejects.toMatchObject({ status: 401 });
  });
});
