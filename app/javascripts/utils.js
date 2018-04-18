
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

export function renderWinner(player, me) {
  renderPlayerName(player, me, "#winner");
}

export function renderPlayer(player, me) {
  renderPlayerName(player, me, "#current-player");
}

function renderPlayerName(player, me, div) {
  let mestr = "";
  if (me) {
    mestr = " (me)";
  }
  if (player === 1) {
    $(div).text("Red" + mestr);
  } else if (player === 2) {
    $(div).text("Yellow" + mestr);
  } else {
    $(div).text("Nobody");
  }
}


export function renderAddress(addr) {
  $('#address').text(addr);
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
