const { isEqual } = require("lodash");

const isTesting = false;

let input;
if (isTesting) {
  input = `
  ....#..
  ..###.#
  #...#.#
  .#...##
  #.###..
  ##.#.##
  .#..#..`;
} else {
  input = ``;
}

const elves = input
  .trim()
  .split("\n")
  .flatMap((row, y) =>
    row
      .trim()
      .split("")
      .map((c, x) => {
        if (c === "#") return { x, y };
      })
  )
  .filter(Boolean);

const isSpaceOccupied = (coord) =>
  elves.some(({ x, y }) => x === coord.x && y === coord.y);

const getSurroundingSpaces = ({ x, y }) => ({
  NW: { x: x - 1, y: y - 1 },
  W: { x: x - 1, y },
  SW: { x: x - 1, y: y + 1 },
  S: { x, y: y + 1 },
  SE: { x: x + 1, y: y + 1 },
  E: { x: x + 1, y },
  NE: { x: x + 1, y: y - 1 },
  N: { x, y: y - 1 },
});

let dirs = "NSWE".split("");

let round = 0;
while (true) {
  const proposedMoves = [];
  elves.forEach((elf, i) => {
    const surroundingSpaces = getSurroundingSpaces(elf);

    // Don't move if every space is empty
    if (Object.values(surroundingSpaces).every((c) => !isSpaceOccupied(c)))
      return;

    for (let dir of dirs) {
      const dirsToCheck = Object.keys(surroundingSpaces).filter((k) =>
        k.includes(dir)
      );

      // If all fields to check are empty, propose to move that way
      if (dirsToCheck.every((d) => !isSpaceOccupied(surroundingSpaces[d]))) {
        proposedMoves.push({ elf: i, moveTo: surroundingSpaces[dir] });
        return;
      }
    }
  });

  proposedMoves.forEach(({ elf, moveTo }) => {
    // Two elves wanted to move to this spot
    if (isTesting) console.log(`Elf ${elf}: move to ${JSON.stringify(moveTo)}`);
    if (proposedMoves.some((e) => e.elf !== elf && isEqual(moveTo, e.moveTo))) {
      const blocking = proposedMoves.find(
        (e) => e.elf !== elf && isEqual(moveTo, e.moveTo)
      ).elf;
      if (isTesting)
        console.log(`Elf ${elf}: skipping duplicate move by elf ${blocking}`);
      return;
    }

    elves[elf] = moveTo;
  });

  // First dir to the last
  dirs.push(dirs.shift());

  console.log(`==== round ${round + 1} ====`);

  if (isTesting) {
    const xOffset = Math.min(...elves.map((e) => e.x));
    const yOffset = Math.min(...elves.map((e) => e.y));

    const drawMap = Array.from({
      length: Math.max(...elves.map((e) => e.y)) - yOffset + 1,
    }).map(() =>
      Array.from({
        length: Math.max(...elves.map((e) => e.x)) - xOffset + 1,
      }).fill(".")
    );

    elves.forEach(({ x, y }) => (drawMap[y - yOffset][x - xOffset] = "#"));

    console.log(drawMap.map((row) => row.join("")).join("\n"));
  }

  const score =
    (Math.max(...elves.map((e) => e.x)) -
      Math.min(...elves.map((e) => e.x)) +
      1) *
      (Math.max(...elves.map((e) => e.y)) -
        Math.min(...elves.map((e) => e.y)) +
        1) -
    elves.length;
  console.log("Score", score);

  if (
    proposedMoves.length === 0 ||
    proposedMoves.every(({ elf, moveTo }) =>
      proposedMoves.some((e) => e.elf !== elf && isEqual(moveTo, e.moveTo))
    )
  ) {
    console.log("No elf moved!")
    break;
  }

  round++;
}
