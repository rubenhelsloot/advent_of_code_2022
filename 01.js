const input = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`
  .split('\n')
  .map(Number);

const nElves = input.filter((v) => v === 0).length + 1;
const counts = Array.from({ length: nElves }).fill(0);

let idx = 0;
input.forEach((row) => {
  if (row === 0) {
    idx += 1;
  } else {
    counts[idx] += row;
  }
});

console.log(Math.max(...counts));
console.log(counts.sort().reverse());
