import { calculateTrailSummary, type GeoPoint } from './geo';
import type { ActivityRepository } from '../data/local/activity-repository';

export type TrackingStatus = 'idle' | 'recording' | 'paused' | 'finished';

export interface LocationSample extends GeoPoint {
  timestamp: string;
  accuracy?: number;
  altitude?: number;
}

export interface Activity {
  id: string;
  trailId?: string;
  status: TrackingStatus;
  startedAt: string;
  finishedAt?: string;
  samples: LocationSample[];
  distanceKm: number;
  totalSeconds: number;
}

export interface ActivitySnapshot {
  status: TrackingStatus;
  distanceKm: number;
  elapsedSeconds: number;
  sampleCount: number;
}

export class TrackingSession {
  private activity?: Activity;

  constructor(
    private readonly repository: ActivityRepository,
    private readonly idFactory: () => string = () => `activity-${Date.now()}`,
    private readonly clock: () => string = () => new Date().toISOString(),
  ) {}

  get status(): TrackingStatus {
    return this.activity?.status ?? 'idle';
  }

  async start(trailId?: string): Promise<void> {
    if (this.status !== 'idle') {
      throw new Error('tracking session has already started');
    }

    this.activity = {
      id: this.idFactory(),
      ...(trailId ? { trailId } : {}),
      status: 'recording',
      startedAt: this.clock(),
      samples: [],
      distanceKm: 0,
      totalSeconds: 0,
    };
    await this.persist();
  }

  async pause(): Promise<void> {
    this.requireActivity('recording');
    this.activity!.status = 'paused';
    await this.persist();
  }

  async resume(): Promise<void> {
    this.requireActivity('paused');
    this.activity!.status = 'recording';
    await this.persist();
  }

  async appendLocation(sample: LocationSample): Promise<ActivitySnapshot> {
    this.requireActivity('recording');
    this.activity!.samples.push(sample);
    this.activity!.distanceKm = this.activity!.samples.length < 2
      ? 0
      : calculateTrailSummary(this.activity!.samples).distanceKm;
    this.activity!.totalSeconds = elapsedSeconds(
      this.activity!.startedAt,
      sample.timestamp,
    );
    await this.persist();
    return this.snapshot();
  }

  async finish(): Promise<Activity> {
    if (this.status !== 'recording' && this.status !== 'paused') {
      throw new Error('tracking session is not active');
    }
    this.activity!.status = 'finished';
    this.activity!.finishedAt = this.clock();
    await this.persist();
    return { ...this.activity!, samples: this.activity!.samples.map((sample) => ({ ...sample })) };
  }

  private requireActivity(expectedStatus: 'recording' | 'paused'): void {
    if (this.status !== expectedStatus) {
      throw new Error(`tracking is ${this.status}`);
    }
  }

  private snapshot(): ActivitySnapshot {
    return {
      status: this.activity!.status,
      distanceKm: this.activity!.distanceKm,
      elapsedSeconds: this.activity!.totalSeconds,
      sampleCount: this.activity!.samples.length,
    };
  }

  private async persist(): Promise<void> {
    await this.repository.save(this.activity!);
  }
}

function elapsedSeconds(startedAt: string, currentAt: string): number {
  return Math.max(0, Math.round((new Date(currentAt).getTime() - new Date(startedAt).getTime()) / 1000));
}
