'use client';

import { useState, useEffect } from 'react';
import classnames from 'classnames';

import { Move, Board, Coords } from '../types';

import ModeButton from './ModeButtons';

import {
  MAX_ROWS,
  MAX_COLS,
  MODE_EASY,
  MODE_HARD,
  MODE_IMPOSSIBLE
} from '../const';

import {
  getBestMoveEasy,
  getBestMoveHard,
  getBestMoveImpossible,
} from '../ai';

import {
  getIsRowWinner,
  getIsColWinner,
  getIsLeftDiagonalWinner,
  getIsRightDiagonalWinner,
} from '../utils';

const getAiMove = (mode: string): (board: Board) => Coords | null => {
  if (mode === MODE_EASY) {
    return getBestMoveEasy;
  }

  if (mode === MODE_HARD) {
    return getBestMoveHard;
  }

  return getBestMoveImpossible;
};


export default function Game() {
  const [board, setBoard] = useState<Board>([]);
  const [winner, setWinner] = useState<Move | null>(null);
  const [isBoardDisabled, setIsBoardDisabled] = useState<boolean>(false);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [mode, setMode] = useState<string>(MODE_EASY);

  const generateBoard = ()=> {
    const initialBoard: Board = [];

    for (let i = 0; i < MAX_ROWS; i++) {
      initialBoard.push([]);

      for (let j = 0; j < MAX_COLS; j++) {
        initialBoard[i].push(null);
      }
    }

    setBoard(initialBoard);
    setWinner(null);
    setIsDraw(false);
    setIsBoardDisabled(false);
  };

  useEffect(()=> generateBoard(), [])

  const validateBoard = (boardToValidate: Board, move: Move, row: number, col: number)=> {
    if (
      getIsRowWinner(boardToValidate, move, row) ||
      getIsColWinner(boardToValidate, move, col) ||
      getIsLeftDiagonalWinner(boardToValidate, move) ||
      getIsRightDiagonalWinner(boardToValidate, move)
    ) {
      setWinner(move);
      setIsBoardDisabled(true);
    }

    const hasOpenSpaces = boardToValidate.some(row => row.includes(null));

    if (!hasOpenSpaces) {
      setIsDraw(true);
      setIsBoardDisabled(true);
    }
  };

  const onClickSquare = (move: Move, row: number, col: number, isHumanMove: boolean)=> {
    const newBoard = [...board];

    if (newBoard[row][col] !== null) {
      alert('This space has already been picked');
      return;
    }

    newBoard[row][col] = move;
    setBoard(newBoard);
    validateBoard(newBoard, move, row, col);

    if (isHumanMove) {
      // const opponentMove = getBestMoveNaive(newBoard);
      const opponentMove = getAiMove(mode)(newBoard);

      if (!opponentMove) {
        return;
      }

      const { rowIdx, colIdx } = opponentMove;

      onClickSquare('O', rowIdx, colIdx, false);
    }
  };

  return (
    <div className="max-w-lg m-auto my-20">
      <div className="grid grid-cols-1 gap-4 text-center antialiased font-bold py-4">
        <div className="p-4 shadow-lgitems-center justify-center">
          <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-300 sm:text-7xl">
            Tic Tac Toe
          </h1>
          <p className="mt-8 text-md font-medium text-pretty text-gray-500 sm:text-xl/8">
            It's a classic game of basic strategy that we all know and love. Do you have what it takes to win on hard mode? Can you outsmart impossible mode?
          </p>
          <p className="mt-8 text-md font-medium text-pretty text-gray-500 sm:text-xl/8">
            May the odds be ever in your favor!
          </p>

          <div className="py-4">
            <ModeButton
              mode={MODE_EASY}
              selectedMode={mode}
              label="Easy"
              onClick={()=> {
                setMode(MODE_EASY);
              }}
            />

            <ModeButton
              mode={MODE_HARD}
              selectedMode={mode}
              label="Hard"
              onClick={()=> {
                setMode(MODE_HARD);
              }}
            />
            
            <ModeButton
              mode={MODE_IMPOSSIBLE}
              selectedMode={mode}
              label="Impossible"
              onClick={()=> {
                setMode(MODE_IMPOSSIBLE);
              }}
            />

            <button
              type="button"
              className="cursor-pointer focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
              onClick={generateBoard}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {
        isDraw && !winner &&
          <div className="grid grid-cols-1 gap-4 text-center text-3xl antialiased font-bold py-4">
            <div className="p-4 rounded-lg shadow-lg bg-emerald-500 items-center justify-center">
              This game is a draw!
            </div>
          </div>
      }

      {
        winner !== null &&
          <div className="grid grid-cols-1 gap-4 text-center text-3xl antialiased font-bold py-4">
            <div className="p-4 rounded-lg shadow-lg bg-emerald-500 items-center justify-center">
              { winner } wins!
            </div>
          </div>
      }

      <div className="grid grid-cols-3 gap-4 text-center text-3xl antialiased font-bold">
        {
          board.map((row, rowIdx)=> (
            row.map((col, colIdx)=> (
              <div
                key={colIdx}
                className={classnames('p-4 rounded-lg shadow-lg bg-indigo-500 items-center justify-center', {
                  'text-transparent': !col,
                  'cursor-pointer': !isBoardDisabled
                })}
                onClick={()=> {
                  if (!isBoardDisabled) {
                    onClickSquare('X', rowIdx, colIdx, true);
                  }
                }}
              >
                { col ? col : '-' }
              </div>
            ))
          ))
        }
      </div>
    </div>
  );
}
