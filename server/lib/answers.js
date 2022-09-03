import { STATES } from './game.js';
import { createLogger } from './logging.js';

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

export {
    createMockAnswerInterface
};