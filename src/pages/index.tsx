import { useCallback } from 'react';
import type { NextPage } from 'next';

import Layout from 'components/Layout';
import RoutineCard from 'components/Routine/RoutineCard';

import { useRoutinesStore } from 'lib/stores';
import { getCurrentDay } from 'lib/helpers';

const Home: NextPage = () => {
  const day = getCurrentDay();
  const routines = useRoutinesStore(
    useCallback((state) => state.routines.filter((routine) => routine.days.includes(day)), [day]),
  );

  return (
    <Layout>
      <section className="space-y-3">
        {routines.map((routine, i) => (
          <RoutineCard key={i} routine={routine} />
        ))}
      </section>
    </Layout>
  );
};

export default Home;
