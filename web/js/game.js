// Reto contrarreloj: convertir números decimales a binario.

const GAME_DURATION = 180;    // segundos por partida
const START_BITS = 4;         // bits disponibles en el nivel 1
const MAX_BITS = 8;
const POINTS_PER_LEVEL = 10;  // se sube de nivel al llegar a nivel * 10 puntos
const LEVEL_UP_DELAY = 2000;  // ms que dura la animación de nivel

const $ = id => document.getElementById(id);

const binaryDisplay = $('binaryDisplay');
const targetNumber = $('targetNumber');
const scoreValue = $('scoreValue');
const timerValue = $('timerValue');
const levelValue = $('levelValue');
const feedback = $('feedback');
const levelUp = $('levelUp');
const playerSetup = $('playerSetup');
const gameContainer = $('gameContainer');
const gameOver = $('gameOver');
const rankingPanel = $('rankingPanel');
const toggleRankingBtn = $('toggleRankingBtn');

let currentPlayerName = '';
let currentTarget = 0;
let score = 0;
let timeLeft = GAME_DURATION;
let currentLevel = 1;
let activeBits = START_BITS;
let gameTimer = null;
let levelUpTimeout = null;
let feedbackTimeout = null;
let isGameActive = false;
let isLevelTransition = false; // durante la animación de nivel no se aceptan respuestas
let nameErrorShown = false;

const canPlay = () => isGameActive && !isLevelTransition;

const bitRow = createBitRow($('bitsContainer'), MAX_BITS, (value, binary) => {
    binaryDisplay.textContent = groupNibbles(binary);
}, { canToggle: canPlay });

// ---------- Ciclo de partida ----------

function startGame() {
    clearInterval(gameTimer);
    clearTimeout(levelUpTimeout);

    score = 0;
    timeLeft = GAME_DURATION;
    currentLevel = 1;
    activeBits = START_BITS;
    currentTarget = 0;
    isLevelTransition = false;
    levelUp.classList.remove('show');

    updateHud();
    timerValue.classList.remove('warning');
    bitRow.setEnabledBits(activeBits);
    generateNewTarget();

    isGameActive = true;
    gameTimer = setInterval(tick, 1000);
}

function tick() {
    if (isLevelTransition) return; // el reloj se pausa durante el cambio de nivel
    timeLeft--;
    timerValue.textContent = timeLeft;
    timerValue.classList.toggle('warning', timeLeft <= 10);
    if (timeLeft <= 0) endGame();
}

async function endGame() {
    isGameActive = false;
    clearInterval(gameTimer);
    clearTimeout(levelUpTimeout);
    isLevelTransition = false;
    levelUp.classList.remove('show');

    renderFinalScore();
    gameOver.hidden = false;

    try {
        await Ranking.add(currentPlayerName, score);
    } catch (error) {
        console.error('Error al guardar la puntuación:', error);
    }
    Ranking.render($('endGameRankingTable'), currentPlayerName);
    Ranking.render($('rankingTable'), currentPlayerName);
}

// ---------- Lógica de preguntas ----------

/** Número aleatorio entre 1 y 2^activeBits - 1, distinto del anterior. */
function generateNewTarget() {
    const maxValue = 2 ** activeBits - 1;
    let next;
    do {
        next = 1 + Math.floor(Math.random() * maxValue);
    } while (next === currentTarget && maxValue > 1);
    currentTarget = next;
    targetNumber.textContent = currentTarget;
}

function checkAnswer() {
    if (!canPlay()) return;

    if (bitRow.getValue() === currentTarget) {
        score++;
        showFeedback(I18n.t('game.correct'), 'correct');
        if (score >= currentLevel * POINTS_PER_LEVEL && activeBits < MAX_BITS) {
            advanceToNextLevel();
        } else {
            nextQuestion();
        }
    } else {
        score--;
        showFeedback(I18n.t('game.incorrect'), 'incorrect');
    }
    updateHud();
}

function skipQuestion() {
    if (!canPlay()) return;
    score--;
    showFeedback(I18n.t('game.skipped'), 'incorrect');
    nextQuestion();
    updateHud();
}

function nextQuestion() {
    generateNewTarget();
    bitRow.reset();
}

function advanceToNextLevel() {
    isLevelTransition = true;
    currentLevel++;
    activeBits = Math.min(activeBits + 1, MAX_BITS);
    levelUp.classList.add('show');

    levelUpTimeout = setTimeout(() => {
        levelUp.classList.remove('show');
        bitRow.setEnabledBits(activeBits);
        generateNewTarget();
        updateHud();
        isLevelTransition = false;
    }, LEVEL_UP_DELAY);
}

// ---------- Interfaz ----------

function updateHud() {
    scoreValue.textContent = score;
    levelValue.textContent = currentLevel;
    timerValue.textContent = timeLeft;
}

function renderFinalScore() {
    $('finalScore').textContent = I18n.t('game.finalScore', { score, level: currentLevel });
}

function renderNameError() {
    $('nameError').textContent = nameErrorShown ? I18n.t('game.nameRequired') : '';
}

function showFeedback(text, type) {
    clearTimeout(feedbackTimeout);
    feedback.textContent = text;
    feedback.className = `feedback ${type} show`;
    feedbackTimeout = setTimeout(() => feedback.classList.remove('show'), 1000);
}

function showSetup() {
    gameOver.hidden = true;
    gameContainer.hidden = true;
    toggleRankingBtn.hidden = true;
    rankingPanel.hidden = true;
    playerSetup.hidden = false;
    $('playerName').focus();
}

// ---------- Eventos ----------

$('setupForm').addEventListener('submit', event => {
    event.preventDefault();
    const name = $('playerName').value.trim();
    nameErrorShown = !name;
    renderNameError();
    if (!name) return;
    currentPlayerName = name;
    playerSetup.hidden = true;
    gameContainer.hidden = false;
    toggleRankingBtn.hidden = false;
    Ranking.render($('rankingTable'), currentPlayerName);
    startGame();
});

// Al cambiar de idioma se vuelven a pintar los textos generados desde JavaScript
I18n.onChange(() => {
    renderNameError();
    if (!gameOver.hidden) {
        renderFinalScore();
        Ranking.render($('endGameRankingTable'), currentPlayerName);
    }
    if (!toggleRankingBtn.hidden) Ranking.render($('rankingTable'), currentPlayerName);
});

toggleRankingBtn.addEventListener('click', () => {
    rankingPanel.hidden = !rankingPanel.hidden;
});

$('newGameBtn').addEventListener('click', () => {
    gameOver.hidden = true;
    startGame();
});

$('backToMenuBtn').addEventListener('click', showSetup);
$('checkBtn').addEventListener('click', checkAnswer);
$('skipBtn').addEventListener('click', skipQuestion);
$('resetBtn').addEventListener('click', () => {
    if (canPlay()) bitRow.reset();
});

document.addEventListener('keydown', event => {
    if (!isGameActive) return;
    switch (event.key) {
        case 'Enter':
        case ' ':
            event.preventDefault(); // evita que además se "pulse" el botón con foco
            checkAnswer();
            break;
        case 'Escape':
            skipQuestion();
            break;
    }
});
