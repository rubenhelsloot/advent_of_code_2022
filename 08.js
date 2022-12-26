const input = `30373
25512
65332
33549
35390`;

const grid = input.split("\n").map((row) => row.split("").map(Number));

const isVisibleGrid = grid.map((row) => row.slice().fill(false));

/**
 * Get the other values in the line and see if they are all smaller
 */
const getTreesInDirection = (row, col, dir) => {
  switch (dir) {
    case "top":
      return grid.slice(0, row).map((r) => r[col]);
    case "left":
      return grid[row].slice(0, col);
    case "right":
      return grid[row].slice(col + 1);
    case "bottom":
      return grid.slice(row + 1).map((r) => r[col]);
  }
};

const isTreeVisibleFrom = (row, col, dir) =>
  getTreesInDirection(row, col, dir).every((v) => v < grid[row][col]);

// From the top-left
for (let row = 0; row < grid[0].length; row++) {
  for (let col = 0; col < grid.length; col++) {
    if (
      // Check is outer edge
      row === 0 ||
      col === 0 ||
      isTreeVisibleFrom(row, col, "top") ||
      isTreeVisibleFrom(row, col, "left")
    ) {
      isVisibleGrid[row][col] = true;
    }
  }
}

const getNumberOfVisibleTrees = (trees, val) => {
  const firstBlockingTreeIdx = trees.findIndex((v) => v >= val);
  return firstBlockingTreeIdx === -1 ? trees.length : firstBlockingTreeIdx + 1;
};

const getTreeScore = (row, col) => {
  const val = grid[row][col];

  return [
    // Reverse to match the perspective of the tree
    getTreesInDirection(row, col, "top").reverse(),
    getTreesInDirection(row, col, "left").reverse(),
    getTreesInDirection(row, col, "bottom"),
    getTreesInDirection(row, col, "right"),
  ]
    .map((trees) => getNumberOfVisibleTrees(trees, val))
    .reduce((s, v) => s * v);
};

// From the bottom-right
for (let row = grid[0].length - 1; row >= 0; row--) {
  for (let col = grid.length - 1; col >= 0; col--) {
    // Check is outer edge
    if (
      row === grid[0].length - 1 ||
      col === grid.length - 1 ||
      isTreeVisibleFrom(row, col, "bottom") ||
      isTreeVisibleFrom(row, col, "right")
    ) {
      isVisibleGrid[row][col] = true;
    }
  }
}

console.log(
  "Part 1",
  isVisibleGrid
    .map((row) => row.reduce((s, v) => s + v))
    .reduce((s, v) => s + v)
);

const scoreGrid = grid.map((row) => row.slice().fill(0));

// Drop the outermost edge, view score = 0
for (let row = 1; row < grid[0].length - 1; row++) {
  for (let col = 1; col < grid.length - 1; col++) {
    scoreGrid[row][col] = getTreeScore(row, col);
  }
}

// console.log(scoreGrid);
console.log("Part 2", Math.max(...scoreGrid.flat()));
