import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);

  const addTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  }

  const toggleTodo = async (id) => {
    try {
      const updatedTodos = todos.map(todo => {
        if (todo._id === id) {
          todo.completed = !todo.completed; // Inverse l'état de la tâche
          // Mettez à jour la tâche sur le serveur
          axios.put(`http://localhost:3000/todos/${id}`, { completed: todo.completed });
        }
        return todo;
      });
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch data from Express server
  useEffect(() => {
    axios.get('http://localhost:3000/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className='form-input'>
      <h1>Todo List</h1>
      <TodoForm onAdd={addTodo} />
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo._id)}
            />
            <label className={todo.completed ? 'completed' : ''}>{todo.task}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
