const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const PAWN_TYPE = "pawn";
const HORSE_TYPE = "horse";
const ROOK_TYPE = "rook";
const ELEPHANT_TYPE = "elephant";
const QUEEN_TYPE = "queen";
const KING_TYPE = "king";


const boardArr = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
];

const brokenWhiteFigure = [];
const brokenBlackFigure = [];

let move = "white";

function drawSquare(x, y, width, height, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawGameBoardAndFillBoardArr() {
    let tmpX = 0;
    let tmpY = 0;

    for(let i = 0; i < 8; i++) {
        if(i % 2 === 0) {
            drawSquare(tmpX, 0, 125, 125, "gray");

            boardArr[0].push({ x: tmpX, y: 0, color: "gray", elementOnBoard: null, possibleMove: false, active: false, availableForKing: true });
        } else {
            drawSquare(tmpX, 0, 125, 125, "#b07b00");

            boardArr[0].push({ x: tmpX, y: 0, color: "#b07b00", elementOnBoard: null, possibleMove: false, active: false, availableForKing: true });
        }
        for(let j = 0; j < 7; j++) {
            tmpY += 125;

            if(i % 2 === 0) {
                if (j % 2 === 0) {
                    drawSquare(tmpX, tmpY, 125, 125, "#b07b00");

                    boardArr[j+1].push({ x: tmpX, y: tmpY, color: "#b07b00", elementOnBoard: null, possibleMove: false, active: false, availableForKing: true });
                } else {
                    drawSquare(tmpX, tmpY, 125, 125, "gray");

                    boardArr[j + 1].push({x: tmpX, y: tmpY, color: "gray", elementOnBoard: null, possibleMove: false, active: false, availableForKing: true });
                }
            } else {
                if (j % 2 === 0) {
                    drawSquare(tmpX, tmpY, 125, 125, "gray");

                    boardArr[j+1].push({ x: tmpX, y: tmpY, color: "gray", elementOnBoard: null, possibleMove: false, active: false, availableForKing: true });
                } else {
                    drawSquare(tmpX, tmpY, 125, 125, "#b07b00");

                    boardArr[j+1].push({ x: tmpX, y: tmpY, color: "#b07b00", elementOnBoard: null, possibleMove: false, active: false, availableForKing: true });
                }
            }
        }
        tmpX += 125;
        tmpY = 0;
    }
    boardArr[0][2].castling = false;
    boardArr[0][6].castling = false;

    boardArr[7][2].castling = false;
    boardArr[7][6].castling = false;
}

function drawFiguresOnStartPositions() {
    // Draw pawn black
    const pawnImgBlack = new Image();

    pawnImgBlack.src = '/img/pawn-black.png';

    for(let i = 0; i < boardArr.length; i++) {
        drawImage(pawnImgBlack, boardArr[1][i].x, boardArr[1][i].y, 120, 120);

        boardArr[1][i].elementOnBoard = { type: PAWN_TYPE, team: "black", x: boardArr[1][i].x, y: boardArr[1][i].y };
    }
    // Draw pawn white
    const pawnImgWhite = new Image();

    pawnImgWhite.src = '/img/pawn-white.png';

    for(let i = 0; i < boardArr.length; i++) {
        drawImage(pawnImgWhite, boardArr[6][i].x, boardArr[6][i].y, 120, 120);

        boardArr[6][i].elementOnBoard = { type: PAWN_TYPE, team: "white", x: boardArr[6][i].x, y: boardArr[6][i].y };
    }

    const figureWithoutPawns = [
        { type: HORSE_TYPE, team: "black", row: 0, col: 1, imgSrc: "/img/horse-black.png" },
        { type: HORSE_TYPE, team: "black", row: 0, col: 6, imgSrc: "/img/horse-black.png" },

        { type: HORSE_TYPE, team: "white", row: 7, col: 1, imgSrc: "/img/horse-white.png" },
        { type: HORSE_TYPE, team: "white", row: 7, col: 6, imgSrc: "/img/horse-white.png"  },

        { type: ROOK_TYPE, team: "black", row: 0, col: 0, imgSrc: "/img/rook-black.png" },
        { type: ROOK_TYPE, team: "black", row: 0, col: 7, imgSrc: "/img/rook-black.png"  },

        { type: ROOK_TYPE, team: "white", row: 7, col: 7, imgSrc: "/img/rook-white.png" },
        { type: ROOK_TYPE, team: "white", row: 7, col: 0, imgSrc: "/img/rook-white.png"  },

        { type: ELEPHANT_TYPE, team: "black", row: 0, col: 2, imgSrc: "/img/elephant-black.png" },
        { type: ELEPHANT_TYPE, team: "black", row: 0, col: 5, imgSrc: "/img/elephant-black.png" },

        { type: ELEPHANT_TYPE, team: "white", row: 7, col: 2, imgSrc: "/img/elephant-white.png" },
        { type: ELEPHANT_TYPE, team: "white", row: 7, col: 5, imgSrc: "/img/elephant-white.png" },

        { type: QUEEN_TYPE, team: "black", row: 0, col: 3, imgSrc: "/img/queen-black.png" },

        { type: QUEEN_TYPE, team: "white", row: 7, col: 3, imgSrc: "/img/queen-white.png" },

        { type: KING_TYPE, team: "black", row: 0, col: 4, imgSrc: "/img/king-black.png" },

        { type: KING_TYPE, team: "white", row: 7, col: 4, imgSrc: "/img/king-white.png" }
    ];
    let img;

    for(let i = 0; i < figureWithoutPawns.length; i++) {
        img = new Image();

        img.src = figureWithoutPawns[i].imgSrc;

        drawImage(img, boardArr[figureWithoutPawns[i].row][figureWithoutPawns[i].col].x, boardArr[figureWithoutPawns[i].row][figureWithoutPawns[i].col].y, 120, 120);
        drawImage(img, boardArr[figureWithoutPawns[i].row][figureWithoutPawns[i].col].x, boardArr[figureWithoutPawns[i].row][figureWithoutPawns[i].col].y, 120, 120);

        if(figureWithoutPawns[i].type === ROOK_TYPE || figureWithoutPawns[i].type === KING_TYPE) {
            boardArr[figureWithoutPawns[i].row][figureWithoutPawns[i].col].elementOnBoard = {
                type: figureWithoutPawns[i].type,
                team: figureWithoutPawns[i].team,
                doneFirstMove: false
            };
        } else {
            boardArr[figureWithoutPawns[i].row][figureWithoutPawns[i].col].elementOnBoard = {
                type: figureWithoutPawns[i].type,
                team: figureWithoutPawns[i].team
            };
        }
    }
}

function drawImage(image, x, y, width, height) {
    ctx.beginPath();

    image.addEventListener("load", function () {
        ctx.drawImage(image, x, y, width, height);
    }, false);
}

function drawRookImage(xCord, yCord, team) {

    if(team === "black") {
        const rookImage = new Image();
        rookImage.src = "/img/rook-black.png";

        drawImage(rookImage, xCord, yCord, 120, 120);
    }
    if(team === "white") {
        const rookImage = new Image();
        rookImage.src = "/img/rook-white.png";

        drawImage(rookImage, xCord, yCord, 120, 120);
    }
}

function drawHorseImage(xCord, yCord, team) {

    if(team === "black") {
        const rookImage = new Image();

        rookImage.src = "/img/horse-black.png";

        drawImage(rookImage, xCord, yCord, 120, 120);
    }
    if(team === "white") {
        const rookImage = new Image();
        rookImage.src = "/img/horse-white.png";

        drawImage(rookImage, xCord, yCord, 120, 120);
    }
}

function drawPawnImage(xCord, yCord, team) {

    if(team === "black") {
        const pawnImage = new Image();
        pawnImage.src = "/img/pawn-black.png";

        drawImage(pawnImage, xCord, yCord, 120, 120);
    }
    if(team === "white") {
        const pawnImage = new Image();
        pawnImage.src = "/img/pawn-white.png";

        drawImage(pawnImage, xCord, yCord, 120, 120);
    }
}

function drawElephantImage(xCord, yCord, team) {

    if(team === "black") {
        const elephantImage = new Image();
        elephantImage.src = "/img/elephant-black.png";

        drawImage(elephantImage, xCord, yCord, 120, 120);
    }
    if(team === "white") {
        const elephantImage = new Image();
        elephantImage.src = "/img/elephant-white.png";

        drawImage(elephantImage, xCord, yCord, 120, 120);
    }
}

function drawQueenImage(xCord, yCord, team) {
    if(team === "black") {
        const queenImage = new Image();
        queenImage.src = "/img/queen-black.png";

        drawImage(queenImage, xCord, yCord, 120, 120);
    }
    if(team === "white") {
        const queenImage = new Image();
        queenImage.src = "/img/queen-white.png";

        drawImage(queenImage, xCord, yCord, 120, 120);
    }
}

function drawKingImage(xCord, yCord, team) {
    if(team === "black") {
        const queenImage = new Image();
        queenImage.src = "/img/king-black.png";

        drawImage(queenImage, xCord, yCord, 120, 120);
    }
    if(team === "white") {
        const queenImage = new Image();
        queenImage.src = "/img/king-white.png";

        drawImage(queenImage, xCord, yCord, 120, 120);
    }
}

function drawFigure(x, y, type, team) {

    if(type === PAWN_TYPE) {
        drawPawnImage(x, y, team);
    }
    if(type === ROOK_TYPE) {
        drawRookImage(x, y, team);
    }
    if(type === HORSE_TYPE) {
        drawHorseImage(x, y, team);
    }
    if(type === ELEPHANT_TYPE) {
        drawElephantImage(x, y, team);
    }
    if(type === QUEEN_TYPE) {
        drawQueenImage(x, y, team);
    }
    if(type === KING_TYPE) {
        drawKingImage(x, y, team);
    }
}

function deleteActiveFromFigure(activeElement, createImage = true) {

    if(!activeElement) {
        return;
    }
    drawSquare(activeElement.x, activeElement.y, 125, 125, activeElement.color);

    activeElement.active = false;

    if(createImage) {
        drawFigure(activeElement.x, activeElement.y, activeElement.elementOnBoard.type, activeElement.elementOnBoard.team);
    }
}

function deletePossibleMoveForFigure() {
    for(let i = 0; i < boardArr.length; i++) {
        for(let j = 0; j < boardArr.length; j++) {
            if(boardArr[i][j].possibleMove) {
                drawSquare(boardArr[i][j].x, boardArr[i][j].y, 125, 125, boardArr[i][j].color);

                if(boardArr[i][j].elementOnBoard) {
                    drawFigure(boardArr[i][j].x, boardArr[i][j].y, boardArr[i][j].elementOnBoard.type, boardArr[i][j].elementOnBoard.team);
                }
                boardArr[i][j].possibleMove = false;
            }
        }
    }
}

function setActiveFigure(boardElement, xCord, yCord, typeFigure, team) {
    drawSquare(xCord, yCord, 125, 125, "yellow");

    boardElement.active = true;

    drawFigure(xCord, yCord, typeFigure, team);
}

function checkPossibleMoveForPawn(row, col, team, checkShahFor="") {
    const indexes = [];
    let prevFigurePresent = { ...boardArr[row][col].elementOnBoard };

    function checkShahLocal(boardElement, team) {
        const king = findKingColAndRow(team);
        let prevFigure;

        if(boardElement.elementOnBoard) {
            prevFigure = { ...boardElement.elementOnBoard };
        } else {
            prevFigure = null;
        }
        boardElement.elementOnBoard = { type: PAWN_TYPE, team: team };

        let result = checkShah(king.row, king.col, team);

        boardElement.elementOnBoard = prevFigure;

        return result;
    }

    if (team === "black" && checkShahFor === "black") {
        boardArr[row][col].elementOnBoard = null;

        if (boardArr[row + 1] && !boardArr[row + 1][col].elementOnBoard) {

            if(!checkShahLocal(boardArr[row + 1][col], team)) {
                indexes.push([row + 1, col]);
            }
            if (boardArr[row + 2] && !boardArr[row + 2][col].elementOnBoard && row === 1) {
                if(!checkShahLocal(boardArr[row + 2][col], team)) {
                    indexes.push([row + 2, col]);
                }
            }
        }
        if (boardArr[row + 1] && boardArr[row + 1][col + 1] && boardArr[row + 1][col + 1].elementOnBoard && boardArr[row + 1][col + 1].elementOnBoard.team === "white") {
            if(!checkShahLocal(boardArr[row + 1][col + 1], team)) {
                indexes.push([row + 1, col + 1]);
            }
        }
        if (boardArr[row + 1] && boardArr[row + 1][col - 1] && boardArr[row + 1][col - 1].elementOnBoard && boardArr[row + 1][col - 1].elementOnBoard.team === "white") {
            if(!checkShahLocal(boardArr[row + 1][col - 1], team)) {
                indexes.push([row + 1, col - 1]);
            }
        }
        boardArr[row][col].elementOnBoard = prevFigurePresent;
    }
    if(team === "white" && checkShahFor === "white") {
        boardArr[row][col].elementOnBoard = null;

        if (boardArr[row - 1] && !boardArr[row - 1][col].elementOnBoard) {
            if(!checkShahLocal(boardArr[row - 1][col], team)) {
                indexes.push([row - 1, col]);
            }
            if (boardArr[row - 2] && !boardArr[row - 2][col].elementOnBoard && row === 6) {
                if(!checkShahLocal(boardArr[row - 2][col], team)) {
                    indexes.push([row - 2, col]);
                }
            }
        }
        if (boardArr[row - 1] && boardArr[row - 1][col - 1] && boardArr[row - 1][col - 1].elementOnBoard && boardArr[row - 1][col - 1].elementOnBoard.team === "black") {
            if(!checkShahLocal(boardArr[row - 1][col - 1], team)) {
                indexes.push([row - 1, col - 1]);
            }
        }
        if (boardArr[row - 1] && boardArr[row - 1][col + 1] && boardArr[row - 1][col + 1].elementOnBoard && boardArr[row - 1][col + 1].elementOnBoard.team === "black") {
            if(!checkShahLocal(boardArr[row - 1][col + 1], team)) {
                indexes.push([row - 1, col + 1]);
            }
        }
        boardArr[row][col].elementOnBoard = prevFigurePresent;
    }
    if(team === "black" && checkShahFor !== team) {
        if (boardArr[row + 1] && !boardArr[row + 1][col].elementOnBoard) {
            indexes.push([row + 1, col]);

            if (boardArr[row + 2] && !boardArr[row + 2][col].elementOnBoard && row === 1) {
                indexes.push([row + 2, col]);
            }
        }
        if (boardArr[row + 1] && boardArr[row + 1][col + 1] && boardArr[row + 1][col + 1].elementOnBoard && boardArr[row + 1][col + 1].elementOnBoard.team === "white") {
            indexes.push([row + 1, col + 1]);
        }
        if (boardArr[row + 1] && boardArr[row + 1][col - 1] && boardArr[row + 1][col - 1].elementOnBoard && boardArr[row + 1][col - 1].elementOnBoard.team === "white") {
            indexes.push([row + 1, col - 1]);
        }
    }
    if(team === "white" && checkShahFor !== team) {
        if (boardArr[row - 1] && !boardArr[row - 1][col].elementOnBoard) {
            indexes.push([row - 1, col]);

            if (boardArr[row - 2] && !boardArr[row - 2][col].elementOnBoard && row === 6) {
                indexes.push([row - 2, col]);
            }
        }
        if (boardArr[row - 1] && boardArr[row - 1][col - 1] && boardArr[row - 1][col - 1].elementOnBoard && boardArr[row - 1][col - 1].elementOnBoard.team === "black") {
            indexes.push([row - 1, col - 1]);
        }
        if (boardArr[row - 1] && boardArr[row - 1][col + 1] && boardArr[row - 1][col + 1].elementOnBoard && boardArr[row - 1][col + 1].elementOnBoard.team === "black") {
            indexes.push([row - 1, col + 1]);
        }
    }
    return indexes;
}
function checkPossibleMoveForRook(row, col, team, checkShahFor="") {
    const indexes = [];
    let tmpIndexes = [];
    let prevFigurePresent = { ...boardArr[row][col].elementOnBoard };

    function checkShahLocal(boardElement, team) {
        const king = findKingColAndRow(team);
        let prevFigure;

        if(boardElement.elementOnBoard) {
            prevFigure = { ...boardElement.elementOnBoard };
        } else {
            prevFigure = null;
        }
        boardElement.elementOnBoard = { type: ROOK_TYPE, team: team };

        let result = checkShah(king.row, king.col, team);

        boardElement.elementOnBoard = prevFigure;

        return result;
    }

    if(team === "black" && checkShahFor === "black") {
        boardArr[row][col].elementOnBoard = null;

        for(let i = 0; i < boardArr.length; i++) {
            if(i > row) {
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "black") {
                    break;
                }
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "white") {
                    if(!checkShahLocal(boardArr[i][col], team)) {
                        indexes.push([i, col]);
                    }
                    break;
                }
                if(!boardArr[i][col].elementOnBoard) {
                    if(!checkShahLocal(boardArr[i][col], team)) {
                        indexes.push([i, col]);
                    }
                }
            }
            if(i < row) {
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "black") {
                    tmpIndexes = [];
                }
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "white") {
                    tmpIndexes = [];

                    if(!checkShahLocal(boardArr[i][col], team)) {
                        tmpIndexes.push([i, col]);
                    }
                }
                if(!boardArr[i][col].elementOnBoard) {
                    if(!checkShah(boardArr[i][col], team)) {
                        tmpIndexes.push([i, col]);
                    }
                }
            }
        }
        indexes.push(...tmpIndexes);
        tmpIndexes = [];

        for(let i = 0; i < boardArr[row].length; i++) {
            if(i > col) {
                if (boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "black" && i !== col) {
                    break;
                }
                if (boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "white") {
                    if(!checkShahLocal(boardArr[row][i], team)) {
                        indexes.push([row, i]);
                    }
                    break;
                }
                if(!boardArr[row][i].elementOnBoard) {
                    if(!checkShahLocal(boardArr[row][i], team)) {
                        indexes.push([row, i]);
                    }
                }
            } else if(i < col) {
                if(!boardArr[row][i].elementOnBoard) {
                    if(!checkShahLocal(boardArr[row][i], team)) {
                        indexes.push([row, i]);
                    }
                }
                if(boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "white") {
                    tmpIndexes = [];

                    if(!checkShahLocal(boardArr[row][i], team)) {
                        tmpIndexes.push([row, i]);
                    }
                }
                if(boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "black") {
                    tmpIndexes = [];
                }
            }
        }
        boardArr[row][col].elementOnBoard = prevFigurePresent;

        indexes.push(...tmpIndexes);
    }
    if(team === "white" && checkShahFor === "white") {
        boardArr[row][col].elementOnBoard = null;

        for(let i = boardArr.length - 1; i >= 0; i--) {
            if(i > row) {
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "white") {
                    tmpIndexes = [];
                }
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "black") {
                    tmpIndexes = [];

                    if(!checkShahLocal(boardArr[i][col], team)) {
                        tmpIndexes.push([i, col]);
                    }
                }
                if(!boardArr[i][col].elementOnBoard) {
                    if(!checkShahLocal(boardArr[i][col], team)) {
                        tmpIndexes.push([i, col]);
                    }
                }
            }
            indexes.push(...tmpIndexes);
            tmpIndexes = [];

            if(i < row) {
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "white") {
                    break;
                }
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "black") {
                    if(!checkShahLocal(boardArr[i][col], team)) {
                        tmpIndexes.push([i, col]);
                    }

                    break;
                }
                if(!boardArr[i][col].elementOnBoard) {
                    if(!checkShahLocal(boardArr[i][col], team)) {
                        tmpIndexes.push([i, col]);
                    }
                }
            }
        }
        indexes.push(...tmpIndexes);
        tmpIndexes = [];

        for(let i = 0; i < boardArr[row].length; i++) {
            if(i < col) {
                if(boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "white") {
                    tmpIndexes = [];
                }
                if(boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "black") {
                    tmpIndexes = [];

                    if(!checkShahLocal(boardArr[row][i], team)) {
                        tmpIndexes.push([row, i]);
                    }
                }
                if(!boardArr[row][i].elementOnBoard) {
                    if(!checkShahLocal(boardArr[row][i], team)) {
                        tmpIndexes.push([row, i]);
                    }
                }
            }
            if(i > col) {
                if(boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "white") {
                    break;
                }
                if(boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "black") {
                    if(!checkShahLocal(boardArr[row][i], team)) {
                        indexes.push([row, i]);
                    }

                    break;
                }
                if(!boardArr[row][i].elementOnBoard) {
                    if(!checkShahLocal(boardArr[row][i], team)) {
                        indexes.push([row, i]);
                    }
                }
            }
        }
        boardArr[row][col].elementOnBoard = prevFigurePresent;
        indexes.push(...tmpIndexes);
    }
    if(team === "black" && checkShahFor !== team) {
        for(let i = 0; i < boardArr.length; i++) {
            if(i > row) {
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "black") {
                    break;
                }
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "white") {
                    indexes.push([i, col]);

                    break;
                }
                if(!boardArr[i][col].elementOnBoard) {
                    indexes.push([i, col]);
                }
            }
            if(i < row) {
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "black") {
                    tmpIndexes = [];
                }
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "white") {
                    tmpIndexes = [];
                    tmpIndexes.push([i, col]);
                }
                if(!boardArr[i][col].elementOnBoard) {
                    tmpIndexes.push([i, col]);
                }
            }
        }
        indexes.push(...tmpIndexes);
        tmpIndexes = [];

        for(let i = 0; i < boardArr[row].length; i++) {
            if(i > col) {
                if (boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "black" && i !== col) {
                    break;
                }
                if (boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "white") {
                    indexes.push([row, i]);

                    break;
                }
                if(!boardArr[row][i].elementOnBoard) {
                    indexes.push([row, i]);
                }
            } else if(i < col) {
                if(!boardArr[row][i].elementOnBoard) {
                    indexes.push([row, i]);
                }
                if(boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "white") {
                    tmpIndexes = [];
                    tmpIndexes.push([row, i]);
                }
                if(boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "black") {
                    tmpIndexes = [];
                }
            }
        }
        indexes.push(...tmpIndexes);
    }
    if(team === "white" && checkShahFor !== team) {
        for(let i = boardArr.length - 1; i >= 0; i--) {
            if(i > row) {
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "white") {
                    tmpIndexes = [];
                }
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "black") {
                    tmpIndexes = [];
                    tmpIndexes.push([i, col]);
                }
                if(!boardArr[i][col].elementOnBoard) {
                    tmpIndexes.push([i, col]);
                }
            }
            indexes.push(...tmpIndexes);
            tmpIndexes = [];

            if(i < row) {
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "white") {
                    break;
                }
                if(boardArr[i][col].elementOnBoard && boardArr[i][col].elementOnBoard.team === "black") {
                    tmpIndexes.push([i, col]);

                    break;
                }
                if(!boardArr[i][col].elementOnBoard) {
                    tmpIndexes.push([i, col]);
                }
            }
        }
        indexes.push(...tmpIndexes);
        tmpIndexes = [];

        for(let i = 0; i < boardArr[row].length; i++) {
            if(i < col) {
                if(boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "white") {
                    tmpIndexes = [];
                }
                if(boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "black") {
                    tmpIndexes = [];
                    tmpIndexes.push([row, i]);
                }
                if(!boardArr[row][i].elementOnBoard) {
                    tmpIndexes.push([row, i]);
                }
            }
            if(i > col) {
                if(boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "white") {
                    break;
                }
                if(boardArr[row][i].elementOnBoard && boardArr[row][i].elementOnBoard.team === "black") {
                    indexes.push([row, i]);

                    break;
                }
                if(!boardArr[row][i].elementOnBoard) {
                    indexes.push([row, i]);
                }
            }
        }
        indexes.push(...tmpIndexes);
    }
    return indexes;
}
function checkPossibleMoveForHorse(row, col, team, checkShahFor= "") {
    const indexes = [];
    let prevFigurePresent = { ...boardArr[row][col].elementOnBoard };

    function checkShahLocal(boardElement, team) {
        const king = findKingColAndRow(team);
        let prevFigure;

        if(boardElement.elementOnBoard) {
            prevFigure = { ...boardElement.elementOnBoard };
        } else {
            prevFigure = null;
        }
        boardElement.elementOnBoard = { type: HORSE_TYPE, team: team };

        let result = checkShah(king.row, king.col, team);

        boardElement.elementOnBoard = prevFigure;

        return result;
    }

    if(checkShahFor) {
        boardArr[row][col].elementOnBoard = null;

        if (row + 2 <= 7 && col + 1 <= 7 && (!boardArr[row + 2][col + 1].elementOnBoard || boardArr[row + 2][col + 1].elementOnBoard.team !== team)) {
            if (!checkShahLocal(boardArr[row + 2][col + 1], team)) {
                indexes.push([row + 2, col + 1]);
            }
        }
        if (row + 2 <= 7 && col - 1 >= 0 && (!boardArr[row + 2][col - 1].elementOnBoard || boardArr[row + 2][col - 1].elementOnBoard.team !== team)) {
            if (!checkShahLocal(boardArr[row + 2][col - 1], team)) {
                indexes.push([row + 2, col - 1]);
            }
        }

        if (row - 2 >= 0 && col + 1 <= 7 && (!boardArr[row - 2][col + 1].elementOnBoard || boardArr[row - 2][col + 1].elementOnBoard.team !== team)) {
            if (!checkShahLocal(boardArr[row - 2][col + 1], team)) {
                indexes.push([row - 2, col + 1]);
            }
        }
        if (row - 2 >= 0 && col - 1 >= 0 && (!boardArr[row - 2][col - 1].elementOnBoard || boardArr[row - 2][col - 1].elementOnBoard.team !== team)) {
            if (!checkShahLocal(boardArr[row - 2][col - 1], team)) {
                indexes.push([row - 2, col - 1]);
            }
        }

        if (row + 1 <= 7 && col + 2 <= 7 && (!boardArr[row + 1][col + 2].elementOnBoard || boardArr[row + 1][col + 2].elementOnBoard.team !== team)) {
            if (!checkShahLocal(boardArr[row + 1][col + 2], team)) {
                indexes.push([row + 1, col + 2]);
            }
        }
        if (row + 1 <= 7 && col - 2 >= 0 && (!boardArr[row + 1][col - 2].elementOnBoard || boardArr[row + 1][col - 2].elementOnBoard.team !== team)) {
            if (!checkShahLocal(boardArr[row + 1][col - 2], team)) {
                indexes.push([row + 1, col - 2])
            }
        }

        if (row - 1 >= 0 && col + 2 <= 7 && (!boardArr[row - 1][col + 2].elementOnBoard || boardArr[row - 1][col + 2].elementOnBoard.team !== team)) {
            if (!checkShahLocal(boardArr[row - 1][col + 2], team)) {
                indexes.push([row - 1, col + 2]);
            }
        }
        if (row - 1 >= 0 && col - 2 >= 0 && (!boardArr[row - 1][col - 2].elementOnBoard || boardArr[row - 1][col - 2].elementOnBoard.team !== team)) {
            if (!checkShahLocal(boardArr[row - 1][col - 2], team)) {
                indexes.push([row - 1, col - 2]);
            }
        }
        boardArr[row][col].elementOnBoard = prevFigurePresent;
    } else {
        if (row + 2 <= 7 && col + 1 <= 7 && (!boardArr[row + 2][col + 1].elementOnBoard || boardArr[row + 2][col + 1].elementOnBoard.team !== team)) {
            indexes.push([row + 2, col + 1]);
        }
        if (row + 2 <= 7 && col - 1 >= 0 && (!boardArr[row + 2][col - 1].elementOnBoard || boardArr[row + 2][col - 1].elementOnBoard.team !== team)) {
            indexes.push([row + 2, col - 1]);
        }

        if (row - 2 >= 0 && col + 1 <= 7 && (!boardArr[row - 2][col + 1].elementOnBoard || boardArr[row - 2][col + 1].elementOnBoard.team !== team)) {
            indexes.push([row - 2, col + 1]);
        }
        if (row - 2 >= 0 && col - 1 >= 0 && (!boardArr[row - 2][col - 1].elementOnBoard || boardArr[row - 2][col - 1].elementOnBoard.team !== team)) {
            indexes.push([row - 2, col - 1]);
        }

        if (row + 1 <= 7 && col + 2 <= 7 && (!boardArr[row + 1][col + 2].elementOnBoard || boardArr[row + 1][col + 2].elementOnBoard.team !== team)) {
            indexes.push([row + 1, col + 2]);
        }
        if (row + 1 <= 7 && col - 2 >= 0 && (!boardArr[row + 1][col - 2].elementOnBoard || boardArr[row + 1][col - 2].elementOnBoard.team !== team)) {
            indexes.push([row + 1, col - 2])
        }

        if (row - 1 >= 0 && col + 2 <= 7 && (!boardArr[row - 1][col + 2].elementOnBoard || boardArr[row - 1][col + 2].elementOnBoard.team !== team)) {
            indexes.push([row - 1, col + 2]);
        }
        if (row - 1 >= 0 && col - 2 >= 0 && (!boardArr[row - 1][col - 2].elementOnBoard || boardArr[row - 1][col - 2].elementOnBoard.team !== team)) {
            indexes.push([row - 1, col - 2]);
        }
    }
    return indexes;
}
function checkPossibleMoveForElephant(row, col, team, checkShahFor) {
    const indexes = [];
    let tmpCol = col + 1;
    let prevFigurePresent = { ...boardArr[row][col].elementOnBoard };

    function checkShahLocal(boardElement, team) {
        const king = findKingColAndRow(team);
        let prevFigure;

        if(boardElement.elementOnBoard) {
            prevFigure = { ...boardElement.elementOnBoard };
        } else {
            prevFigure = null;
        }
        boardElement.elementOnBoard = { type: ELEPHANT_TYPE, team: team };

        let result = checkShah(king.row, king.col, team);

        boardElement.elementOnBoard = prevFigure;

        return result;
    }
    if(checkShahFor) {
        boardArr[row][col].elementOnBoard = null;

        for (let i = row + 1; i < boardArr.length; i++) {
            if (tmpCol <= boardArr.length - 1) {
                if (!boardArr[i][tmpCol].elementOnBoard) {
                    if (!checkShahLocal(boardArr[i][tmpCol], team)) {
                        indexes.push([i, tmpCol]);
                    }
                }
                if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team !== team) {
                    if (!checkShahLocal(boardArr[i][tmpCol], team)) {
                        indexes.push([i, tmpCol]);

                        break;
                    }
                }
                if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team === team) {
                    break;
                }
                tmpCol += 1;
            }
        }
        tmpCol = col - 1;

        for (let i = row + 1; i < boardArr.length; i++) {
            if (tmpCol >= 0) {
                if (!boardArr[i][tmpCol].elementOnBoard) {
                    if (!checkShahLocal(boardArr[i][tmpCol], team)) {
                        indexes.push([i, tmpCol]);
                    }
                }
                if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team !== team) {
                    if (!checkShahLocal(boardArr[i][tmpCol], team)) {
                        indexes.push([i, tmpCol]);
                        break;
                    }
                }
                if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team === team) {
                    break;
                }
                tmpCol -= 1;
            }
        }
        if (row > 0) {
            tmpCol = col + 1;

            for (let i = row - 1; i >= 0; i--) {
                if (tmpCol <= boardArr.length - 1) {
                    if (!boardArr[i][tmpCol].elementOnBoard) {
                        if (!checkShahLocal(boardArr[i][col], team)) {
                            indexes.push([i, tmpCol]);
                        }
                    }
                    if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team !== team) {
                        if (!checkShahLocal(boardArr[i][tmpCol], team)) {
                            indexes.push([i, tmpCol]);

                            break;
                        }
                    }
                    if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team === team) {
                        break;
                    }
                    tmpCol += 1;
                }
            }
            tmpCol = col - 1;

            for (let i = row - 1; i >= 0; i--) {
                if (tmpCol >= 0) {
                    if (!boardArr[i][tmpCol].elementOnBoard) {
                        if (!checkShahLocal(boardArr[i][tmpCol], team)) {
                            indexes.push([i, tmpCol])
                        }
                    }
                    if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team !== team) {
                        if (!checkShahLocal(boardArr[i][tmpCol], team)) {
                            indexes.push([i, tmpCol]);

                            break;
                        }
                    }
                    if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team === team) {
                        break;
                    }
                    tmpCol -= 1;
                }
            }
        }
        boardArr[row][col].elementOnBoard = prevFigurePresent;
    } else {
        for (let i = row + 1; i < boardArr.length; i++) {
            if (tmpCol <= boardArr.length - 1) {
                if (!boardArr[i][tmpCol].elementOnBoard) {
                    indexes.push([i, tmpCol]);
                }
                if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team !== team) {
                    indexes.push([i, tmpCol]);

                    break;
                }
                if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team === team) {
                    break;
                }
                tmpCol += 1;
            }
        }
        tmpCol = col - 1;

        for (let i = row + 1; i < boardArr.length; i++) {
            if (tmpCol >= 0) {
                if (!boardArr[i][tmpCol].elementOnBoard) {
                    indexes.push([i, tmpCol]);
                }
                if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team !== team) {
                    indexes.push([i, tmpCol]);
                    break;
                }
                if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team === team) {
                    break;
                }
                tmpCol -= 1;
            }
        }
        if (row > 0) {
            tmpCol = col + 1;

            for (let i = row - 1; i >= 0; i--) {
                if (tmpCol <= boardArr.length - 1) {
                    if (!boardArr[i][tmpCol].elementOnBoard) {
                        indexes.push([i, tmpCol]);
                    }
                    if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team !== team) {
                        indexes.push([i, tmpCol]);

                        break;
                    }
                    if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team === team) {
                        break;
                    }
                    tmpCol += 1;
                }
            }
            tmpCol = col - 1;

            for (let i = row - 1; i >= 0; i--) {
                if (tmpCol >= 0) {
                    if (!boardArr[i][tmpCol].elementOnBoard) {
                        indexes.push([i, tmpCol])
                    }
                    if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team !== team) {
                        indexes.push([i, tmpCol]);

                        break;
                    }
                    if (boardArr[i][tmpCol].elementOnBoard && boardArr[i][tmpCol].elementOnBoard.team === team) {
                        break;
                    }
                    tmpCol -= 1;
                }
            }
        }
    }
    return indexes;
}
function checkPossibleMoveForKing(row, col, team, withAvailableCheck=true) {
    const indexes = [];

    if(withAvailableCheck) {
        if (row + 1 < boardArr.length && (!boardArr[row + 1][col].elementOnBoard || boardArr[row + 1][col].elementOnBoard.team !== team) && boardArr[row + 1][col].availableForKing) {
            indexes.push([row + 1, col]);
        }
        if (row + 1 < boardArr.length && col + 1 < boardArr.length && (!boardArr[row + 1][col + 1].elementOnBoard || boardArr[row + 1][col + 1].elementOnBoard.team !== team)
            && boardArr[row + 1][col + 1].availableForKing) {
            indexes.push([row + 1, col + 1]);
        }
        if (row + 1 < boardArr.length && col - 1 >= 0 && (!boardArr[row + 1][col - 1].elementOnBoard || boardArr[row + 1][col - 1].elementOnBoard.team !== team)
            && boardArr[row + 1][col - 1].availableForKing) {
            indexes.push([row + 1, col - 1]);
        }

        if (col - 1 >= 0 && (!boardArr[row][col - 1].elementOnBoard || boardArr[row][col - 1].elementOnBoard.team !== team)
            && boardArr[row][col - 1].availableForKing) {
            indexes.push([row, col - 1]);
        }
        if (col + 1 < boardArr.length && (!boardArr[row][col + 1].elementOnBoard || boardArr[row][col + 1].elementOnBoard.team !== team)
            && boardArr[row][col + 1].availableForKing) {
            indexes.push([row, col + 1]);
        }

        if (row - 1 >= 0 && (!boardArr[row - 1][col].elementOnBoard || boardArr[row - 1][col].elementOnBoard.team !== team)
            && boardArr[row - 1][col].availableForKing) {
            indexes.push([row - 1, col]);
        }
        if (row - 1 >= 0 && col + 1 < boardArr.length && (!boardArr[row - 1][col + 1].elementOnBoard || boardArr[row - 1][col + 1].elementOnBoard.team !== team)
            && boardArr[row - 1][col + 1].availableForKing) {
            indexes.push([row - 1, col + 1]);
        }
        if (row - 1 >= 0 && col - 1 >= 0 && (!boardArr[row - 1][col - 1].elementOnBoard || boardArr[row - 1][col - 1].elementOnBoard.team !== team)
            && boardArr[row - 1][col - 1].availableForKing) {
            indexes.push([row - 1, col - 1]);
        }
        return indexes;
    } else {
        if (row + 1 < boardArr.length && (!boardArr[row + 1][col].elementOnBoard || boardArr[row + 1][col].elementOnBoard.team !== team)) {
            indexes.push([row + 1, col]);
        }
        if (row + 1 < boardArr.length && col + 1 < boardArr.length && (!boardArr[row + 1][col + 1].elementOnBoard || boardArr[row + 1][col + 1].elementOnBoard.team !== team)) {
            indexes.push([row + 1, col + 1]);
        }
        if (row + 1 < boardArr.length && col - 1 >= 0 && (!boardArr[row + 1][col - 1].elementOnBoard || boardArr[row + 1][col - 1].elementOnBoard.team !== team)) {
            indexes.push([row + 1, col - 1]);
        }

        if (col - 1 >= 0 && (!boardArr[row][col - 1].elementOnBoard || boardArr[row][col - 1].elementOnBoard.team !== team)) {
            indexes.push([row, col - 1]);
        }
        if (col + 1 < boardArr.length && (!boardArr[row][col + 1].elementOnBoard || boardArr[row][col + 1].elementOnBoard.team !== team)) {
            indexes.push([row, col + 1]);
        }

        if (row - 1 >= 0 && (!boardArr[row - 1][col].elementOnBoard || boardArr[row - 1][col].elementOnBoard.team !== team)) {
            indexes.push([row - 1, col]);
        }
        if (row - 1 >= 0 && col + 1 < boardArr.length && (!boardArr[row - 1][col + 1].elementOnBoard || boardArr[row - 1][col + 1].elementOnBoard.team !== team)) {
            indexes.push([row - 1, col + 1]);
        }
        if (row - 1 >= 0 && col - 1 >= 0 && (!boardArr[row - 1][col - 1].elementOnBoard || boardArr[row - 1][col - 1].elementOnBoard.team !== team)) {
            indexes.push([row - 1, col - 1]);
        }
        return indexes;
    }
}
function checkPossibleMoveForQueen(row, col, team, checkShahFor) {
    const indexes = [];

    indexes.push(...checkPossibleMoveForRook(row, col, team, checkShahFor));
    indexes.push(...checkPossibleMoveForElephant(row, col, team, checkShahFor));

    return indexes;
}

function calculatePossibleMoveForFigure(row, col, type, team) {
    function castling(row, col, team) {
        const indexes = [];

        if(boardArr[row][col + 1]
            && !boardArr[row][col + 1].elementOnBoard
            && boardArr[row][col + 2]
            && !boardArr[row][col + 2].elementOnBoard
            && boardArr[row][col + 3]
            && boardArr[row][col + 3].elementOnBoard
            && !boardArr[row][col + 3].elementOnBoard.doneFirstMove
            && !boardArr[row][col].elementOnBoard.doneFirstMove
            && !checkShah(row, col, team)
        ) {
            indexes.push([row, col + 2]);
        }
        if(boardArr[row][col - 1]
            && !boardArr[row][col - 1].elementOnBoard
            && boardArr[row][col - 2]
            && !boardArr[row][col - 2].elementOnBoard
            && boardArr[row][col - 3]
            && !boardArr[row][col - 3].elementOnBoard
            && boardArr[row][col - 4]
            && boardArr[row][col - 4].elementOnBoard
            && !boardArr[row][col - 4].elementOnBoard.doneFirstMove
            && !boardArr[row][col].elementOnBoard.doneFirstMove
            && !checkShah(row, col, team)
        ) {
            indexes.push([row, col - 2]);
        }
        return indexes;
    }
    function drawPossibleMove(possibleMoveIndexes) {
        let cords;

        for (let i = 0; i < possibleMoveIndexes.length; i++) {
            cords = possibleMoveIndexes[i];

            if(boardArr[cords[0]][cords[1]].elementOnBoard) {
                drawSquare(boardArr[cords[0]][cords[1]].x, boardArr[cords[0]][cords[1]].y, 125, 125, "red");
                drawFigure(boardArr[cords[0]][cords[1]].x, boardArr[cords[0]][cords[1]].y, boardArr[cords[0]][cords[1]].elementOnBoard.type, boardArr[cords[0]][cords[1]].elementOnBoard.team);

                boardArr[cords[0]][cords[1]].possibleMove = true;
            } else {
                ctx.beginPath();
                ctx.fillStyle = "green";
                ctx.fillRect(boardArr[cords[0]][cords[1]].x, boardArr[cords[0]][cords[1]].y, 125, 125);

                boardArr[cords[0]][cords[1]].possibleMove = true;
            }
        }
    }

    if(type === PAWN_TYPE) {
        drawPossibleMove(checkPossibleMoveForPawn(row, col, team, team));
    }
    if(type === ROOK_TYPE) {
        drawPossibleMove(checkPossibleMoveForRook(row, col, team, team));
    }
    if(type === HORSE_TYPE) {
        drawPossibleMove(checkPossibleMoveForHorse(row, col, team, team));
    }
    if(type === ELEPHANT_TYPE) {
        drawPossibleMove(checkPossibleMoveForElephant(row, col, team, team));
    }
    if(type === KING_TYPE) {
        const castlingMove = castling(row, col, team);

        if(castlingMove.length) {
            boardArr[castlingMove[0][0]][castlingMove[0][1]].castling = true;

            if(castlingMove.length > 1) {
                boardArr[castlingMove[1][0]][castlingMove[1][1]].castling = true;
            }
            drawPossibleMove([...checkPossibleMoveForKing(row, col, team, true), ...castlingMove]);
        } else {
            drawPossibleMove(checkPossibleMoveForKing(row, col, team, true));
        }
    }
    if(type === QUEEN_TYPE) {
        drawPossibleMove(checkPossibleMoveForQueen(row, col, team, team));
    }
}

function findActiveElement() {
    for(let i = 0; i < boardArr.length; i++) {
        for(let j = 0; j < boardArr[i].length; j++) {
            if(boardArr[i][j].active) {
                return boardArr[i][j];
            }
        }
    }
}

function moveFigure(xCord, yCord, boardElement, boardElementRow, boardElementCol) {
    const element = findActiveElement();

    if(element) {
        ctx.beginPath();
        ctx.clearRect(element.x, element.y, 125, 125);

        deleteActiveFromFigure(element, false);

        ctx.beginPath();
        ctx.clearRect(xCord, yCord, 125, 125);

        drawSquare(xCord, yCord, 125, 125, boardElement.color);

        if(element.elementOnBoard.type === PAWN_TYPE && yCord === 0 && element.elementOnBoard.team === "white"
            || element.elementOnBoard.type === PAWN_TYPE && yCord === 875 && element.elementOnBoard.team === "black") {
            const selectedFigure = getSelectedFigure();

            drawFigure(xCord, yCord, selectedFigure, element.elementOnBoard.team);

            element.elementOnBoard = { ...element.elementOnBoard, type: selectedFigure };
        } else {
            drawFigure(xCord, yCord, element.elementOnBoard.type, element.elementOnBoard.team);
        }
        function getSelectedFigure() {
            const result = prompt("Select new figure: " +
                "1 - Queen" +
                " 2 - Rook" +
                " 3 - Horse" +
                " 4 - Elephant").replaceAll(" ", "");

            if (result !== "1" && result !== "2" && result !== "3" && result !== "4") {
                alert("Wrong value");

                return getSelectedFigure();
            }
            if (result === "1") {
                return QUEEN_TYPE;
            }
            if (result === "2") {
                return ROOK_TYPE;
            }
            if (result === "3") {
                return HORSE_TYPE;
            }
            if(result === "4") {
                return ELEPHANT_TYPE;
            }
        }

        if(boardElement.elementOnBoard && boardElement.elementOnBoard.team === "black") {
            brokenBlackFigure.push(boardElement.elementOnBoard);
        }
        if(boardElement.elementOnBoard && boardElement.elementOnBoard.team === "white") {
            brokenWhiteFigure.push(boardElement.elementOnBoard);
        }
        boardElement.elementOnBoard = {...element.elementOnBoard};

        if(boardElement.elementOnBoard.type === ROOK_TYPE || boardElement.elementOnBoard.type === KING_TYPE) {
            boardElement.elementOnBoard.doneFirstMove = true;
        }
        if(boardElement.castling && boardElementCol === 2) {
            ctx.beginPath();
            ctx.clearRect(boardArr[boardElementRow][0].x, boardArr[boardElementRow][0].y, 125, 125);

            drawSquare(boardArr[boardElementRow][0].x, boardArr[boardElementRow][0].y, 125, 125, boardArr[boardElementRow][0].color);

            boardArr[boardElementRow][3].elementOnBoard = { ...boardArr[boardElementRow][0].elementOnBoard };
            boardArr[boardElementRow][0].elementOnBoard = null;

            ctx.beginPath();
            ctx.clearRect(boardArr[boardElementRow][3].x, boardArr[boardElementRow][3].y, 125, 125);

            drawSquare(boardArr[boardElementRow][3].x, boardArr[boardElementRow][3].y, 125, 125, boardArr[boardElementRow][3].color);
            drawFigure(boardArr[boardElementRow][3].x, boardArr[boardElementRow][3].y, ROOK_TYPE, element.elementOnBoard.team);

            boardElement.castling = false;
        }
        if(boardElement.castling && boardElementCol === 6) {
            ctx.beginPath();
            ctx.clearRect(boardArr[boardElementRow][7].x, boardArr[boardElementRow][7].y, 125, 125);

            drawSquare(boardArr[boardElementRow][7].x, boardArr[boardElementRow][7].y, 125, 125, boardArr[boardElementRow][7].color);

            boardArr[boardElementRow][5].elementOnBoard = { ...boardArr[boardElementRow][7].elementOnBoard };
            boardArr[boardElementRow][7].elementOnBoard = null;

            ctx.beginPath();
            ctx.clearRect(boardArr[boardElementRow][5].x, boardArr[boardElementRow][5].y, 125, 125);

            drawSquare(boardArr[boardElementRow][5].x, boardArr[boardElementRow][5].y, 125, 125, boardArr[boardElementRow][5].color);
            drawFigure(boardArr[boardElementRow][5].x, boardArr[boardElementRow][5].y, ROOK_TYPE, element.elementOnBoard.team);

            boardElement.castling = false;
        }
        element.elementOnBoard = null;
        element.active = false;

        return true;
    }
    return false;
}

function findKingColAndRow(team) {
    for(let i = 0; i < boardArr.length; i++) {
        for(let j = 0; j < boardArr[i].length; j++) {
            if(boardArr[i][j].elementOnBoard && boardArr[i][j].elementOnBoard.team === team && boardArr[i][j].elementOnBoard.type === KING_TYPE) {
                return { row: i, col: j };
            }
        }
    }
}

function getAllPossibleMove(team) {
    const indexes = [];

    for(let i = 0; i < boardArr.length; i++) {
        for(let j = 0; j < boardArr[i].length; j++) {
            if(boardArr[i][j].elementOnBoard && boardArr[i][j].elementOnBoard.team === team && boardArr[i][j].elementOnBoard.type === PAWN_TYPE) {
                indexes.push(...checkPossibleMoveForPawn(i, j, boardArr[i][j].elementOnBoard.team));
            }
            if(boardArr[i][j].elementOnBoard && boardArr[i][j].elementOnBoard.team === team && boardArr[i][j].elementOnBoard.type === HORSE_TYPE) {
                indexes.push(...checkPossibleMoveForHorse(i, j, boardArr[i][j].elementOnBoard.team));
            }
            if(boardArr[i][j].elementOnBoard && boardArr[i][j].elementOnBoard.team === team && boardArr[i][j].elementOnBoard.type === QUEEN_TYPE) {
                indexes.push(...checkPossibleMoveForQueen(i, j, boardArr[i][j].elementOnBoard.team));
            }
            if(boardArr[i][j].elementOnBoard && boardArr[i][j].elementOnBoard.team === team && boardArr[i][j].elementOnBoard.type === ROOK_TYPE) {
                indexes.push(...checkPossibleMoveForRook(i, j, boardArr[i][j].elementOnBoard.team));
            }
            if(boardArr[i][j].elementOnBoard && boardArr[i][j].elementOnBoard.team === team && boardArr[i][j].elementOnBoard.type === ELEPHANT_TYPE) {
                indexes.push(...checkPossibleMoveForElephant(i, j, boardArr[i][j].elementOnBoard.team));
            }
            if(boardArr[i][j].elementOnBoard && boardArr[i][j].elementOnBoard.team === team && boardArr[i][j].elementOnBoard.type === KING_TYPE) {
                indexes.push(...checkPossibleMoveForKing(i, j, boardArr[i][j].elementOnBoard.team));
            }
        }
    }
    return indexes;
}

function checkMat(kingRow, kingCol, teamWithKing) {
    function hasFigureWithTheSameTeamNotKing(team) {
        for(let i = 0; i < boardArr.length; i++) {
            for(let j = 0; j < boardArr[i].length; j++) {
                if(boardArr[i][j].elementOnBoard && boardArr[i][j].elementOnBoard.team === team && boardArr[i][j].elementOnBoard.type !== KING_TYPE) {
                    return true;
                }
            }
        }
    }
    const possibleMoveForKing = checkPossibleMoveForKing(kingRow, kingCol, teamWithKing, false);
    let horseIndexes;

    for(let i = 0; i < boardArr.length; i++) {
        for (let j = 0; j < boardArr[i].length; j++) {
            if (boardArr[i][j].elementOnBoard && boardArr[i][j].elementOnBoard.team !== teamWithKing && boardArr[i][j].elementOnBoard.type === HORSE_TYPE) {
                horseIndexes = checkPossibleMoveForHorse(i, j, boardArr[i][j].elementOnBoard.team);
            }
        }
    }
    if(!possibleMoveForKing.length && horseIndexes.findIndex(cord => cord[0] === kingRow && cord[1] === kingCol) !== -1) {
        return true;
    }
    if(!possibleMoveForKing.length) {
        return false;
    }
    const indexes = getAllPossibleMove(teamWithKing === "white" ? "black" : "white");

    for(let i = 0; i < possibleMoveForKing.length; i++) {
        if(indexes.findIndex(cord => cord[0] === possibleMoveForKing[i][0] && cord[1] === possibleMoveForKing[i][1]) === -1) {
            return false;
        }
    }
    if(indexes.findIndex(cord => cord[0] === kingRow && cord[1] === kingCol) === -1
        && hasFigureWithTheSameTeamNotKing(teamWithKing)) {
        return false;
    }
    const allPossibleFigureMoveWithCheckShah = [];

    for(let i = 0; i < boardArr.length; i++) {
        for(let j = 0; j < boardArr[i].length; j++) {
            if(boardArr[i][j].elementOnBoard && boardArr[i][j].elementOnBoard.team === teamWithKing && boardArr[i][j].elementOnBoard.type === PAWN_TYPE) {
                allPossibleFigureMoveWithCheckShah.push(...checkPossibleMoveForPawn(i, j, teamWithKing, teamWithKing));
            }
            if(boardArr[i][j].elementOnBoard && boardArr[i][j].elementOnBoard.team === teamWithKing && boardArr[i][j].elementOnBoard.type === ROOK_TYPE) {
                allPossibleFigureMoveWithCheckShah.push(...checkPossibleMoveForRook(i, j, teamWithKing, teamWithKing));
            }
            if(boardArr[i][j].elementOnBoard && boardArr[i][j].elementOnBoard.team === teamWithKing && boardArr[i][j].elementOnBoard.type === HORSE_TYPE) {
                allPossibleFigureMoveWithCheckShah.push(...checkPossibleMoveForHorse(i, j, teamWithKing, teamWithKing));
            }
            if(boardArr[i][j].elementOnBoard && boardArr[i][j].elementOnBoard.team === teamWithKing && boardArr[i][j].elementOnBoard.type === ELEPHANT_TYPE) {
                allPossibleFigureMoveWithCheckShah.push(...checkPossibleMoveForElephant(i, j, teamWithKing, teamWithKing));
            }
            if(boardArr[i][j].elementOnBoard && boardArr[i][j].elementOnBoard.team === teamWithKing && boardArr[i][j].elementOnBoard.type === QUEEN_TYPE) {
                allPossibleFigureMoveWithCheckShah.push(...checkPossibleMoveForQueen(i, j, teamWithKing, teamWithKing));
            }
        }
    }
    if(allPossibleFigureMoveWithCheckShah.length) {
        return false;
    }
    return true;
}

function setNotAvailableMoveForKing(kingRow, kingCol, teamWithKing) {
    setAvailableMoveForKing();

    const notAvailableMoveForKing = [];
    const possibleMoveForKing = checkPossibleMoveForKing(kingRow, kingCol, teamWithKing);

    if(!possibleMoveForKing.length) {
        return false;
    }
    const indexes = getAllPossibleMove(teamWithKing === "white" ? "black" : "white");

    for(let i = 0; i < possibleMoveForKing.length; i++) {
        if(indexes.findIndex(cord => cord[0] === possibleMoveForKing[i][0] && cord[1] === possibleMoveForKing[i][1]) !== -1) {
            notAvailableMoveForKing.push([possibleMoveForKing[i][0], possibleMoveForKing[i][1]]);
        }
    }
    // Emulate another move
    let filteredPossibleMoveForKing = [];
    let tmpAvailable = true;

    for(let i = 0; i < possibleMoveForKing.length; i++) {
        for(let j = 0; j < notAvailableMoveForKing.length; j++) {
            if(possibleMoveForKing[i][0] === notAvailableMoveForKing[j][0] && possibleMoveForKing[i][1] === notAvailableMoveForKing[j][1]) {
                tmpAvailable = false;

                break;
            }
        }
        if(tmpAvailable) {
            filteredPossibleMoveForKing.push([possibleMoveForKing[i][0], possibleMoveForKing[i][1]]);
        }
        tmpAvailable = true;
    }
    let tmpKing = { ...boardArr[kingRow][kingCol].elementOnBoard };
    let tmpIndexes;
    let tmpElementOnBoard;

    boardArr[kingRow][kingCol].elementOnBoard = null;

    for(let i = 0; i < filteredPossibleMoveForKing.length; i++) {
        if(!boardArr[filteredPossibleMoveForKing[i][0]][filteredPossibleMoveForKing[i][1]].elementOnBoard) {
            tmpElementOnBoard = null;
        } else {
            tmpElementOnBoard = { ...boardArr[filteredPossibleMoveForKing[i][0]][filteredPossibleMoveForKing[i][1]].elementOnBoard };
        }
        boardArr[filteredPossibleMoveForKing[i][0]][filteredPossibleMoveForKing[i][1]].elementOnBoard = tmpKing;

        tmpIndexes = getAllPossibleMove(teamWithKing === "white" ? "black" : "white");

        if(tmpIndexes.findIndex(cord => cord[0] === filteredPossibleMoveForKing[i][0] && cord[1] === filteredPossibleMoveForKing[i][1]) !== -1) {
            notAvailableMoveForKing.push([filteredPossibleMoveForKing[i][0], filteredPossibleMoveForKing[i][1]]);
        }
        boardArr[filteredPossibleMoveForKing[i][0]][filteredPossibleMoveForKing[i][1]].elementOnBoard = tmpElementOnBoard;
    }
    boardArr[kingRow][kingCol].elementOnBoard = tmpKing;

    for(let i = 0; i < notAvailableMoveForKing.length; i++) {
        boardArr[notAvailableMoveForKing[i][0]][notAvailableMoveForKing[i][1]].availableForKing = false;
    }
}

function setAvailableMoveForKing() {
    for(let i = 0; i < boardArr.length; i++) {
        for(let j = 0; j < boardArr.length; j++) {
            boardArr[i][j].availableForKing = true;
        }
    }
}

function checkShah(kingRow, kingCol, teamWithKing) {
    const allPossibleMove = getAllPossibleMove(teamWithKing === "white" ? "black" : "white");
    return allPossibleMove.findIndex(cord => cord[0] === kingRow && cord[1] === kingCol) !== -1;
}

function clearBlueColor() {
    for(let i = 0; i < boardArr.length; i++) {
        for(let j = 0; j < boardArr[i].length; j++) {
            if(boardArr[i][j].color === "blue") {
                if(i % 2 === 0) {
                    if(j % 2 === 0) {
                        drawSquare(boardArr[i][j].x, boardArr[i][j].y, 125, 125, "gray");

                        if (boardArr[i][j].elementOnBoard) {
                            drawFigure(boardArr[i][j].x, boardArr[i][j].y, boardArr[i][j].elementOnBoard.type, boardArr[i][j].elementOnBoard.team);
                        }
                        boardArr[i][j].color = "gray";
                    } else {
                        drawSquare(boardArr[i][j].x, boardArr[i][j].y, 125, 125, "#b07b00");

                        if(boardArr[i][j].elementOnBoard) {
                            drawFigure(boardArr[i][j].x, boardArr[i][j].y, boardArr[i][j].elementOnBoard.type, boardArr[i][j].elementOnBoard.team);
                        }
                        boardArr[i][j].color = "#b07b00";
                    }
                }
                if(i % 2 !== 0) {
                    if(j % 2 === 0) {
                        drawSquare(boardArr[i][j].x, boardArr[i][j].y, 125, 125, "#b07b00");

                        if (boardArr[i][j].elementOnBoard) {
                            drawFigure(boardArr[i][j].x, boardArr[i][j].y, boardArr[i][j].elementOnBoard.type, boardArr[i][j].elementOnBoard.team);
                        }
                        boardArr[i][j].color = "#b07b00";
                    } else {
                        drawSquare(boardArr[i][j].x, boardArr[i][j].y, 125, 125, "gray");

                        if(boardArr[i][j].elementOnBoard) {
                            drawFigure(boardArr[i][j].x, boardArr[i][j].y, boardArr[i][j].elementOnBoard.type, boardArr[i][j].elementOnBoard.team);
                        }
                        boardArr[i][j].color = "gray";
                    }
                }
            }
        }
    }
}


drawGameBoardAndFillBoardArr();
drawFiguresOnStartPositions();

canvas.addEventListener("click", function (e) {
    for(let i = 0; i < boardArr.length; i++) {
        for(let j = 0; j < boardArr[i].length; j++) {
            if(
                e.clientX >= boardArr[i][j].x && e.clientX <= boardArr[i][j].x + 125
                && e.clientY >= boardArr[i][j].y
                && e.clientY <= boardArr[i][j].y + 125
                && !boardArr[i][j].possibleMove
                && !boardArr[i][j].elementOnBoard
            ) {
                deletePossibleMoveForFigure();
                deleteActiveFromFigure(findActiveElement());

                break;
            }
            if(
                e.clientX >= boardArr[i][j].x && e.clientX <= boardArr[i][j].x + 125
                && e.clientY >= boardArr[i][j].y
                && e.clientY <= boardArr[i][j].y + 125
                && !boardArr[i][j].possibleMove
                && boardArr[i][j].elementOnBoard
                && boardArr[i][j].elementOnBoard.team === move
            ) {
                deletePossibleMoveForFigure();
                deleteActiveFromFigure(findActiveElement());
                setActiveFigure(boardArr[i][j], boardArr[i][j].x, boardArr[i][j].y, boardArr[i][j].elementOnBoard.type, boardArr[i][j].elementOnBoard.team);
                calculatePossibleMoveForFigure(i, j, boardArr[i][j].elementOnBoard.type, boardArr[i][j].elementOnBoard.team);

                break;
            }  else if(
                e.clientX >= boardArr[i][j].x && e.clientX <= boardArr[i][j].x + 125
                && e.clientY >= boardArr[i][j].y
                && e.clientY <= boardArr[i][j].y + 125
                && boardArr[i][j].possibleMove
            ) {
                moveFigure(boardArr[i][j].x, boardArr[i][j].y, boardArr[i][j], i, j);
                deletePossibleMoveForFigure();
                clearBlueColor();

                if(move === "white") {
                    const king = findKingColAndRow("black");

                    setNotAvailableMoveForKing(king.row, king.col,"black");

                    if(checkMat(king.row, king.col, "black")) {
                        alert("White win");

                        window.location.reload();
                    } else {
                        if(checkShah(king.row, king.col, "black")) {
                            drawSquare(boardArr[king.row][king.col].x, boardArr[king.row][king.col].y, 125, 125, "blue");
                            drawKingImage(boardArr[king.row][king.col].x, boardArr[king.row][king.col].y, "black");

                            boardArr[king.row][king.col].color = "blue";
                        }
                    }
                    move = "black";
                } else {
                    const king = findKingColAndRow("white");

                    setNotAvailableMoveForKing(king.row, king.col,"white");

                    if(checkMat(king.row, king.col, "white")) {
                        alert("Black win");

                        window.location.reload();
                    } else {
                        if(checkShah(king.row, king.col, "white")) {
                            drawSquare(boardArr[king.row][king.col].x, boardArr[king.row][king.col].y, 125, 125, "blue");
                            drawKingImage(boardArr[king.row][king.col].x, boardArr[king.row][king.col].y, "white");

                            boardArr[king.row][king.col].color = "blue";
                        }
                    }
                    move = "white";
                }
                break;
            }
        }
    }
});



