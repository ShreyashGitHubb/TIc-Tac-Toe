const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'pvp';
const recognizedCommandElem = document.getElementById('recognized-command');
const currentTurnElem = document.getElementById('current-turn');
const messageElem = document.getElementById('message');
const boardElem = document.getElementById('board');
const voiceButton = document.getElementById('voice-button');

// Initialize the board UI
function initBoard() {
    boardElem.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElem = document.createElement('div');
        cellElem.className = 'cell';
        cellElem.dataset.index = index;
        cellElem.textContent = cell;
        cellElem.addEventListener('click', () => handleCellClick(index));
        boardElem.appendChild(cellElem);
    });
}
initBoard();

// Handle cell clicks
function handleCellClick(index) {
    if (board[index] || !gameActive) return;

    board[index] = currentPlayer;
    initBoard();

    if (checkWin()) {
        messageElem.textContent = `${currentPlayer} Wins!`;
        gameActive = false;
    } else if (checkDraw()) {
        messageElem.textContent = 'Draw!';
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        currentTurnElem.textContent = `Current Turn: ${currentPlayer}`;
        if (gameMode === 'ai' && currentPlayer === 'O') {
            aiMove();
        }
    }
}

// AI Move
function aiMove() {
    const availableCells = board.map((cell, index) => (cell === null ? index : null)).filter(index => index !== null);
    const selectedCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    if (selectedCell !== null) {
        handleCellClick(selectedCell);
    }
}

// Check for win
function checkWin() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

// Check for draw
function checkDraw() {
    return board.every(cell => cell !== null);
}

// Voice Command Handling
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = 'en-US';

recognition.onresult = (event) => {
    const speechToText = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
    recognizedCommandElem.textContent = `Recognized Command: ${speechToText}`;
    processCommand(speechToText);
};

function processCommand(command) {
    const cellMap = {
        "1st": 0, "one": 0, "1": 0,
        "2nd": 1, "two": 1, "2": 1,
        "3rd": 2, "three": 2, "3": 2,
        "4th": 3, "four": 3, "4": 3,
        "5th": 4, "five": 4, "5": 4,
        "6th": 5, "six": 5, "6": 5,
        "7th": 6, "seven": 6, "7": 6,
        "8th": 7, "eight": 7, "8": 7,
        "9th": 8, "nine": 8, "9": 8
    };

    if (cellMap[command] !== undefined) {
        handleCellClick(cellMap[command]);
    } else if (command === 'restart') {
        restartGame();
    } else {
        recognizedCommandElem.textContent = "Command not recognized. Please try again.";
    }
}

voiceButton.addEventListener('click', () => {
    if (voiceButton.textContent === 'Start Listening') {
        recognition.start();
        voiceButton.textContent = 'Stop Listening';
    } else {
        recognition.stop();
        voiceButton.textContent = 'Start Listening';
    }
});

// Restart Game
function restartGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    messageElem.textContent = '';
    initBoard();
}

// Initialize turn display
currentTurnElem.textContent = `Current Turn: ${currentPlayer}`;
