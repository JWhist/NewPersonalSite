const MAZE_ROWS = Math.floor(document.querySelector("#home").clientHeight);
const MAZE_COLS = Math.floor(document.querySelector("#home").clientWidth) / 5;
console.log(MAZE_ROWS, MAZE_COLS);
const maze = document.querySelector(".maze");
grid = new Array(MAZE_ROWS).fill(0).map(() => new Array(MAZE_COLS).fill(0));

function buildGrid() {
  for (let i = 0; i < MAZE_ROWS; i++) {
    const row = document.createElement("tr");
    row.classList.add("row");
    for (let j = 0; j < MAZE_COLS; j++) {
      const cell = document.createElement("td");
      cell.classList.add("cell", "wall");
      cell.classList.add(`cell-${i}-${j}`);
      grid[i][j] = -1;
      row.appendChild(cell);
    }
    maze.appendChild(row);
  }
}

function getDocNode(x, y) {
  return document.querySelector(`.cell-${x}-${y}`);
}

function neighbors(cell) {
  const up = [cell[0], cell[1] - 1];
  const down = [cell[0], cell[1] + 1];
  const left = [cell[0] - 1, cell[1]];
  const right = [cell[0] + 1, cell[1]];
  return [up, right, down, left];
}

function removeWall(x, y) {
  grid[x][y] = 0;
  getDocNode(x, y).classList.remove("wall");
}

function random_int(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
}

function isValid(cell) {
  return (
    cell[0] > 0 &&
    cell[0] < grid.length - 1 &&
    cell[1] > 0 &&
    cell[1] < grid[0].length - 1
  );
}

buildGrid();

let currentCell = [1, 1];
removeWall(currentCell[0], currentCell[1]);
getDocNode(currentCell[0], currentCell[1]).classList.add("visited");
grid[currentCell[0]][currentCell[1]] = 1;
let wall_list = [];
let list = neighbors(currentCell);

for (let i = 0; i < list.length; i++) {
  if (
    list[i][0] > 0 &&
    list[i][0] < grid.length - 1 &&
    list[i][1] > 0 &&
    list[i][1] < grid[0].length - 1
  ) {
    wall_list.push(list[i]);
  }
}

const interval = window.setInterval(function () {
  while (true) {
    if (wall_list.length == 0) {
      clearInterval(interval);
      return;
    }

    let index = random_int(0, wall_list.length);
    let wall = wall_list[index];
    wall_list.splice(index, 1);
    let cell_pair;

    if (wall[0] % 2 == 0)
      cell_pair = [
        [wall[0] - 1, wall[1]],
        [wall[0] + 1, wall[1]],
      ];
    else
      cell_pair = [
        [wall[0], wall[1] - 1],
        [wall[0], wall[1] + 1],
      ];

    let new_cell;
    let valid = false;

    if (grid[cell_pair[0][0]][cell_pair[0][1]] < 1) {
      new_cell = cell_pair[0];
      valid = true;
    } else if (grid[cell_pair[1][0]][cell_pair[1][1]] < 1) {
      new_cell = cell_pair[1];

      valid = true;
    }

    if (valid) {
      if (isValid(wall)) {
        getDocNode(wall[0], wall[1]).classList.add("visited");
        removeWall(wall[0], wall[1]);
      }
      if (isValid(new_cell)) {
        getDocNode(new_cell[0], new_cell[1]).classList.add("visited");
        removeWall(new_cell[0], new_cell[1]);
      }
      grid[new_cell[0]][new_cell[1]] = 1;
      let list = neighbors(new_cell, 1);

      for (let i = 0; i < list.length; i++)
        if (
          list[i][0] > 0 &&
          list[i][0] < grid.length - 1 &&
          list[i][1] > 0 &&
          list[i][1] < grid[0].length - 1
        ) {
          wall_list.push(list[i]);
        }
      return;
    }
  }
}, 28);
