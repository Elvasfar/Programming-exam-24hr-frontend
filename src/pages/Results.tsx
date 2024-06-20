import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getResults, getParticipantById, getDisciplineById, updateResult, deleteResult } from '../service/apiFacade';

const Results = () => {
  const [results, setResults] = useState([]);
  const [participants, setParticipants] = useState({});
  const [disciplines, setDisciplines] = useState({});
  const [editingResult, setEditingResult] = useState(null);
  const [editedResultValue, setEditedResultValue] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const resultsData = await getResults();
      setResults(resultsData);

      const participantIds = resultsData.map(result => result.participantId);
      const disciplineIds = resultsData.map(result => result.disciplineId);

      const participantsData = await Promise.all(participantIds.map(id => getParticipantById(id)));
      const disciplinesData = await Promise.all(disciplineIds.map(id => getDisciplineById(id)));

      const participantsMap = participantsData.reduce((acc, participant) => {
        acc[participant.id] = participant;
        return acc;
      }, {});

      const disciplinesMap = disciplinesData.reduce((acc, discipline) => {
        acc[discipline.id] = discipline;
        return acc;
      }, {});

      setParticipants(participantsMap);
      setDisciplines(disciplinesMap);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
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
    </div>
  );
};

export default Results;
