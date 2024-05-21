const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connection to MongoDB
mongoose.connect('mongodb://localhost/mern-stack-db');

const todoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

//Implementing routes for CRUD ===>
    //create a new To do
app.post('/todos', async (req, res) => {
    const newTodo = new Todo (req.body);
    await newTodo.save();
    res.json(newTodo);
});
// ===>
    // update an existing todo
app.put('/todos/:id', async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body,{ new: true });
    res.json(updatedTodo);
});
// ===> 
    // Delete a Todo 
app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo task deleted successfully !'});
});

app.get('/todos', async (req,res) => {
    const todos = await Todo.find();
    res.json(todos);
});
// Routes and middleware
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
