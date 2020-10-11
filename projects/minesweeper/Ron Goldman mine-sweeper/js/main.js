'use strict';

var board;
var BOMB = '💣'
var FLAG = '🚩'
var gBombs = []
var gIsFirstClick = true;
var gFlags = 3
var gScore = 0

var gLevel = [
    { rows: 4, cols: 4, mines: 3, },
    { rows: 8, cols: 8, mines: 12 },
    { rows: 12, cols: 12, mines: 30 }
]

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLives = 0

var gCurrLevel = gLevel[2]
disableContextMenu()

function init() {
    board = buildBoard(gCurrLevel.rows, gCurrLevel.cols)
    resetVars()
    createMines(gCurrLevel.mines, board)
    fillBoard(board)
    renderBoard(board)
}

function resetVars() {
    var elpyro = document.querySelector('.pyro')
    elpyro.style.display = 'none'
    gIsFirstClick = true;
    gBombs = []
    gGame.isOn = true;
    gFlags = gCurrLevel.mines
    updateFlags()
    var elMessageBox = document.querySelector('.message-box')
    elMessageBox.style.display = 'none'
    createLives()
    gScore = 0
    updateScore()

}

function chooseYourLevel(level) {
    gCurrLevel = gLevel[level]

    init()
    //console.log(gCurrLevel);
}


function buildBoard(ROW, COL) {
    var board = [];
    for (var i = 0; i < ROW; i++) {
        board[i] = [];
        for (var j = 0; j < COL; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };

            board[i][j] = cell;
        }
    }
    return board;
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {

            strHTML += `\t<td oncontextmenu="markFlag(this,${i},${j})" onClick="cellClicked(this,${i},${j})" class="cell ${i} - ${j} ">\n`
            if (board[i][j].isShown && board[i][j].isMine) {
                strHTML += BOMB;
            } else if (board[i][j].isShown && !board[i][j].isMarked) {

                strHTML += board[i][j].minesAroundCount

            }
             if (board[i][j].isMarked) {
                strHTML += FLAG
            }
            strHTML += `\t</td>\n`;
        }
        strHTML += '</tr>\n';
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function cellClicked(elCell, i, j) {

    if (!gGame.isOn) return;
    if (board[i][j].isMarked) return;
    elCell.innerText = (gIsFirstClick && board[i][j].isMine) ? init() : board[i][j].minesAroundCount;
    gIsFirstClick = false;
    if (board[i][j].isShown) return;
    var cell = board[i][j]
    cell.isShown = true;
    revealNeighbors(i, j, board)
    updateScore()
    elCell.innerText = (cell.isMine) ? BOMB : cell.minesAroundCount;
    elCell.classList.add('cell-clicked')
    //console.log(elCell);
    checkGameWon(board)
    if (cell.isMine && gLives === 0) {
        elCell.classList.add('cell-clicked')
        var elMessageBox = document.querySelector('.message-box')
        elCell.classList.add('bomb')
        elMessageBox.innerText = 'GAME OVER!!'
        elMessageBox.style.display = 'block'
        setTimeout(() => {
            showMines(gBombs, board)
            resetMessageBox()
        }, 1000);

        gGame.isOn = false;

    } else if (cell.isMine) {
        updateScore()
        cell.isShown;
        gGame.isOn = false;
        var elMessageBox = document.querySelector('.message-box')
        elMessageBox.innerText = ` BOOM! you have ${gLives} more life `
        elMessageBox.style.display = 'block'
        var elLives = document.querySelectorAll('.modal h2')
        
        setTimeout(() => {
            elLives[1].style.backgroundColor = 'red'
            
        }, 500);


    }
    console.log('elCell : ', elCell);
}

function markFlag(elCell, i, j) {
    var cell = board[i][j]
    if (cell.isMarked) {
       cell.isShown = false;
       cell.isMarked = false;
       elCell.innerText = ''
       elCell.classList.remove('cell-clicked')
       console.log('test');
       return;
   }
    if (!cell.isShown && gFlags >= 0) {
        gFlags--
        updateFlags()
        elCell.innerText = FLAG
        var cell = board[i][j]
        cell.isShown = true;
        cell.isMarked = true;
        //elCell.classList.add('cell-clicked')
        checkGameWon(board)
        //console.log(elCell);
        //console.log(cell);
    } 

}

function checkGameWon(board) {
    //if (gScore === board.length*board[0].length-gCurrLevel.mines)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isShown) return false
        }
    }
    gGame.isOn = false;
    console.log('WIN!!!');
    var elMessageBox = document.querySelector('.message-box')
    elMessageBox.innerText = 'YOU WIN!!'
    elMessageBox.style.display = 'block'
    var elpyro = document.querySelector('.pyro')
    elpyro.style.display = 'block'
    setTimeout(() => {
        resetMessageBox()
    }, 3000);


}

function resetMessageBox() {
    var elMessageBox = document.querySelector('.message-box')
    elMessageBox.style.display = 'none'


}

function createMines(numOfMines, board) {
    while (gBombs.length !== gCurrLevel.mines) {
        for (var i = 0; i < numOfMines; i++) {
            var num1 = getRandomIntInclusive(0, board.length - 1);
            var num2 = getRandomIntInclusive(0, board[num1].length - 1);

            board[num1][num2].isMine = true
            var bombLocation = { i: num1, j: num2 }
            gBombs.push(bombLocation)
            for (var j = 0; j < gBombs.length; j++) {
                if (gBombs[j].i === num1 && gBombs[j].j === j) console.log(bombLocation, 'exists');
            }
        }
    }
    console.log('location of bombs: ', gBombs);
}

function fillBoard(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = getNeighborsCount(i, j, board)
        }
    }

}

function showMines(bombs, board) {

    for (var i = 0; i < gBombs.length; i++) {

        board[bombs[i].i][bombs[i].j].isShown = true;
        console.log(board[bombs[i].i][bombs[i].j]);
        
    }

    renderBoard(board)
}

function updateFlags() {
    var elFlagSpan = document.querySelector('h2 span')
    elFlagSpan.innerText = gFlags;
    
}


function updateScore() {
    gScore = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isShown) {
                gScore++
            }

            var elScoreSpan = document.querySelectorAll('h2 span')
            elScoreSpan[1].innerText = gScore;
        }
    }
    return gScore
}


function revealNeighbors(cellI, cellJ, board) {
    if (board[cellI][cellJ].minesAroundCount === 0 && !board[cellI][cellJ].isMine) {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (j < 0 || j >= board[i].length) continue;
                if (i === cellI && j === cellJ) continue;
                board[i][j].isShown = true;
                
                

                // if (board[i][j].minesAroundCount === 0 && !board[cellI][cellJ].isMine) {

                //     revealNeighbors(i, j, board)
                // }
            }
        }
    }

    renderBoard(board)
}


function createLives() {
    var elLives = document.querySelectorAll('.modal h2')
    for (var i = 0; i < 3; i++) {
        if (gLives < 3) {
            elLives[1].innerHTML += '<img  onclick="useLife(this)"  src="img/D9.png" alt=""> '
            gLives++
        }
    }
}

function useLife(elLife) {
    gGame.isOn = true;
    elLife.style.display = 'none'
    gLives--
    // console.log('life left: ', gLives);
    var elMessageBox = document.querySelector('.message-box')
    elMessageBox.style.display = 'none'

    var elLives = document.querySelectorAll('.modal h2')
    elLives[1].style.backgroundColor = ''

}

function test() {

    var elCell = document.querySelector("cell 6 - 6 ")
    elCell.innerText = 'fsdfsdgfs'
}



