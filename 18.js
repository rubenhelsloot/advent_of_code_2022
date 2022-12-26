const { sum, cloneDeep } = require("lodash");

const isTesting = false;

const input = isTesting
  ? `2,2,2
  1,2,2
  3,2,2
  2,1,2
  2,3,2
  2,2,1
  2,2,3
  2,2,4
  2,2,6
  1,2,5
  3,2,5
  2,1,5
  2,3,5`
  : ``;

const points = input
  .trim()
  .split("\n")
  .map((row) => {
    const [x, y, z] = row.trim().split(",").map(Number);
    return { x, y, z };
  });

const grid = Array.from({
  length: Math.max(...points.map((p) => p.x)) + 1,
}).map(() =>
  Array.from({ length: Math.max(...points.map((p) => p.y)) + 1 }).map(() =>
    Array.from({ length: Math.max(...points.map((p) => p.z)) + 1 }).fill(null)
  )
);

points.forEach(({ x, y, z }) => {
  grid[x][y][z] = true;
});

const safeGet = (arr, ...vals) => {
  let curr = arr;
  for (let v of vals) {
    curr = curr[v];
    if (curr === undefined) return undefined;
  }
  return curr;
};

console.log(
  "Part 1",
  sum(
    points.map(
      ({ x, y, z }) =>
        !safeGet(grid, x - 1, y, z) +
        !safeGet(grid, x + 1, y, z) +
        !safeGet(grid, x, y - 1, z) +
        !safeGet(grid, x, y + 1, z) +
        !safeGet(grid, x, y, z - 1) +
        !safeGet(grid, x, y, z + 1)
    )
  )
);

const steamGrid = cloneDeep(grid);

const stack = grid[0].flatMap((row, y) => row.map((_, z) => ({ x: 0, y, z })));
while (stack.length) {
  const { x, y, z } = stack.shift();
  if (safeGet(steamGrid, x, y, z) === null) {
    // Not processed yet!
    steamGrid[x][y][z] = false;
    stack.push(
      { x: x - 1, y, z },
      { x: x + 1, y, z },
      { x, y: y - 1, z },
      { x, y: y + 1, z },
      { x, y, z: z - 1 },
      { x, y, z: z + 1 }
    );
  }
}

console.log(
  "Part 2",
  sum(
    points.map(({ x, y, z }) =>
      sum(
        [
          [x - 1, y, z],
          [x + 1, y, z],
          [x, y - 1, z],
          [x, y + 1, z],
          [x, y, z - 1],
          [x, y, z + 1],
        ].map((args) => {
          const v = safeGet(steamGrid, ...args);
          return v === undefined || v === false;
        })
      )
    )
  )
);
