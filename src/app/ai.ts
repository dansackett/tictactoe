import { Board, Move, Coords } from './types';
import { MAX_ROWS, MAX_COLS } from './const';

const getOpenSpaces = (board: Board): Coords[] => {
  const openSpaces = [];

  for (let i = 0; i < MAX_ROWS; i++) {
  for (let j = 0; j < MAX_COLS; j++) {
    if (board[i][j] === null) {
    openSpaces.push({
      rowIdx: i,
      colIdx: j
    });
    }
  }
  }

  return openSpaces;
};

export const getBestMoveEasy = (board: Board): Coords | null => {
  const openSpaces = getOpenSpaces(board);

  if (!openSpaces) {
  return null;
  }

  return openSpaces[Math.floor(Math.random() * openSpaces.length)];
}

export const getBestMoveHard = (
  board: Board,
  ai: Move = 'O',
  human: Move = 'X',
  maxDepth: number = 2,
  mistakeChance: number = 0.1
): Coords | null => {

  function isMovesLeft(b: Board) {
    return b.some(row => row.includes(null));
  }

  function evaluate(b: Board) {
    const lines = [
      [b[0][0], b[0][1], b[0][2]],
      [b[1][0], b[1][1], b[1][2]],
      [b[2][0], b[2][1], b[2][2]],
      [b[0][0], b[1][0], b[2][0]],
      [b[0][1], b[1][1], b[2][1]],
      [b[0][2], b[1][2], b[2][2]],
      [b[0][0], b[1][1], b[2][2]],
      [b[0][2], b[1][1], b[2][0]],
    ];

    for (const line of lines) {
      if (line.every(cell => cell === ai)) return 10;
      if (line.every(cell => cell === human)) return -10;
    }

    return 0;
  }

  function minimax(b: Board, depth: number, isMax: boolean, alpha: number, beta: number) {
    const score = evaluate(b);
    if (score !== 0 || !isMovesLeft(b) || depth === maxDepth) return score;

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (b[i][j] === null) {
            b[i][j] = ai;
            best = Math.max(best, minimax(b, depth + 1, false, alpha, beta));
            b[i][j] = null;
            alpha = Math.max(alpha, best);
            if (beta <= alpha) break;
          }
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (b[i][j] === null) {
            b[i][j] = human;
            best = Math.min(best, minimax(b, depth + 1, true, alpha, beta));
            b[i][j] = null;
            beta = Math.min(beta, best);
            if (beta <= alpha) break;
          }
        }
      }
      return best;
    }
  }

  // Collect all move options with their scores
  const moves = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === null) {
        board[i][j] = ai;
        const score = minimax(board, 0, false, -Infinity, Infinity);
        board[i][j] = null;
        moves.push({ pos: { rowIdx: i, colIdx: j }, score });

      }
    }
  }

  // Sort moves best to worst
  moves.sort((a, b) => b.score - a.score);

  // Mistake: pick second-best move (or worse) with a small chance
  if (Math.random() < mistakeChance && moves.length > 1) {
    return moves[1].pos;
  }

  if (moves && moves[0]) {
    return moves[0].pos; // Best move
  }
  
  return null;
}


export const getBestMoveImpossible = (board: Board, ai: Move = 'O', human: Move = 'X'): Coords | null => {
  // Check if any empty cells are left
  function isMovesLeft(b: Board) {
    return b.some(row => row.includes(null));
  }

  // Evaluate the current board state
  function evaluate(b: Board) {
  // Rows and columns
  for (let i = 0; i < 3; i++) {
    if (b[i][0] === b[i][1] && b[i][1] === b[i][2]) {
      if (b[i][0] === ai) return +10;
      if (b[i][0] === human) return -10;
    }
    if (b[0][i] === b[1][i] && b[1][i] === b[2][i]) {
      if (b[0][i] === ai) return +10;
      if (b[0][i] === human) return -10;
    }
  }

  // Diagonals
  if (b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
    if (b[0][0] === ai) return +10;
    if (b[0][0] === human) return -10;
  }

  if (b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
    if (b[0][2] === ai) return +10;
    if (b[0][2] === human) return -10;
  }

  return 0;
  }

  // Optimized minimax function with alpha-beta pruning
  function minimax(b: Board, depth: number, isMax: boolean, alpha: number, beta: number) {
  const score = evaluate(b);

  // Return final score if the game is over
  if (score === 10 || score === -10) return score;
  if (!isMovesLeft(b)) return 0;

  if (isMax) {
    let best = -Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (b[i][j] === null) {
        b[i][j] = ai;
        best = Math.max(best, minimax(b, depth + 1, false, alpha, beta));
        b[i][j] = null;
        alpha = Math.max(alpha, best);

        // Beta cut-off
        if (beta <= alpha) break;
        }
      }
    }
    return best;
  } else {
    let best = Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (b[i][j] === null) {
        b[i][j] = human;
        best = Math.min(best, minimax(b, depth + 1, true, alpha, beta));
        b[i][j] = null;
        beta = Math.min(beta, best);

        // Alpha cut-off
        if (beta <= alpha) break;
        }
      }
    }
    return best;
  }
  }

  // Determine the best move for the AI
  let bestVal = -Infinity;
  let bestMove = null;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === null) {
      board[i][j] = ai;

      // Use alpha-beta parameters
      const moveVal = minimax(board, 0, false, -Infinity, +Infinity);

      board[i][j] = null;

      if (moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = { rowIdx: i, colIdx: j };
      }
      }
    }
  }

  return bestMove;
}
