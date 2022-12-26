const stackInput = `
    [D]
[N] [C]
[Z] [M] [P]
 1   2   3
`;

const moves = `move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const stackLines = stackInput.split("\n").filter(Boolean).slice(0, -1);
// Create N empty stacks
const stacks = Array.from(
  stackLines[stackLines.length - 1].matchAll(/\[/g)
).reduce((obj, _stack, i) => {
  obj[i + 1] = [];
  return obj;
}, {});
// Loop over stacklines in reverse order
stackLines
  .slice()
  .reverse()
  .forEach((line) => {
    for (let idx = 0; idx <= line.length; idx += 4) {
      const block = line.slice(idx, idx + 3);
      const letter = block[1];
      if (letter !== " ") stacks[idx / 4 + 1].push(letter);
    }
  });
console.log(Object.values(stacks).map(v => v.join('')).join('\n'));
console.log('----');

moves.split('\n').forEach(sentence => {
  // console.log(sentence);
  const [, qty, , from, , to] = sentence.split(' ');

  const fromStack = stacks[Number(from)];
  const crates = fromStack.splice(fromStack.length - Number(qty), Number(qty));

  const toStack = stacks[Number(to)];
  toStack.push(...crates);
});

console.log(Object.values(stacks).map(v => v.join('')).join('\n'));
console.log('tops', Object.values(stacks).map(stack => stack[stack.length - 1]).join(''));