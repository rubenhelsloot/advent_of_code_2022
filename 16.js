const { sortBy, maxBy, intersection } = require("lodash");

const isTesting = false;
let input;

if (isTesting) {
  input = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
  Valve BB has flow rate=13; tunnels lead to valves CC, AA
  Valve CC has flow rate=2; tunnels lead to valves DD, BB
  Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
  Valve EE has flow rate=3; tunnels lead to valves FF, DD
  Valve FF has flow rate=0; tunnels lead to valves EE, GG
  Valve GG has flow rate=0; tunnels lead to valves FF, HH
  Valve HH has flow rate=22; tunnel leads to valve GG
  Valve II has flow rate=0; tunnels lead to valves AA, JJ
  Valve JJ has flow rate=21; tunnel leads to valve II`;
} else {
  input = ``;
}

const regex =
  /^Valve ([A-Z]*) has flow rate=(\d*); tunnels? leads? to valves? (.*)$/;

const valves = {};
input
  .split("\n")
  .map((row) => row.trim())
  .forEach((row) => {
    const match = row.match(regex);

    const valve = match[1];
    const flow = Number(match[2]);
    const tunnels = match[3].split(", ");

    return (valves[valve] = { flow, tunnels });
  });

// Floyd-Warshall
const distances = {};
Object.keys(valves).forEach((valve) => {
  distances[valve] = Object.fromEntries(
    Object.keys(valves).map((other) => [other, Infinity])
  );
  distances[valve][valve] = 0;

  valves[valve].tunnels.forEach((t) => {
    distances[valve][t] = 1;
  });
});

Object.keys(valves).forEach((C) => {
  Object.keys(valves).forEach((A) => {
    Object.keys(valves).forEach((B) => {
      const distanceThroughC = distances[A][C] + distances[C][B];
      distances[A][B] = Math.min(distanceThroughC, distances[A][B]);
    });
  });
});

const usefulValves = Object.fromEntries(
  Object.entries(valves).filter(([, { flow }]) => flow > 0)
);

const runDp = (totalTime) => {
  const stack = [
    {
      minutesRemaining: totalTime,
      currentPosition: "AA",
      openValves: [],
      score: 0,
    },
  ];

  const completePaths = [];
  const allPaths = [];

  while (stack.length > 0) {
    const path = stack.shift();
    const { minutesRemaining, currentPosition, openValves, score } = path;

    let hasNew = false;
    Object.keys(usefulValves)
      .filter((v) => !openValves.includes(v))
      .forEach((valve) => {
        const timeCost = distances[currentPosition][valve] + 1;
        if (timeCost < minutesRemaining) {
          hasNew = true;
          stack.push({
            minutesRemaining: minutesRemaining - timeCost,
            currentPosition: valve,
            openValves: [...openValves, valve],
            score: score + valves[valve].flow * (minutesRemaining - timeCost),
          });
        }
      });

    if (!hasNew) completePaths.push(path);
    allPaths.push(path);
  }

  return { completePaths, allPaths };
};

console.log("Part 1", maxBy(runDp(30).completePaths, "score"));

const paths = sortBy(runDp(26).allPaths, "score").reverse();

const allDualPaths = [];
let currentMax = 0;
paths.forEach((pathOne, i) => {
  for (let pathTwo of paths.slice(i + 1)) {
    if (pathOne.score + pathTwo.score <= currentMax) break;
    if (intersection(pathOne.openValves, pathTwo.openValves).length === 0)
      allDualPaths.push({
        pathOne,
        pathTwo,
        score: (currentMax = pathOne.score + pathTwo.score),
      });
  }
});

console.log("Part 2", maxBy(allDualPaths, "score"));
