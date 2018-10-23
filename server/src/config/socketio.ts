/**
 * Start and configure socket.io
 */
import * as socketIO from 'socket.io';
import * as os from 'os';
import {Server} from 'http';

let io:SocketIO.Server; //

export class SocketIO{

  public static bootstrap =  (httpServer:Server):void => {
    new SocketIO(httpServer);
  };

  constructor (httpServer:Server){
      io = socketIO(httpServer, {});
      io.sockets.on('connection', this.configSocket)
  }

  private configSocket(socket){
    // convenience function to log server messages on the client
    function log(...args: any[]) {
      let array: any[] = ['Message from server:'];
      array.push.apply(array, args);
      socket.emit('log', array);
    }

    socket.on('message', (message) =>{
      log('Client said: ', message);
      // for a real app, would be room-only (not broadcast)
      socket.broadcast.emit('message', message);
    });
  
    socket.on('create or join', (room) => {
      log('Received request to create or join room ' + room);
  
      let clientsInRoom = io.sockets.adapter.rooms[room];
      let numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
      log('Room ' + room + ' now has ' + numClients + ' client(s)');
  
      if (numClients === 0) {
        socket.join(room);
        log('Client ID ' + socket.id + ' created room ' + room);
        socket.emit('created', room, socket.id);
  
      } else if (numClients === 1) {
        log('Client ID ' + socket.id + ' joined room ' + room);
        io.sockets.in(room).emit('join', room);
        socket.join(room);
        socket.emit('joined', room, socket.id);
        io.sockets.in(room).emit('ready');
      } else { // max two clients
        socket.emit('full', room);
      }
    });
  
    socket.on('ipaddr', () => {
      let ifaces = os.networkInterfaces();
      for (var dev in ifaces) {
        ifaces[dev].forEach((details) => {
          if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
            socket.emit('ipaddr', details.address);
          }
        });
      }
    });

    socket.on('bye', () => {
      console.log('received bye');
    });
  }
}
