export type Move = 'X' | 'O';
export type Board = Array<Array<Move | null>>;

export interface Coords {
  rowIdx: number;
  colIdx: number;
}
