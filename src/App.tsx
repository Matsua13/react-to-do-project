import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import EditTodo from './pages/EditTodo';
import { TodoProvider } from './context/TodoContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/retro.css';

const App: React.FC = () => {
  return (
    <TodoProvider>
      <Router>
        {/* Menu de navigation */}
        <nav>
          <ul>
            {/* <li> */}
              <Link to="/about">About</Link>
            {/* </li> */}
          </ul>
        </nav>
        {/* Définition des routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/edit/:id" element={<EditTodo />} />
        </Routes>
      </Router>
      <ToastContainer />
    </TodoProvider>
  );
};

export default App;
