module.exports = function(io) {
  // WebSocket connection handling
  io.on('connection', (socket) => {
    console.log('New WebSocket client connected:', socket.id);

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`Client ${socket.id} disconnected. Reason: ${reason}`);
      // Additional cleanup can be done here if needed
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Handle cashOut event
    socket.on('cashOut', (data, callback) => {
      try {
        console.log('Received cashOut:', data);
        // Process the cashOut here
        // Broadcast to all clients
        io.emit('cashOutResponse', { 
          status: 'success', 
          data: {
            ...data,
            timestamp: new Date().toISOString()
          }
        });
        
        // Acknowledge the client
        if (typeof callback === 'function') {
          callback({ status: 'processing' });
        }
      } catch (error) {
        console.error('Error processing cashOut:', error);
        if (typeof callback === 'function') {
          callback({ status: 'error', message: error.message });
        }
      }
    });

    // Send welcome message
    socket.emit('welcome', { 
      message: 'Welcome to Aviator Crash Server',
      serverTime: new Date().toISOString(),
      clientId: socket.id
    });
  });

  // Handle server errors
  io.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });

  console.log('WebSocket server initialized');
  return io;
};
