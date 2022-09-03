import fs from 'fs';
import path, { dirname } from 'path';
import { parse } from 'csv-parse/sync';
import arrayShuffle from 'array-shuffle';

// stupid way of getting __dirname
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function getQuestionsPath() {
    // prefer path via environment variable if set
    if (process.env.QUESTIONS_CSV) return process.env.QUESTIONS_CSV;

    // otherwise returned the canned questions relative to the codebase
    return path.join(__dirname, '../../questions.csv');
}

function fetchQuestions() {
    const path = getQuestionsPath();

    if (!path || !fs.existsSync(path))
        throw Error(`Cannot find questions csv at [${path}]`);

    const content = fs.readFileSync(path, 'utf-8');
    const records = parse(content);

    const buildQuestion = (record) => {
        return {
            question: record[0].trim(),
            correctAnswer: record[1].trim(),
            incorrectAnswer1: record[2].trim(),
            incorrectAnswer2: record[3].trim()
        };
    };

    // drop the first row as that's the header
    const questions = records.slice(1).map(buildQuestion);
    return arrayShuffle(questions);
}

export { fetchQuestions };