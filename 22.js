const { findLastIndex, cloneDeep, sum } = require("lodash");

const isTesting = false;

let input;
if (isTesting) {
  input = `
        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5
`;
} else {
  input = ``;
}

const rows = input.split("\n");
const maxLength = Math.max(...rows.slice(1, -3).map((r) => r.length));
const board = rows
  .slice(1, -3)
  .map((row) => row.padEnd(maxLength, " ").split(""));
const commandString = rows[rows.length - 2];

const start = {
  x: board[0].indexOf("."),
  y: 0,
  f: ">",
};

const safeGet = (arr, ...vals) => {
  let curr = arr;
  for (let v of vals) {
    curr = curr[v];
    if (curr === undefined) return undefined;
  }
  return curr;
};

const score = ({ x, y, f }) => 1000 * (y + 1) + 4 * (x + 1) + ">v<^".indexOf(f);

const isInsideBounds = ({ x, y }) => (safeGet(board, y, x) ?? " ") !== " ";

const isExteriorPoint = ({ x, y }) =>
  !isInsideBounds({ x, y: y - 1 }) ||
  !isInsideBounds({ x, y: y + 1 }) ||
  !isInsideBounds({ x: x - 1, y }) ||
  !isInsideBounds({ x: x + 1, y });

const getNextCoord = ({ x, y, f }) => {
  switch (f) {
    case ">":
      return isInsideBounds({ x: x + 1, y })
        ? { x: x + 1, y, f }
        : // Wrap around
          { x: board[y].findIndex((c) => c !== " "), y, f };
    case "<":
      return isInsideBounds({ x: x - 1, y })
        ? { x: x - 1, y, f }
        : // Wrap around
          { x: findLastIndex(board[y], (c) => c !== " "), y, f };
    case "^":
      return isInsideBounds({ x, y: y - 1 })
        ? { x, y: y - 1, f }
        : // Wrap around
          { x, y: findLastIndex(board, (row) => row[x] !== " "), f };
    case "v":
      return isInsideBounds({ x, y: y + 1 })
        ? { x, y: y + 1, f }
        : // Wrap around
          { x, y: board.findIndex((row) => row[x] !== " "), f };
  }
};

const getNewFacing = (facing, turn) => {
  switch (facing) {
    case ">":
      return turn === "L" ? "^" : "v";
    case "<":
      return turn === "L" ? "v" : "^";
    case "^":
      return turn === "L" ? "<" : ">";
    case "v":
      return turn === "L" ? ">" : "<";
  }
};

const getDirectionToInterior = ({ x, y, f }) => {
  const fRight = getNewFacing(f, "R");
  const nextRight = getNextCoord({ x, y, f: fRight });

  return Math.abs(nextRight.x - x) + Math.abs(nextRight.y - y) === 1
    ? fRight
    : getNewFacing(f, "L");
};

const getDirectionFromInterior = (coord) =>
  getNewFacing(getNewFacing(getDirectionToInterior(coord), "L"), "L");

const walkPerimiter = (coord) => {
  const straightAhead = getNextCoord(coord);

  // Adjacent, can continue in the same direction
  if (
    (isExteriorPoint(straightAhead) || getInnerCornerType(straightAhead)) &&
    Math.abs(straightAhead.x - coord.x) +
      Math.abs(straightAhead.y - coord.y) ===
      1
  )
    return straightAhead;

  for (let turnDir of ["R", "L"]) {
    const newFacing = getNewFacing(coord.f, turnDir);
    const next = getNextCoord({ ...coord, f: newFacing });

    if (
      isExteriorPoint(next) &&
      Math.abs(next.x - coord.x) + Math.abs(next.y - coord.y) === 1
    )
      return { ...coord, f: newFacing };
  }
  throw Error("NOPE");
};

const getInnerCornerType = ({ x, y }) => {
  if (isExteriorPoint({ x, y })) return;

  const diagonals = [
    !isInsideBounds({ x: x - 1, y: y - 1 }),
    !isInsideBounds({ x: x - 1, y: y + 1 }),
    !isInsideBounds({ x: x + 1, y: y - 1 }),
    !isInsideBounds({ x: x + 1, y: y + 1 }),
  ];

  if (sum(diagonals) !== 1) return;
  return ["UL", "DL", "UR", "DR"][diagonals.indexOf(true)];
};

const cornerMap = cloneDeep(board);
const wrapAroundMap = {};
board.forEach((row, y) => {
  row.forEach((cell, x) => {
    if (cell === " ") return;

    const coords = { x, y };
    const innerCornerType = getInnerCornerType(coords);

    if (innerCornerType === undefined) return;
    cornerMap[y][x] = "X";

    let a = { x, y, f: innerCornerType.startsWith("U") ? "^" : "v" };
    let b = { x, y, f: innerCornerType.endsWith("L") ? "<" : ">" };

    // Walk up the cube and zip up the corner
    let side = 1;
    while (true) {
      const nextA = walkPerimiter(a);
      const nextB = walkPerimiter(b);

      if (isTesting && (nextA.f !== a.f || nextB.f !== b.f)) {
        console.log(`====== ${side} ======`);
        console.log(cornerMap.map((r) => r.join("")).join("\n"));
        side += 1;
      }

      if (nextA.f !== a.f && nextB.f !== b.f) break;

      a = nextA;
      b = nextB;

      wrapAroundMap[JSON.stringify({ ...a, f: getDirectionFromInterior(a) })] =
        JSON.stringify({ ...b, f: getDirectionToInterior(b) });
      wrapAroundMap[JSON.stringify({ ...b, f: getDirectionFromInterior(b) })] =
        JSON.stringify({ ...a, f: getDirectionToInterior(a) });

      cornerMap[a.y][a.x] = side;
      cornerMap[b.y][b.x] = side;
    }
  });
});

const getNextCoordWrapAround = ({ x, y, f }) => {
  switch (f) {
    case ">":
      if (isInsideBounds({ x: x + 1, y })) return { x: x + 1, y, f };
      break;
    case "<":
      if (isInsideBounds({ x: x - 1, y })) return { x: x - 1, y, f };
      break;
    case "^":
      if (isInsideBounds({ x, y: y - 1 })) return { x, y: y - 1, f };
      break;
    case "v":
      if (isInsideBounds({ x, y: y + 1 })) return { x, y: y + 1, f };
      break;
  }

  // Wrap around
  return JSON.parse(wrapAroundMap[JSON.stringify({ x, y, f })]);
};

const batches = [...commandString.match(/\d+[LR]?/g)];

const run = (nextCoordFn) => {
  const boardMap = cloneDeep(board);
  const lastPosition = batches.reduce(
    (currentPosition, batch, i) => {
      let remainingMoves = parseInt(batch, 10);

      while (remainingMoves > 0) {
        const nextPosition = nextCoordFn(currentPosition);
        if (board[nextPosition.y][nextPosition.x] !== ".") break;

        currentPosition = nextPosition;
        boardMap[currentPosition.y][currentPosition.x] = currentPosition.f;
        remainingMoves--;
      }

      // No turn after the last move
      if (i === batches.length - 1) return currentPosition;

      const turnDirection = batch[batch.length - 1];
      currentPosition.f = getNewFacing(currentPosition.f, turnDirection);
      boardMap[currentPosition.y][currentPosition.x] = currentPosition.f;

      if (isTesting) {
        console.log(boardMap.map((r) => r.join("")).join("\n"));
        console.log(`+++++ ${i} ++++++`);
      }
      return currentPosition;
    },
    { ...start }
  );
  return lastPosition;
};

console.log("Part 1", score(run(getNextCoord)));
console.log("Part 2", score(run(getNextCoordWrapAround)));
