import { PathOrFileDescriptor } from "fs";
import { parseInput } from "../utilities/parser";

interface DesertNode {
  left: string;
  right: string;
}
export function run(filename: PathOrFileDescriptor) {
  const start = Date.now();
  const arr = parseInput(filename);
  const instructions = arr[0].split("");
  const nodes = getNodesFromArray(arr.slice(2));

  let currentNode = "AAA";
  let steps = 0;
  while (currentNode !== "ZZZ") {
    let instruction = instructions.shift()!;
    steps++;
    currentNode =
      instruction === "L" ? nodes[currentNode].left : nodes[currentNode].right;
    instructions.push(instruction);
  }

  console.log("Part 1:", steps);

  let stepsArray: number[] = [];
  let aNodes = Object.keys(nodes).filter((key) => endsIn(key, "A"));
  aNodes.forEach((node) => {
    currentNode = node;
    const newInstructions = arr[0].split("");
    steps = 0;
    while (!endsIn(currentNode, "Z")) {
      let currentInstruction = newInstructions.shift()!;
      steps++;
      currentNode =
        currentInstruction === "L"
          ? nodes[currentNode].left
          : nodes[currentNode].right;
      newInstructions.push(currentInstruction);
    }
    stepsArray.push(steps);
  });

  const partTwo = lowestCommonMultiple(stepsArray);
  console.log("Part 2:", partTwo);
  console.log(`Execution time: ${Date.now() - start}ms`);
}

function lowestCommonMultiple(list: number[]) {
  let multiple = list[0];

  for (let n = 1; n < list.length; n++) {
    multiple = lcm(multiple, list[n]);
  }

  return multiple;
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function endsIn(node: string, character: string): boolean {
  return node[node.length - 1] === character;
}

function getNodesFromArray(arr: string[]): Record<string, DesertNode> {
  const nodes: Record<string, DesertNode> = {};
  arr.map((line) => {
    const [key, coordinates] = line.split(" = ");
    const [left, right] = coordinates
      .replace("(", "")
      .replace(")", "")
      .split(", ");
    nodes[key] = { left, right };
  });
  return nodes;
}

run("dayEight/input.txt");
