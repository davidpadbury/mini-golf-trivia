import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

function Answer(answer, index, { marker = null, disabled = false } = {}) {
    const cssClass = 'Answer' + String.fromCharCode(index + 65);
    const className = [ 'Answer', cssClass, disabled ? 'Disabled' : '' ].join(' ')
    const markerEl = marker ? <div className='Marker'>{marker}</div> : null;

    return (
        <div key={index} className={className}>
            {markerEl}
            <div className="Text">{answer}</div>
            {markerEl}
        </div>
    );
}

function actullyDrawHeart(ctx) {
    // Ripped off from stack overflow answer: https://stackoverflow.com/a/58333880
    var x = 0;
    var y = 0;
    var width = 80;
    var height = 80;

    ctx.beginPath();
    var topCurveHeight = height * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(
        x, y,
        x - width / 2, y,
        x - width / 2, y + topCurveHeight
    );

    // bottom left curve
    ctx.bezierCurveTo(
        x - width / 2, y + (height + topCurveHeight) / 2,
        x, y + (height + topCurveHeight) / 2,
        x, y + height
    );

    // bottom right curve
    ctx.bezierCurveTo(
        x, y + (height + topCurveHeight) / 2,
        x + width / 2, y + (height + topCurveHeight) / 2,
        x + width / 2, y + topCurveHeight
    );

    // top right curve
    ctx.bezierCurveTo(
        x + width / 2, y,
        x, y,
        x, y + topCurveHeight
    );

    ctx.closePath();
    ctx.fillStyle = '#f00';
    ctx.fill();
}

export default ({ gameState }) => {
    const { width, height } = useWindowSize()

    const { state, question: { question, answers } } = gameState;
    const isAnswered = state == 'ANSWERED'

    const correctAnswerIndex = () => gameState.question.correctAnswer;
    const guessedAnswerIndex = () => gameState.guessIndex;
    const isCorrect = () => isAnswered && gameState.isCorrect;

    const mkMarker = (answerIndex) => {
        if (!isAnswered) return null;

        if (answerIndex == guessedAnswerIndex())
            return isCorrect() ? '✅' : '❌';
    }

    const isAnswerDisabled = (answerIndex) => isAnswered && (
        [guessedAnswerIndex()].indexOf(answerIndex) < 0
    );

    const mkAnswer = (answer, index) => Answer(answer, index, {
        marker: mkMarker(index),
        disabled: isAnswerDisabled(index)
    });

    return (
        <div className="Game">
            <Confetti
                numberOfPieces={isCorrect() ? 20 : 0}
                gravity={isCorrect() ? 0.1 : 0.9}
                drawShape={actullyDrawHeart} 
                width={width}
                height={height}
                />
            <div className="Question">{question}</div>
            <div className="Answers">
                {answers.map(mkAnswer)}
            </div>
        </div>
    );
};