import arrayShuffle from 'array-shuffle';
import { createLogger } from './logging.js';

const STATES = {
    PLAYING: 'PLAYING',
    ANSWERED: 'ANSWERED'
};

const logger = createLogger('game');

function createGame(questions, stateChangeCallback, { answerDisplayTimeoutMs = 5 * 1000 } = {}) {
    if (!questions || questions.length < 1)
        throw Error('Must initialize game with some questions');

    let nextQuestionIdx = 0;

    const nextQuestion = () => {
        const question = questions[nextQuestionIdx++];
        if (nextQuestionIdx >= questions.length) nextQuestionIdx = 0; // loop back around when questions exhausted

        const answers = [ question.correctAnswer, question.incorrectAnswer1, question.incorrectAnswer2 ];
        const answerOrder = arrayShuffle([0, 1, 2]);

        const questionPresentation = {
            question: question.question,
            answers: [
                answers[answerOrder[0]], // i1
                answers[answerOrder[1]], // i2
                answers[answerOrder[2]], // c
            ],
            correctAnswer: answerOrder.indexOf(0)
        }

        return {
            state: STATES.PLAYING,
            question: questionPresentation
        }
    };

    let currentState = null;

    const updateState = (nextState) => {
        currentState = nextState;
        stateChangeCallback(currentState);
    };

    const guess = guessIndex => {
        if (currentState.state !== STATES.PLAYING) {
            logger.warn(`Ignoring guess [${guessIndex}] as in state: ${currentState.state}`);
            return;
        }

        const isCorrect = currentState.question.correctAnswer == guessIndex;

        const nextState = Object.assign({}, currentState, {
            state: STATES.ANSWERED,
            isCorrect: isCorrect,
            guessIndex: guessIndex
        });

        updateState(nextState);

        // schedule moving to next question
        setTimeout(() => {
            if (currentState == nextState) updateState(nextQuestion());
        }, answerDisplayTimeoutMs);
    };

    // initialize with a question
    updateState(nextQuestion());

    return {
        guess
    };
}


export { createGame, STATES };