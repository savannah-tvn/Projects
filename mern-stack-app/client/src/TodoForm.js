import React, { useState } from "react";
import axios from 'axios';

const TodoForm = ({ onAdd }) => {
    const [task, setTask] = useState('');

    const addTodo = async () => {
        try {
            const response = await
            axios.post('http://localhost:3001/todos', { task });
            onAdd(response.data);
            setTask('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <input type="text" value={task} onChange={ (e) => 
                setTask(e.target.value)} /><br></br>
            <button style={{marginTop: 20}} onClick={addTodo}>Add Todo</button>
        </div>
    );
};

export default TodoForm;
