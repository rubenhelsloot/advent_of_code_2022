const input = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const moves = input.split("\n").map((row) => {
  const [direction, nSteps] = row.split(" ");
  return { direction, nSteps: Number(nSteps) };
});

const move = (currentPos, directions) => {
  let newPos = { ...currentPos };

  if (directions.includes('L')) newPos.x -= 1;
  else if (directions.includes('R')) newPos.x += 1;

  if (directions.includes('U')) newPos.y += 1;
  else if (directions.includes('D')) newPos.y -= 1;

  return newPos;
}

const distance = (pointA, pointB) => {
  const distanceX = Math.abs(pointA.x - pointB.x);
  const distanceY = Math.abs(pointA.y - pointB.y);
  return Math.max(distanceX, distanceY);
}

const partOne = () => {
  let currHead = { x: 0, y: 0 };
  let currTail = { x: 0, y: 0 };
  let visited = new Set(["0,0"]);
  moves.forEach(({ direction, nSteps }) => {
    for(let nStepsLeft = nSteps; nStepsLeft > 0; nStepsLeft--) {
      currHead = move(currHead, direction);

      if (distance(currHead, currTail) <= 1) continue;

      // Move tail to keep up with head
      let tailDirection = '';
      if (currHead.y !== currTail.y)
        tailDirection += currHead.y > currTail.y ? 'U' : 'D';

      if (currHead.x !== currTail.x)
        tailDirection += currHead.x > currTail.x ? 'R' : 'L';

      currTail = move(currTail, tailDirection);
      visited.add(`${currTail.x},${currTail.y}`);
    }
  });

  console.log("Part 1", visited.size);
};

const partTwo = (length) => {
  const nodes = Array.from({ length }).map(() => ({ x: 0, y: 0 }));
  let visited = new Set(["0,0"]);
  moves.forEach(({ direction, nSteps }) => {
    for(let nStepsLeft = nSteps; nStepsLeft > 0; nStepsLeft--) {

      // Move the first node
      nodes[0] = move(nodes[0], direction);

      // Move each node to keep up with the previous one one
      for(let idx = 1; idx < nodes.length; idx++) {
        const head = nodes[idx - 1];
        let tail = nodes[idx];

        if (distance(head, tail) <= 1) continue;

        let tailDirection = '';
        if (head.y !== tail.y)
          tailDirection += head.y > tail.y ? 'U' : 'D';

        if (head.x !== tail.x)
          tailDirection += head.x > tail.x ? 'R' : 'L';

        nodes[idx] = tail = move(tail, tailDirection);
        if (idx === nodes.length - 1) visited.add(`${tail.x},${tail.y}`);
      };
    };
  });

  console.log("Part 2", visited.size);
};

partOne();
partTwo(10);