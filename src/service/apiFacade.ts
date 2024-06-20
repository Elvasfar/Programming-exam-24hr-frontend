const endpoint = "http://localhost:8080";

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
    resultType: string;
}


// ------- PARTICIPANTS ------- //

async function getParticipants() {
    const url = `${endpoint}/api/participants`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Extract JSON data from response body
        // console.log("Products:", data); // Log the fetched data
        return data; // Return the fetched data
    } catch (error) {
        console.error("Error fetching participant:", error);
        throw error;
    }
}

async function createParticipant(participant: Participant) {
    
    const url = `${endpoint}/api/participants`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(participant),
        });
        console.log("Request Body:", participant);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log("Created result:", data);
        return data;
    } catch (error) {
        console.error("Error creating result:", error);
        throw error;
    }
}

async function getParticipantById(id: number) {
    const url = `${endpoint}/api/participants/${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Extract JSON data from response body
        // console.log("Product:", data); // Log the fetched data
        return data; // Return the fetched data
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}

async function updateParticipant(id: number, participant: Participant) {
    const url = `${endpoint}/api/participants/${id}`;
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(participant),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log("Updated product:", data);
        return data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

async function deleteParticipant(id: number) {
    const url = `${endpoint}/api/participants/${id}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // console.log("Deleted product:", id);
    } catch (error) {
        console.error("Error deleting participant:", error);
        throw error;
    }
}


// ------- DISCIPLINES ------- //

async function getDisciplines() {
    const url = `${endpoint}/api/disciplines`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Extract JSON data from response body
        // console.log("Categories:", data); // Log the fetched data
        return data; // Return the fetched data
    } catch (error) {
        console.error("Error fetching disciplines:", error);
        throw error;
    }
}

async function getDisciplineById(id: number) {
    const url = `${endpoint}/api/disciplines/${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Extract JSON data from response body
        // console.log("Category:", data); // Log the fetched data
        return data; // Return the fetched data
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
}

async function createDiscipline(discipline: Discipline) {
    const url = `${endpoint}/api/discipline`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(discipline),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log("Created category:", data);
        return data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
}

async function updateDiscipline(id: number, discipline: Discipline) {
    const url = `${endpoint}/api/discipline/${id}`;
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(discipline),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log("Updated category:", data);
        return data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
}


// ----------- RESULTS ----------- //

async function getResults() {
    const url = `${endpoint}/api/results`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Extract JSON data from response body
        // console.log("Results:", data); // Log the fetched data
        return data; // Return the fetched data
    } catch (error) {
        console.error("Error fetching results:", error);
        throw error;
    }
}

async function getResultById(id: number) {
    const url = `${endpoint}/api/results/${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Extract JSON data from response body
        // console.log("Result:", data); // Log the fetched data
        return data; // Return the fetched data
    } catch (error) {
        console.error("Error fetching result:", error);
        throw error;
    }
}

async function createResult(result: any) {
    const url = `${endpoint}/api/results`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
        });
        console.log("Request Body:", result);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log("Created result:", data);
        return data;
    } catch (error) {
        console.error("Error creating result:", error);
        throw error;
    }
}

async function updateResult(id: number, result: any) {
    const url = `${endpoint}/api/results/${id}`;
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log("Updated result:", data);
        return data;
    } catch (error) {
        console.error("Error updating result:", error);
        throw error;
    }
}

async function deleteResult(id: number) {
    const url = `${endpoint}/api/results/${id}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // console.log("Deleted result:", id);
    } catch (error) {
        console.error("Error deleting result:", error);
        throw error;
    }
}

export { createParticipant, getParticipants, getParticipantById, updateParticipant, deleteParticipant, getDisciplines, getDisciplineById, createDiscipline, updateDiscipline, getResults, getResultById, createResult, updateResult, deleteResult };