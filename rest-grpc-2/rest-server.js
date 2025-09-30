const express = require('express');

const app = express();
app.use(express.json());

// Temp database
const users = new Map(); // Map<number, { name: string, email: string }>
let nextId = 1; // auto-id starting at 1

app.post('/users', (req, res)=>{
    const { user, email } = req.body;
    const id = nextId++;
    users.set(id, { user, email });

    return res.status(201).json({ id, user, email });
})

app.get('/users/:id', (req, res)=>{
    const id = Number(req.params.id);
    const user = users.get(id) || null;
    return res.status(200).json(user);
})

app.get('/users', (req, res)=>{
    const { id } = req.query;
    if (id !== undefined) {
        const numericId = Number(id);
        const user = users.get(numericId) || null;
        return res.status(200).json(user);
    }
    return res.status(200).json(Array.from(users.entries()).map(([id, data]) => ({ id, ...data })));
})

app.listen(3003, () => {
  console.log('REST server listening on http://localhost:3003');
});