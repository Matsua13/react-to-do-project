import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TodoContext, Todo } from '../context/TodoContext';

interface TodoListProps {
  todos?: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ todos: propTodos }) => {
  const navigate = useNavigate();
  const context = useContext(TodoContext);
  if (!context) return null;
  const { todos: contextTodos, toggleTodo, removeTodo } = context;
  const todos = propTodos || contextTodos;

  return (
    <ul>
      {todos.map(todo => (
        <li
          key={todo.id}
          className={`todo-item ${todo.completed ? 'completed' : ''}`}
        >
          <span onClick={() => toggleTodo(todo.id)} className="todo-text">
            {todo.text}{" "}
            <em className="todo-deadline">
              (Deadline: {new Date(todo.deadline).toLocaleString()})
            </em>
          </span>
          {/* Groupe de boutons alignés côte à côte */}
          <div className="btn-group">
            <button
              className="btn"
              onClick={() => {
                if (window.confirm("Are you sure?")) {
                  removeTodo(todo.id);
                }
              }}
            >
              Delete
            </button>
            <button
              className="btn"
              onClick={() => navigate(`/edit/${todo.id}`)}
            >
              Update
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
