const { range } = require("lodash");

const isTesting = false;

const input = isTesting
  ? `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`
  : ``;

const sensorRegEx = /^Sensor at x=(-?\d*), y=(-?\d*)/;
const beaconRegEx = /beacon is at x=(-?\d*), y=(-?\d*)$/;
const toCoords = (row, regex) => {
  const match = row.match(regex);

  return {
    x: Number(match[1]),
    y: Number(match[2]),
  };
};

const getDistance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const sensors = input.split("\n").map((row) => {
  const sensor = toCoords(row, sensorRegEx);
  const beacon = toCoords(row, beaconRegEx);

  return {
    sensor,
    beacon,
    distance: getDistance(sensor, beacon),
  };
});

const getNUnavailableSquaresInRow = (yRow) => {
  const unavailable = new Set([]);
  sensors.forEach(({ sensor, distance }) => {
    const yDiff = Math.abs(sensor.y - yRow);

    if (yDiff > distance) return;

    const xSpan = distance - yDiff;
    range(sensor.x - xSpan, sensor.x + xSpan + 1).forEach((v) =>
      unavailable.add(v)
    );
  });

  // Delete known beacons
  sensors.forEach(({ beacon }) => {
    if (beacon.y === yRow) unavailable.delete(beacon.x);
  });

  return unavailable.size;
};

console.log("Part 1", getNUnavailableSquaresInRow(isTesting ? 10 : 2_000_000));

const getOnlySquareAvailableEverywhere = (extent) => {
  const [min, max] = extent;

  for (let i = 0; i < sensors.length; i++) {
    const thisSensor = sensors[i];
    console.log(`Trying sensor`, i);

    const minX = thisSensor.sensor.x - thisSensor.distance - 1;
    const maxX = thisSensor.sensor.x + thisSensor.distance + 1;

    let currentOverlappingSensor;

    // Go along the bottom
    for (let x = Math.max(min, minX); x < thisSensor.sensor.x; x++) {
      const y = thisSensor.sensor.y + (x - minX);

      if (y > max) break;
      if (
        currentOverlappingSensor &&
        getDistance(currentOverlappingSensor.sensor, { x, y }) <=
          currentOverlappingSensor.distance
      )
        continue;

      currentOverlappingSensor = sensors.find(
        (s) => getDistance(s.sensor, { x, y }) <= s.distance
      );
      if (!currentOverlappingSensor) {
        return { x, y };
      }
    }

    for (let x = thisSensor.sensor.x; x <= Math.min(max, maxX); x++) {
      const y = thisSensor.sensor.y + (maxX - x);

      if (y > max) continue;
      if (
        currentOverlappingSensor &&
        getDistance(currentOverlappingSensor.sensor, { x, y }) <=
          currentOverlappingSensor.distance
      )
        continue;

      currentOverlappingSensor = sensors.find(
        (s) => getDistance(s.sensor, { x, y }) <= s.distance
      );
      if (!currentOverlappingSensor) {
        return { x, y };
      }
    }

    for (let x = Math.min(max, maxX); x >= thisSensor.sensor.x; x--) {
      const y = thisSensor.sensor.y - (maxX - x);

      if (y < 0) break;
      if (
        currentOverlappingSensor &&
        getDistance(currentOverlappingSensor.sensor, { x, y }) <=
          currentOverlappingSensor.distance
      )
        continue;

      currentOverlappingSensor = sensors.find(
        (s) => getDistance(s.sensor, { x, y }) <= s.distance
      );
      if (!currentOverlappingSensor) {
        return { x, y };
      }
    }

    for (let x = thisSensor.sensor.x; x >= Math.max(min, minX); x--) {
      const y = thisSensor.sensor.y - (x - minX);

      if (y < 0) break;
      if (
        currentOverlappingSensor &&
        getDistance(currentOverlappingSensor.sensor, { x, y }) <=
          currentOverlappingSensor.distance
      )
        continue;

      currentOverlappingSensor = sensors.find(
        (s) => getDistance(s.sensor, { x, y }) <= s.distance
      );
      if (!currentOverlappingSensor) {
        return { x, y };
      }
    }
  }
};

const { x, y } = getOnlySquareAvailableEverywhere([
  0,
  isTesting ? 20 : 4_000_000,
]);
console.log("Part 2", x * 4_000_000 + y);
