import React, { useEffect, useState } from 'react';
import { getResults, getParticipants, getDisciplines, deleteResult, updateResult } from '../service/apiFacade';
import CreateResultModal from '../components/CreateResultModal';
import { Modal, Button, Form } from 'react-bootstrap';
import { BiSort } from 'react-icons/bi';

interface Result {
  id: number;
  participantId: number;
  disciplineId: number;
  resultValue: string;
}

interface Participant {
  id: number;
  name: string;
  gender: string;
  age: number;
}

interface Discipline {
  id: number;
  disciplineName: string;
}

const Results = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [editedResultValue, setEditedResultValue] = useState<string>('');

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const [sortConfig, setSortConfig] = useState<{ key: keyof Result | null, direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });

  const [filters, setFilters] = useState({
    disciplineId: '',
    gender: '',
    ageGroup: '',
  });

  useEffect(() => {
    fetchResults();
    fetchParticipants();
    fetchDisciplines();
  }, []);

  const fetchResults = async () => {
    try {
      const resultsData = await getResults();
      setResults(resultsData);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const fetchParticipants = async () => {
    try {
      const participantsData = await getParticipants();
      setParticipants(participantsData);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const fetchDisciplines = async () => {
    try {
      const disciplinesData = await getDisciplines();
      setDisciplines(disciplinesData);
    } catch (error) {
      console.error('Error fetching disciplines:', error);
    }
  };

  const handleCreateResult = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const refreshResults = () => {
    fetchResults();
  };

  const handleEditResult = (result: Result) => {
    setEditingResult(result);
    setEditedResultValue(result.resultValue);
  };

  const handleUpdateResult = async () => {
    if (editingResult) {
      try {
        const updatedResult = { ...editingResult, resultValue: editedResultValue };
        await updateResult(editingResult.id, updatedResult);
        fetchResults();
        handleCloseModal();
      } catch (error) {
        console.error('Error updating result:', error);
      }
    }
  };

  const handleDeleteResult = async (id: number) => {
    try {
      await deleteResult(id);
      fetchResults();
    } catch (error) {
      console.error('Error deleting result:', error);
    }
  };

  const handleCloseModal = () => {
    setEditingResult(null);
    setEditedResultValue('');
  };

  const handleSort = (key: keyof Result) => {
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

  const filteredResults = results.filter(result => {
    if (filters.disciplineId && result.disciplineId !== parseInt(filters.disciplineId)) {
      return false;
    }

    const participant = participants.find(p => p.id === result.participantId);
    if (!participant) return false;

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

    return true;
  });

  const sortedResults = React.useMemo(() => {
    let sortableResults = [...filteredResults];
    if (sortConfig.key !== null) {
      sortableResults.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableResults;
  }, [filteredResults, sortConfig]);

  return (
    <div className="container mt-5 pt-5">
      <h1 style={{ marginTop: '40px' }}>Resultater</h1>
      <button className="btn btn-primary mb-3" onClick={handleCreateResult}>Opret Nyt Resultat</button>

      <div className="mb-4">
        <h5>Filtre:</h5>

        <label className="me-2">Disciplin:</label>
        <select name="disciplineId" onChange={handleFilterChange} className="me-3">
          <option value="">Alle</option>
          {disciplines.map(discipline => (
            <option key={discipline.id} value={String(discipline.id)}>{discipline.disciplineName}</option>
          ))}
        </select>

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
          <option value="41-">41+</option>
        </select>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Navn</th>
            <th onClick={() => handleSort('disciplineId')}>Disciplin <BiSort /></th>
            <th onClick={() => handleSort('resultValue')}>Resultat <BiSort /></th>
            <th>Handlinger</th>
          </tr>
        </thead>
        <tbody>
          {sortedResults.map(result => (
            <tr key={result.id}>
              <td>{participants.find(p => p.id === result.participantId)?.name}</td>
              <td>{disciplines.find(d => d.id === result.disciplineId)?.disciplineName}</td>
              <td>{result.resultValue}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditResult(result)}
                >
                  Rediger
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteResult(result.id)}
                >
                  Slet
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Result Modal */}
      <Modal show={!!editingResult} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Rediger Resultat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editedResultValue">
              <Form.Label>Resultat</Form.Label>
              <Form.Control
                type="text"
                value={editedResultValue}
                onChange={e => setEditedResultValue(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuller
          </Button>
          <Button variant="primary" onClick={handleUpdateResult}>
            Gem ændringer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create Result Modal */}
      <CreateResultModal
        show={showCreateModal}
        onClose={handleCloseCreateModal}
        refreshResults={refreshResults}
        participants={participants}
        disciplines={disciplines}
      />
    </div>
  );
};

export default Results;
