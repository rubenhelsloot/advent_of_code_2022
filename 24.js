const { cloneDeep } = require("lodash");

const isTesting = false;

const input = isTesting
  ? `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`
  : ``;

const grid = input
  .trim()
  .split("\n")
  .map((row) => row.trim().split(""));

const gridSize = {
  width: grid[0].length,
  height: grid.length,
  start: { x: 1, y: 0 },
  end: { x: grid[0].length - 2, y: grid.length - 1 },
};

const startBlizzards = [];
grid.forEach((row, y) =>
  row.forEach((v, x) => {
    if ("<>v^".includes(v)) {
      startBlizzards.push({
        x,
        y,
        dir: v,
      });
    }
  })
);

const print = (blizzards) => {
  const printGrid = Array.from({ length: gridSize.height }).map(() =>
    Array.from({ length: gridSize.width }).fill(".")
  );

  printGrid[0].fill("#");
  printGrid[printGrid.length - 1].fill("#");
  printGrid.forEach((row) => {
    row[0] = "#";
    row[row.length - 1] = "#";
  });
  printGrid[0][1] = ".";
  printGrid[printGrid.length - 1][printGrid[0].length - 2] = ".";

  blizzards.forEach(({ x, y, dir }) => {
    if (printGrid[y][x] !== ".") {
      printGrid[y][x] = "<>v^".includes(printGrid[y][x])
        ? "2"
        : Number(printGrid[y][x]) + 1;
    } else {
      printGrid[y][x] = dir;
    }
  });

  console.log(printGrid.map((row) => row.join("")).join("\n"));
};

const stepEachBlizzard = (blizzards) =>
  blizzards.map(({ x: oldX, y: oldY, dir }) => {
    let y = oldY;
    let x = oldX;

    switch (dir) {
      case "<":
        x--;
        if (x === 0) x = gridSize.width - 2;
        break;
      case ">":
        x++;
        if (x === gridSize.width - 1) x = 1;
        break;
      case "^":
        y--;
        if (y === 0) y = gridSize.height - 2;
        break;
      case "v":
        y++;
        if (y === gridSize.height - 1) y = 1;
        break;
    }

    return { x, y, dir };
  });

const getFreeSpaces = (blizzards) => {
  const freeGrid = Array.from({ length: gridSize.height }).map(() =>
    Array.from({ length: gridSize.width }).fill(true)
  );

  freeGrid[0].fill(false);
  freeGrid[freeGrid.length - 1].fill(false);
  freeGrid.forEach((row) => {
    row[0] = false;
    row[row.length - 1] = false;
  });
  freeGrid[0][1] = true;
  freeGrid[freeGrid.length - 1][freeGrid[0].length - 2] = true;

  blizzards.forEach(({ x, y }) => {
    freeGrid[y][x] = false;
  });

  return freeGrid.flatMap((row, y) =>
    row
      .map((c, x) => {
        if (c) return { x, y };
      })
      .filter(Boolean)
  );
};

const nSteps = (gridSize.width - 2) * (gridSize.height - 2);
const freeSpaceCache = {
  0: getFreeSpaces(startBlizzards),
};

let currentBlizzards = cloneDeep(startBlizzards);
for (let step = 1; step < nSteps; step++) {
  currentBlizzards = stepEachBlizzard(currentBlizzards);
  freeSpaceCache[step] = getFreeSpaces(currentBlizzards);
}

const iterCache = {
  0: [JSON.stringify(gridSize.start)],
};

const doStep = () => {
  const freeSpaces = freeSpaceCache[step % nSteps];
  const prevLocations = iterCache[step - 1];

  // For each free space, check if it was reachable from the last iteration
  // and how we can get there in one step
  const reachableSpaces = freeSpaces.filter(
    ({ x, y }) =>
      prevLocations.includes(JSON.stringify({ x: x - 1, y })) || // step right
      prevLocations.includes(JSON.stringify({ x: x + 1, y })) || // step left
      prevLocations.includes(JSON.stringify({ x, y: y - 1 })) || // step down
      prevLocations.includes(JSON.stringify({ x, y: y + 1 })) || // step up
      prevLocations.includes(JSON.stringify({ x, y })) // wait
  );

  iterCache[step] = reachableSpaces.map(JSON.stringify);

  if (isTesting) {
    console.log(`==== step ${step} ====`);
    console.log(iterCache[step]);
  }
};

let step = 1;
// console.log(getKey({ x: gridSize.width - 1, y: gridSize.height, step }));
while (true) {
  doStep();
  if (iterCache[step].includes(JSON.stringify(gridSize.end))) break;
  step++;
}

console.log("Part 1", step);

iterCache[step - 1] = [JSON.stringify(gridSize.end)];
while (true) {
  doStep();
  if (iterCache[step].includes(JSON.stringify(gridSize.start))) break;
  step++;
}

iterCache[step - 1] = [JSON.stringify(gridSize.start)];
while (true) {
  doStep();
  if (iterCache[step].includes(JSON.stringify(gridSize.end))) break;
  step++;
}

console.log("Part 2", step);