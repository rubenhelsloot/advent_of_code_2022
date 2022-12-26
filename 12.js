const isTesting = false;

const input = isTesting
  ? `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`
  : ``;

const getIndexOfChar = (char) => {
  const y = grid.findIndex((row) => row.includes(char));
  const x = grid[y].indexOf(char);
  return { x, y };
};

const grid = input.split("\n").map((row) => row.split(""));

const start = getIndexOfChar("S");
const end = getIndexOfChar("E");

const charA = "a".charCodeAt(0);
grid[start.y][start.x] = "a";
grid[end.y][end.x] = "z";
const numGrid = grid.map((row) => row.map((l) => l.charCodeAt(0) - charA));

const toStr = (coords) => JSON.stringify(coords);
const fromStr = (coords) => JSON.parse(coords);

const getNeighbours = ({ x, y }) => {
  const neighbours = [];
  if (x > 0) neighbours.push({ x: x - 1, y });
  if (x < grid[0].length - 1) neighbours.push({ x: x + 1, y });
  if (y > 0) neighbours.push({ x, y: y - 1 });
  if (y < grid.length - 1) neighbours.push({ x, y: y + 1 });

  return neighbours;
};

const stepGrid = Array.from(grid).map(() => Array.from(grid[0]).fill(Infinity));

const recurse = (coord, nSteps) => {
  if (stepGrid[coord.y][coord.x] <= nSteps) return;

  stepGrid[coord.y][coord.x] = nSteps;

  getNeighbours(coord).forEach((neighbour) => {
    if (numGrid[neighbour.y][neighbour.x] >= numGrid[coord.y][coord.x] - 1)
      recurse(neighbour, nSteps + 1);
  });
};

recurse(end, 0);
console.log("Part 1", stepGrid[start.y][start.x]);

let bestScore = stepGrid[start.y][start.x];
numGrid.forEach((row, y) => {
  row.forEach((cell, x) => {
    if (cell === 0 && stepGrid[y][x] < bestScore) {
      bestScore = stepGrid[y][x];
    }
  });
});
console.log("Part 2", bestScore);
