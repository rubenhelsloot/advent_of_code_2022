const { sortBy } = require("lodash");

const input = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`
  .split("\n")
  .map((row) => row.split(",").map((part) => {
    const [start, end] = part.split("-").map(Number);
    return { start, end };
  }));

console.log(
  "One contains another",
  input.filter((ranges) => {
    const [r1, r2] = sortBy(ranges, ['start', (v) => -v.end]);

    // We know r1.start <= r2.start because of sorting
    // So we have a match if r1.start <= r2.start <= r2.end <= r1.end
    return r2.end <= r1.end;
  }).length
);

console.log(
  "Overlap at all",
  input.filter((ranges) => {
    const [r1, r2] = sortBy(ranges, 'start');

    // We know r1.start <= r2.start because of sorting
    // So we have a match if r1.start <= r2.start <= r1.end
    return r2.start <= r1.end;
  }).length
);

