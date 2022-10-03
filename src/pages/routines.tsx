import { useState } from 'react';
import type { NextPage } from 'next';

import Layout from 'components/Layout';
import RoutineCard from 'components/Routine/RoutineCard';
import SaveRoutineModal from 'components/Routine/SaveRoutineModal';
import RoutineSettingsModal from 'components/Routine/RoutineSettingsModal';

import { useRoutinesStore } from 'lib/stores';

const Routines: NextPage = () => {
  const [isRoutineOpen, setIsRoutineOpen] = useState(false);
  const [isRoutineSettingsOpen, setIsRoutineSettingsOpen] = useState(false);
  const { routines, add, edit } = useRoutinesStore();

  const [routineId, setRoutineId] = useState<string | null>(null);

  return (
    <>
      <Layout header={{ action: { text: 'Add Routine', onClick: () => setIsRoutineOpen(true) } }}>
        <section className="space-y-3">
          {routines.map((routine, i) => (
            <RoutineCard
              key={i}
              routine={routine}
              onSettingsClick={() => {
                setRoutineId(routine.id);
                setIsRoutineSettingsOpen(true);
              }}
            />
          ))}
        </section>
      </Layout>

      <SaveRoutineModal
        isOpen={isRoutineOpen}
        onClose={() => {
          if (routineId) setRoutineId(null);
          setIsRoutineOpen(false);
          if (isRoutineSettingsOpen) setIsRoutineSettingsOpen(false);
        }}
        routineId={routineId}
        onSubmit={(routine) => {
          if (routineId) {
            edit(routineId, routine);
          } else {
            add(routine);
          }
        }}
      />

      <RoutineSettingsModal
        isOpen={isRoutineSettingsOpen}
        onClose={() => {
          setIsRoutineSettingsOpen(false);
          setRoutineId(null);
        }}
        routineId={routineId!}
        onEditClick={() => setIsRoutineOpen(true)}
      />
    </>
  );
};

export default Routines;
