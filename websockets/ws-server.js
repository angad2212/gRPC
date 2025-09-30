const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
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

// Create user and broadcast over Socket.IO
app.post('/users', (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  const id = nextId++;
  const user = { id, name, email };
  users.set(id, user);

  // Broadcast to all connected Socket.IO clients
  io.emit('user.created', user);
  // Broadcast to raw WebSocket clients (Postman)
  broadcastWs({ type: 'user.created', user });

  return res.status(201).json(user);
});

// Create HTTP server and attach WebSocket server to it (same port)
const PORT = 4001;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket) => {
  // Greet the client and share current users
  socket.emit('welcome', { message: 'Socket.IO connected' });
  socket.emit('snapshot', { users: Array.from(users.values()) });

  // Optional echo for client messages
  socket.on('echo', (data) => {
    socket.emit('echo', data);
  });
});

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
  console.log(`- Socket.IO URL: ws://localhost:${PORT}`);
  console.log(`- Raw WS URL (Postman): ws://localhost:${PORT}/ws`);
});


