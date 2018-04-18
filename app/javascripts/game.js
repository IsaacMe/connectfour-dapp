import * as utils from './utils';

export default class Connect4 {
  constructor() {
    this.players = {NONE: 0, RED: 1, YELLOW: 2};
    this.size = {cols: 7, rows: 6};

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
        break;
      }
    }

    if (chosenRow >= 0) {
      this._nextPlayer();
    }

  }

  checkForWin() {
    // Horizontal -
    for (let row = 0; row < this.size.rows; row++) {
      for (let col = 0; col < (this.size.cols - 3); col++)
        if (this.board[col][row] !== this.players.NONE && this.board[col][row] === this.board[col + 1][row]
          && this.board[col + 1][row] === this.board[col + 2][row]
          && this.board[col + 2][row] === this.board[col + 3][row]) {
          return [[col, row], [col + 1, row], [col + 2, row], [col + 3, row]]
        }
    }

    // Vertical |
    for (let col = 0; col < this.size.cols; col++) {
      for (let row = 0; row < (this.size.rows - 3); row++)
        if (this.board[col][row] !== this.players.NONE && this.board[col][row] === this.board[col][row + 1]
          && this.board[col][row + 1] === this.board[col][row + 2]
          && this.board[col][row + 2] === this.board[col][row + 3]) {
          return [[col, row], [col, row + 1], [col, row + 2], [col, row + 3]]
        }
    }

    // Diagonal /
    for (let row = 0; row < (this.size.rows - 3); row++) {
      for (let col = 0; col < (this.size.cols - 3); col++)
        if (this.board[col][row] !== this.players.NONE && this.board[col][row] === this.board[col + 1][row + 1]
          && this.board[col + 1][row + 1] === this.board[col + 2][row + 2]
          && this.board[col + 2][row + 2] === this.board[col + 3][row + 3]) {
          return [[col, row], [col + 1, row + 1], [col + 2, row + 2], [col + 3, row + 3]]
        }
    }

    // Diagonal \
    for (let row = this.size.rows; row >= 3; row--) {
      for (let col = 0; col < (this.size.cols - 3); col++)
        if (this.board[col][row] !== this.players.NONE && this.board[col][row] === this.board[col + 1][row - 1]
          && this.board[col + 1][row - 1] === this.board[col + 2][row - 2]
          && this.board[col + 2][row - 2] === this.board[col + 3][row - 3]) {
          return [[col, row], [col + 1, row - 1], [col + 2, row - 2], [col + 3, row - 3]]
        }
    }

    return undefined;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  _nextPlayer() {
    if (this.currentPlayer === this.players.RED) {
      this.currentPlayer = this.players.YELLOW;
    } else {
      this.currentPlayer = this.players.RED;
    }
  }
}
