import * as utils from './utils';

export default class Connect4 {
  board;

  players = {NONE: 0, RED: 1, YELLOW: 2};
  size = {cols: 7, rows: 6};

  private currentPlayer;

  constructor() {
    this.board = new Array(this.size.cols).fill(new Array(this.size.rows).fill(this.players.NONE));
    this.currentPlayer = this.players.RED;
  }

  /**
   * Add a disk to the board
   * @param col The column
   * @param player The player
   */
  makeMove(col, player) {
    if (player !== this.currentPlayer) {
      return;
    }

    let chosenRow = -1;
    for (let row = 0; row < this.size.rows; row++) {
      if (this.board[col][row] === this.players.NONE) {
        this.board[col][row] = player;
        chosenRow = row;
      }
    }

    if (chosenRow >= 0) {
      this.nextPlayer();
    }

  }


  private nextPlayer() {
    if (this.currentPlayer === this.players.RED) {
      this.currentPlayer = this.players.YELLOW;
    } else {
      this.currentPlayer = this.players.RED;
    }
  }
}
