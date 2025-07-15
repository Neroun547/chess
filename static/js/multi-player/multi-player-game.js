import {
    drawGameBoard,
    drawSquare,
    drawGameBoardAndFillBoardArr,
    drawFiguresOnStartPositions,
    deletePossibleMoveForFigure,
    drawFigure,
    drawKingImage,
    moveFigure,
    deleteActiveFromFigure,
    setActiveFigure,
    calculatePossibleMoveForFigure,
    clearBlueColor,
    findKingColAndRow,
    checkMat,
    setNotAvailableMoveForKing,
    findActiveElement,
    findActiveElementRowAndCol, checkShah
} from "../game/main.js";

const body = document.getElementsByTagName("body")[0];
const canvas = document.getElementById("canvas");
const offerLoseBtn = document.getElementById("offer-loss");
const offerDrawBtn = document.getElementById("offer-draw");

const socket = io();

let move;
let waitForMoveAnotherTeam = false;
let gameEnd = false;
let alreadyHaveBoard = false;

let boardArr = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
];

function deleteControlButtons() {
    if(offerDrawBtn) {
        offerDrawBtn.remove();
    }
    if(offerLoseBtn) {
        offerLoseBtn.remove();
    }
}


canvas.style.display = "none";

socket.emit("join-to-room-after-start", localStorage.getItem("game-hash"));

socket.on("player-leave", () => {
    const playerLeaveLogo = document.createElement("h1");
    playerLeaveLogo.innerText = "Гравець вийшов. Почекайте поки він доєднається знову або створіть нову гру";
    playerLeaveLogo.setAttribute("id", "player-leave-logo");

    body.appendChild(playerLeaveLogo);
});

socket.on("player-connected", () => {
    canvas.style.display = "block";

    const playerLeaveLogo = document.getElementById("player-leave-logo");

    if(playerLeaveLogo) {
        playerLeaveLogo.remove();
    }
    socket.emit("get-game-board", JSON.stringify(boardArr));
});

socket.on("get-game-board", (board) => {

    if(!alreadyHaveBoard) {
        boardArr = JSON.parse(board);
        drawGameBoard(ctx, boardArr);

        alreadyHaveBoard = true;
    }
});

socket.on("set-team", (team) => {
    const hash = localStorage.getItem("game-hash");

    if(!localStorage.getItem(hash + "-team")) {
        localStorage.setItem(hash + "-team", team);
        move = team;
    } else {
        move = localStorage.getItem(hash + "-team");
    }
    if(move === "white") {
        alert("Ви граєте за білі фігури");
    } else {
        alert("Ви граєте за чорні фігури");
    }
    if(!localStorage.getItem(hash + "-current-move")) {
        waitForMoveAnotherTeam = team === "black";
    } else if(localStorage.getItem(hash + "-current-move") && localStorage.getItem(hash + "-current-move") === move) {
        waitForMoveAnotherTeam = false;
    } else if(localStorage.getItem(hash + "-current-move") && localStorage.getItem(hash + "-current-move") !== move) {
        waitForMoveAnotherTeam = true;
    }
});

socket.on("move-figure", (cordX, cordY, row, col, activeElementRow, activeElementCol, team, figureType, castling) => {

    if(document.getElementById("show-prev-move")) {
        document.getElementById("show-prev-move").remove();
    }
    function movePlayerFigure() {
        boardArr[activeElementRow][activeElementCol].active = true;
        boardArr[activeElementRow][activeElementCol].elementOnBoard = { ...boardArr[activeElementRow][activeElementCol].elementOnBoard, type: figureType };

        setActiveFigure(
            ctx,
            boardArr[activeElementRow][activeElementCol],
            boardArr[activeElementRow][activeElementCol].x,
            boardArr[activeElementRow][activeElementCol].y,
            boardArr[activeElementRow][activeElementCol].type,
            boardArr[activeElementRow][activeElementCol].team
        );
        const king = findKingColAndRow(boardArr, move);

        if(castling) {
            boardArr[row][col].castling = true;
        }
        moveFigure(ctx, boardArr, brokenBlackFigure, brokenWhiteFigure, cordX, cordY, boardArr[row][col], row, col, move);
        setNotAvailableMoveForKing(boardArr, king.row, king.col, move);

        if (checkShah(boardArr, king.row, king.col, move)) {
            drawSquare(ctx, boardArr[king.row][king.col].x, boardArr[king.row][king.col].y, 125, 125, "blue");
            drawKingImage(ctx, boardArr[king.row][king.col].x, boardArr[king.row][king.col].y, move);

            boardArr[king.row][king.col].color = "blue";
        }
        waitForMoveAnotherTeam = false;
    }
    if(team !== move && !gameEnd) {
        movePlayerFigure();

        localStorage.setItem(localStorage.getItem("game-hash") + "-current-move", move);

        if(!document.getElementById("show-prev-move")) {
            const button = document.createElement("button");

            button.setAttribute("id", "show-prev-move");
            button.innerText = "Повторити хід противника";

            body.appendChild(button);

            button.addEventListener("click", function () {
                boardArr[activeElementRow][activeElementCol].elementOnBoard = { ...boardArr[row][col].elementOnBoard };
                boardArr[row][col].elementOnBoard = null;

                drawSquare(ctx, boardArr[row][col].x, boardArr[row][col].y, 125, 125, boardArr[row][col].color);
                drawFigure(
                    ctx,
                    boardArr[activeElementRow][activeElementCol].x,
                    boardArr[activeElementRow][activeElementCol].y,
                    boardArr[activeElementRow][activeElementCol].elementOnBoard.type,
                    boardArr[activeElementRow][activeElementCol].elementOnBoard.team
                );

                const timeout = setTimeout(function () {
                    movePlayerFigure();

                    clearTimeout(timeout);
                }, 1000);
            });
        }
    }
});

socket.on("player-win", (team) => {
    if(!gameEnd) {
        if (team === move) {
            alert("Ви виграли");
        } else {
            alert("Ви програли");

            deleteControlButtons();
        }
        gameEnd = true;
    }
});

socket.on("offer-lose", () => {
    alert("Гравець здався");
    gameEnd = true;

    deleteControlButtons();
});

socket.on("offer-draw", () => {
    const acceptDraw = confirm("Гравець запропонував нічію");

    if(acceptDraw) {
        gameEnd = true;
        socket.emit("accept-draw", localStorage.getItem("game-hash"));

        deleteControlButtons();
    } else {
        socket.emit("reject-draw");
    }
});

socket.on("accept-draw", () => {
    alert("Гравець прийняв нічію");

    deleteControlButtons();

    gameEnd = true;
});

socket.on("reject-draw", () => {
    alert("Гравець відхилив нічію");
});

offerLoseBtn.addEventListener("click", function () {
    alert("Ви здалися");
    socket.emit("offer-lose", localStorage.getItem("game-hash"));

    gameEnd = true;

    deleteControlButtons();
});

offerDrawBtn.addEventListener("click", function () {
    socket.emit("offer-draw");
});

const ctx = canvas.getContext("2d");

const brokenWhiteFigure = [];
const brokenBlackFigure = [];

drawGameBoardAndFillBoardArr(ctx, boardArr);
drawFiguresOnStartPositions(ctx, boardArr);

canvas.addEventListener("click", function (e) {

    if(!gameEnd) {
        for (let i = 0; i < boardArr.length; i++) {
            for (let j = 0; j < boardArr[i].length; j++) {
                if (
                    e.layerX >= boardArr[i][j].x && e.layerX <= boardArr[i][j].x + 125
                    && e.layerY >= boardArr[i][j].y
                    && e.layerY <= boardArr[i][j].y + 125
                    && !boardArr[i][j].possibleMove
                    && !boardArr[i][j].elementOnBoard
                ) {
                    deletePossibleMoveForFigure(ctx, boardArr);
                    deleteActiveFromFigure(ctx, findActiveElement(boardArr));

                    break;
                }
                if (
                    e.layerX >= boardArr[i][j].x && e.layerX <= boardArr[i][j].x + 125
                    && e.layerY >= boardArr[i][j].y
                    && e.layerY <= boardArr[i][j].y + 125
                    && !boardArr[i][j].possibleMove
                    && boardArr[i][j].elementOnBoard
                    && boardArr[i][j].elementOnBoard.team === move
                    && !waitForMoveAnotherTeam
                ) {
                    deletePossibleMoveForFigure(ctx, boardArr);
                    deleteActiveFromFigure(ctx, findActiveElement(boardArr));
                    setActiveFigure(ctx, boardArr[i][j], boardArr[i][j].x, boardArr[i][j].y, boardArr[i][j].elementOnBoard.type, boardArr[i][j].elementOnBoard.team);
                    calculatePossibleMoveForFigure(ctx, boardArr, i, j, boardArr[i][j].elementOnBoard.type, boardArr[i][j].elementOnBoard.team);

                    break;
                } else if (
                    e.layerX >= boardArr[i][j].x && e.layerX <= boardArr[i][j].x + 125
                    && e.layerY >= boardArr[i][j].y
                    && e.layerY <= boardArr[i][j].y + 125
                    && boardArr[i][j].possibleMove
                    && !waitForMoveAnotherTeam
                ) {
                    const {row, col} = findActiveElementRowAndCol(boardArr);

                    const castling = moveFigure(ctx, boardArr, brokenBlackFigure, brokenWhiteFigure, boardArr[i][j].x, boardArr[i][j].y, boardArr[i][j], i, j, move);

                    localStorage.setItem(localStorage.getItem("game-hash") + "-current-move", move === "white" ? "black" : "white");

                    if(!castling) {
                        socket.emit("move-figure", boardArr[i][j].x, boardArr[i][j].y, i, j, row, col, move, boardArr[i][j].elementOnBoard.type);
                    } else {
                        socket.emit("move-figure", boardArr[i][j].x, boardArr[i][j].y, i, j, row, col, move, boardArr[i][j].elementOnBoard.type, true)
                    }
                    deletePossibleMoveForFigure(ctx, boardArr);
                    clearBlueColor(ctx, boardArr);

                    waitForMoveAnotherTeam = true;

                    if (move === "white") {
                        const king = findKingColAndRow(boardArr, "black");

                        if (checkMat(boardArr, king.row, king.col, "black")) {
                            socket.emit("player-win", "white");

                            deleteControlButtons();
                        }
                    } else {
                        const king = findKingColAndRow(boardArr, "white");

                        if (checkMat(boardArr, king.row, king.col, "white")) {
                            socket.emit("player-win", "black");

                            deleteControlButtons();
                        }
                    }
                    break;
                }
            }
        }
    }
});

