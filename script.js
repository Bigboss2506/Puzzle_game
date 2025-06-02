let board = [];
let moves = 0;
let timer;
let seconds = 0;
let history = [];
// let mode = "number";
// let currentImage = "default";
let moveSoundEnabled = true;
let size = 4;

// const images = {
//   "default": "tiles",
//   "saitama_genos": "saitama_genos"
// };
// const images = {
//   "default": "saitama_genos"
// };



function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function isSolvable(array) {
  let invCount = 0;
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] && array[j] && array[i] > array[j]) invCount++;
    }
  }
  const gridWidth = size;
  const emptyRowFromBottom = gridWidth - Math.floor(array.indexOf(0) / gridWidth);
  if (gridWidth % 2 === 1) {
    return invCount % 2 === 0;
  } else {
    return (invCount + emptyRowFromBottom) % 2 === 1;
  }
}

function isSolved() {
  for (let i = 0; i < size * size - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[size * size - 1] === 0;
}
function toggleSize() {
  size = (size === 4) ? 3 : 4;
  init();
}


function draw() {
  const boardEl = document.getElementById("board");
  boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  boardEl.innerHTML = "";
  board.forEach((val, i) => {
    const div = document.createElement("div");
    div.className = val === 0 ? "tile empty" : "tile";

    // if (val !== 0) {
    //   if (mode === "image") {
    //     const img = document.createElement("img");
    //     img.src = `${images[currentImage]}/${val}.jpg`;
    //     img.alt = val;
    //     div.appendChild(img);
    //   } else {
    //     div.innerText = val;
    //   }
    // }

    if (val !== 0) {
  div.innerText = val;
}


    div.addEventListener("click", () => move(i));
    boardEl.appendChild(div);
  });

  // document.querySelector("button[onclick='toggleMode()']").innerText =
  //   "Режим: " + (mode === "image" ? "Картинка" : "Цифры");
}


function move(i) {
  const empty = board.indexOf(0);
  const row = Math.floor(i / size), col = i % size;
  const erow = Math.floor(empty / size), ecol = empty % size;
  if ((row === erow && Math.abs(col - ecol) === 1) ||
      (col === ecol && Math.abs(row - erow) === 1)) {
    history.push([...board]);
    [board[i], board[empty]] = [board[empty], board[i]];
    moves++;
    document.getElementById("moves").innerText = "Ходы: " + moves;
    draw();
    playMoveSound();

    if (isSolved()) {
      setTimeout(() => {
        showWinModal();
      }, 100);
    }
  }
}




function updateTimer() {
  seconds++;
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  document.getElementById("timer").innerText = m + ":" + s;
}

function init() {
  let tiles;
  let tries = 0;
  do {
    tiles = shuffle([...Array(size * size - 1).keys()].map(x => x + 1).concat(0));
    tries++;
    if (tries > 1000) {
      alert("Не удалось сгенерировать решаемую комбинацию.");
      return;
    }
  } while (!isSolvable(tiles));
  board = tiles;
  history = [];
  moves = 0;
  seconds = 0;
  document.getElementById("moves").innerText = "Ходы: 0";
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
  draw();
}

function undo() {
  if (history.length > 0) {
    board = history.pop();
    moves--;
    document.getElementById("moves").innerText = "Ходы: " + moves;
    draw();
  }
}

// function toggleMode() {
//   mode = mode === "image" ? "number" : "image";
//   draw();
// }

function showWinModal() {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  document.getElementById('winMessage').innerText = `Вы собрали картинку за ${m}:${s} и ${moves} ходов.`;
  document.getElementById('winModal').style.display = 'block';
  clearInterval(timer);
  playWinSound();
}

function restartGame() {
  document.getElementById('winModal').style.display = 'none';
  init();
}

function playMoveSound() {
  const moveSound = document.getElementById('move-sound');
  if (moveSound && moveSoundEnabled) {
    moveSound.currentTime = 0;
    moveSound.play();
  }
}

function playWinSound() {
  const winSound = document.getElementById('win-sound');
  if (winSound) {
    winSound.currentTime = 0;
    winSound.play();
  }
}


function toggleMoveSound() {
  moveSoundEnabled = !moveSoundEnabled;
}

// function changeImage(value) {
//   currentImage = value;
//   init();
// }

function changeSize(value) {
  size = parseInt(value);
  init();
}
function draw() {
  const boardEl = document.getElementById("board");
  boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  boardEl.innerHTML = "";
  board.forEach((val, i) => {
    const div = document.createElement("div");
    div.className = val === 0 ? "tile empty" : "tile";

    if (val !== 0) {
      div.innerText = val;
    }

    div.addEventListener("click", () => move(i));
    boardEl.appendChild(div);
  });
}





window.onload = init;

