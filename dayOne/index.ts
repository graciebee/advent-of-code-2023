import { PathOrFileDescriptor } from "fs";
import { parseInput } from "../utilities/parser";

export function run(filename: PathOrFileDescriptor) {
  const start = Date.now();
  const arr = parseInput(filename);

  const numberArray = arr.map((calibrationText) => {
    const first = returnFirstDigit(calibrationText.split(""));
    const last = returnFirstDigit(calibrationText.split("").reverse());
    return parseInt(first + last);
  });
  const partOne = numberArray.reduce((a, b) => a + b);

  console.log("Part one: ", partOne);

  const spelledNumberArray = arr.map((calibrationText) => {
    const first = returnFirstSpelledDigit(calibrationText);
    const last = returnLastSpelledDigit(
      calibrationText.split("").reverse().join("")
    );
    return parseInt(first + last);
  });
  const partTwo = spelledNumberArray.reduce((a, b) => a + b);

  console.log("Part two: ", partTwo);
  console.log(`Execution time: ${Date.now() - start}ms`);
}

function returnFirstDigit(text: string[]): string {
  return text.find((character) => character.match("[0-9]")) || "0";
}

function returnFirstSpelledDigit(text: string): string {
  const positions = [
    { id: "1", value: findNumberPosition(text, "one", "1") },
    { id: "2", value: findNumberPosition(text, "two", "2") },
    { id: "3", value: findNumberPosition(text, "three", "3") },
    { id: "4", value: findNumberPosition(text, "four", "4") },
    { id: "5", value: findNumberPosition(text, "five", "5") },
    { id: "6", value: findNumberPosition(text, "six", "6") },
    { id: "7", value: findNumberPosition(text, "seven", "7") },
    { id: "8", value: findNumberPosition(text, "eight", "8") },
    { id: "9", value: findNumberPosition(text, "nine", "9") },
  ]
    .filter((number) => number.value !== -1)
    .sort((a, b) => {
      if (a.value > b.value) return 1;
      return -1;
    });
  return positions[0].id;
}

function returnLastSpelledDigit(text: string): string {
  const positions = [
    { id: "1", value: findNumberPosition(text, "eno", "1") },
    { id: "2", value: findNumberPosition(text, "owt", "2") },
    { id: "3", value: findNumberPosition(text, "eerht", "3") },
    { id: "4", value: findNumberPosition(text, "ruof", "4") },
    { id: "5", value: findNumberPosition(text, "evif", "5") },
    { id: "6", value: findNumberPosition(text, "xis", "6") },
    { id: "7", value: findNumberPosition(text, "neves", "7") },
    { id: "8", value: findNumberPosition(text, "thgie", "8") },
    { id: "9", value: findNumberPosition(text, "enin", "9") },
  ]
    .filter((number) => number.value !== -1)
    .sort((a, b) => {
      if (a.value > b.value) return 1;
      return -1;
    });
  return positions[0].id;
}

function findNumberPosition(
  text: string,
  match: string,
  match2: string
): number {
  const spelled = text.indexOf(match);
  const numeric = text.indexOf(match2);

  if (spelled === -1) return numeric;
  if (numeric === -1) return spelled;
  return Math.min(text.indexOf(match), text.indexOf(match2));
}

run("dayOne/input.txt");
