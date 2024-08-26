import React, { useState, useEffect } from 'react';
import { createResult } from '../service/apiFacade';
import { ModalBody } from 'react-bootstrap';



interface Props {
  show: boolean;
  onClose: () => void;
  refreshResults: () => void; // Function to refresh results after creating new result
  participants: Participant[];
  disciplines: Discipline[];
}

interface Participant {
  id: number;
  name: string;
}

interface Discipline {
  id: number;
  disciplineName: string;
}

const CreateResultModal: React.FC<Props> = ({ show, onClose, refreshResults, participants, disciplines }) => {
  const [participantId, setParticipantId] = useState<number | null>(null);
  const [disciplineId, setDisciplineId] = useState<number | null>(null);
  const [resultValue, setResultValue] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantId || !disciplineId || !resultValue) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const result = {
        participantId: participantId,
        disciplineId: disciplineId,
        resultValue: resultValue,
      };

      await createResult(result);
      refreshResults(); // Refresh results after creating new result
      onClose(); // Close modal after successful creation

      // Reset form fields
      setParticipantId(null);
      setDisciplineId(null);
      setResultValue('');
    } catch (error) {
      console.error('Error creating result:', error);
    }
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`} tabIndex={-1} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Opret nyt resultat</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="participantId" className="form-label">Vælg deltager</label>
                <select
                  className="form-control"
                  id="participantId"
                  value={participantId || ''}
                  onChange={(e) => setParticipantId(parseInt(e.target.value))}
                  required
                >
                  <option value="">Vælg deltager...</option>
                  {participants.map(participant => (
                    <option key={participant.id} value={participant.id}>{participant.name}</option>
                  ))}
                  Se
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="disciplineId" className="form-label">Vælg disciplin</label>
                <select
                  className="form-control"
                  id="disciplineId"
                  value={disciplineId || ''}
                  onChange={(e) => setDisciplineId(parseInt(e.target.value))}
                  required
                >
                  <option value="">Vælg disciplin...</option>
                  {disciplines.map(discipline => (
                    <option key={discipline.id} value={discipline.id}>{discipline.disciplineName}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="resultValue" className="form-label">Resultatværdi</label>
                <input
                  type="text"
                  className="form-control"
                  id="resultValue"
                  value={resultValue}
                  onChange={(e) => setResultValue(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Annuller</button>
              <button type="submit" className="btn btn-primary">Opret resultat</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateResultModal;
