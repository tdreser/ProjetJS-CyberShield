import quizQuestions from './quiz-data.js';

let currentQuestions = [];
let currentQuestionIndex = 0;

let timerInterval;
let timeLeft = 10;

let score = 0;
let streak = 0;
let currentDifficulty = "";

let wrongCategories = [];

function start(difficulty) {

    currentDifficulty = difficulty;

    const filteredQuestions = quizQuestions
        .filter(q => q.difficulty === difficulty);

    currentQuestions = filteredQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

    currentQuestionIndex = 0;
    score = 0;
    streak = 0;
    wrongCategories = [];

    toggleGame();
    showQuestion();
}

function showQuestion() {

    const gameDiv = document.getElementById("game");
    gameDiv.innerHTML = "";

    if (currentQuestionIndex >= currentQuestions.length) {
        endQuiz();
        return;
    }

    const selectedQuestion = currentQuestions[currentQuestionIndex];
    const question = currentQuestions.find((item) => item.id === selectedQuestion.id);

    if (!question) {
        currentQuestionIndex++;
        showQuestion();
        return;
    }

    const header = document.createElement("div");

    header.innerHTML = `
        <span>Question ${currentQuestionIndex + 1} / ${currentQuestions.length}</span>
        <span id="timer">Temps restant : 10s</span>
        <button id="quit-btn">Quitter</button>
    `;

    const questionBlock = document.createElement("div");

    const title = document.createElement("h2");
    title.textContent = question.question;

    questionBlock.appendChild(title);

    question.options.forEach((option, index) => {

        const btn = document.createElement("button");
        btn.textContent = option;

        btn.addEventListener("click", () => {

            clearInterval(timerInterval);

            checkAnswer(index, question);

        });

        questionBlock.appendChild(btn);
    });

    gameDiv.appendChild(header);
    gameDiv.appendChild(questionBlock);

    document.getElementById("quit-btn").addEventListener("click", () => {
        clearInterval(timerInterval);
        toggleGame();
    });

    startTimer();
}

/* ---------------- TIMER ---------------- */

function startTimer() {

    timeLeft = 10;

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        timeLeft--;

        const timer = document.getElementById("timer");

        if (timer) {
            timer.textContent = `Temps restant : ${timeLeft}s`;
        }

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            currentQuestionIndex++;

            showQuestion();
        }

    }, 1000);
}

function checkAnswer(selected, question) {

    const gameDiv = document.getElementById("game");

    const correct = question.answer;

    let message = "";

    if (selected === correct) {

        streak++;

        let points = 100 + timeLeft * 10;

        if (streak >= 3) {
            points = Math.floor(points * 1.5);
        }

        score += points;

        message = "Bonne réponse !";

    } else {

        streak = 0;

        wrongCategories.push(question.category);

        message = "Mauvaise réponse.";
    }

    gameDiv.innerHTML = `
        <h2>${message}</h2>
        <p>${question.explanation}</p>
        <button id="next">Question suivante</button>
    `;

    document.getElementById("next").addEventListener("click", () => {
        currentQuestionIndex++;
        showQuestion();
    });
}

function endQuiz() {

    saveScore(score, currentDifficulty);

    const rank = getRanking(score);

    const weakCategories = getWeakCategories();

    const gameDiv = document.getElementById("game");

    gameDiv.innerHTML = `
        <h2>Quiz terminé</h2>
        <p>Score : ${score}</p>
        <p>Classement : #${rank}</p>

        <h3>Catégories à revoir</h3>
        <ul>
            ${weakCategories.map(c => `<li>${c}</li>`).join("")}
        </ul>

        <h3>Top 5</h3>
        <div id="score-history"></div>

        <button id="restart">Retour</button>
    `;

    displayScores();

    document.getElementById("restart").addEventListener("click", () => {
        toggleGame();
    });
}

function getWeakCategories() {

    const unique = wrongCategories
        .filter((v, i, arr) => arr.indexOf(v) === i);

    return unique;
}

function saveScore(score, difficulty) {

    const newScore = {
        score: score,
        difficulty: difficulty,
        date: new Date().toLocaleDateString()
    };

    const storedScores =
        JSON.parse(localStorage.getItem("quizScores")) || [];

    storedScores.push(newScore);

    const sorted = storedScores
        .sort((a, b) => b.score - a.score);

    const topFive = sorted.slice(0, 5);

    localStorage.setItem(
        "quizScores",
        JSON.stringify(topFive)
    );
}

function getScores() {

    return JSON.parse(localStorage.getItem("quizScores")) || [];
}

function displayScores() {

    const scores = getScores();

    const container =
        document.getElementById("score-history");

    if (!container) return;

    container.innerHTML = "";

    scores.map((s, index) => {

        const div = document.createElement("div");

        div.textContent =
            `${index + 1}. ${s.score} pts | ${s.difficulty} | ${s.date}`;

        container.appendChild(div);
    });
}

function getRanking(playerScore) {

    const scores =
        JSON.parse(localStorage.getItem("quizScores")) || [];

    scores.push({ score: playerScore });

    const sorted =
        scores.sort((a, b) => b.score - a.score);

    const rank =
        sorted.findIndex(s => s.score === playerScore) + 1;

    return rank;
}

function toggleGame() {

    const welcome = document.getElementById("welcome-quiz");
    const game = document.getElementById("game");

    welcome.style.display =
        welcome.style.display === "none" ? "block" : "none";

    game.style.display =
        game.style.display === "block" ? "none" : "block";
}

const startForm = document.getElementById("startForm");
const endForm = document.getElementById("endForm");

startForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const formData = new FormData(event.target);

    const difficulty = formData.get("difficulty");

    start(difficulty);
});

endForm.addEventListener("submit", (event) => {

    event.preventDefault();

    clearInterval(timerInterval);

    toggleGame();
});