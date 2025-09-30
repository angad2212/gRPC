const http = require('http');
const express = require('express');
const { WebSocketServer } = require('ws');

// In-memory store: id -> { id, name, email }
const users = new Map();
let nextId = 1; // auto-increment starting at 1

// Create Express app
const app = express();
app.use(express.json());

// Basic health
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// List users
app.get('/users', (req, res) => {
  res.status(200).json(Array.from(users.values()));
});

// Create user and broadcast to WebSocket clients
app.post('/users', (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  const id = nextId++;
  const user = { id, name, email };
  users.set(id, user);

  // Broadcast to all connected raw WebSocket clients
  broadcastWs({ type: 'user.created', user });

  return res.status(201).json(user);
});

// Create HTTP server and attach raw WebSocket server to it (same port)
const PORT = 4001;
const server = http.createServer(app);

// Raw WebSocket endpoint for Postman: ws://localhost:4001/ws
const wss = new WebSocketServer({ noServer: true });

function broadcastWs(messageObject) {
  const data = JSON.stringify(messageObject);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(data);
  });
}

server.on('upgrade', (req, socket, head) => {
  if (req.url === '/ws') {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'welcome', message: 'Raw WebSocket connected' }));
  ws.send(JSON.stringify({ type: 'snapshot', users: Array.from(users.values()) }));
});

server.listen(PORT, () => {
  console.log(`WS + HTTP server listening on http://localhost:${PORT}`);
  console.log(`- HTTP endpoints: GET/POST http://localhost:${PORT}/users`);
  console.log(`- WS URL: ws://localhost:${PORT}/ws`);
});


