import io from 'socket.io-client';
import Peer from 'simple-peer';
import Debug from 'debug';
var debug = Debug('client');
var socket = io.connect();
var useTrickle = true; // Use trickle default
var peers = [];
// Take a name of room from URL, trim leading slash and ignore path behind secod slash
var path = window.location.pathname.slice(1);
var slash2Index = path.indexOf('/');
var room = slash2Index < 0 ? path : path.slice(0, slash2Index);
if (room !== '') {
    // Create or join room
    socket.emit('join', room);
    debug('Attempted to create or join room', room);
}
socket.on('connect', function () {
    debug('Connected to signalling server, Peer ID: %s', socket.id);
});
socket.on('full', function (r) {
    debug('Can\'t join room  %s, two participants max!', r);
});
socket.on('peer', function (peerData) {
    var peerId = peerData.peerId;
    var peer = new Peer({ initiator: peerData.initiator, trickle: useTrickle });
    debug('Peer available for connection discovered from signalling server, Peer ID: %s', peerId);
    // Catching signal event from socket.io server
    socket.on('signal', function (data) {
        if (data.peerId === peerId) { // If not true this is not my room partner
            debug('Received signalling data', data, 'from Peer ID:', peerId);
            peer.signal(data.signal);
        }
    });
    socket.on('log', function (array) {
        debug(array);
    });
    peer.on('signal', function (data) {
        debug('Advertising signalling data', data, 'to Peer ID:', peerId);
        socket.emit('signal', {
            signal: data,
            peerId: peerId,
        });
    });
    peer.on('error', function (e) {
        debug('Error sending connection to peer %s:', peerId, e);
    });
    peer.on('connect', function () {
        debug('Peer connection established');
    });
    peer.on('data', function (data) {
        debug('Recieved data from peer:', data);
    });
    // Remember peers in the list though only one on one is allowed
    peers[peerId] = peer;
});
//# sourceMappingURL=index.js.map