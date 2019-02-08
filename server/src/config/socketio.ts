/**
 * Start and configure socket.io
 */
import * as socketIO from 'socket.io';
import { Server } from 'http';

let io: SocketIO.Server; //
const DEFAULT_PEER_COUNT: number = 5;

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
      console.log(args);
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


      if (numClients === 0) {
        // New room created (When do you cloese it?)
        socket.join(room);
        log('Client ID ' + socket.id + ' created room ' + room);
        // socket.emit('created', room, socket.id);
      } else if (numClients < DEFAULT_PEER_COUNT) {
        // io.sockets.in(room).emit('join', room);
        socket.join(room);
        log('Client ID ' + socket.id + ' joined room ' + room);
        // socket.emit('joined', room, socket.id);
        // Now emit peer event back to connected socket
        SocketIO.emitToAllPeersInRoom(socket, room);

      } else { // max two clients
        socket.emit('full', room);
        return;
      }

      log ("Clients in the room: " + ++numClients);

      // Works for all socket pairs but for now we have only one

      // Message over server
      socket.on('message', (message) => {
        log('Client said: ', message);
        // room broadcast
        socket
          .to(room)
          .emit('message', message);
      });

      socket.on('signal', (data) => {
        log('Signal:', data);
        socket
          .to(room)
          .emit('signal', {
            signal: data.signal,
            peerId: socket.id,
          });
      });

      socket.on('disconnect', _ => {
        log('received bye');
        socket
          .to(room)
          .emit('bye', socket.id);
      });
    });




  }

  // tslint:disable-next-line:member-ordering
  private static emitToAllPeersInRoom(socket: SocketIO.Socket, room: string) {
    io
      .in(room)
      .clients((err, clients) => { // clients is array of socket ids in given room, connect all to new peer
        clients.forEach((roomSocketId: string) => {
          let roomSocket: SocketIO.Socket = io.sockets.connected[roomSocketId];
          // pair peer to all other nodes
          if (roomSocketId !== socket.id) {
            roomSocket.emit('peer', {
              peerId: socket.id,
              initiator: true, // new peer is initiator
            });
            // now send a peer event to new node
            socket.emit('peer', {
              peerId: roomSocketId,
              initiator: false,
            });
          }
        });
      });
  }
}
