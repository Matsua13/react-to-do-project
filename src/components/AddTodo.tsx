import React, { useState, useContext, FormEvent } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { TodoContext } from '../context/TodoContext';

const AddTodo: React.FC = () => {
  const { addTodo } = useContext(TodoContext)!;

  const [text, setText] = useState('');
  // Pour la saisie manuelle
  const [deadline, setDeadline] = useState<string>('');
  // Pour le calendrier
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // Toggle pour choisir entre saisie manuelle et calendrier
  const [useCalendar, setUseCalendar] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Définir la deadline selon le mode choisi :
    // - En mode calendrier, utiliser selectedDate converti en ISO
    // - En mode manuel, utiliser la valeur du champ deadline
    let deadlineStr = deadline;
    if (useCalendar && selectedDate) {
      deadlineStr = selectedDate.toISOString();
    }

    if (!text.trim() || !deadlineStr) {
      alert('Please enter a task and a deadline.');
      return;
    }

    addTodo(text, deadlineStr);
    setText('');
    setDeadline('');
    setSelectedDate(null);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task"
      />

      <div style={{ margin: '10px 0' }}>
        <label>
          <input
            type="checkbox"
            checked={useCalendar}
            onChange={(e) => setUseCalendar(e.target.checked)}
          />
          &nbsp;Use calendar?
        </label>
      </div>

      {useCalendar ? (
        // Affichage du calendrier
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Select deadline"
          className="date-picker"
        />
      ) : (
        // Saisie manuelle via datetime-local
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      )}

      <button type="submit" className="btn">Add</button>
    </form>
  );
};

export default AddTodo;
