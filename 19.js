// const Solver = require("javascript-lp-solver");
const highs = require("highs")();
const { range, sum } = require("lodash");

const isTesting = false;

const input = isTesting
  ? `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`
  : ``;

const blueprints = input
  .trim()
  .split("\n")
  .map((row) => {
    const sentences = row
      .substring(0, row.length - 1)
      .split(": ")[1]
      .split(". ");
    return sentences.map((sentence) => {
      const [, type, , , ...costParts] = sentence.split(" ");

      const cost = {};
      while (costParts.length) {
        const amount = Number(costParts.shift());
        cost[costParts.shift()] = amount;
        costParts.shift(); // Drop the "and"
      }

      return { type, cost };
    });
  });

const printResult = ({ Status, Columns }, maxTime) => {
  console.log(Status, Columns[`inv_geode_${maxTime}`]);

  range(1, maxTime + 1).forEach((t) => {
    const inv = {};
    let build = "";
    bp.forEach(({ type }) => {
      inv[type] = Math.round(Columns[`inv_${type}_${t}`].Primal);
      if (Math.round(Columns[`build_${type}_${t}`].Primal)) build += type;
    });
    console.log(`${t}`.padStart(2), build.padEnd(4), "\t", inv);
  });
};

const formulateProblem = (bp, maxTime) => {
  // const objectiveFnValues = [];
  const buildConstraints = [];
  const inventoryConstraints = [];
  const buildVariables = [];
  const inventoryVariables = [];

  range(1, maxTime + 1).forEach((t) => {
    // objectiveFnValues.push(`${maxTime - t} build_geode_${t}`);

    const currentVariables = bp.map(({ type }) => `build_${type}_${t}`);
    buildConstraints.push(`${currentVariables.join(" + ")} <= 1`);

    bp.forEach(({ type }) => {
      inventoryVariables.push(`inv_${type}_${t}`);

      const prevInventory = t > 1 ? `inv_${type}_${t - 1}` : 0;
      const fromStartingRobot = type === "ore" ? 1 : 0;
      const fromRobots =
        buildVariables
          .filter(
            (v) =>
              v.startsWith(`build_${type}_`) && v !== `build_${type}_${t - 1}`
          )
          .join(" - ") || 0;
      const spentBuilding =
        bp
          .filter((r) => !!r.cost[type])
          .map((r) => `${r.cost[type]} build_${r.type}_${t}`)
          .join(" + ") || 0;

      inventoryConstraints.push(
        `inv_${type}_${t} - ${prevInventory} - ${fromRobots} + ${spentBuilding} = ${fromStartingRobot}`
      );
    });

    buildVariables.push(...currentVariables);
  });

  return `
  Maximize obj:
    inv_geode_${maxTime}
  Subject To
    ${buildConstraints.join("\n  ")}
    ${inventoryConstraints.join("\n  ")}
  Bounds
    ${inventoryVariables.map((v) => `${v} >= 0`).join("\n  ")}
  Binary
    ${buildVariables.join("\n  ")}
  End
  `;
};

const run = (blueprints, maxTime) =>
  Promise.resolve(highs).then((h) =>
    blueprints.map((bp, i) => {
      const problem = formulateProblem(bp, maxTime);
      const status = h.solve(problem);

      if (status.Status !== "Optimal") {
        printResult(status, maxTime);
        return 0;
      }

      const result = Math.round(status.Columns[`inv_geode_${maxTime}`].Primal);
      console.log(`Blueprint ${i + 1}: ${result}`);
      return result;
    })
  );

run(blueprints, 24).then((res) =>
  console.log("Part 1", sum(res.map((v, i) => (i + 1) * v)))
);
run(blueprints.slice(0, 3), 32).then((res) =>
  console.log(
    "Part 2",
    res.reduce((s, v) => s * v, 1)
  )
);
