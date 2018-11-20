import io from 'socket.io-client';
import Peer from 'simple-peer';
import Debug from 'debug';

const debug = Debug('client');

const chat: () => void = () => {

  const socket = io.connect({port: '3000'});
  const useTrickle: boolean = true; // Use trickle default
  const peers: Peer.Instance[] = [];

  // Take a name of room from URL, trim leading slash and ignore path behind secod slash
  const path: string = window.location.pathname.slice(1);
  const slash2Index: number = path.indexOf('/');
  const room = slash2Index < 0 ? path : path.slice(0, slash2Index);

  if (room !== '') {
    // Create or join room
    socket.emit('join', room);
    debug('Attempted to create or join room', room);
  }

  socket.on('connect', () => {
    debug('Connected to signalling server, Peer ID: %s', socket.id);
  });

  socket.on('full', (r: string) => {
    debug('Can\'t join room  %s, two participants max!', r);
  });

  socket.on('peer', (peerData: any) => {
    const peerId: number = peerData.peerId;
    const peer = new Peer({ initiator: peerData.initiator, trickle: useTrickle });

    debug('Peer available for connection discovered from signalling server, Peer ID: %s', peerId);

    // Catching signal event from socket.io server
    socket.on('signal', (data) => {
      if (data.peerId === peerId) { // If not true this is not my room partner
        debug('Received signalling data', data, 'from Peer ID:', peerId);
        peer.signal(data.signal);
      }
    });

    socket.on('log', (array) => {
      debug(array);
    });

    peer.on('signal', (data) => {
      debug('Advertising signalling data', data, 'to Peer ID:', peerId);
      socket.emit('signal', {
        signal: data,
        peerId,
      });
    });

    peer.on('error', (e) => {
      debug('Error sending connection to peer %s:', peerId, e);
    });

    peer.on('connect', () => {
      debug('Peer connection established');
    });

    peer.on('data', (data) => {
      debug('Recieved data from peer:', data);
    });
    // Remember peers in the list though only one on one is allowed
    peers[peerId] = peer;
  });
};

export default chat;
