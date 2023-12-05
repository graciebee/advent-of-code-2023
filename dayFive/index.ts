import { PathOrFileDescriptor } from "fs";
import { parseInput } from "../utilities/parser";

interface SeedMap {
  source: number;
  destination: number;
  change: number;
  range: number;
}

interface SeedRange {
  source: number;
  range: number;
}

export function run(filename: PathOrFileDescriptor) {
  const start = Date.now();
  const arr = parseInput(filename);

  const seeds = arr[0]
    .split(": ")[1]
    .split(" ")
    .map((seed) => parseInt(seed, 10));

  const maps = parseMaps(arr);

  const routes: number[][] = seeds.map((seed) => [seed]);

  maps.forEach((map) => {
    routes.forEach((route) => {
      const currSeed = route[route.length - 1];
      const matchingRange = map.find(
        (seedMap) =>
          seedMap.source <= currSeed &&
          seedMap.source + seedMap.range > currSeed
      );

      route.push(matchingRange ? currSeed + matchingRange.change : currSeed);
    });
  });

  const partOne = Math.min(...routes.map((route) => route[route.length - 1]));

  console.log("Part 1: ", partOne);
  console.log(`Execution time: ${Date.now() - start}ms`);

  const seedRanges: SeedRange[] = [];

  const seedLine = arr[0].split(": ")[1].split(" ");
  while (seedLine.length) {
    const range = parseInt(seedLine.pop()!, 10);
    const source = parseInt(seedLine.pop()!, 10);
    seedRanges.push({ range, source });
  }

  const locationsSorted = maps
    .pop()!
    .sort((a, b) => b.destination - a.destination);

  let currentLocationRange = locationsSorted.pop()!;
  while (locationsSorted.length) {
    for (let i = 0; i < currentLocationRange.range; i++) {
      const initialDestination = currentLocationRange.destination + i;
      let currSource = currentLocationRange.source + i;
      for (let j = maps.length - 1; j >= 0; j--) {
        const matchedRange = maps[j].find(
          (map) =>
            map.destination <= currSource &&
            map.destination + map.range > currSource
        );
        currSource = matchedRange
          ? currSource - matchedRange.change
          : currSource;
      }
      const matchingSeed = seedRanges.find(
        (range) =>
          range.source <= currSource && range.source + range.range > currSource
      );
      if (matchingSeed) {
        console.log("Part 2:", initialDestination);
        locationsSorted.splice(0, locationsSorted.length - 1);
        break;
      }
    }
    currentLocationRange = locationsSorted.pop()!;
  }

  console.log(`Execution time: ${Date.now() - start}ms`);
}

function parseMaps(arr: string[]): SeedMap[][] {
  const seedMaps: SeedMap[][] = [];

  let currMap: SeedMap[] = [];

  for (let i = 2; i < arr.length; i++) {
    if (arr[i] === "") {
      seedMaps.push(currMap);
      currMap = [];
    } else if (arr[i].split(" ")[0].match("[0-9]")) {
      const [destination, source, range] = arr[i]
        .split(" ")
        .map((stringNum) => parseInt(stringNum, 10));

      currMap.push({
        source,
        destination,
        change: destination - source,
        range,
      });
    }
  }
  seedMaps.push(currMap);
  seedMaps.forEach((seedMap) => {
    seedMap.sort((a, b) => {
      if (a.source + a.change < b.source + b.range) return -1;
      return 1;
    });
  });
  return seedMaps;
}

run("dayFive/input.txt");
