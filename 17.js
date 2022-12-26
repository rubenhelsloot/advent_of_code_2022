const { findLastIndex } = require("lodash");

const isTesting = false;

const input = isTesting
  ? `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`
  : "";

const shapes = [
  `####`,
  `.#.\n###\n.#.`,
  `..#\n..#\n###`,
  `#\n#\n#\n#`,
  `##\n##`,
].map((shape) =>
  shape.split("\n").map((row) => row.split("").map((v) => v === "#"))
);
const moves = input.split("");

const transpose = (arr) =>
  arr[0].map((_, colIndex) => arr.map((row) => row[colIndex]));

const canShapeMove = ({ occupiedSpaces, bottomLeft, shape, direction }) => {
  const width = shape[0].length;
  const height = shape.length;

  switch (direction) {
    case "right":
      if (bottomLeft.x + width >= 7) return false;

      return shape.every((row, i) => {
        const newXCoord = bottomLeft.x + row.lastIndexOf(true) + 1;
        const yCoord = bottomLeft.y + height - 1 - i;
        return !occupiedSpaces[yCoord][newXCoord];
      });
    case "left":
      if (bottomLeft.x <= 0) return false;

      return shape.every((row, i) => {
        const newXCoord = bottomLeft.x + row.indexOf(true) - 1;
        const yCoord = bottomLeft.y + height - 1 - i;
        return !occupiedSpaces[yCoord][newXCoord];
      });
    case "down":
      if (bottomLeft.y <= 0) return false;

      return transpose(shape).every((col, i) => {
        const newYCoord = bottomLeft.y + height - 1 - col.lastIndexOf(true) - 1;
        const xCoord = bottomLeft.x + width - 1 - i;
        return !occupiedSpaces[newYCoord][xCoord];
      });
    default:
      throw Error("Invalid direction");
  }
};

const print = (occupiedSpaces) => {
  occupiedSpaces
    .slice()
    .reverse()
    .map((row, rowIdx) => {
      if (row.includes(true)) {
        console.log(
          `${occupiedSpaces.length - rowIdx} ${row
            .map((v) => (v ? "#" : "."))
            .join("")}`
        );
      }
    });
};

const run = (maxFallenRocks) => {
  let shapeIdx = 0;
  let moveIdx = 0;
  let nFallenRocks = 0;
  let topTowerHeight = 0;
  let heightFromCycles = 0;
  let cycleFound = false;

  const towerHeights = [];
  const states = [];

  // TODO tweak or auto-grow?
  const occupiedSpaces = Array.from({
    length: 3 * Math.min(maxFallenRocks, 10_000),
  }).map(() => Array.from({ length: 7 }).fill(false));

  const getState = () => {
    const heights = occupiedSpaces[0].map((_, i) =>
      findLastIndex(occupiedSpaces, (row) => row[i])
    );

    return `${shapeIdx},${moveIdx}:${heights
      .map((h) => h - Math.min(...heights))
      .join(",")}`;
  };

  while (nFallenRocks < maxFallenRocks) {
    const shape = shapes[shapeIdx];

    // Booleans denoting if the space is occupied by rock or not
    const height = shape.length;

    let bottomLeft = { x: 2, y: topTowerHeight + 3 };

    while (true) {
      if (moves[moveIdx] === ">") {
        if (
          canShapeMove({
            occupiedSpaces,
            bottomLeft,
            shape,
            direction: "right",
          })
        ) {
          bottomLeft.x++;
        }
      } else {
        if (
          canShapeMove({ occupiedSpaces, bottomLeft, shape, direction: "left" })
        ) {
          bottomLeft.x--;
        }
      }
      moveIdx = (moveIdx + 1) % moves.length;

      if (
        canShapeMove({ occupiedSpaces, bottomLeft, shape, direction: "down" })
      ) {
        bottomLeft.y--;
        continue;
      }

      // Landed
      shape.forEach((row, rowIdx) => {
        row.forEach((v, colIdx) => {
          if (!v) return;
          occupiedSpaces[bottomLeft.y + (height - 1) - rowIdx][
            bottomLeft.x + colIdx
          ] = true;
        });
      });
      break;
    }

    nFallenRocks++;
    shapeIdx = (shapeIdx + 1) % shapes.length;
    topTowerHeight =
      findLastIndex(occupiedSpaces, (row) => row.includes(true)) + 1;
    towerHeights.push(topTowerHeight);

    if (cycleFound) continue;

    const state = getState();
    if (!states.includes(state)) {
      states.push(state);
      continue;
    }

    // Found cycle
    cycleFound = true;

    const cycleStart = states.indexOf(state);
    const cycleLength = nFallenRocks - cycleStart - 1;
    const cycleHeight = topTowerHeight - towerHeights[cycleStart];
    const nRepititions = Math.floor(
      (maxFallenRocks - nFallenRocks) / cycleLength
    );
    heightFromCycles = nRepititions * cycleHeight;
    nFallenRocks += nRepititions * cycleLength;

    console.log("Cycle found!", [cycleStart, cycleStart + cycleLength], "->", {
      length: cycleLength,
      height: cycleHeight,
      repetitions: nRepititions,
      addedHeight: heightFromCycles,
      remainder: maxFallenRocks - nFallenRocks,
    });
  }

  return topTowerHeight + heightFromCycles;
};

console.log("Part 1", run(2022));
console.log("Part 2", run(1_000_000_000_000));
