function printGameGrid() {
  gameWindow.innerHTML = "";
  let j = 0;
  for (let i = 0; i < width * width; i++) {
    const gameGridCell = document.createElement("div");
    gameGridCell.classList.add("grid-item", "flex");
    gameWindow.appendChild(gameGridCell);
  }
}

function printSnake() {
  snake.forEach((index) => {
    gridArray[index].innerHTML = "";
    let snakeBody = document.createElement("div");
    snakeBody.classList.add("snake-body");
    gridArray[index].appendChild(snakeBody);
    if (snake.indexOf(index) == snake.length - 1) {
      let eyes = document.createElement("img");
      eyes.src = "../snake/assets/eyes.png";
      eyes.setAttribute("id", "eyes-img");
      snakeBody.appendChild(eyes);
    }
  });
}

function deleteSnake() {
  snake.forEach((index) => {
    gridArray[index].innerHTML = "";
  });
}

//Funzione che genera una posizione casuale in cui far comparire il frutto
//la function ritornerà le coordinate del frutto
function spawnFruit() {
  let fruitSpawnSpace;
  //variabile che controllerà se effettivamente qualcosa è nella posizione
  //in cui mi appare il frutto
  let freeSpace = true;
  do {
    freeSpace = true;
    fruitSpawnSpace = Math.floor(Math.random() * width * width);
    snake.forEach((index) => {
      if (fruitSpawnSpace === index) freeSpace = false;
    });
  } while (!freeSpace);

  let fruitImg = document.createElement("img");
  fruitImg.src = "../snake/assets/apple-3155.png";
  fruitImg.setAttribute("id", "fruit-img");
  gridArray[fruitSpawnSpace].appendChild(fruitImg);
  return fruitSpawnSpace;
}

//function che 'muove' il serpente
function snakeMove() {
  lock = true;
  let length = snake.length;
  //difficoltà progressiva
  switch (length) {
    case 3:
      interval = 500;
      pointModifier = 1;
      break;
    case 5:
      interval = 450;
      pointModifier = 1.5;
      break;
    case 9:
      interval = 400;
      pointModifier = 2;
      break;
    case 14:
      interval = 350;
      pointModifier = 2.5;
      break;
    case 18:
      interval = 300;
      pointModifier = 3;
      break;
    case 22:
      interval = 250;
      pointModifier = 3.5;
      break;
    case 25:
      interval = 200;
      pointModifier = 4;
      break;
    case 30:
      interval = 100;
      pointModifier = 5;
      break;
  }

  let gameTimeout = setTimeout(snakeMove, interval);
  deleteSnake();
  let head = snake[length - 1];
  if (canMove(head, movement, width)) {
    let tail = snake.shift();
    snake.push(head + movement);
    if (head + movement == fruitLocation) {
      points += 100 * pointModifier;
      pointsDisplay.innerText = `Punteggio: ${points}`;
      fruitLocation = spawnFruit();
      snake.unshift(tail);
    }
  } else {
    clearTimeout(gameTimeout);
    let gameOverScreen = document.createElement("div");
    gameOverScreen.innerText = "Hai Perso!";
    if (points > highScore) {
      highScore = points;
      highScoreDisplay.innerText = `High Score: ${highScore}`;
    }
    gameOverScreen.classList.add("game-over-screen");
    gameOverScreen.setAttribute("id", "game-over");
    gameWindow.appendChild(gameOverScreen);
    gameBtn.classList.add("none");
    startBtn.classList.remove("none");
  }
  printSnake();
}

//function che controlla che effettivamente il serpente possa effettuare quel movimento
function canMove(head, movement, width) {
  let noBonk = true;
  let movedHead = head + movement;
  if (
    movedHead >= width * width ||
    movedHead < 0 ||
    snake.indexOf(movedHead) != -1 ||
    (head % width == width - 1 && movedHead % width == 0) ||
    (head % width == 0 && movedHead % width == width - 1)
  ) {
    noBonk = false;
  }
  return noBonk;
}

let gameWindow = document.getElementById("game-window");
let width = 18;
let snake = [0, 1, 2];
let movement = 1;
let fruitLocation;
let points = 0;
let pointModifier = 1;
let pointsDisplay = document.getElementById("points-window");
pointsDisplay.innerText = "Punteggio: 000";
let highScore = 0;
let highScoreDisplay = document.getElementById("high-score");
highScoreDisplay.innerText = "High Score: 000";
let gameCounter = 0;
printGameGrid();
let gridArray = document.getElementsByClassName("grid-item");
printSnake();
fruitLocation = spawnFruit();
let interval = 500;
let lock = true;

let startBtn = document.getElementById("start-btn");
let gameBtn = document.getElementById("game-btn");
startBtn.addEventListener("click", () => {
  //se non è la prima partita riporto tutto alla situazione iniziale
  if (gameCounter != 0) {
    deleteSnake();
    interval = 500;
    points = 0;
    pointModifier = 1;
    movement = 1;
    snake = [0, 1, 2];
    gridArray[fruitLocation].innerHTML = "";
    printSnake();
    fruitLocation = spawnFruit();
    document.getElementById("game-over").remove();
  }
  gameCounter++;
  startBtn.classList.add("none");
  gameBtn.classList.remove("none");
  setTimeout(snakeMove, interval);
});

//Bottoni a schermo coi loro event listener
let leftBtn = document.getElementById("left-btn");
let rightBtn = document.getElementById("right-btn");
let downBtn = document.getElementById("down-btn");
let upBtn = document.getElementById("up-btn");
//Event listener dei bottoni che cambiano movimento serpente
leftBtn.addEventListener("click", () => {
  if (movement != 1 && lock) {
    lock = false;
    movement = -1;
  }
});
rightBtn.addEventListener("click", () => {
  if (movement != -1 && lock) {
    lock = false;
    movement = 1;
  }
});
upBtn.addEventListener("click", () => {
  if (movement != width && lock) {
    lock = false;
    movement = -width;
  }
});
downBtn.addEventListener("click", () => {
  if (movement != -width && lock) {
    lock = false;
    movement = width;
  }
});
//Event listener per i keypress
document.addEventListener("keydown", (event) => {
  console.log("hai premuto la freccetta:", event.code);
  event.preventDefault();
  switch (event.code) {
    case "ArrowLeft":
      document.getElementById("left-btn").click();
      break;
    case "ArrowUp":
      document.getElementById("up-btn").click();
      break;
    case "ArrowRight":
      document.getElementById("right-btn").click();
      break;
    case "ArrowDown":
      document.getElementById("down-btn").click();
      break;
  }
});
