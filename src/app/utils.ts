import { Move, Board } from './types';
import { MAX_ROWS, MAX_COLS } from './const';

export const getIsRowWinner = (board: Board, move: Move, rowIdx: number): boolean => {
  for (const col of board[rowIdx]) {
    if (col !== move) {
      return false;
    }
  }

  return true;
};

export const getIsColWinner = (board: Board, move: Move, colIdx: number): boolean => {
  for (let row = 0; row < MAX_ROWS; row++) {
    if (board[row][colIdx] !== move) {
      return false;
    }
  }

  return true;
};

export const getIsLeftDiagonalWinner = (board: Board, move: Move): boolean => {
  for (let row = 0; row < MAX_ROWS; row++) {
    if (board[row][row] !== move) {
      return false;
    }
  }

  return true;
};

export const getIsRightDiagonalWinner = (board: Board, move: Move): boolean => {
  for (let row = 0; row < MAX_ROWS; row++) {
    if (board[row][MAX_COLS - 1 - row] !== move) {
      return false;
    }
  }

  return true;
};

