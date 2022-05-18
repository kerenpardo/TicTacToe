const board = [[], [], []];
const players = [];
const cards = [];
const numOfCards = 9;
let activePlayer = null;
const numOfPlayers = 2;
let gameCards = []; //currentGame - array of cards
let savedGame = []; //saved game to reload - array of cards

// fields for timer
let btnStart = document.getElementById("start");
let btnStop = document.getElementById("stop");
let span = document.getElementById("span");
let timeStart, timeStop;

// Player object
function Player(id, name, cssClass) {
  this.id = id;
  this.name = name;
  this.cards = [];
  this.active = false;
  this.cssClass = cssClass;
  this.addScore = function () {
    this.pairs++;
  };
  this.showMe = function () {
    document.getElementById(
      `player${id}`
    ).innerHTML = `<div name="player" id="player1">${this.name} found ${this.cards} pairs</div>`;
  };
  this.myTurn = function () {
    document.getElementById(`player${id}`).classList.add("activePlayer");
    // this.active=true;
  };
}

// Card object
function Card(row, col, frontImg) {
  this.row = row;
  this.col = col;
  this.frontImg = frontImg;
  this.disable = function () {
    this.divElement.removeEventListener("click", showCard);
    this.divElement.style.pointerEvents = "none";
  };
}

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
}

function init() {
  for (let p = 0; p < numOfPlayers; p++) {
    let playerName = document.getElementById(`player${p + 1}`).value;
    players.push(new Player(p + 1, playerName));
  }
  players[0].cssClass = "Xcard";
  players[1].cssClass = "Ocard";

  players.forEach((v) => v.showMe());
  players[0].myTurn();
  activePlayer = players[0];
  for (let i = 0; i < numOfCards / 3; i++) {
    for (let j = 0; j < numOfCards / 3; j++) {
      let card = new Card(i, j, null);
      board[i][j] = card;
      let divElement = document.createElement("div");
      divElement.id = i + "" + j;
      divElement.classList.add("cards");
      document.querySelector("#board").appendChild(divElement);
      document.querySelector("#board").classList.add("baord");
      divElement.addEventListener("click", showCard);
      if (i == 0 || i == 1) {
        divElement.classList.add("horizontal-Line");
      }
      if (j == 0 || j == 1) {
        divElement.classList.add("vertical-Line");
      }
    }
  }
  document.querySelector("#board").removeAttribute("hidden");
}
//init();

function timer(date1, date2) {
  return (date2 - date1) / 1000;
}

/***************************** Timer *********************/
btnStart.addEventListener("click", () => {
  timeStart = Date.now();
  span.innerText = 0;
});
btnStop.addEventListener("click", () => {
  clearInterval(myVar);
}); //span.innerText= timer(timeStart,timeStop);

let myVar = setInterval(myTimer, 1000);

function myTimer() {
  const d = new Date();
  span.innerHTML = time_convert(Math.round(timer(timeStart, Date.now())));
}

function time_convert(num) {
  let hours = Math.floor(num / 3600);
  let minutes = Math.floor(num / 60);
  let seconds = num % 60;
  return hours + ":" + minutes + ":" + seconds;
}
/***************************** Timer *********************/

function showCard(e) {
  e.target.classList.add(activePlayer.cssClass);
  let curCard = cards.filter(
    (v) =>
      v.row == e.target.id.split("")[0] && v.col == e.target.id.split("")[1]
  );
  curCard.disable();
  for (p of players) {
    p.active = !p.active;
    if (activePlayer.id != p.id) {
      activePlayer = p;
      activePlayer.myTurn();
    }
  }
}
function CheckGameWon(card) {
  let x = card.row;
  let y = card.col;
  let n = numOfCards / 3;

  //check row
  for (let j = 0; j < n; j++) {
    if (board[x][j].frontImg != card.frontImg) break;
    if (j == n - 1) {
      //GAME WON
    }
  }

  //check row
  for (let i = 0; i < n; i++) {
    if (board[i][y].frontImg != card.frontImg) break;
    if (i == n - 1) {
      //GAME WON
    }
  }

  //check diag
  if (x == y) {
    for (let i = 0; i < n; i++) {
      if (board[i][i].frontImg != card.frontImg) break;
      if (i == n - 1) {
        //GAME WON
      }
    }
  }
  //check anti diag
  if (x + y == n - 1) {
    for (let i = 0; i < n; i++) {
      if (board[i][n - 1 - i].frontImg != card.frontImg) break;
      if (i == n - 1) {
        //GAME WON
      }
    }
  }
}

// }
