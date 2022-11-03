import { useCallback } from 'react';
import type { NextPage } from 'next';
import Router from 'next/router';

import Layout from 'components/Layout';
import RoutineCard from 'components/Routine/RoutineCard';
import EmptySection from 'components/sections/EmptySection';

import { useRoutinesStore } from 'lib/stores';
import { isRoutineActive, sortRoutines } from 'lib/helpers';

const Home: NextPage = () => {
  const { routines, isReady } = useRoutinesStore(
    useCallback(
      (state) => ({
        routines: sortRoutines(state.routines.filter((routine) => isRoutineActive(routine))),
        isReady: state.isReady,
      }),
      [],
    ),
  );

  return (
    <Layout>
      {routines.length ? (
        <section className="space-y-3">
          {routines.map((routine, i) => (
            <RoutineCard key={i} routine={routine} />
          ))}
        </section>
      ) : (
        isReady && (
          <EmptySection
            title="You have not created any routines yet"
            action={{
              onClick: () => Router.push('/routines'),
              text: 'Add Routine',
            }}
          />
        )
      )}
    </Layout>
  );
};

export default Home;
