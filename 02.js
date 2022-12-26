const optIn = {
  A: "Rock",
  B: "Paper",
  C: "Scissors",
};
const optOut = {
  X: "Rock",
  Y: "Paper",
  Z: "Scissors",
};
const resultOut = {
  X: "Lose",
  Y: "Draw",
  Z: "Win",
};

const input = `
A Y
B X
C Z
`
  .trim()
  .split("\n")
  .map((s) => {
    const [inp, out] = s.split(" ");

    return {
      inp: optIn[inp],
      out: optOut[out],
      result: resultOut[out],
    };
  });

const pointsPerType = Object.fromEntries(
  Object.values(optIn).map((v, i) => [v, i + 1])
);

console.log(
  input
    .map(({ inp, out }) => {
      let score = pointsPerType[out];

      if (inp === out) return score + 3;
      if (
        (inp === "Rock" && out === "Paper") ||
        (inp === "Paper" && out === "Scissors") ||
        (inp === "Scissors" && out === "Rock")
      )
        return score + 6;
      return score;
    })
    .reduce((s, v) => s + v)
);

console.log(
  input
    .map(({ inp, result }) => {
      let score, choice;

      switch (result) {
        case "Lose":
          choice = {
            Paper: "Rock",
            Scissors: "Paper",
            Rock: "Scissors",
          }[inp];
          score = 0;
          break;
        case "Draw":
          choice = inp;
          score = 3;
          break;
        case "Win":
          choice = {
            Rock: "Paper",
            Paper: "Scissors",
            Scissors: "Rock",
          }[inp];
          score = 6;
          break;
        default:
          console.error("NO!", result);
      }
      score += pointsPerType[choice];
      return score;
    })
    .reduce((s, v) => s + v)
);
