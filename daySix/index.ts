import { PathOrFileDescriptor } from "fs";
import { parseInput } from "../utilities/parser";

export function run(filename: PathOrFileDescriptor) {
  const start = Date.now();
  const arr = parseInput(filename);

  const sets = arr.map((line) =>
    line
      .split(":")[1]
      .split(" ")
      .filter((character) => character !== "")
  );
  const races = sets[0].map((time, index) => [
    parseInt(time, 10),
    parseInt(sets[1][index], 10),
  ]);

  const wins = getWinsFromRaces(races);

  const partOne = wins.reduce((acc, wins) => acc * wins);

  console.log("Part 1:", partOne);

  const time = parseInt(
    arr[0]
      .split(":")[1]
      .split(" ")
      .filter((character) => character != "")
      .join(""),
    10
  );
  const distance = parseInt(
    arr[1]
      .split(":")[1]
      .split(" ")
      .filter((character) => character != "")
      .join(""),
    10
  );

  let minTime = -1;
  let maxTime = -1;
  let speed = 0;

  while (minTime < 0) {
    if (speed * (time - speed) > distance) {
      minTime = speed;
    } else {
      speed++;
    }
  }

  speed = time;
  while (maxTime < 0) {
    if (speed * (time - speed) > distance) {
      maxTime = speed;
    } else {
      speed--;
    }
  }

  const partTwo = maxTime - minTime + 1;

  console.log("Part 2:", partTwo);
  console.log(`Execution time: ${Date.now() - start}ms`);
}

function getWinsFromRaces(races: number[][]): number[] {
  const wins = races.map(([time, distance]) => {
    let winTally = 0;

    for (let i = 1; i < time; i++) {
      if (i * (time - i) > distance) {
        winTally++;
      }
    }
    return winTally;
  });
  return wins;
}

run("daySix/input.txt");
