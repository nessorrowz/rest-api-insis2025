const express = require('express');

const app = express();
const PORT = 1337;

// Middleware 
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
 
let users = [];
let nextId = 1; // auto increment idnya

// GET all
app.get('/users', (req, res) => {
    res.json(users);
});

// POST 
app.post('/users', (req, res) => {
    console.log(req.body); // Debugging line
    const { name, email, category } = req.body;

    if (!name || !email || !category) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newUser = {
        id: nextId++, // valuenya naik terus
        name,
        email,
        category
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

// GET 
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

// PATCH 
app.patch('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const { name, email, category } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (category) user.category = category;

    res.json(user);
});

// DELETE 
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    users = users.filter(u => u.id !== userId);
    res.json({ message: 'User deleted' });
});



