import { readFileSync } from "fs";
import chalk from "chalk";

const EXAMPLE = "../example.txt";
const INPUT = "../input.txt";

function getLists(inputFileName: string): [number[], number[]] {
  const left: number[] = [];
  const right: number[] = [];

  const fileContent = readFileSync(inputFileName, "utf-8");
  const lines = fileContent.trim().split("\n");

  for (const line of lines) {
    const [leftNum, rightNum] = line.split("   ").map(Number);
    left.push(leftNum);
    right.push(rightNum);
  }

  return [left, right];
}

function getDistances(left: number[], right: number[]): number[] {
  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  return left.map((l, i) => Math.abs(l - right[i]));
}

function part1(inputFileName: string): void {
  console.time(`Part 1 for ${inputFileName.split("/").pop()}`);
  const [left, right] = getLists(inputFileName);
  const distances = getDistances(left, right);
  const result = distances.reduce((acc, curr) => acc + curr, 0);
  console.log(
    `Part 1 for ${inputFileName.split("/").pop()}: ${chalk.green(result)}`
  );
  console.timeEnd(`Part 1 for ${inputFileName.split("/").pop()}`);
}

part1(EXAMPLE);
part1(INPUT);

function getSimilarities(left: number[], right: number[]): number[] {
  const similarities: number[] = [];

  for (const e of left) {
    const count = right.filter((r) => r === e).length;
    similarities.push(e * count);
  }

  return similarities;
}

function part2(inputFileName: string): void {
  console.time(`Part 2 for ${inputFileName.split("/").pop()}`);
  const [left, right] = getLists(inputFileName);
  const similarities = getSimilarities(left, right);
  const result = similarities.reduce((acc, curr) => acc + curr, 0);
  console.log(
    `Part 2 for ${inputFileName.split("/").pop()}: ${chalk.green(result)}`
  );
  console.timeEnd(`Part 2 for ${inputFileName.split("/").pop()}`);
}

part2(EXAMPLE);
part2(INPUT);
