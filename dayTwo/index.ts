import { PathOrFileDescriptor } from "fs";
import { parseInput } from "../utilities/parser";

const RED_TOTAL = 12;
const GREEN_TOTAL = 13;
const BLUE_TOTAL = 14;

interface Bag {
  id: number;
  red: number[];
  green: number[];
  blue: number[];
  possible: boolean;
}

export function run(filename: PathOrFileDescriptor) {
  const start = Date.now();
  const arr = parseInput(filename);

  const bags = parseBags(arr);

  const partOne = bags.reduce((a, b) => {
    if (b.possible) return a + b.id;
    return a;
  }, 0);

  console.log("Part 1: ", partOne);

  const powers = getPowers(bags);
  const partTwo = powers.reduce((a, b) => a + b);

  console.log("Part 2: ", partTwo);
  console.log(`Execution time: ${Date.now() - start}ms`);
}

function parseBags(input: string[]): Bag[] {
  return input.map((line) => {
    const [gameId, sets] = line.split(": ");
    const [_name, id] = gameId.split(" ");
    const bag: Bag = {
      id: parseInt(id, 10),
      red: [],
      green: [],
      blue: [],
      possible: false,
    };
    sets.split("; ").forEach((set) => {
      set.split(", ").forEach((handful) => {
        const [num, colour] = handful.split(" ");

        switch (colour) {
          case "red":
            bag.red.push(parseInt(num, 10));
            break;
          case "green":
            bag.green.push(parseInt(num, 10));
            break;
          case "blue":
            bag.blue.push(parseInt(num, 10));
            break;
        }
      });
    });
    bag.possible = getValidity(bag);

    return bag;
  });
}

function getValidity(bag: Bag): boolean {
  if (bag.green.some((handful) => handful > GREEN_TOTAL)) {
    return false;
  }
  if (bag.red.some((handful) => handful > RED_TOTAL)) {
    return false;
  }
  if (bag.blue.some((handful) => handful > BLUE_TOTAL)) {
    return false;
  }
  return true;
}

function getPowers(bags: Bag[]): number[] {
  return bags.map((bag) => {
    const minRed = Math.max(...bag.red);
    const minGreen = Math.max(...bag.green);
    const minBlue = Math.max(...bag.blue);
    return minRed * minBlue * minGreen;
  });
}

run("dayTwo/input.txt");
