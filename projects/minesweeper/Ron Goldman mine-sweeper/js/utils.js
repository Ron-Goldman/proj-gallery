function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNeighborsCount(cellI, cellJ, board) {
   
    var negCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isMine) negCount++;
            
            if (board[i][j].isShown) continue;
        }
    }
    
    return negCount;
}



function disableContextMenu() {
    window.addEventListener('contextmenu', function (e) {
        document.body.innerHTML += ''
        e.preventDefault();
    }, false);
}
