const isTesting = false;

const input = isTesting
  ? `root: pppw + sjmn
  dbpl: 5
  cczh: sllz + lgvd
  zczc: 2
  ptdq: humn - dvpt
  dvpt: 3
  lfqf: 4
  humn: 5
  ljgn: 2
  sjmn: drzm * dbpl
  sllz: 4
  pppw: cczh / lfqf
  lgvd: ljgn * ptdq
  drzm: hmdt - zczc
  hmdt: 32`
  : ``;

const monkeys = input
  .split("\n")
  .map((s) => s.trim().split(": "))
  .map(([monkey, job]) => ({
    monkey,
    job: !Number.isNaN(Number(job)) ? Number(job) : job.split(" "),
  }));

const op = (sign) => {
  switch (sign) {
    case "+":
      return (a, b) => a + b;
    case "-":
      return (a, b) => a - b;
    case "*":
      return (a, b) => a * b;
    case "/":
      return (a, b) => a / b;
  }
};

const reverseOp = (sign, knownValueIsB) => {
  switch (sign) {
    case "+":
      // X + B = C -> X = C - B
      // A + X = C -> X = C - A
      return (b, c) => c - b;
    case "-":
      // X - B = C -> X = C + B
      // A - X = C -> X = A - C
      return knownValueIsB ? (b, c) => c + b : (a, c) => a - c;
    case "*":
      // X * B = C -> X = C / B
      // A * X = C -> X = C / A
      return (b, c) => c / b;
    case "/":
      // X / B = C -> X = C * B
      // A / X = C -> X = A / C
      return knownValueIsB ? (b, c) => c * b : (a, c) => a / c;
  }
};

const willYell = (monkey, cache = {}) => {
  if (cache[monkey] === undefined) {
    const { job } = monkeys.find((m) => m.monkey === monkey);

    if (typeof job === "number") {
      cache[monkey] = job;
    } else {
      const [a, sign, b] = job;
      cache[monkey] = op(sign)(willYell(a, cache), willYell(b, cache));
    }
  }
  return cache[monkey];
};

const hasHuman = (monkey) => {
  if (monkey === "humn") return true;
  const { job } = monkeys.find((m) => m.monkey === monkey);

  if (typeof job === "number") {
    return false;
  } else {
    const [a, , b] = job;
    return hasHuman(a) || hasHuman(b);
  }
};

const yellReverse = (outerValue, monkey) => {
  if (monkey === "humn") return outerValue;
  const { job } = monkeys.find((m) => m.monkey === monkey);
  if (typeof job === "number") return job;

  const [a, sign, b] = job;
  const aHasHuman = hasHuman(a);

  const treeWithHuman = aHasHuman ? a : b;
  const valueFromNonHumanTree = willYell(aHasHuman ? b : a, {});

  const valueToMatch =
    monkey === "root"
      ? valueFromNonHumanTree
      : reverseOp(sign, aHasHuman)(valueFromNonHumanTree, outerValue);

  console.log(
    monkey,
    `human is in ${treeWithHuman} [${aHasHuman ? "A" : "B"}]`,
    aHasHuman
      ? `HUMAN ${sign} ${valueFromNonHumanTree} = ${outerValue}`
      : `${valueFromNonHumanTree} ${sign} HUMAN = ${outerValue}`,
    "->",
    `HUMAN = ${valueToMatch}`
  );

  return yellReverse(valueToMatch, treeWithHuman);
};

console.log("Part 1", willYell("root"));
console.log("Part 2", yellReverse(null, "root"));
