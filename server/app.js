import { fetchQuestions } from './lib/questions.js';
import { createGame } from './lib/game.js';
import purdy from 'purdy';
import { WebSocket, WebSocketServer } from 'ws';
import { createMockAnswerInterface  } from './lib/answers.js';
import { createLogger } from './lib/logging.js';
import { handleState as soundEffects } from './lib/sounds.js';

const logger = createLogger('app');

const server = new WebSocketServer({
    host: process.env.WS_HOST || 'localhost',
    port: process.env.WS_PORT || 8080
});

logger.info(`Started WebSocket Server at ${server.address()}`);

const sendState = (socket, state) => {
    if (socket.readyState == WebSocket.OPEN) socket.send(JSON.stringify(state));
}

const broadcast = data => server.clients.forEach(client => sendState(client, data));

const answerInterface = createMockAnswerInterface(idx => game.guess(idx));

let lastState;

const game = createGame(fetchQuestions(), state => {
    lastState = state;

    purdy(state);
    broadcast(state);
    soundEffects(state);
    answerInterface.updateState(state)
});

// when clients connect send the current state
server.on('connection', socket => {
    logger.info('Got connection');
    if (lastState) sendState(socket, lastState);
});