import React, { useState, useContext } from 'react';
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';
import { TodoContext, Todo } from '../context/TodoContext';

const Home: React.FC = () => {
  const { todos } = useContext(TodoContext)!;
  const [filter, setFilter] = useState<'All' | 'Urgent' | 'Done'>('All');

  // Filtrage et tri des tâches selon le filtre sélectionné
  const filterTodos = (todos: Todo[]) => {
    let filtered: Todo[] = todos;

    if (filter === 'Done') {
      filtered = todos.filter(todo => todo.completed);
    } else if (filter === 'Urgent') {
      filtered = todos.filter(todo => {
        if (todo.completed) return false;
        const now = new Date();
        const deadlineDate = new Date(todo.deadline);
        const diffTime = deadlineDate.getTime() - now.getTime();
        const daysLeft = diffTime / (1000 * 3600 * 24);
        return daysLeft <= 3 && daysLeft > 0;
      });
    }

    // Tri des tâches filtrées par date de deadline du plus proche au plus lointain
    return [...filtered].sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
  };

  const filteredTodos = filterTodos(todos);

  return (
    <div className="container">
      <h1>My To-Do-List</h1>
      <AddTodo />
      {/* Boutons de filtrage placés avant la liste */}
      <div
        style={{
          marginTop: '20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <button onClick={() => setFilter('All')}>All</button>
        <button onClick={() => setFilter('Urgent')}>Urgent</button>
        <button onClick={() => setFilter('Done')}>Done</button>
      </div>
      {/* La liste des tâches apparaît désormais sous les boutons */}
      <TodoList todos={filteredTodos} />
    </div>
  );
};

export default Home;
