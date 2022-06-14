const numOfCards = 9;
const numOfPlayers = 2;
let currentGame = null;
let timerVar;

function Game() {
  this.movesArray = [];
  this.board = [[], [], []];
  this.players = [];
  this.isGameWon = false;
  this.gamesCounter = 1;
  this.startDate = new Date();
  this.duration = 0;

  this.saveMe = function () {
    localStorage.setItem("savedGame", JSON.stringify(this));
  };

  this.addGame = function () {
    this.gamesCounter++;
  };
}

// Player object
function Player(id, name, cssClass) {
  this.recordCards = [];
  this.id = id;
  this.name = name;
  this.active = false;
  this.cssClass = cssClass;

  this.showMe = function () {
    document.getElementById(
      `player${id}`
    ).innerHTML = `<div name="player" id="player1">${this.name} found ${this.cards} pairs</div>`;
  };
  this.myTurn = function () {
    document.getElementById(`player${this.id}`).classList.add("activePlayer");
  };
  this.checkRecord = function (lastGameCards) {
    if (this.recordCards.length > 0) {
      if (this.recordCards.length > lastGameCards.length) {
        this.recordCards = lastGameCards;
      }
    } else {
      this.recordCards = lastGameCards;
    }
  };
}

// Card object
function Card(row, col, symbol) {
  this.row = row;
  this.col = col;
  this.symbol = symbol;
  this.disable = function () {
    document
      .getElementById(`${row}${col}`)
      .removeEventListener("click", showCard);
    document.getElementById(`${row}${col}`).style.pointerEvents = "none";
  };
  this.enable = function () {
    document.getElementById(`${row}${col}`).addEventListener("click", showCard);
    document.getElementById(`${row}${col}`).style.pointerEvents = "auto";
    this.symbol = "";
  };
}

disableMenu();

// onfocusout callback - player names input element
function checkNames() {
  if (
    document.getElementById(`player1`).value != undefined &&
    document.getElementById(`player2`).value != undefined &&
    document.getElementById(`player1`).value != "" &&
    document.getElementById(`player2`).value != ""
  ) {
    document.getElementById("startGame").removeAttribute("disabled");
    document.getElementById("startGame").classList.remove("button-disabbled");
  }
  document.querySelector("#board").removeAttribute("hidden");
}

function init() {
  document.getElementById("startGame").style.display = "none";
  currentGame = new Game();
  //players
  for (let p = 0; p < numOfPlayers; p++) {
    let playerName = document.getElementById(`player${p + 1}`).value;
    currentGame.players.push(new Player(p + 1, playerName, ""));
  }
  currentGame.players[0].cssClass = "Xcard";
  currentGame.players[1].cssClass = "Ocard";

  currentGame.players.forEach((v) => v.showMe());
  currentGame.players[0].myTurn();
  currentGame.players[0].active = true;

  //board
  buildBoard();

  enableMenu();
  //init timer
  currentGame.startDate = Date.now();
  currentGame.duration = 0;
  beginTimer();
}

/********** Timer ********/

function beginTimer(){
    document.getElementById("timerSpan").removeAttribute("hidden");
   timerVar= setInterval(myTimer, 1000);
  }

function myTimer() {
  const d = new Date();
  currentGame.duration = (Date.now() - currentGame.startDate) / 1000;
  document.getElementById("timerSpan").innerText = time_convert(Math.round(currentGame.duration));
  //document.getElementById("timerSpan").innerText = time_convert(Math.round((Date.now()-currentGame.startDate)/1000));
}

function time_convert(num) {
  let hours = Math.floor(num / 3600);
  let minutes = Math.floor(num / 60);
  let seconds = num % 60;
  return hours + ":" + minutes + ":" + seconds;
}

/********** Timer ********/

function showCard(e) {
  let activePlayer = currentGame.players.filter((p) => p.active)[0];
  let div = document.createElement("div");
  div.className = activePlayer.cssClass;
  e.target.appendChild(div);
  let curCard = null;
  for (cardsRow of currentGame.board) {
    if (curCard == null || curCard.length == 0) {
      curCard = cardsRow.filter(
        (v) =>
          v.row == Number(e.target.id.split("")[0]) &&
          v.col == Number(e.target.id.split("")[1])
      );
    }
  }
  if (curCard[0] != null) {
    curCard[0].symbol = activePlayer.cssClass.split("")[0];
    currentGame.movesArray.push(curCard[0]);
    curCard[0].disable();
    if (currentGame.movesArray != null && currentGame.movesArray.length > 4) {
      if (CheckGameWon(curCard[0]) || currentGame.movesArray.length == 9) {
        finishGame(curCard[0]);
      }
    }
    if (!currentGame.isGameWon) {
      for (p of currentGame.players) {
        p.active = !p.active;
        if (p.active) {
          p.myTurn();
        } else {
          document
            .getElementById(`player${p.id}`)
            .classList.remove("activePlayer");
        }
      }
    }
  } else {
    document.getElementById('message').innerHTML = 'Error'
    // alert("Error");
  }
  if (currentGame.movesArray.length == 1) {
    document
      .getElementById("previousStep")
      .addEventListener("click", undoLastMove);
    document.getElementById("previousStep").style.pointerEvents = "auto";
  }
}

function CheckGameWon(card) {
  let x = card.row;
  let y = card.col;
  let n = numOfCards / 3;

  //check row
  for (let j = 0; j < n; j++) {
    if (currentGame.board[x][j].symbol != card.symbol) break;
    if (j == n - 1) {
      return true;
    }
  }

  //check row
  for (let i = 0; i < n; i++) {
    if (currentGame.board[i][y].symbol != card.symbol) break;
    if (i == n - 1) {
      return true;
    }
  }

  //check diag
  if (x == y) {
    for (let i = 0; i < n; i++) {
      if (currentGame.board[i][i].symbol != card.symbol) break;
      if (i == n - 1) {
        return true;
      }
    }
  }
  //check anti diag
  if (x + y == n - 1) {
    for (let i = 0; i < n; i++) {
      if (currentGame.board[i][n - 1 - i].symbol != card.symbol) break;
      if (i == n - 1) {
        return true;
      }
    }
  }
  return false;
}

function finishGame(winnerCard) {
  if (currentGame.movesArray.length == 9) {
    document.getElementById('message').innerHTML = "No More moves to play, it's a tie"
    // alert("No More moves to play, it's a tie");
  } else {
    currentGame.isGameWon = true;
    let p = currentGame.players.filter(
      (v) => v.cssClass.split("")[0].toUpperCase() == winnerCard.symbol
    );
    p[0].checkRecord(currentGame.movesArray);
    // disable board
    for (cardsRow of currentGame.board) {
      cardsRow.forEach((card) => card.disable());
    }
    document.getElementById('message').innerHTML = `player ${winnerCard.symbol} won!!`
    // alert(`player ${winnerCard.symbol} won!!`);
  }
  clearInterval(timerVar);
}

function undoLastMove() {
  let activePlayerClass = "";
  if (currentGame.movesArray.length > 0) {
    // switch players
    for (p of currentGame.players) {
      p.active = !p.active;
      if (p.active) {
        p.myTurn();
        activePlayerClass = p.cssClass;
      } else {
        document
          .getElementById(`player${p.id}`)
          .classList.remove("activePlayer");
      }
    }

    //remove board cell symbol
    let lastMoveRow =
      currentGame.movesArray[currentGame.movesArray.length - 1].row;
    let lastMoveCol =
      currentGame.movesArray[currentGame.movesArray.length - 1].col;
    document.getElementById(`${lastMoveRow}${lastMoveCol}`).innerHTML = "";

    //enable cell click
    currentGame.board[lastMoveRow][lastMoveCol].enable();

    //remove last played card
    currentGame.movesArray.pop();

    // if first move canceled => disable undo last step menu option
    if (currentGame.movesArray.length == 0) {
      document
        .getElementById("previousStep")
        .removeEventListener("click", undoLastMove);
      document.getElementById("previousStep").style.pointerEvents = "none";
    }
  }
}

function restart() {
  currentGame.isGameWon = false;
  buildBoard();
  currentGame.addGame();
  if (currentGame.gamesCounter % 2 == 1) {
    currentGame.players[0].myTurn();
    currentGame.players[0].active = true;
    currentGame.players[1].active = false;
    document
      .getElementById(`player${currentGame.players[1].id}`)
      .classList.remove("activePlayer");
  } else {
    currentGame.players[1].myTurn();
    currentGame.players[1].active = true;
    currentGame.players[0].active = false;
    document
      .getElementById(`player${currentGame.players[0].id}`)
      .classList.remove("activePlayer");
  }
  currentGame.movesArray = [];
  beginTimer();
  currentGame.startDate=Date.now();
  currentGame.duration=0;
}

function buildBoard() {
  document.querySelector("#board").innerHTML = "";
  for (let i = 0; i < numOfCards / 3; i++) {
    for (let j = 0; j < numOfCards / 3; j++) {
      let card = new Card(i, j, "");
      currentGame.board[i][j] = card;
      let divElement = document.createElement("div");
      divElement.id = i + "" + j;
      divElement.classList.add("cards");
      divElement.addEventListener("click", showCard);
      if (i == 0 || i == 1) {
        divElement.classList.add("horizontal-Line");
      }
      if (j == 0 || j == 1) {
        divElement.classList.add("vertical-Line");
      }
      document.querySelector("#board").appendChild(divElement);
    }
  }
  document.querySelector("#board").classList.add("baord");
  document.querySelector("#board").removeAttribute("hidden");
}

function saveGame() {
  currentGame.duration = (Date.now() - currentGame.startDate) / 1000;
  currentGame.saveMe();
}

function loadGame() {
  document.getElementById("startGame").style.display = "none";
  if (localStorage.getItem("savedGame")) {
    currentGame = Object.assign(
      new Game(),
      JSON.parse(localStorage.getItem("savedGame"))
    );
    currentGame.players = currentGame.players.map((v) => {
      let recordCards = v.recordCards;
      v = new Player(v.id, v.name, v.cssClass);
      v.recordCards = recordCards;
      return v;
    });

    document.getElementById(`player1`).value = currentGame.players[0].name;
    document.getElementById(`player2`).value = currentGame.players[1].name;

    document.querySelector("#board").innerHTML = "";
    buildBoard();
    currentGame.movesArray = currentGame.movesArray.map((v) => {
      v = new Card(v.row, v.col, v.symbol);
      return v;
    });
    for (let i = 0; i < currentGame.movesArray.length; i++) {
      let div = document.createElement("div");
      div.className = `${currentGame.movesArray[i].symbol}card`;
      document
        .getElementById(
          `${currentGame.movesArray[i].row}${currentGame.movesArray[i].col}`
        )
        .appendChild(div);
      currentGame.board[currentGame.movesArray[i].row][
        currentGame.movesArray[i].col
      ].symbol = currentGame.movesArray[i].symbol;
      currentGame.board[currentGame.movesArray[i].row][
        currentGame.movesArray[i].col
      ].disable();
    }
    currentGame.players.forEach((v) => {
      if (
        v.cssClass.split("")[0].toUpperCase() ==
        currentGame.movesArray[
          currentGame.movesArray.length - 1
        ].symbol.toUpperCase()
      ) {
        document
          .getElementById(`player${v.id}`)
          .classList.remove("activePlayer");
      } else {
        v.active = true;
        v.myTurn();
      }
    });
    if (currentGame.isGameWon) {
      finishGame(currentGame.movesArray[currentGame.movesArray.length - 1]);
    }
    currentGame.startDate = Date.now() - currentGame.duration * 1000;
  } else {
    document.getElementById('message').innerHTML = "No game saved"
    // alert("No game saved");
  }
}

function showRecord() {
  if (
    currentGame.players[0].recordCards.length == 0 &&
    currentGame.players[1].recordCards.length == 0
  ) {
    document.getElementById('message').innerHTML = `No record yet...`
    // alert(`No record yet...`);
    return;
  }
  if (
    currentGame.players[0].recordCards.length <
    currentGame.players[1].recordCards.length &&
    currentGame.players[0].recordCards.length > 0
  ) {
    document.getElementById('message').innerHTML = `Record: ${currentGame.players[0].recordCards.length} moves, belong to ${currentGame.players[0].name}`
    // alert(
    //   `Record: ${currentGame.players[0].recordCards.length} moves, belong to ${currentGame.players[0].name}`
    // );
  } else if (
    currentGame.players[0].recordCards.length >
    currentGame.players[1].recordCards.length &&
    currentGame.players[1].recordCards.length > 0
  ) {
    document.getElementById('message').innerHTML = `Record: ${currentGame.players[1].recordCards.length} moves, belong to ${currentGame.players[1].name}`
    // alert(
    //   `Record: ${currentGame.players[1].recordCards.length} moves, belong to ${currentGame.players[1].name}`
    // );
  } else {
    // players records equal or one of them has no record
    if (currentGame.players[0].recordCards.length == 0) {
      document.getElementById('message').innerHTML = `Record: ${currentGame.players[1].recordCards.length} moves, belong to ${currentGame.players[1].name}`
      // alert(
      //   `Record: ${currentGame.players[1].recordCards.length} moves, belong to ${currentGame.players[1].name}`
      // );
      return;
    }
    if (currentGame.players[1].recordCards.length == 0) {
      document.getElementById('message').innerHTML = `Record: ${currentGame.players[0].recordCards.length} moves, belong to ${currentGame.players[0].name}`
      // alert(
      //   `Record: ${currentGame.players[0].recordCards.length} moves, belong to ${currentGame.players[0].name}`
      // );
      return;
    }
    document.getElementById('message').innerHTML = `Record: ${currentGame.players[0].recordCards.length} moves, acheived by both players :)`
    // alert(
    //   `Record: ${currentGame.players[0].recordCards.length} moves, acheived by both players :)`
    // );
  }
}

function enableMenu() {
  const menuItems = document.querySelectorAll('[name="menuItem"]');
  let menuItemsArray = [...menuItems];
  menuItemsArray.forEach((v) => v.classList.add("menu-item-enabled"));
}

function disableMenu() {
  const menuItems = document.querySelectorAll('[name="menuItem"]');
  let menuItemsArray = [...menuItems];
  menuItemsArray.forEach((v) => v.classList.add("menu-item-disabled"));
}
