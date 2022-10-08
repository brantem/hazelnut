import { useMemo } from 'react';
import type { NextPage } from 'next';
import dayjs from 'dayjs';

import Layout from 'components/Layout';
import RoutineCard from 'components/Routine/RoutineCard';

import { useRoutinesStore } from 'lib/stores';
import { getCurrentDay } from 'lib/helpers';

const Home: NextPage = () => {
  const routines = useRoutinesStore((state) => state.routines);

  const routine = useMemo(() => {
    if (!routines.length) return;
    return routines.slice().find((routine) => {
      if (!routine.days.includes(getCurrentDay())) return false;
      const [hour, minute] = routine.time.split(':');
      const date = dayjs().set('hour', parseInt(hour)).set('minute', parseInt(minute)).set('second', 0);
      const now = dayjs().set('minute', 0).set('second', 0);
      return now.isBefore(date);
    });
  }, [routines]);

  return <Layout>{routine && <RoutineCard routine={routine} />}</Layout>;
};

export default Home;
