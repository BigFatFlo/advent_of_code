import chalk from "chalk";
import { readFileSync } from "fs";

const EXAMPLE = "../example.txt";
const INPUT = "../input.txt";

class Equation {
  constructor(public numbers: number[], public target: number) {}
}

class EquationList {
  private equations: Equation[] = [];

  constructor(inputfileName: string) {
    const file = readFileSync(inputfileName, "utf-8");
    const lines = file.trim().split("\n");
    for (const line of lines) {
      const [targetString, numbersString] = line.split(":");
      const target = parseInt(targetString);
      const numbers = numbersString
        .trim()
        .split(" ")
        .map((x) => parseInt(x));
      this.equations.push(new Equation(numbers, target));
    }
  }

  calculateResult(operators: string[]) {
    let result = 0;
    for (const equation of this.equations) {
      if (isTargetReachable(equation.target, equation.numbers, operators)) {
        result += equation.target;
      }
    }
    return result;
  }
}

function isTargetReachable(
  target: number,
  numbers: number[],
  operators: string[]
) {
  // Start with the end and recursively check if the target is reachable
  const head = numbers.slice(0, -1);
  const tail = numbers[numbers.length - 1];
  if (head.length === 0) {
    // Only one number
    return tail === target;
  }
  if (operators.includes("||")) {
    // Target is reachable via final concatenation only if target ends with the digits of the last number
    const tailString = tail.toString();
    if (
      target.toString().endsWith(tailString) &&
      isTargetReachable(
        Math.floor(target / 10 ** tailString.length),
        head,
        operators
      )
    ) {
      return true;
    }
  }
  if (operators.includes("*")) {
    // Target is reachable via final multiplication only if target is divisible by the last number
    const quotient = Math.floor(target / tail);
    const remainder = target % tail;
    if (remainder === 0 && isTargetReachable(quotient, head, operators)) {
      return true;
    }
  }
  // Finally, check if target is reachable via final addition
  return isTargetReachable(target - tail, head, operators);
}

function part1(inputFileName: string) {
  console.time(`Part 1 for ${inputFileName}`);
  const equationList = new EquationList(inputFileName);
  const operators = ["+", "*"];
  const result = equationList.calculateResult(operators);
  console.log(`Part 1 for ${inputFileName}: ${chalk.green(result)}`);
  console.timeEnd(`Part 1 for ${inputFileName}`);
}

function part2(inputFileName: string) {
  console.time(`Part 2 for ${inputFileName}`);
  const equationList = new EquationList(inputFileName);
  const operators = ["+", "*", "||"];
  const result = equationList.calculateResult(operators);
  console.log(`Part 1 for ${inputFileName}: ${chalk.green(result)}`);
  console.timeEnd(`Part 2 for ${inputFileName}`);
}

part1(EXAMPLE);
part1(INPUT);
part2(EXAMPLE);
part2(INPUT);
