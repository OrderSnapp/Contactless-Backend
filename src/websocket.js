const WebSocket = require('ws');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });
  const clients = new Set();

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    clients.add(ws);

    ws.on('message', (message) => {
      console.log('Received:', message.toString());

      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    });

    ws.on('close', () => {
      console.log('WebSocket backend connection closed');
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  return wss;
}

module.exports = setupWebSocket;
