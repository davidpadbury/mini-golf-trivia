import { STATES } from './game.js';
import { createLogger } from './logging.js';
import { RegexParser, SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline'

const logger = createLogger('answers');

function createMockAnswerInterface(guessCallback, { minGuessTimeMs = 2000, maxGuessTimeMs = 5000 } = {}) {
    let state = null;

    function scheduleGuess(newState) {
        const waitForMs = Math.floor(Math.random() * (maxGuessTimeMs - minGuessTimeMs)) + minGuessTimeMs;

        const makeGuess = () => {
            // randomly guess 0, 1 or 2
            const guess = Math.floor(Math.random() * 3);

            // only run if the game is still in the expected state
            if (newState == state) {
                logger.info(`Mocking guess of ${guess}`);
                guessCallback(guess);
            }
        }

        setTimeout(makeGuess, waitForMs);
    }

    function updateState(newState) {
        state = newState;

        if (newState.state == STATES.PLAYING) scheduleGuess(state);
    }

    return {
        updateState
    };
}

const ballDetectedRegex = /Ball\((\d+)\)/;

function createSerialAnswerInterface(path, guess, baudRate = 115200) {
    function handleLine(line) {
        // only look at lines coming from our logger
        if (line.indexOf('BallDetected') < 0) return;

        const match = ballDetectedRegex.exec(line);

        if (match) {
            const ballText = match[1];
            const ball = parseInt(ballText, 10);
            logger.info(`Ball Detected: ${ball}`);
            guess(ball);
        }
    }

    const port = new SerialPort({
        path: path,
        baudRate: baudRate
    });
    const parser = port.pipe(new ReadlineParser());

    port.on('open', () => logger.debug('Serial port open'));
    port.on('close', () => logger.debug('Serial port closed'));

    parser.on('data', handleLine);

    function updateState(newState) {
        // don't really need to do much the other way currently
    }

    return {
        updateState
    }
}

export {
    createMockAnswerInterface,
    createSerialAnswerInterface
};