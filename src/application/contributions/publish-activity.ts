import { createFork } from '../../domain/trails';
import type { ActivityRepository } from '../../data/local/activity-repository';
import type { TrailRepository } from '../../data/repositories';
import type { ActivityGateway, PublishedActivityReport } from '../sync/sync-activities';

export interface PublishActivityInput {
  authorId: string;
  title: string;
  description: string;
  createTrailFork: boolean;
  visibility: 'public' | 'private' | 'group';
}

export type ActivityReport = PublishedActivityReport;

interface PublishActivityDependencies {
  activityRepository: ActivityRepository;
  trailRepository: TrailRepository;
  activityGateway?: ActivityGateway;
}

export class PublishActivityService {
  constructor(private readonly dependencies: PublishActivityDependencies) {}

  async publishActivity(
    activityId: string,
    input: PublishActivityInput,
  ): Promise<ActivityReport | Awaited<ReturnType<typeof createFork>>> {
    const activity = await this.dependencies.activityRepository.getById(activityId);
    if (!activity) throw new Error('activity not found');
    if (this.dependencies.activityGateway) {
      const syncResult = await this.dependencies.activityGateway.push(activity);
      if (syncResult.status !== 'synced') throw new Error('activity sync is pending');
    }

    if (input.createTrailFork) {
      if (!activity.trailId) throw new Error('activity is not linked to a trail');
      const sourceTrail = await this.dependencies.trailRepository.getById(activity.trailId);
      if (!sourceTrail) throw new Error('source trail not found');
      const fork = createFork(sourceTrail, {
        name: input.title,
        description: input.description,
        visibility: input.visibility,
      }, input.authorId);
      await this.dependencies.trailRepository.save(fork);
      return fork;
    }

    const report: ActivityReport = {
      id: `report:${activityId}`,
      activityId,
      authorId: input.authorId,
      title: input.title,
      description: input.description,
      visibility: input.visibility,
      status: 'published',
    };
    if (this.dependencies.activityGateway?.publishReport) {
      await this.dependencies.activityGateway.publishReport(report);
    }
    return report;
  }
}
