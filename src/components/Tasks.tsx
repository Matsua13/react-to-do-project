// src/components/Tasks.tsx
import React, { useEffect, useState } from 'react';
import { createTask, getTasks, deleteTask, updateTask } from '../services/apiService';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');

  // Fonction pour charger les tâches depuis le backend
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  // Chargement des tâches lors du montage du composant
  useEffect(() => {
    fetchTasks();
  }, []);

  // Gestion de la création d'une nouvelle tâche
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // On vérifie que le titre n'est pas vide avant d'appeler l'API
      if (newTaskTitle.trim() === '') {
        setError('Le titre est requis.');
        return;
      }

      const taskData = { title: newTaskTitle };
      const createdTask = await createTask(taskData);
      // On met à jour la liste des tâches en ajoutant la tâche créée
      setTasks([...tasks, createdTask]);
      setNewTaskTitle(''); // Réinitialiser le champ
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la tâche');
    }
  };

  // Exemple de suppression d'une tâche
  const handleDeleteTask = async (id: number) => {
    setError(null);
    try {
      await deleteTask(id);
      // Mettre à jour la liste en filtrant la tâche supprimée
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de la tâche');
    }
  };

  // Exemple de mise à jour (ici, nous changeons le statut "completed" d'une tâche)
  const handleToggleComplete = async (id: number, completed: boolean) => {
    setError(null);
    try {
      const updatedTask = await updateTask(id, { completed: !completed });
      // On met à jour la liste des tâches en remplaçant la tâche modifiée
      setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour de la tâche');
    }
  };

  return (
    <div>
      <h1>Liste des tâches</h1>

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Titre de la tâche"
        />
        <button type="submit">Créer une tâche</button>
      </form>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => handleToggleComplete(task.id, task.completed)}
            >
              {task.title}
            </span>
            <button onClick={() => handleDeleteTask(task.id)} style={{ marginLeft: '10px' }}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
