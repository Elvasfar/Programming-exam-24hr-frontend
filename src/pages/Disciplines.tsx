import React, { useEffect, useState } from 'react';
import { getDisciplines } from '../service/apiFacade';

interface Discipline {
  id: number;
  disciplineName: string;
  resultType: string;
  participantIds: number[];
  results: null;
}

const Disciplines = () => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  useEffect(() => {
    async function fetchDisciplinesData() {
      try {
        const data = await getDisciplines();
        setDisciplines(data);
      } catch (error) {
        console.error('Error fetching disciplines:', error);
      }
    }

    fetchDisciplinesData();
  }, []);


  return (
    <div className="container mt-5 pt-5">
      <h1 style={{ marginTop: '40px' }}>Discipliner</h1>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Navn</th>
            <th>Resultat Type</th>
          </tr>
        </thead>
        <tbody>
          {disciplines.map((discipline) => (
            <tr key={discipline.id}>
              <td>{discipline.disciplineName}</td>
              <td>{discipline.resultType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Disciplines;
