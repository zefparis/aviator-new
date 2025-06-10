const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Combine WebSocket server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Import WebSocket handlers from ws-server.js
require('./ws-server')(io);

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Set port from environment variable or default to 4000
const PORT = process.env.PORT || 4000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
  console.log('Nouveau client connecté:', socket.id);

  // Gérer les déconnexions
  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });

  // Gérer les erreurs
  socket.on('error', (error) => {
    console.error('Erreur de socket:', error);
  });

  // Exemple d'événement personnalisé
  socket.on('cashOut', (data) => {
    console.log('Reçu un cashOut:', data);
    // Traiter le cashOut ici
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Serveur WebSocket en cours d'exécution sur le port ${PORT}`);
});
