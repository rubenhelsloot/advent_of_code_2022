const input = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

const commands = input.split("\n");

const partOne = () => {
  let result = 0;
  let x = 1;
  let cycle = 0;

  commands.forEach((cmd) => {
    const [op, amount] = cmd.split(" ");

    for (let i = 0; i < (cmd === "noop" ? 1 : 2); i++) {
      cycle++;
      if ((cycle - 20) % 40 === 0) {
        console.log(`Cycle ${cycle}: ${cycle * x}`);
        result += cycle * x;
      }
    }

    if (op === "addx") {
      x += Number(amount);
    }
  });

  return result;
};

console.log("Part1", partOne());

const partTwo = () => {
  let x = 1;
  let cycle = 0;
  let currCrtRow = "";

  const handleCycle = () => {
    const pixelToDraw = currCrtRow.length;
    currCrtRow += Math.abs(x - pixelToDraw) <= 1 ? "#" : ".";

    cycle++;
    if (cycle % 40 === 0) {
      console.log(currCrtRow);
      currCrtRow = "";
    }
  };

  commands.forEach((cmd) => {
    const [op, amount] = cmd.split(" ");

    for (let i = 0; i < (cmd === "noop" ? 1 : 2); i++) {
      handleCycle();
    }

    if (op === "addx") {
      x += Number(amount);
    }
  });
};

partTwo();
