"use strict";
exports.__esModule = true;
/**
 * Start and configure socket.io
 */
var socketIO = require("socket.io");
var os = require("os");
var SocketIO = /** @class */ (function () {
    function SocketIO(httpServer) {
        this.io = socketIO(httpServer, {});
        this.io.sockets.on('connection', this.configSocket);
    }
    SocketIO.prototype.configSocket = function (socket) {
        // convenience function to log server messages on the client
        function log() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var array = ['Message from server:'];
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
                this.io.sockets["in"](room).emit('join', room);
                socket.join(room);
                socket.emit('joined', room, socket.id);
                this.io.sockets["in"](room).emit('ready');
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
    };
    SocketIO.bootstrap = function (httpServer) {
        new SocketIO(httpServer);
    };
    return SocketIO;
}());
exports.SocketIO = SocketIO;
