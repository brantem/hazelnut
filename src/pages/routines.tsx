import type { NextPage } from 'next';

import Layout from 'components/Layout';
import RoutineCard from 'components/Routine/RoutineCard';
import SaveRoutineModal from 'components/Routine/SaveRoutineModal';
import RoutineSettingsModal from 'components/Routine/RoutineSettingsModal';

import { useRoutinesStore, useRoutineStore } from 'lib/stores';

const Routines: NextPage = () => {
  const { routines } = useRoutinesStore();
  const { showSave } = useRoutineStore();

  return (
    <>
      <Layout header={{ action: { text: 'Add Routine', onClick: () => showSave() } }}>
        <section className="space-y-3">
          {routines.map((routine, i) => (
            <RoutineCard key={i} routine={routine} />
          ))}
        </section>
      </Layout>

      <SaveRoutineModal />

      <RoutineSettingsModal />
    </>
  );
};

export default Routines;
