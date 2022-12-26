const { sum } = require("lodash");

const isTesting = false;

const input = isTesting
  ? `1
2
-3
3
-2
0
4`
  : ``;

const coords = input.trim().split("\n").map(Number);

const nextPosition = (position, nCoords) => {
  let res = position % (nCoords - 1);
  if (res <= 0) res += nCoords - 1;
  return res;
};

const getScore = (arr) => {
  // console.log(arr.map((e) => e.value).join(", "));

  const zeroPos = arr.findIndex((r) => r.value === 0);
  return sum(
    [1000, 2000, 3000].map((v) => arr[(v + zeroPos) % arr.length].value)
  );
};

const mix = (values, nReps) => {
  const result = values.map((value, originalIdx) => ({
    value,
    originalIdx,
  }));

  for (let rep = 0; rep < nReps; rep++) {
    values.forEach((_, i) => {
      const nextIdx = result.findIndex((e) => e.originalIdx === i);
      const next = result.splice(nextIdx, 1)[0];
      result.splice(nextPosition(nextIdx + next.value, values.length), 0, next);
    });
  }

  return result;
};

console.log("Part 1", getScore(mix(coords, 1)));
console.log(
  "Part 2",
  getScore(
    mix(
      coords.map((v) => v * 811589153),
      10
    )
  )
);
