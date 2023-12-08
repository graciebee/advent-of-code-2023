import { PathOrFileDescriptor } from "fs";
import { parseInput } from "../utilities/parser";

enum HandType {
  FiveOfAKind = 6,
  FourOfAKind = 5,
  FullHouse = 4,
  ThreeOfAKind = 3,
  TwoPair = 2,
  OnePair = 1,
  HighCard = 0,
}

const CARD_VALUES: Record<string, number> = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

const NEW_CARD_VALUES: Record<string, number> = {
  J: 1,
  "1": 2,
  "2": 3,
  "3": 4,
  "4": 5,
  "5": 6,
  "6": 7,
  "7": 8,
  "8": 9,
  "9": 10,
  T: 11,
  Q: 12,
  K: 13,
  A: 14,
};

interface Hand {
  bet: number;
  type: HandType;
  value: string;
}

export function run(filename: PathOrFileDescriptor) {
  const start = Date.now();
  const arr = parseInput(filename);

  const hands = parseHands(arr, false);

  const groupedHands = hands.reduce((acc, hand) => {
    if (acc[hand.type]) acc[hand.type].push(hand);
    else acc[hand.type] = [hand];
    return acc;
  }, {} as { [key: string]: Hand[] });

  Object.keys(groupedHands).forEach((key) => {
    groupedHands[key].sort(compareHands);
  });

  let rank = 1;

  const winnings: number[] = [];
  for (let i = 0; i < 7; i++) {
    if (groupedHands[i]) {
      winnings.push(
        groupedHands[i].reduce((acc, hand) => {
          return (acc += rank++ * hand.bet);
        }, 0)
      );
    }
  }
  const partOne = winnings.reduce((a, b) => a + b);
  console.log("Part 1:", partOne);
  console.log(`Execution time: ${Date.now() - start}ms`);

  const partTwoHands = parseHands(arr, true);

  const groupedHandsTwo = partTwoHands.reduce((acc, hand) => {
    if (acc[hand.type]) acc[hand.type].push(hand);
    else acc[hand.type] = [hand];
    return acc;
  }, {} as { [key: string]: Hand[] });

  Object.keys(groupedHandsTwo).forEach((key) => {
    groupedHandsTwo[key].sort(compareHandsTwo);
  });

  rank = 1;

  const winningsTwo: number[] = [];
  for (let i = 0; i < 7; i++) {
    if (groupedHandsTwo[i]) {
      winningsTwo.push(
        groupedHandsTwo[i].reduce((acc, hand) => {
          return (acc += rank++ * hand.bet);
        }, 0)
      );
    }
  }
  const partTwo = winningsTwo.reduce((a, b) => a + b);
  console.log("Part 2:", partTwo);
  console.log(`Execution time: ${Date.now() - start}ms`);
}

function compareHands(a: Hand, b: Hand): number {
  let index = 0;
  while (index < 5) {
    if (CARD_VALUES[a.value[index]] < CARD_VALUES[b.value[index]]) {
      return -1;
    }
    if (CARD_VALUES[a.value[index]] > CARD_VALUES[b.value[index]]) {
      return 1;
    }
    index++;
  }
  return 0;
}

function compareHandsTwo(a: Hand, b: Hand): number {
  let index = 0;
  while (index < 5) {
    if (NEW_CARD_VALUES[a.value[index]] < NEW_CARD_VALUES[b.value[index]]) {
      return -1;
    }
    if (NEW_CARD_VALUES[a.value[index]] > NEW_CARD_VALUES[b.value[index]]) {
      return 1;
    }
    index++;
  }
  return 0;
}

function parseHands(lines: string[], isPartTwo: boolean): Hand[] {
  return lines.map((line) => {
    const [value, bet] = line.split(" ");
    return {
      value,
      bet: parseInt(bet, 10),
      type: getHandType(value.split(""), isPartTwo),
    };
  });
}

function getHandType(cards: string[], isPartTwo: boolean): HandType {
  const hand: { [key: string]: number } = {};
  cards.forEach((card) => {
    if (hand[card]) {
      hand[card] += 1;
    } else {
      hand[card] = 1;
    }
  });

  if (isPartTwo) {
    if (Object.keys(hand).find((key) => key === "J")) {
      if (hand["J"] === 5) return HandType.FiveOfAKind;
      let keyOfMost = "J";
      Object.keys(hand).forEach((key) => {
        if (key !== "J" && (keyOfMost === "J" || hand[key] > hand[keyOfMost]))
          keyOfMost = key;
      });
      hand[keyOfMost] += hand["J"];
      delete hand["J"];
    }
  }
  if (Object.keys(hand).length === 1) {
    return HandType.FiveOfAKind;
  }
  if (Object.keys(hand).length === 5) {
    return HandType.HighCard;
  }
  if (Object.keys(hand).length === 2) {
    if (Object.keys(hand).find((key) => hand[key] === 4)) {
      return HandType.FourOfAKind;
    }
    return HandType.FullHouse;
  }
  if (Object.keys(hand).length === 3) {
    if (Object.keys(hand).find((key) => hand[key] === 3)) {
      return HandType.ThreeOfAKind;
    }
    return HandType.TwoPair;
  }
  return HandType.OnePair;
}

run("daySeven/input.txt");
