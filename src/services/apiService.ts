// src/services/apiService.ts

const API_BASE_URL = 'http://localhost:3000'; // L'adresse de votre backend

// Fonction générique pour gérer les requêtes HTTP
async function request(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    // Vérification de la présence d'une erreur HTTP
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la requête');
    }

    // Si la réponse ne contient pas de contenu (ex: DELETE renvoie souvent 204), on retourne null
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    // On peut ajouter ici des logs ou d'autres gestions d'erreur globales
    throw error;
  }
}

// Fonctions spécifiques aux tâches

export async function createTask(taskData: { title: string; description?: string; completed?: boolean }) {
  return await request('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Ajoutez le token si nécessaire :
      'Authorization': 'Bearer votretokenattendu'
    },
    body: JSON.stringify(taskData)
  });
}

export async function getTasks() {
  return await request('/tasks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function getTaskById(id: number) {
  return await request(`/tasks/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function updateTask(id: number, taskData: { title?: string; description?: string; completed?: boolean }) {
  return await request(`/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer votretokenattendu'
    },
    body: JSON.stringify(taskData)
  });
}

export async function deleteTask(id: number) {
  return await request(`/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer votretokenattendu'
    }
  });
}
