import { useCallback } from 'react';
import type { NextPage } from 'next';

import Layout from 'components/Layout';
import RoutineCard from 'components/Routine/RoutineCard';

import { useRoutinesStore } from 'lib/stores';
import { isRoutineActive, sortRoutines } from 'lib/helpers';

const Home: NextPage = () => {
  const routines = useRoutinesStore(
    useCallback((state) => sortRoutines(state.routines.filter((routine) => isRoutineActive(routine))), []),
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
