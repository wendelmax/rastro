import { fireEvent, render } from '@testing-library/react-native';
import { createDemoRepository } from '../../data/demo/demo-trails';
import { TripPlanForm } from './TripPlanForm';

describe('TripPlanForm', () => {
  it('lets the user select a useful point and calculate the plan', () => {
    const { trailRepository, pointRepository } = createDemoRepository();
    const trail = trailRepository.getById('trail-serra-azul');
    const onSubmit = jest.fn();

    return Promise.all([trail, pointRepository.listForTrail('trail-serra-azul')]).then(
      ([loadedTrail, points]) => {
        expect(loadedTrail).not.toBeNull();
        const screen = render(
          <TripPlanForm trail={loadedTrail!} points={points} onSubmit={onSubmit} />,
        );

        fireEvent.press(screen.getByRole('button', { name: 'Fonte de água' }));
        fireEvent.press(screen.getByRole('button', { name: 'Calcular plano' }));

        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
          movingTimeMinutes: 240,
          stopTimeMinutes: 15,
          warnings: [],
        }));
      },
    );
  });
});
