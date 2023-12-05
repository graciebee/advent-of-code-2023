import { PathOrFileDescriptor } from "fs";
import { parseInput } from "../utilities/parser";

interface EngineNumber {
  xMin: number;
  xMax: number;
  y: number;
  value: string;
}

interface Symbol {
  x: number;
  y: number;
  value: string;
}

export function run(filename: PathOrFileDescriptor) {
  const start = Date.now();
  const arr = parseInput(filename);

  const [symbols, gears, engineNumbers] = parseEngine(arr);

  const partNumbers = filterEngineNumbers(symbols, engineNumbers);

  const partOne = partNumbers.reduce((a, b) => a + parseInt(b.value, 10), 0);
  console.log("Part 1: ", partOne);

  const gearRatios = getGearRatios(gears, engineNumbers);

  const partTwo = gearRatios.reduce((acc, ratio) => acc + ratio);
  console.log("Part 2: ", partTwo);
  console.log(`Execution time: ${Date.now() - start}ms`);
}

export function getGearRatios(
  gears: Symbol[],
  partNumbers: EngineNumber[]
): number[] {
  return gears.reduce((acc, gear) => {
    const adjacentPartNumbers: number[] = [];
    partNumbers.forEach((partNumber) => {
      const adjacentOnY =
        partNumber.y >= gear.y - 1 && partNumber.y <= gear.y + 1;
      const adjacentOnX =
        (partNumber.xMax >= gear.x - 1 && partNumber.xMax <= gear.x + 1) ||
        (partNumber.xMin >= gear.x - 1 && partNumber.xMin <= gear.x + 1);
      if (adjacentOnX && adjacentOnY) {
        adjacentPartNumbers.push(parseInt(partNumber.value));
      }
    });
    if (adjacentPartNumbers.length === 2) {
      acc.push(adjacentPartNumbers[0] * adjacentPartNumbers[1]);
    }
    return acc;
  }, [] as number[]);
}

export function filterEngineNumbers(
  symbols: string[][],
  engineNumbers: EngineNumber[]
): EngineNumber[] {
  return engineNumbers.filter((engineNumber) => {
    for (let y = engineNumber.y - 1; y <= engineNumber.y + 1; y++) {
      if (y < 0 || y >= symbols.length) {
        continue;
      }
      for (let x = engineNumber.xMin - 1; x <= engineNumber.xMax + 1; x++) {
        if (x < 0 || x >= symbols[y].length) {
          continue;
        }
        if (symbols[y][x]) {
          return true;
        }
      }
    }
  });
}

export function parseEngine(
  arr: string[]
): [string[][], Symbol[], EngineNumber[]] {
  const symbols: string[][] = new Array(arr.length);
  const gears: Symbol[] = [];
  const engineNumbers: EngineNumber[] = [];

  arr.forEach((line, lineIndex) => {
    symbols[lineIndex] = new Array(line.length);
    let currY = -1;
    let currXMin = -1;
    let currVal = "";

    line.split("").forEach((character, characterIndex) => {
      if (character !== ".") {
        if (character.match("[0-9]")) {
          currY = lineIndex;
          currVal = currVal !== "" ? currVal + character : character;
          if (currXMin < 0) {
            currXMin = characterIndex;
          }
        } else {
          if (currXMin !== -1) {
            engineNumbers.push({
              xMin: currXMin,
              xMax: characterIndex - 1,
              y: currY,
              value: currVal,
            });
            currY = -1;
            currVal = "";
            currXMin = -1;
          }
          symbols[lineIndex][characterIndex] = character;
          if (character === "*") {
            gears.push({ y: lineIndex, x: characterIndex, value: character });
          }
        }
      } else if (currXMin !== -1) {
        engineNumbers.push({
          xMin: currXMin,
          xMax: characterIndex - 1,
          y: currY,
          value: currVal,
        });
        currY = -1;
        currVal = "";
        currXMin = -1;
      }
    });
    if (currXMin !== -1) {
      engineNumbers.push({
        xMin: currXMin,
        xMax: line.length - 1,
        y: currY,
        value: currVal,
      });
    }
  });
  return [symbols, gears, engineNumbers];
}

run("dayThree/input.txt");
