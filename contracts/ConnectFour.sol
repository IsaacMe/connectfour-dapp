pragma solidity ^0.4.21;

contract ConnectFour {

    enum Piece {NONE, RED, YELLOW}

    struct Player {
        bytes32 name;
        address addr;
    }

    struct Status {
        bool endGame;
        Piece winner;
        uint round;
        Piece nextTurn;
        Piece[6][7] board;
    }

    address owner;
    Player playerRed;
    Player playerYellow;
    Status gameStatus;

    event Move(Piece player, uint8 column, uint8 row);
    event End(Piece winner);

    function ConnectFour(bytes32 namePlayer1, address addressPlayer1,
        bytes32 namePlayer2, address addressPlayer2) public {
        owner = msg.sender;

        // Init players
        playerRed.name = namePlayer1;
        playerRed.addr = addressPlayer1;
        playerYellow.name = namePlayer2;
        playerYellow.addr = addressPlayer2;

        // Init game
        gameStatus.endGame = false;
        gameStatus.round = 0;
        gameStatus.nextTurn = Piece.RED;
    }

    modifier whenActive {
        require(!gameStatus.endGame);
        _;
    }

    modifier currentPlayer {
        if (gameStatus.nextTurn == Piece.RED) {
            require(msg.sender == playerRed.addr);
        } else {
            require(msg.sender == playerYellow.addr);
        }
        _;
    }

    function makeMove(uint8 column) whenActive currentPlayer public {
        require(column >= 0 && column < 7);
        bool madeMove = false;
        uint8 frow = 0;

        for (uint8 row = 0; row < 6; row++) {
            if (gameStatus.board[column][row] == Piece.NONE) {
                gameStatus.board[column][row] = gameStatus.nextTurn;
                madeMove = true;
                frow = row;
                break;
            }
        }

        require(madeMove);

        emit Move(gameStatus.nextTurn, column, frow);

        if (gameStatus.nextTurn == Piece.RED) {
            gameStatus.nextTurn = Piece.YELLOW;
        } else {
            gameStatus.nextTurn = Piece.RED;
            gameStatus.round++;
        }
    }

    // Check if the given end is winning
    // Positions array has to be ordered ascending on collumn than on row.
    function checkEnd(uint8[2][4] positions) whenActive public {
        // Check if all pieces form the winning color
        Piece winner = Piece.NONE;
        for (uint8 i = 0; i < 4; i++) {
            Piece current = gameStatus.board[positions[i][0]][positions[i][1]];
            if (current == Piece.NONE) {
                winner = Piece.NONE;
                break;
            } else if (current != winner && winner == Piece.NONE) {
                winner = current;
            } else if (current != winner) {
                winner = Piece.NONE;
                break;
            }
        }

        require(winner != Piece.NONE);

        // Check type of win
        if (positions[0][0] == positions[1][0]) {
            // Equal rows => Horizontal
            for (uint8 j = 0; j < 3; j++) {
                require(positions[j][1] + 1 == positions[j + 1][1] && positions[j][0] == positions[j + 1][0]);
            }
        } else if (positions[0][1] == positions[1][1]) {
            // Equal collumns => Vertical
            for (uint8 k = 0; k < 3; k++) {
                require(positions[k][0] + 1 == positions[k + 1][0] && positions[k][1] == positions[k + 1][1]);
            }
        } else if (positions[0][0] + 1 == positions[1][0] && positions[0][1] + 1 == positions[1][1]) {
            // Diagonal (Ascending)
            for (uint8 l = 0; l < 3; l++) {
                require(positions[l][0] + 1 == positions[l + 1][0] && positions[l][1] + 1 == positions[l + 1][1]);
            }
        } else if (positions[0][0] + 1 == positions[1][0] && positions[0][1] - 1 == positions[1][1]) {
            // Diagonal (Descending)
            for (uint8 m = 0; m < 3; m++) {
                require(positions[m][0] + 1 == positions[m + 1][0] && positions[m][1] - 1 == positions[m + 1][1]);
            }
        } else {
            revert();
        }

        gameStatus.endGame = true;
        gameStatus.winner = winner;
        emit End(winner);
    }
}
