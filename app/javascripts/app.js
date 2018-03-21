// Import the page's CSS. Webpack will know what to do with it.
require('bootstrap/dist/css/bootstrap.css');
import "../stylesheets/app.css";
import * as utils from "./utils";
import Connect4 from "./game"

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import connect4_artifacts from '../../build/contracts/ConnectFour.json'

// Connect4 Contract
let Connect4Contract = contract(connect4_artifacts);
let Connect4Deployed = undefined;

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts;
let account;
let game;

window.App = {
  start: function() {
    let self = this;

    Connect4Contract.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    window.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        utils.showError("There was an error fetching your accounts.");
        return;
      }

      if (accs.length === 0) {
        utils.showError("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      $('#p1addr').val(accs);
      utils.showWelcome();
    });
  },

  create: function() {
    utils.loading();
    const player1 = {name: $('#p1name').val(), address: $('#p1addr').val()};
    const player2 = {name: $('#p2name').val(), address: $('#p2addr').val()};

    Connect4Contract.new(player1.name, player1.address, player2.name, player2.address, {from: account, gas: 1400000}).then((instance) => {
        Connect4Deployed = instance;
        App.startGame();
    }).catch((e) => {
      utils.showInputError(e.message);
    });
  },

  resume: function() {
    utils.loading();
    const address = $('#contractaddr').val();
    try {
      Connect4Contract.at(address).then((instance) => {
        Connect4Deployed = instance;
        App.startGame();
      }).catch((e) => {
        utils.showInputError(e.message);
      })
    } catch (e) {
      utils.showInputError(e.message);
    }
  },

  startGame: function() {
    game = new Connect4();
    Connect4Deployed.getBoard.call().then((boardChain) => {
      game.board = App.convertBoardChainToBoard(boardChain);
      utils.renderBoard(game.board);
      utils.renderPlayer(game.getCurrentPlayer(), false);
      utils.showGame();
    });

    Connect4Deployed.Move().watch((err, res) => {
      if (err) console.error(err);

      game.makeMove(res.args.column.toNumber(), res.args.player.toNumber());
      utils.renderBoard(game.board);
      utils.renderPlayer(game.getCurrentPlayer(), false);
    });

  },

  makeMove: function(col) {
    Connect4Deployed.makeMove(col, {from: account, gas: 140000}).then((result) => {
      console.log("Made move");
    }).catch((err) => {
      console.log("Move failed");
      console.log(err);
    });
  },

  convertBoardChainToBoard: function (boardChain) {
    return boardChain.map(col => col.map(e => e.toNumber()));
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  sendCoin: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  }
};

$(document).ready(() => {

  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
    App.start();
  } else {
    utils.showError("No Metamask or other web3 provider found!");
  }

  $("#btn-create").click(() => {
    App.create();
  });

  $("#btn-resume").click(() => {
    App.resume();
  });

  $("#game-board :button").click((event) => {
    const pos = event.target.id.split("-");
    App.makeMove(parseInt(pos[1]));
  })
});
