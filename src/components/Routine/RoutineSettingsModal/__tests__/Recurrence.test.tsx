import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Recurrence from 'components/Routine/RoutineSettingsModal/Recurrence';

import { Recurrence as _Recurrence } from 'types/shared';
import days from 'data/days';

const base = { startAt: 0, interval: 1, days: [] };
const daily: _Recurrence = { ...base, frequency: 'DAILY' };
const weekly: _Recurrence = { ...base, frequency: 'WEEKLY' };

describe('Recurrence', () => {
  it('should render DAILY with interval === 1 correctly', () => {
    render(<Recurrence recurrence={daily} />);
    expect(screen.getByTestId('routine-settings-modal-recurrence').textContent).toContain('Daily');
  });

  it('should render DAILY with interval > 1 correctly', () => {
    render(<Recurrence recurrence={{ ...daily, interval: 2 }} />);
    expect(screen.getByTestId('routine-settings-modal-recurrence').textContent).toContain('Every 2 days');
  });

  it('should render WEEKLY with interval === 1 and only 1 day correctly', () => {
    render(<Recurrence recurrence={{ ...weekly, interval: 1, days: ['MONDAY'] }} />);
    expect(screen.getByTestId('routine-settings-modal-recurrence').textContent).toContain('Weekly on Monday');
  });

  it('should render WEEKLY with interval > 1 and only 2 days correctly', () => {
    render(<Recurrence recurrence={{ ...weekly, interval: 2, days: ['TUESDAY', 'MONDAY'] }} />);
    expect(screen.getByTestId('routine-settings-modal-recurrence').textContent).toContain(
      'Every 2 weeks on Monday & Tuesday',
    );
  });

  it('should render WEEKLY with all days correctly', () => {
    render(<Recurrence recurrence={{ ...weekly, interval: 1, days }} />);
    expect(screen.getByTestId('routine-settings-modal-recurrence').textContent).toContain('Weekly on all days');
  });
});
