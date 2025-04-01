const WebSocket = require('ws');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');

    const serviceHandlers = {
        chat: (data) => {
          console.log(`Chat service received: ${data.message}`);
          ws.send(JSON.stringify({ service: 'chat', response: `Chat message received: ${data.message}` }));
        },
        notifications: (data) => {
          console.log(`Notification service received: ${data.message}`);
          ws.send(JSON.stringify({ service: 'notifications', response: `Notification processed: ${data.message}` }));
        },
        echo: (data) => {
          console.log(`Echo service received: ${data.message}`);
          ws.send(JSON.stringify({ service: 'echo', response: data.message }));
        },
      };

      ws.on('message', (message) => {
        try {
          const parsedMessage = JSON.parse(message);
          const { service, data } = parsedMessage;
  
          if (service && serviceHandlers[service]) {
            serviceHandlers[service](data); 
          } else {
            console.log(`Unknown service: ${service}`);
            ws.send(JSON.stringify({ service: 'error', response: 'Unknown service' }));
          }
        } catch (error) {
          console.error('Error parsing message:', error);
          ws.send(JSON.stringify({ service: 'error', response: 'Invalid message format' }));
        }
      });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return wss;
}

module.exports = setupWebSocket;