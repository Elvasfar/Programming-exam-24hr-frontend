import React, { useEffect, useState } from 'react';
import { getResults, getParticipants, getDisciplines, deleteResult, updateResult} from '../service/apiFacade';
import CreateResultModal from '../components/CreateResultModal';
import { Modal, Button, Form } from 'react-bootstrap';


interface Result {
  id: number;
  participantId: number;
  disciplineId: number;
  resultValue: string;
}

interface Participant {
  id: number;
  name: string;
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

  const handleEditResult = (result) => {
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

  const handleDeleteResult = async (id) => {
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

  return (
    <div className="container mt-5 pt-5">
      <h1 style={{ marginTop: '40px' }}>Results</h1>
      <button className="btn btn-primary mb-3" onClick={handleCreateResult}>Opret nyt resultat</button>
      <table className="table table-striped">
  <thead>
    <tr>
      <th>Navn</th>
      <th>Disciplin</th>
      <th>Resultat</th>
      <th>Handlinger</th>
    </tr>
  </thead>
  <tbody>
    {results.map(result => (
      <tr key={result.id}>
        <td>{participants[result.participantId]?.name}</td>
        <td>{disciplines[result.disciplineId]?.disciplineName}</td>
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
