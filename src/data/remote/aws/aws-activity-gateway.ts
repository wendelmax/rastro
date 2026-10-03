import type { Activity } from '../../../domain/tracking';
import type { ApiClient } from './api-client';
import type { ActivityGateway } from '../../../application/sync/sync-activities';

export class AwsActivityGateway implements ActivityGateway {
  constructor(private readonly client: ApiClient) {}

  async push(activity: Activity): Promise<{ status: 'synced' | 'pending' }> {
    return this.client.request<{ status: 'synced' | 'pending' }>('/v1/activities/sync', {
      method: 'POST',
      body: JSON.stringify({ activity }),
    });
  }
}
