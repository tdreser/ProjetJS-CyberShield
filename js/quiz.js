import quizQuestions from './quiz-data.js';

let currentQuestionIndex = 0;
let currentQuestions = [];
let timerInterval;
let timeLeft = 10;
let score = 0;

function start(difficulty, duel = false) {

    const filteredQuestions = quizQuestions.filter(q => q.difficulty === difficulty);

    currentQuestions = filteredQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

    currentQuestionIndex = 0;
    score = 0;

    toggleGame();
    showQuestion();
}

function showQuestion() {

    const gameDiv = document.getElementById("game");
    gameDiv.innerHTML = "";

    if (currentQuestionIndex >= currentQuestions.length) {
        gameDiv.innerHTML = `
            <h2>Quiz terminé</h2>
            <p>Score : ${score} / ${currentQuestions.length}</p>
            <button id="restart">Retour</button>
        `;

        document.getElementById("restart").addEventListener("click", () => {
            toggleGame();
        });

        return;
    }

    const question = currentQuestions[currentQuestionIndex];

    const header = document.createElement("div");
    header.className = "quiz-header";

    header.innerHTML = `
        <span>
            Question ${currentQuestionIndex + 1} / ${currentQuestions.length}
        </span>

        <span id="timer">
            Temps restant : 10s
        </span>

        <button id="quit-btn">Quitter</button>
    `;

    const questionElem = document.createElement("div");

    const title = document.createElement("h2");
    title.textContent = question.question;
    questionElem.appendChild(title);

    question.options.forEach((option, index) => {

        const button = document.createElement("button");
        button.textContent = option;

        button.addEventListener("click", () => {

            checkAnswer(index, question.answer);

            currentQuestionIndex++;
            showQuestion();

        });

        questionElem.appendChild(button);

    });

    gameDiv.appendChild(header);
    gameDiv.appendChild(questionElem);

    document.getElementById("quit-btn").addEventListener("click", () => {
        clearInterval(timerInterval);
        toggleGame();
    });

    startTimer();
}

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

function checkAnswer(selected, correct) {

    if (selected === correct) {
        score++;
        alert("Bonne réponse !");
    } else {
        alert("Mauvaise réponse !");
    }

}

function toggleGame() {

    const welcomeModal = document.getElementById('welcome-quiz');
    const gameModal = document.getElementById('game');

    welcomeModal.style.display =
        welcomeModal.style.display === "none" ? "block" : "none";

    gameModal.style.display =
        gameModal.style.display === "block" ? "none" : "block";
}

const startForm = document.getElementById('startForm');
const endForm = document.getElementById('endForm');

startForm.addEventListener('submit', (event) => {

    event.preventDefault();

    const formData = new FormData(event.target);
    const difficulty = formData.get("difficulty");

    start(difficulty);

});

endForm.addEventListener('submit', (event) => {

    event.preventDefault();

    clearInterval(timerInterval);

    toggleGame();

});