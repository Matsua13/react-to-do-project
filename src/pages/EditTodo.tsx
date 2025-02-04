import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TodoContext, Todo } from '../context/TodoContext';

const EditTodo: React.FC = () => {
  // Récupérer l'ID depuis l'URL et les fonctions de navigation
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // On récupère le contexte
  const context = useContext(TodoContext);
  if (!context) {
    // Plutôt que de retourner null, on lance une erreur afin que tous les hooks soient toujours appelés
    throw new Error("TodoContext n'est pas disponible. Assurez-vous que votre composant est bien enveloppé par le provider.");
  }
  const { todos, editTodo } = context;

  // Chercher la tâche à éditer
  const todoToEdit = todos.find(todo => todo.id === Number(id));

  // Toujours appeler les hooks d'état avec des valeurs initiales par défaut
  const [text, setText] = useState('');
  const [deadline, setDeadline] = useState('');
  const [completed, setCompleted] = useState(false);

  // Dès que la tâche est disponible, on met à jour les états
  useEffect(() => {
    if (todoToEdit) {
      setText(todoToEdit.text);
      setDeadline(todoToEdit.deadline);
      setCompleted(todoToEdit.completed);
    }
  }, [todoToEdit]);

  // Si la tâche n'existe pas, on redirige vers l'accueil.
  // Note : ce useEffect sera appelé même si todoToEdit est undefined, mais il ne posera pas de problème.
  useEffect(() => {
    if (!todoToEdit) {
      navigate('/');
    }
  }, [todoToEdit, navigate]);

  // Le rendu est conditionné dans le JSX, mais TOUS les hooks ont déjà été appelés ci-dessus.
  return (
    <div>
      { !todoToEdit ? (
        <p>Chargement...</p>
      ) : (
        <>
          <h1>Modifier la tâche</h1>
          <form onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            if (text.trim() === '') {
              alert('Please enter a task.');
              return;
            }
            if (deadline === '') {
              alert('Please select a deadline.');
              return;
            }
            // On construit la tâche mise à jour en s'appuyant sur todoToEdit qui est garanti ici
            const updatedTodo: Todo = {
              id: todoToEdit.id,
              text,
              deadline,
              completed,
              notified: todoToEdit.notified,
            };
            editTodo(updatedTodo);
            navigate('/');
          }}>
            <div>
              <label>Task</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Update"
              />
            </div>
            <div>
              <label>Deadline</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div>
              <label>
                Completed?
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                />
              </label>
            </div>
            <button type="submit">Save</button>
          </form>
        </>
      )}
    </div>
  );
};

export default EditTodo;
