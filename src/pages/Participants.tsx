import React, { useEffect, useState } from 'react';
import { getParticipants, getDisciplines, createParticipant, deleteParticipant, updateParticipant } from '../service/apiFacade';
import { translateGender } from '../components/TranslateGender';
import { Button, Modal, Form } from 'react-bootstrap';
import { BiSort } from 'react-icons/bi';
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
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [disciplineMap, setDisciplineMap] = useState<Map<number, string>>(new Map());
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedParticipant, setUpdatedParticipant] = useState<Partial<Participant>>({});

  
  const [newParticipant, setNewParticipant] = useState<Partial<Participant>>({
    name: '',
    gender: '',
    age: 0,
    club: '',
    disciplineIds: [],
  });
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
        setDisciplines(data);
        const disciplineMap = new Map();
        data.forEach((discipline: Discipline) => {
          disciplineMap.set(discipline.id, discipline.disciplineName);
        });
        setDisciplineMap(disciplineMap);
      } catch (error) {
        console.error("Error fetching disciplines:", error);
      }
    }

    fetchParticipants();
    fetchDisciplines();
  }, []);

  const getDisciplineNames = (ids: number[]) => {
    return ids.map(id => disciplineMap.get(id)).filter(name => name).join(', ');
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

  const handleCreateParticipant = async () => {
    try {
      await createParticipant(newParticipant as Participant);
      const updatedParticipants = await getParticipants();
      setParticipants(updatedParticipants);
      setShowCreateModal(false);
      setNewParticipant({
        name: '',
        gender: '',
        age: 0,
        club: '',
        disciplineIds: [],
      });
    } catch (error) {
      console.error('Error creating participant:', error);
    }
  };

// Function to handle opening the update modal with selected participant data
const handleOpenUpdateModal = (participant: Participant) => {
  setSelectedParticipant(participant);
  setUpdatedParticipant({
    id: participant.id,
    name: participant.name,
    gender: participant.gender,
    age: participant.age,
    club: participant.club,
    disciplineIds: participant.disciplineIds.slice(), // Copy array to avoid mutating original data
  });
  setShowUpdateModal(true);
};

// Function to handle updating a participant
const handleUpdateParticipant = async (id: number | undefined, updatedData: Partial<Participant>) => {
  try {
    if (id === undefined) {
      console.error('Participant ID is missing.');
      return;
    }
    await updateParticipant(id, updatedData);
    // After successful update, fetch updated participants and set them
    const updatedParticipants = await getParticipants();
    setParticipants(updatedParticipants);
    setShowUpdateModal(false); // Close the update modal
    setSelectedParticipant(null); // Clear selected participant
    setUpdatedParticipant({}); // Clear updated participant state
  } catch (error) {
    console.error('Error updating participant:', error);
    // Handle error state or display error message to the user
  }
};
// Function to handle deleting a participant
const handleDeleteParticipant = async (id) => {
  try {
      await deleteParticipant(id);
      // Update frontend state after successful deletion
      setParticipants(participants.filter(p => p.id !== id));
  } catch (error) {
      console.error("Error deleting participant:", error);
      // Handle specific error cases if needed
      if (error.response && error.response.status === 404) {
          // Participant not found error handling
          alert("Participant not found for deletion.");
      } else {
          alert("Failed to delete participant. Please try again later.");
      }
  }
};

return (
    <div className="container mt-5 pt-5">
      <h1 style={{ marginTop: '40px' }}>Deltagere</h1>
      <Button className="mb-3" onClick={() => setShowCreateModal(true)}>Opret ny deltager</Button>

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
          {Array.from(disciplineMap.entries()).map(([id, name]) => (
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
            <th onClick={() => handleSort('name')}>Navn<BiSort /></th>
            <th onClick={() => handleSort('gender')}>Køn<BiSort /></th>
            <th onClick={() => handleSort('age')}>Alder<BiSort /></th>
            <th style={{width: "20px"}} onClick={() => handleSort('club')}>Klub<BiSort /></th>
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
    <td>
      <Button variant="primary" onClick={() => handleOpenUpdateModal(participant)}>Opdater</Button>
      <Button variant="danger" onClick={() => handleDeleteParticipant(participant.id)}>Slet</Button>
    </td>
  </tr>
))}        
</tbody>
</table>

      // Update Participant Modal or Form
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Opdater deltager</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="updateParticipantName">
        <Form.Label>Navn</Form.Label>
        <Form.Control
          type="text"
          value={updatedParticipant.name || ''}
          onChange={(e) => setUpdatedParticipant({ ...updatedParticipant, name: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group controlId="updateParticipantGender">
        <Form.Label>Køn</Form.Label>
        <Form.Control
          as="select"
          value={updatedParticipant.gender || ''}
          onChange={(e) => setUpdatedParticipant({ ...updatedParticipant, gender: e.target.value })}
          required
        >
          <option value="Male">Mand</option>
          <option value="Female">Kvinde</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="updateParticipantAge">
        <Form.Label>Alder</Form.Label>
        <Form.Control
          type="number"
          value={updatedParticipant.age || 0}
          onChange={(e) => setUpdatedParticipant({ ...updatedParticipant, age: Number(e.target.value) })}
          required
        />
      </Form.Group>
      <Form.Group controlId="updateParticipantClub">
        <Form.Label>Klub</Form.Label>
        <Form.Control
          type="text"
          value={updatedParticipant.club || ''}
          onChange={(e) => setUpdatedParticipant({ ...updatedParticipant, club: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group controlId="updateParticipantDisciplines">
        <Form.Label>Discipliner</Form.Label>
        <Form.Control
          as="select"
          multiple
          value={updatedParticipant.disciplineIds || []}
          onChange={(e) => {
            const selectedValues = Array.from(e.target.options)
              .filter(option => option.selected)
              .map(option => Number(option.value));
            setUpdatedParticipant({ ...updatedParticipant, disciplineIds: selectedValues });
          }}
          required
        >
          {disciplines.map((discipline) => (
            <option key={discipline.id} value={discipline.id}>
              {discipline.disciplineName}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
      Annuller
    </Button>
    <Button variant="primary" onClick={() => handleUpdateParticipant(selectedParticipant?.id, updatedParticipant)}>
      Gem ændringer
    </Button>
  </Modal.Footer>
</Modal>
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Opret ny deltager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="participantName">
              <Form.Label>Navn</Form.Label>
              <Form.Control
                type="text"
                value={newParticipant.name}
                onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="participantGender">
              <Form.Label>Køn</Form.Label>
              <Form.Control
                type="text"
                value={newParticipant.gender}
                onChange={(e) => setNewParticipant({ ...newParticipant, gender: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="participantAge">
              <Form.Label>Alder</Form.Label>
              <Form.Control
                type="number"
                value={newParticipant.age}
                onChange={(e) => setNewParticipant({ ...newParticipant, age: Number(e.target.value) })}
                required
              />
            </Form.Group>
            <Form.Group controlId="participantClub">
              <Form.Label>Klub</Form.Label>
              <Form.Control
                type="text"
                value={newParticipant.club}
                onChange={(e) => setNewParticipant({ ...newParticipant, club: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="participantDisciplines">
              <Form.Label>Discipliner</Form.Label>
              <Form.Control
  as="select"
  multiple
  value={newParticipant.disciplineIds.map(String)} // Convert number array to string array
  onChange={(e) => {
    const selectedValues: number[] = [];
    for (let i = 0; i < e.target.options.length; i++) {
      if (e.target.options[i].selected) {
        selectedValues.push(Number(e.target.options[i].value));
      }
    }
    setNewParticipant({ ...newParticipant, disciplineIds: selectedValues });
  }}
  required
>
  {disciplines.map((discipline) => (
    <option key={discipline.id} value={discipline.id}>
      {discipline.disciplineName}
    </option>
  ))}
</Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Annuller
          </Button>
          <Button variant="primary" onClick={handleCreateParticipant}>
            Opret
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Participants;
