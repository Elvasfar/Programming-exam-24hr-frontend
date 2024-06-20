import React, { useEffect, useState } from 'react';
import { getParticipants, getDisciplines } from '../service/apiFacade';
import { translateGender } from '../components/TranslateGender';

interface Participant {
  id: number;
  name: string;
  gender: string;
  age: number;
  club: string;
  disciplineIds: number[];
  results: null;
}

interface Discipline {
  id: number;
  disciplineName: string;
}

const Participants = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [disciplines, setDisciplines] = useState<Map<number, string>>(new Map());
  const [sortConfig, setSortConfig] = useState<{ key: keyof Participant | null, direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });

  const [filters, setFilters] = useState({
    gender: '',
    ageGroup: '',
    discipline: '',
    club: '',
    searchQuery: ''
  });

  useEffect(() => {
    async function fetchParticipants() {
      try {
        const data = await getParticipants();
        setParticipants(data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    }

    async function fetchDisciplines() {
      try {
        const data = await getDisciplines();
        const disciplineMap = new Map();
        data.forEach((discipline: Discipline) => {
          disciplineMap.set(discipline.id, discipline.disciplineName);
        });
        setDisciplines(disciplineMap);
      } catch (error) {
        console.error("Error fetching disciplines:", error);
      }
    }

    fetchParticipants();
    fetchDisciplines();
  }, []);

  const getDisciplineNames = (ids: number[]) => {
    return ids.map(id => disciplines.get(id)).filter(name => name).join(', ');
  };

  const handleSort = (key: keyof Participant) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const filteredParticipants = participants.filter(participant => {
    if (filters.searchQuery && !participant.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }

    if (filters.gender && participant.gender !== filters.gender) {
      return false;
    }

    if (filters.ageGroup) {
      const age = participant.age;
      if (filters.ageGroup === '6-9' && (age < 6 || age > 9)) return false;
      if (filters.ageGroup === '10-13' && (age < 10 || age > 13)) return false;
      if (filters.ageGroup === '14-22' && (age < 14 || age > 22)) return false;
      if (filters.ageGroup === '23-40' && (age < 23 || age > 40)) return false;
      if (filters.ageGroup === '41-' && age < 41) return false;
    }

    if (filters.discipline) {
      const disciplineNames = getDisciplineNames(participant.disciplineIds);
      if (!disciplineNames.includes(filters.discipline)) {
        return false;
      }
    }

    if (filters.club && participant.club !== filters.club) {
      return false;
    }

    return true;
  });

  const sortedParticipants = React.useMemo(() => {
    let sortableParticipants = [...filteredParticipants];
    if (sortConfig.key !== null) {
      sortableParticipants.sort((a, b) => {
        const aKey = a[sortConfig.key!];
        const bKey = b[sortConfig.key!];

        if (aKey < bKey) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aKey > bKey) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableParticipants;
  }, [filteredParticipants, sortConfig]);

  const uniqueClubs = Array.from(new Set(participants.map(p => p.club)));

  return (
    <div className="container mt-5 pt-5">
      <h1 style={{ marginTop: "40px" }}>Deltagere</h1>
      
      <div className="mb-4">
        <h5 style={{marginTop: "20px"}}>Søg:</h5>
        <input
          type="text"
          name="searchQuery"
          placeholder="Søg efter navn"
          value={filters.searchQuery}
          onChange={handleFilterChange}
          className="me-3"
        />
        <h5 style={{marginTop: "20px"}}>Filter:</h5>

        <label className="me-2">Køn:</label>
        <select name="gender" onChange={handleFilterChange} className="me-3">
          <option value="">Alle</option>
          <option value="Male">Mand</option>
          <option value="Female">Kvinde</option>
        </select>

        <label className="me-2">Aldersgruppe:</label>
        <select name="ageGroup" onChange={handleFilterChange} className="me-3">
          <option value="">Alle</option>
          <option value="6-9">6-9</option>
          <option value="10-13">10-13</option>
          <option value="14-22">14-22</option>
          <option value="23-40">23-40</option>
          <option value="41-">41-</option>
        </select>

        <label className="me-2">Discipliner:</label>
        <select name="discipline" onChange={handleFilterChange} className="me-3">
          <option value="">Alle</option>
          {Array.from(disciplines.entries()).map(([id, name]) => (
            <option key={id} value={name}>{name}</option>
          ))}
        </select>

        <label className="me-2">Klub:</label>
        <select name="club" onChange={handleFilterChange} className="me-3">
          <option value="">Alle</option>
          {uniqueClubs.map((club, index) => (
            <option key={index} value={club}>{club}</option>
          ))}
        </select>
      </div>
      
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Navn</th>
            <th onClick={() => handleSort('gender')}>Køn</th>
            <th onClick={() => handleSort('age')}>Alder</th>
            <th onClick={() => handleSort('club')}>Klub</th>
            <th>Discipliner</th>
          </tr>
        </thead>
        <tbody>
          {sortedParticipants.map((participant) => (
            <tr key={participant.id}>
              <td>{participant.name}</td>
              <td>{translateGender(participant.gender)}</td>
              <td>{participant.age}</td>
              <td>{participant.club}</td>
              <td>{getDisciplineNames(participant.disciplineIds)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Participants;
