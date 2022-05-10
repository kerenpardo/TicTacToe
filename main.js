function Player(id, name) {
  this.id = id;
  this.name = name;
  this.cards = [];
  this.active = false;
  this.addScore = function () {
    this.pairs++;
  };

  this.myTurn = function () {
    document.getElementById(`player${id}`).classList.add("activePlayer");
  };
}

function Card(row, col, frontImg) {
  this.row = row;
  this.col = col;
  this.frontImg = frontImg;
  this.disable = function () {
    this.divElement.removeEventListener("click", flipCard);
    this.divElement.style.pointerEvents = "none";
  };
}

const board = [[], [], []];
const players = []
const card = [];
const numOfCards = 9;
let activePlayer = null;

function init() {
  for (let i = 0; i < numOfCards / 3; i++) {
   
    for (let j = 0; j < numOfCards / 3; j++) {
      let card = new Card(i, j, null);
      board[i][j] = card;
      let divElement = document.createElement('div');
      divElement.id = i + "" + j;
      divElement.classList.add('card');
      document.querySelector('#board').appendChild(divElement);
      document.querySelector('#board').classList.add('board');
    }
  }
}
init();



