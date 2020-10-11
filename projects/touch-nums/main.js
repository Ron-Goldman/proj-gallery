'use strict';

var gLevels = [
    { level: 1, numOfRows: 3, numOfCells: 9 },
    { level: 2, numOfRows: 5, numOfCells: 25 },
    { level: 3, numOfRows: 6, numOfCells: 36 },
]
var gLevel = 0;
var gCorrectNum = 1;
var gScore = 0
var gShuffledNums = shuffleNums(createNums(gLevels[gLevel].numOfRows))

function init() {
    reset()
    renderBoard()
}

function reset() {
    var elpyro = document.querySelector('.pyro')
    elpyro.style.display = 'none'
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    gShuffledNums = shuffleNums(createNums(gLevels[gLevel].numOfRows))
    gScore = 0
    gCorrectNum = 1;
}
function renderBoard() {
    var strHtml = ''
    for (var i = 0; i < gLevels[gLevel].numOfCells; i++) {
        if (i === 0) strHtml += '<tr>'
        strHtml += `<td data-cell="${i}" class="cell" onclick="cellClicked(this)">${gShuffledNums[i]}</td>`
        if ((i + 1) % gLevels[gLevel].numOfRows === 0) strHtml += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHtml
}

function cellClicked(elCell) {
    if (+elCell.innerText === gCorrectNum) {
        var correctAudio = new Audio('Bike-bell-ring-sound-effect.mp3')
        correctAudio.play()
        elCell.style.backgroundColor = 'tomato';
        gScore++
        checkGameOver()
        updateScore()
        gCorrectNum++
    } else {
        var wrongAudio = new Audio('Wrong-answer-sound-effect.mp3')
        wrongAudio.play()
        elCell.style.backgroundColor = 'red';
        setTimeout(() => {
            elCell.style.backgroundColor = 'cadetblue';
        }, 500);
        gScore--
        updateScore()
    }
}

function checkGameOver() {
    if (gCorrectNum === gLevels[gLevel].numOfCells) {
        var elpyro = document.querySelector('.pyro')
        elpyro.style.display = 'block'
        var elModal = document.querySelector('.modal')
        elModal.style.display = 'block'

    }
}

function updateScore() {
    var elScore = document.querySelector('.game-stats span')
    elScore.innerText = gScore
}

function createNums(numOfRows) {
    var nums = [];
    for (var i = 1; i <= numOfRows ** 2; i++) {
        nums.push(i);
    }
    return nums;
}

function shuffleNums(nums) {
    nums.sort(() => Math.random() - 0.5);
    return nums
}

function chooseYourLevel(level) {
    gLevel = level
    init()
}
