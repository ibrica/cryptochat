/**
 * Application server
 */
import app from './app';
import * as fs from 'fs';
import * as https from 'https';
import {SocketIO} from  './config/socketio';
const debug = require('debug')('cryptochat:server');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
// Certificates

const privateKey = port === 3000 
      ? fs.readFileSync('server.key')
      : fs.readFileSync('/etc/letsencrypt/live/eter.io/privkey.pem', 'utf8');
const certificate = port === 3000 
      ? fs.readFileSync('server.cert')
      : fs.readFileSync('/etc/letsencrypt/live/eter.io/fullchain.pem', 'utf8');


const credentials = {
	key: privateKey,
	cert: certificate
};
const server = https.createServer(credentials, app);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// start socketio
SocketIO.bootstrap(server);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

export default server;