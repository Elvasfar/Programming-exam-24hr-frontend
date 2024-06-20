import React, { useEffect, useState } from 'react';
import { getDisciplines, getParticipants } from '../service/apiFacade';

interface Discipline {
  id: number;
  disciplineName: string;
  resultType: string;
  results: null;
}

interface Participant {
  id: number;
  name: string;
  gender: string;
  age: number;
  club: string;
  disciplineIds: number[];
}

const Disciplines = () => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const disciplinesData = await getDisciplines();
        setDisciplines(disciplinesData);
        
        const participantsData = await getParticipants();
        setParticipants(participantsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const getParticipantNamesForDiscipline = (disciplineId: number) => {
    const participantsInDiscipline = participants.filter(participant => 
      participant.disciplineIds.includes(disciplineId)
    );

    return participantsInDiscipline.map(p => p.name).join(', ');
  };

  return (
    <div className="container mt-5 pt-5">
      <h1 style={{ marginTop: '40px' }}>Discipliner</h1>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Navn</th>
            <th>Deltagere</th>
          </tr>
        </thead>
        <tbody>
          {disciplines.map((discipline) => (
            <tr key={discipline.id}>
              <td>{discipline.disciplineName}</td>
              <td>{getParticipantNamesForDiscipline(discipline.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Disciplines;
