/**
 * Start and configure socket.io
 */
import * as socketIO from 'socket.io';
import * as os from 'os';
import { Server } from 'http';

let io: SocketIO.Server; //

export class SocketIO {

  public static bootstrap = (httpServer: Server): void => {
    // Start server
    new SocketIO(httpServer);
  }

  constructor(httpServer: Server) {
    io = socketIO(httpServer, {});
    io.sockets.on('connection', this.configSocket);
  }

  private configSocket(socket) {
    // function to log server messages on the client
    function log(...args: any[]) {
      let array: any[] = ['Message from server:'];
      array.push.apply(array, args);
      socket.emit('log', array);
    }

    /**
     * Create or join room
     */
    socket.on('join', (room: string) => {
      log('Received request to create or join room ' + room);

      let clientsInRoom = io.sockets.adapter.rooms[room];
      let numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
      log('Room ' + room + ' now has ' + numClients + ' client(s)');

      if (numClients === 0) {
        socket.join(room);
        log('Client ID ' + socket.id + ' created room ' + room);
        // socket.emit('created', room, socket.id);
      } else if (numClients === 1) {
        log('Client ID ' + socket.id + ' joined room ' + room);
        // io.sockets.in(room).emit('join', room);

        socket.join(room);
        // socket.emit('joined', room, socket.id);
        // io.sockets.in(room).emit('ready');
        // Emit peer to the chat partner
        socket.to(room).emit('peer', {
          initiator: false, // Creator of the room is initiator
          peerId: socket.id, // peerid = socketid
        });
      } else { // max two clients
        socket.emit('full', room);
      }

      // Message over server
      socket.on('message', (message) => {
        log('Client said: ', message);
        // room broadcast
        socket.to(room).emit('message', message);
      });

      socket.on('signal', (data) => {
        socket.to(room).emit('signal', {
          signal: data.signal,
          peerId: socket.id,
        });
      });
    });

    socket.on('bye', () => {
      log('received bye');
    });
  }
}
