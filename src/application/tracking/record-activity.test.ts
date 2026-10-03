import { recordActivity } from './record-activity';
import { InMemoryActivityRepository } from '../../data/local/activity-repository';

describe('recordActivity', () => {
  it('creates a tracking session through the application boundary', async () => {
    const repository = new InMemoryActivityRepository();
    const session = await recordActivity(repository, () => 'activity-application');

    expect(session.status).toBe('idle');
  });
});
