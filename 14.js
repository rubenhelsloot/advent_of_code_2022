const { cloneDeep } = require("lodash");

const isTesting = false;
const input = isTesting
  ? `498,4 -> 498,6 -> 496,6
  503,4 -> 502,4 -> 502,9 -> 494,9`
  : ``;

const sandOrigin = { x: 500, y: 0 };
const rockPaths = input
  .trim()
  .split("\n")
  .map((s) =>
    s
      .trim()
      .split(" -> ")
      .map((coordStr) => {
        const [x, y] = coordStr.split(",").map(Number);
        return { x, y };
      })
  );

const gridSpan = {
  x: {
    min: Math.min(sandOrigin.x, ...rockPaths.flat().map((c) => c.x)) - 250,
    max: Math.max(sandOrigin.x, ...rockPaths.flat().map((c) => c.x)) + 150,
  },
  y: {
    min: Math.min(sandOrigin.y, ...rockPaths.flat().map((c) => c.y)),
    max: Math.max(sandOrigin.y, ...rockPaths.flat().map((c) => c.y)),
  },
};

const grid = Array.from({ length: gridSpan.y.max - gridSpan.y.min + 1 }).map(
  () => Array.from({ length: gridSpan.x.max - gridSpan.x.min + 1 }).fill(".")
);

const fillGrid = (from, to) => {
  if (from.x === to.x) {
    for (let y = Math.min(from.y, to.y); y <= Math.max(from.y, to.y); y++) {
      grid[y - gridSpan.y.min][from.x - gridSpan.x.min] = "x";
    }
  } else if (from.y === to.y) {
    for (let x = Math.min(from.x, to.x); x <= Math.max(from.x, to.x); x++) {
      grid[from.y - gridSpan.y.min][x - gridSpan.x.min] = "x";
    }
  } else {
    throw Error("x or y must be equal");
  }
};

rockPaths.forEach(([start, ...points]) => {
  let prev = start;

  points.forEach((p) => {
    fillGrid(prev, p);
    prev = p;
  });
});

const run = (grid) => {
  let end = false;
  let cnt = 0;
  while (!end) {
    const newSand = { ...sandOrigin };
    while (true) {
      if (
        newSand.x < gridSpan.x.min ||
        newSand.x > gridSpan.x.max ||
        newSand.y >= grid.length - 1
      ) {
        console.log("Abyss!");
        end = true;
        break;
      }

      if (
        grid[newSand.y - gridSpan.y.min + 1][newSand.x - gridSpan.x.min] === "."
      ) {
        newSand.y++;
      } else if (
        grid[newSand.y - gridSpan.y.min + 1][newSand.x - gridSpan.x.min - 1] ===
        "."
      ) {
        newSand.x--;
        newSand.y++;
      } else if (
        grid[newSand.y - gridSpan.y.min + 1][newSand.x - gridSpan.x.min + 1] ===
        "."
      ) {
        newSand.x++;
        newSand.y++;
      } else {
        grid[newSand.y - gridSpan.y.min][newSand.x - gridSpan.x.min] = "o";
        cnt++;

        if (newSand.x === sandOrigin.x && newSand.y === sandOrigin.y) {
          console.log("end!");
          end = true;
          break;
        }

        if (cnt % grid[0].length === 0) console.log(grid.map((r) => r.join("")).join("\n"));
        break;
      }
    }
  }

  console.log(grid.map((r) => r.join("")).join("\n"));
  return cnt;
};

const partOne = () => console.log("Part 1", run(cloneDeep(grid)));
partOne();

const partTwo = () => {
  const gridWithFloor = cloneDeep(grid);
  gridWithFloor.push(
    Array.from({ length: grid[0].length }).fill("."),
    Array.from({ length: grid[0].length }).fill("x")
  );
  console.log("Part 2", run(gridWithFloor));
};
partTwo();

// const partOne = () => {
//   const rows = input.split("\n");
//   const pairs = [];
//   for (let i = 0; i < rows.length; i += 3) {
//     pairs.push({ left: eval(rows[i]), right: eval(rows[i + 1]) });
//   }

//   console.log(
//     "Part 1",
//     pairs
//       .map(({ left, right }, i) =>
//         isCorrectOrder(left, right) === 1 ? i + 1 : 0
//       )
//       .filter((v) => v != 0)
//       .reduce((s, v) => s + v)
//   );
// };

// partOne();
