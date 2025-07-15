import {
    drawGameBoardAndFillBoardArr,
    drawFiguresOnStartPositions,
    deletePossibleMoveForFigure,
    deleteActiveFromFigure,
    setActiveFigure,
    calculatePossibleMoveForFigure,
    moveFigure,
    clearBlueColor,
    findKingColAndRow,
    setNotAvailableMoveForKing,
    checkMat,
    drawSquare,
    drawKingImage,
    findActiveElement,
    checkShah
} from "../game/main.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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

drawGameBoardAndFillBoardArr(ctx, boardArr);
drawFiguresOnStartPositions(ctx, boardArr);

canvas.addEventListener("click", function (e) {
    for(let i = 0; i < boardArr.length; i++) {
        for(let j = 0; j < boardArr[i].length; j++) {
            if(
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
            if(
                e.layerX >= boardArr[i][j].x && e.layerX <= boardArr[i][j].x + 125
                && e.layerY >= boardArr[i][j].y
                && e.layerY <= boardArr[i][j].y + 125
                && !boardArr[i][j].possibleMove
                && boardArr[i][j].elementOnBoard
                && boardArr[i][j].elementOnBoard.team === move
            ) {
                deletePossibleMoveForFigure(ctx, boardArr);
                deleteActiveFromFigure(ctx, findActiveElement(boardArr));
                setActiveFigure(ctx, boardArr[i][j], boardArr[i][j].x, boardArr[i][j].y, boardArr[i][j].elementOnBoard.type, boardArr[i][j].elementOnBoard.team);
                calculatePossibleMoveForFigure(ctx, boardArr, i, j, boardArr[i][j].elementOnBoard.type, boardArr[i][j].elementOnBoard.team);

                break;
            }  else if(
                e.layerX >= boardArr[i][j].x && e.layerX <= boardArr[i][j].x + 125
                && e.layerY >= boardArr[i][j].y
                && e.layerY <= boardArr[i][j].y + 125
                && boardArr[i][j].possibleMove
            ) {
                moveFigure(ctx, boardArr, brokenWhiteFigure, brokenBlackFigure, boardArr[i][j].x, boardArr[i][j].y, boardArr[i][j], i, j, move);
                deletePossibleMoveForFigure(ctx, boardArr);
                clearBlueColor(ctx, boardArr);

                if(move === "white") {
                    const king = findKingColAndRow(boardArr,"black");

                    setNotAvailableMoveForKing(boardArr, king.row, king.col,"black");

                    if(checkMat(boardArr, king.row, king.col, "black")) {
                        alert("Білі перемогли");

                        window.location.reload();
                    } else {
                        if(checkShah(boardArr, king.row, king.col, "black")) {
                            drawSquare(ctx, boardArr[king.row][king.col].x, boardArr[king.row][king.col].y, 125, 125, "blue");
                            drawKingImage(ctx, boardArr[king.row][king.col].x, boardArr[king.row][king.col].y, "black");

                            boardArr[king.row][king.col].color = "blue";
                        }
                    }
                    move = "black";
                } else {
                    const king = findKingColAndRow(boardArr, "white");

                    setNotAvailableMoveForKing(boardArr, king.row, king.col,"white");

                    if(checkMat(boardArr, king.row, king.col, "white")) {
                        alert("Чорні перемогли");

                        window.location.reload();
                    } else {
                        if(checkShah(boardArr, king.row, king.col, "white")) {
                            drawSquare(ctx, boardArr[king.row][king.col].x, boardArr[king.row][king.col].y, 125, 125, "blue");
                            drawKingImage(ctx, boardArr[king.row][king.col].x, boardArr[king.row][king.col].y, "white");

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



