import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faStar } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const addTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = async (id) => {
    try {
      const updatedTodos = todos.map(todo => {
        if (todo._id === id) {
          todo.completed = !todo.completed;
          axios.put(`http://localhost:3001/todos/${id}`, { completed: todo.completed });
        }
        return todo;
      });
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
  };

  const saveEditing = async (id) => {
    try {
      const updatedTodo = await axios.put(`http://localhost:3001/todos/${id}`, { task: editingText });
      setTodos(todos.map(todo => (todo._id === id ? updatedTodo.data : todo)));
      setEditingId(null);
      setEditingText('');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    axios.get('http://localhost:3001/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className='form-input'>
      <h1><FontAwesomeIcon icon={faStar} /> Todo List <FontAwesomeIcon icon={faStar} /></h1>
      <TodoForm onAdd={addTodo} />
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo._id)}
            />
            {editingId === todo._id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
            ) : (
              <label className={todo.completed ? 'completed' : ''}>{todo.task}</label>
            )}
            <div className="icon-container">
              <button onClick={() => deleteTodo(todo._id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              {editingId === todo._id ? (
                <>
                  <button onClick={() => saveEditing(todo._id)}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </>
              ) : (
                <button onClick={() => startEditing(todo._id, todo.task)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
