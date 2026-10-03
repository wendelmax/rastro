import type { PointOfInterest, TrailVersion } from '../../domain/trails';
import { InMemoryPointRepository, InMemoryTrailRepository } from '../repositories';

const demoAuthor = 'rastro-demo';

const trails: TrailVersion[] = [
  {
    id: 'trail-serra-azul',
    authorId: demoAuthor,
    name: 'Serra Azul',
    description: 'Roteiro de 4x4 com mirantes e trechos de terra compactada.',
    region: 'Serra Azul',
    visibility: 'public',
    geometry: [
      { latitude: -23.55, longitude: -46.63 },
      { latitude: -23.551, longitude: -46.631 },
      { latitude: -23.553, longitude: -46.633 },
    ],
    estimatedDurationMinutes: { min: 150, max: 240 },
    generalDifficulty: 'moderate',
    vehicleRatings: [
      { vehicleType: '4x4', difficulty: 'moderate' },
      { vehicleType: 'quadricycle', difficulty: 'difficult' },
    ],
    status: 'open',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-28T10:00:00.000Z',
  },
  {
    id: 'trail-cachoeira-do-lobo',
    authorId: demoAuthor,
    name: 'Cachoeira do Lobo',
    description: 'Trilha curta com ponto de água e parada para fotos.',
    region: 'Serra Azul',
    visibility: 'public',
    geometry: [
      { latitude: -23.56, longitude: -46.64 },
      { latitude: -23.562, longitude: -46.642 },
      { latitude: -23.565, longitude: -46.644 },
    ],
    estimatedDurationMinutes: { min: 90, max: 150 },
    generalDifficulty: 'easy',
    vehicleRatings: [
      { vehicleType: '4x4', difficulty: 'easy' },
      { vehicleType: 'quadricycle', difficulty: 'easy' },
    ],
    status: 'open',
    createdAt: '2026-09-02T10:00:00.000Z',
    updatedAt: '2026-09-26T10:00:00.000Z',
  },
  {
    id: 'trail-pedra-bruta',
    authorId: demoAuthor,
    name: 'Pedra Bruta',
    description: 'Roteiro técnico com erosões e subida de baixa velocidade.',
    region: 'Serra Azul',
    visibility: 'public',
    geometry: [
      { latitude: -23.57, longitude: -46.65 },
      { latitude: -23.574, longitude: -46.653 },
      { latitude: -23.579, longitude: -46.656 },
    ],
    estimatedDurationMinutes: { min: 210, max: 360 },
    generalDifficulty: 'difficult',
    vehicleRatings: [
      { vehicleType: '4x4', difficulty: 'difficult' },
      { vehicleType: 'quadricycle', difficulty: 'difficult' },
    ],
    status: 'partially_blocked',
    createdAt: '2026-09-03T10:00:00.000Z',
    updatedAt: '2026-09-25T10:00:00.000Z',
  },
  {
    id: 'trail-private-demo',
    authorId: 'user-private',
    name: 'Roteiro privado',
    description: 'Conteúdo privado de teste.',
    region: 'Serra Azul',
    visibility: 'private',
    geometry: [
      { latitude: -23.58, longitude: -46.66 },
      { latitude: -23.581, longitude: -46.661 },
    ],
    estimatedDurationMinutes: { min: 30, max: 60 },
    generalDifficulty: 'easy',
    vehicleRatings: [{ vehicleType: '4x4', difficulty: 'easy' }],
    status: 'unknown',
    createdAt: '2026-09-04T10:00:00.000Z',
    updatedAt: '2026-09-04T10:00:00.000Z',
  },
];

const points: PointOfInterest[] = trails
  .filter((trail) => trail.visibility === 'public')
  .flatMap((trail) => [
    {
      id: `${trail.id}-stop`,
      trailId: trail.id,
      type: 'stop' as const,
      name: 'Parada principal',
      description: 'Espaço para reunir o grupo.',
      coordinate: trail.geometry[0]!,
      verifiedAt: trail.updatedAt,
    },
    {
      id: `${trail.id}-water`,
      trailId: trail.id,
      type: 'water' as const,
      name: 'Fonte de água',
      description: 'Levar filtro e confirmar a condição antes da saída.',
      coordinate: trail.geometry[1]!,
      verifiedAt: trail.updatedAt,
    },
    {
      id: `${trail.id}-viewpoint`,
      trailId: trail.id,
      type: 'viewpoint' as const,
      name: 'Mirante para fotos',
      description: 'Área aberta para parada rápida.',
      coordinate: trail.geometry[trail.geometry.length - 1]!,
      verifiedAt: trail.updatedAt,
    },
  ]);

export function createDemoRepository() {
  return {
    trailRepository: new InMemoryTrailRepository(trails),
    pointRepository: new InMemoryPointRepository(points),
  };
}
