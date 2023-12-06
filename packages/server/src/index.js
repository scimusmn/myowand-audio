const ws = require('ws');
const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');


const port = new SerialPort({ path: 'COMXXX', baudRate: 115200 });
const listeners = [];
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
parser.on('data', data => listeners.forEach(l => l.send(data)));



const sequence = [ 0, 1, 2, 3, 4, 5, 4, 3, 2, 1 ];
let index = 0;


(async function main() {
  //
  // Start an Express server
  //
  // We use Express so that we can allow CORS for WS communication between client and server
  //
  const app = express();
  app.use(cors({
    origin: true,
    credentials: true
  }));

  //
  // WebSocket listener
  //
  const wsServer = new ws.Server({ noServer: true, path: '/' });
  wsServer.on('connection', socket => {
    listeners.push(socket);
    socket.on('message', message => {
      console.log(message.toString());
    });
  });

  //
  // Set the Express server to listen on 8081
  //
  const server = app.listen(8081);

  //
  // Use WebSockets to handle the ws:// connections from the Express server
  //
  server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
      wsServer.emit('connection', socket, request);
    });
  });
})();
