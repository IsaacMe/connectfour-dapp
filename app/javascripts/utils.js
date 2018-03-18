
export function hideAll() {
  $('.container').addClass('d-none');
}

export function showError(msg) {
  hideAll();
  $('#error-msg').text(msg);
  $('#error').removeClass('d-none');
}

export function showInputError(msg) {
  hideAll();
  $('#error-msg').text(msg);
  $('#error').removeClass('d-none');
  $('#welcome').removeClass('d-none');
}

export function loading() {
  hideAll();
  $('#loading').removeClass('d-none');
}

export function showGame() {
  hideAll();
  $('#game').removeClass('d-none');
}

export function showWelcome() {
  hideAll();
  $('#welcome').removeClass('d-none');
}

export function renderBoard(board) {
  for (let col = 0; col < board.length; col++) {
    for (let row = 0; row < board[col].length; row++) {
      const htmlEl = $('#b-' + col + '-' + row);
      htmlEl.removeClass('red yellow');
      if (board[col][row] === 1) {
        htmlEl.addClass('red');
      } else if (board[col][row] === 2) {
        htmlEl.addClass('yellow');
      }
    }
  }
}
