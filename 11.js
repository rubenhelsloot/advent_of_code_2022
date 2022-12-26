const { cloneDeep } = require("lodash");

const input = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

const monkeys = input.split("\n\n").map((monkey) => {
  const [, startingItemsRow, operationRow, testRow, trueRow, falseRow] = monkey
    .split("\n")
    .map((s) => s.split(": ")[1]);

  const items = startingItemsRow.split(", ").map(Number);
  const operation = operationRow.split(" = ")[1];
  const testDivisibleBy = Number(testRow.split(" ").reverse()[0]);
  const ifTrue = Number(trueRow.split(" ").reverse()[0]);
  const ifFalse = Number(falseRow.split(" ").reverse()[0]);

  return { items, operation, testDivisibleBy, ifTrue, ifFalse };
});
const modAll = monkeys.map(m => m.testDivisibleBy).reduce((s, v) => s * v, 1);

const partOne = (monkeys) => {
  const doRoundForMonkey = (monkey) => {
    monkey.items.forEach((old) => {
      let worryLevel = Math.floor(eval(monkey.operation) / 3);

      monkeys[
        worryLevel % monkey.testDivisibleBy === 0
          ? monkey.ifTrue
          : monkey.ifFalse
      ].items.push(worryLevel);
    });

    monkey.items = [];
  };

  const inspectedItems = Array.from(monkeys).fill(0);
  for (let round = 0; round < 20; round++) {
    monkeys.forEach((monkey, idx) => {
      inspectedItems[idx] += monkey.items.length;
      doRoundForMonkey(monkey);
    });
  }

  const [a, b] = inspectedItems.sort((a, b) => a - b).reverse();
  console.log("Part 1", a * b);
};

partOne(cloneDeep(monkeys));

const partTwo = (monkeys) => {
  const doRoundForMonkey = (monkey) => {
    monkey.items.forEach((old) => {
      let worryLevel = eval(monkey.operation) % modAll;

      monkeys[
        worryLevel % monkey.testDivisibleBy === 0
          ? monkey.ifTrue
          : monkey.ifFalse
      ].items.push(worryLevel);
    });

    monkey.items = [];
  };

  const inspectedItems = Array.from(monkeys).fill(0);
  for (let round = 0; round < 10_000; round++) {
    monkeys.forEach((monkey, idx) => {
      inspectedItems[idx] += monkey.items.length;
      doRoundForMonkey(monkey);
    });
  }

  const [a, b] = inspectedItems.sort((a, b) => a - b).reverse();
  console.log("Part 2", a * b);
};

partTwo(cloneDeep(monkeys));
