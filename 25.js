const { sum } = require("lodash");

const isTesting = false;

const input = isTesting
  ? `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`
  : ``;

const fromSnafu = (snafuString) =>
  sum(
    snafuString
      .split("")
      .map(
        (s, i) => ("=-012".indexOf(s) - 2) * 5 ** (snafuString.length - i - 1)
      )
  );

const toSnafu = (number) => {
  if (number === 0) return "";
  const remainder = Math.floor((number + 2) / 5);
  const mod = (number + 2) % 5;
  return toSnafu(remainder) + "=-012"[mod];
};

console.log("Part 1", toSnafu(sum(input.split("\n").map(fromSnafu))));
