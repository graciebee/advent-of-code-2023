import { PathOrFileDescriptor } from "fs";
import { parseInput } from "../utilities/parser";

export function run(filename: PathOrFileDescriptor) {
  const start = Date.now();
  const arr = parseInput(filename);
  const numberArray = getNumbers(arr);

  const wonMatches = numberArray.map((card) => {
    const winningNumbers = card[0].sort((a, b) => (a > b ? 1 : -1));
    const numbers = card[1].sort((a, b) => (a > b ? 1 : -1));

    const matches: number[] = [];
    while (numbers.length) {
      const num = numbers.pop()!;
      while (num <= winningNumbers[winningNumbers.length - 1]) {
        const winningNum = winningNumbers.pop();
        if (num === winningNum) {
          matches.push(winningNum);
        }
      }
    }
    return matches.length;
  });

  const partOne = wonMatches.reduce((acc, num) => {
    if (num === 0) return acc;
    return acc + Math.pow(2, num - 1);
  }, 0);

  console.log("Part 1:", partOne);

  const unprocessed: number[] = new Array(arr.length).fill(1);
  const processed: number[] = new Array(arr.length).fill(0);
  let index = 0;
  while (unprocessed.some((num) => num > 0)) {
    if (unprocessed[index] === 0) {
      index++;
      if (index === unprocessed.length) {
        index = 0;
      }
    }
    for (let i = 1; i <= wonMatches[index]; i++) {
      unprocessed[index + i]++;
    }
    unprocessed[index]--;
    processed[index]++;
  }

  const partTwo = processed.reduce((acc, num) => acc + num);
  console.log("Part 2:", partTwo);
  console.log(`Execution time: ${Date.now() - start}ms`);
}

function getNumbers(arr: string[]): number[][][] {
  return arr.map((card) => {
    return card
      .split(": ")[1]
      .split(" | ")
      .map((nums) =>
        nums.split(" ").reduce((acc, num) => {
          if (num !== "") {
            acc.push(parseInt(num, 10));
          }
          return acc;
        }, [] as number[])
      );
  });
}

run("dayFour/input.txt");
