import fs from 'fs';
import path, { dirname } from 'path';
import createSoundPlayer from 'play-sound';
import { createLogger } from './logging.js';
import { STATES } from './game.js';

// stupid way of getting __dirname
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const player = createSoundPlayer({
    players: [ 'mplayer', 'aplay' ]
});
const logger = createLogger('sounds');

// always assume we're using the relative sounds directory for now
const soundsDir = path.join(__dirname, '../../sounds');
const correctDir = path.join(soundsDir, 'correct');
const incorrectDir = path.join(soundsDir, 'incorrect');

function loadMp3Paths(dir) {
    function isMp3(filename) {
        const ext = path.extname(filename);
        
        return ext && ext.toLowerCase() === '.mp3';
    }

    const mp3s = fs.readdirSync(dir).filter(isMp3);

    // return a absolute path to make it easy for whatever we're playing it with
    // (which likely won't have a working directory relative to dirname)
    return mp3s.map(filename => path.resolve(dir, filename));
}

const files = {
    correct: loadMp3Paths(correctDir),
    incorrect: loadMp3Paths(incorrectDir)
};

function playSound(files) {
    const file = files[Math.floor(Math.random() * files.length)];

    logger.info(`Playing sound [${file}]`);
    
    player.play(file, err => {
        if (!err) logger.debug('Playing sound completed');
        else logger.error('Playing sound failed')
    });
}

function handleState(newState) {
    if (newState.state === STATES.ANSWERED) {
        const appropriateSounds = newState.isCorrect ? files.correct : files.incorrect;
        playSound(appropriateSounds);
    }
}

export {
    handleState
};