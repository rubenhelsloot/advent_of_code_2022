const isTesting = false;
const input = isTesting
  ? `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`
  : ``;

const isCorrectOrder = (left, right) => {
  if (!Array.isArray(left) && !Array.isArray(right)) {
    if (left < right) return 1;
    if (left > right) return -1;
    return null;
  }

  // Force arrays
  const leftArray = Array.isArray(left) ? left : [left];
  const rightArray = Array.isArray(right) ? right : [right];

  for (let i = 0; i < Math.min(leftArray.length, rightArray.length); i++) {
    const isCorrect = isCorrectOrder(leftArray[i], rightArray[i]);
    if (isCorrect !== null) {
      return isCorrect;
    }
  }
  if (leftArray.length < rightArray.length) return 1;
  if (leftArray.length > rightArray.length) return -1;
  return null; // unknown, continue to the next one
};

const partOne = () => {
  const rows = input.split("\n");
  const pairs = [];
  for (let i = 0; i < rows.length; i += 3) {
    pairs.push({ left: eval(rows[i]), right: eval(rows[i + 1]) });
  }

  console.log(
    "Part 1",
    pairs
      .map(({ left, right }, i) =>
        isCorrectOrder(left, right) === 1 ? i + 1 : 0
      )
      .filter((v) => v != 0)
      .reduce((s, v) => s + v)
  );
};

partOne();

const partTwo = () => {
  const rows = input
    .split("\n")
    .filter((r) => r.length > 0)
    .map(eval);
  const dividerA = [[2]];
  const dividerB = [[6]];
  rows.push(dividerA, dividerB);

  const sortedRows = rows.sort(isCorrectOrder).reverse();

  console.log(
    "Part 2",
    (sortedRows.indexOf(dividerA) + 1) * (sortedRows.indexOf(dividerB) + 1)
  );
};

partTwo();
