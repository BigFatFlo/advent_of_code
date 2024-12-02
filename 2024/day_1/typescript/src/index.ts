import { readFileSync } from "fs";

const EXAMPLE = "../example.txt";
const INPUT = "../input.txt";

function get_lists(input_file_name: string): [number[], number[]] {
  const left: number[] = [];
  const right: number[] = [];

  const fileContent = readFileSync(input_file_name, "utf-8");
  const lines = fileContent.trim().split("\n");

  for (const line of lines) {
    const [leftNum, rightNum] = line.split("   ").map(Number);
    left.push(leftNum);
    right.push(rightNum);
  }

  return [left, right];
}

function get_distances(left: number[], right: number[]): number[] {
  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  return left.map((l, i) => Math.abs(l - right[i]));
}

function part_1(input_file_name: string): void {
  const [left, right] = get_lists(input_file_name);
  const distances = get_distances(left, right);
  const result = distances.reduce((acc, curr) => acc + curr, 0);
  console.log(`Part 1 for ${input_file_name.split("/").pop()}: ${result}`);
}

part_1(EXAMPLE);
part_1(INPUT);

function get_similarities(left: number[], right: number[]): number[] {
  const similarities: number[] = [];

  for (const e of left) {
    const count = right.filter((r) => r === e).length;
    similarities.push(e * count);
  }

  return similarities;
}

function part2(input_file_name: string): void {
  const [left, right] = get_lists(input_file_name);
  const similarities = get_similarities(left, right);
  const result = similarities.reduce((acc, curr) => acc + curr, 0);
  console.log(`Part 2 for ${input_file_name.split("/").pop()}: ${result}`);
}

part2(EXAMPLE);
part2(INPUT);
