module.exports = function(io) {
  // Gestion des connexions WebSocket
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Gérer les erreurs
    socket.on('error', (error) => {
      console.error('Erreur de socket:', error);
    });

    // Écouter l'événement cashOut
    socket.on('cashOut', (data) => {
      console.log('Reçu un cashOut:', data);
      // Ici, vous pouvez ajouter la logique de traitement du cashOut
      // Par exemple, diffuser à tous les clients
      io.emit('cashOutResponse', { status: 'success', data });
    });

    // Envoyer un message de bienvenue
    socket.emit('welcome', { message: 'Bienvenue sur le serveur Aviator Crash!' });
  });

  console.log('WebSocket server initialized');
  return io;
};
