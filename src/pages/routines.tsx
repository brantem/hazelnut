import type { NextPage } from 'next';

import Layout from 'components/Layout';
import RoutineCard from 'components/Routine/RoutineCard';
import SaveRoutineModal from 'components/Routine/SaveRoutineModal';
import SaveItemsToRoutineModal from 'components/Item/SaveItemsToRoutineModal';
import RoutineSettingsModal from 'components/Routine/RoutineSettingsModal';

import { useRoutinesStore } from 'lib/stores';
import { getMinutesFromTime } from 'lib/helpers';

const Routines: NextPage = () => {
  const { routines, showSave } = useRoutinesStore();

  return (
    <>
      <Layout header={{ actions: [{ text: 'Add Routine', onClick: () => showSave() }] }}>
        <section className="space-y-3">
          {routines
            .sort((a, b) => getMinutesFromTime(a.time) - getMinutesFromTime(b.time))
            .map((routine, i) => (
              <RoutineCard key={i} routine={routine} showAction isItemSortable />
            ))}
        </section>
      </Layout>

      <SaveRoutineModal />

      <SaveItemsToRoutineModal />

      <RoutineSettingsModal />
    </>
  );
};

export default Routines;
