import { fetchQuestions } from './lib/questions.js';
import { createGame } from './lib/game.js';
import purdy from 'purdy';
import { WebSocket, WebSocketServer } from 'ws';
import { createMockAnswerInterface  } from './lib/answers.js';
import { createLogger } from './lib/logging.js';

const logger = createLogger('app');

const server = new WebSocketServer({
    host: process.env.WS_HOST || '127.0.0.1',
    port: process.env.WS_PORT || 8080
});

logger.info(`Started WebSocket Server at ${server.address()}`);

const broadcast = data => server.clients.forEach(client => {
    if (client.readyState == WebSocket.OPEN) client.send(data);
});

const answerInterface = createMockAnswerInterface(idx => game.guess(idx));

let lastState;

const game = createGame(fetchQuestions(), state => {
    lastState = state;

    purdy(state);
    broadcast(state);
    answerInterface.updateState(state)
});