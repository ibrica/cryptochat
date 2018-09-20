"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Start and configure socket.io
 */
const socketIO = __importStar(require("socket.io"));
const os = __importStar(require("os"));
class SocketIO {
    constructor(httpServer) {
        this.io = socketIO(httpServer, {});
        this.io.sockets.on('connection', this.configSocket);
    }
    configSocket(socket) {
        // convenience function to log server messages on the client
        function log(...args) {
            let array = ['Message from server:'];
            array.push.apply(array, args);
            socket.emit('log', array);
        }
        socket.on('message', function (message) {
            log('Client said: ', message);
            // for a real app, would be room-only (not broadcast)
            socket.broadcast.emit('message', message);
        });
        socket.on('create or join', function (room) {
            log('Received request to create or join room ' + room);
            var clientsInRoom = this.io.sockets.adapter.rooms[room];
            var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
            log('Room ' + room + ' now has ' + numClients + ' client(s)');
            if (numClients === 0) {
                socket.join(room);
                log('Client ID ' + socket.id + ' created room ' + room);
                socket.emit('created', room, socket.id);
            }
            else if (numClients === 1) {
                log('Client ID ' + socket.id + ' joined room ' + room);
                this.io.sockets.in(room).emit('join', room);
                socket.join(room);
                socket.emit('joined', room, socket.id);
                this.io.sockets.in(room).emit('ready');
            }
            else { // max two clients
                socket.emit('full', room);
            }
        });
        socket.on('ipaddr', function () {
            var ifaces = os.networkInterfaces();
            for (var dev in ifaces) {
                ifaces[dev].forEach(function (details) {
                    if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                        socket.emit('ipaddr', details.address);
                    }
                });
            }
        });
        socket.on('bye', function () {
            console.log('received bye');
        });
    }
}
SocketIO.bootstrap = (httpServer) => {
    new SocketIO(httpServer);
};
exports.SocketIO = SocketIO;
//# sourceMappingURL=index.js.map