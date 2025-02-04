import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Définir l'interface d'une tâche avec deadline et notified
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  deadline: string;  // Date sous forme de chaîne (ISO string)
  notified: boolean; // Pour éviter d'afficher plusieurs fois la même notification
}

// Interface du contexte
interface TodoContextProps {
  todos: Todo[];
  addTodo: (text: string, deadline: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  editTodo: (updatedTodo: Todo) => void;
}

export const TodoContext = createContext<TodoContextProps | undefined>(undefined);

// Fonction utilitaire pour calculer le nombre de jours jusqu'à la deadline
const daysUntilDeadline = (deadline: string) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  return diffTime / (1000 * 3600 * 24);
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialisation paresseuse qui lit le localStorage et réinitialise notified pour les tâches urgentes
  const [todos, setTodos] = useState<Todo[]>(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      const parsedTodos: Todo[] = JSON.parse(storedTodos);
      return parsedTodos.map(todo => {
        if (!todo.completed) {
          const daysLeft = daysUntilDeadline(todo.deadline);
          if (daysLeft <= 3 && daysLeft > 0) {
            return { ...todo, notified: false };
          }
        }
        return todo;
      });
    }
    return [];
  });

  // Supprimer le useEffect de chargement redondant
  // Sauvegarder les tâches à chaque modification
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Ajouter une tâche
  const addTodo = (text: string, deadline: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      deadline,
      notified: false,
    };
    setTodos([...todos, newTodo]);
  };

  // Basculer le statut d'une tâche
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Supprimer une tâche
  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Modifier une tâche existante
  const editTodo = (updatedTodo: Todo) => {
    setTodos(todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
  };

  // UseEffect pour les notifications
  useEffect(() => {
    const checkNotifications = () => {
      todos.forEach(todo => {
        if (!todo.completed && !todo.notified) {
          const daysLeft = daysUntilDeadline(todo.deadline);
          if (daysLeft <= 3 && daysLeft > 0) {
            toast.warn(`The task "${todo.text}" has a close deadline!`, { autoClose: false });
            setTodos(prevTodos =>
              prevTodos.map(t =>
                t.id === todo.id ? { ...t, notified: true } : t
              )
            );
          }
        }
      });
    };

    // Vérification immédiate dès le montage
    checkNotifications();

    // Vérification toutes les 60 secondes
    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, [todos]);

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, removeTodo, editTodo }}>
      {children}
    </TodoContext.Provider>
  );
};
