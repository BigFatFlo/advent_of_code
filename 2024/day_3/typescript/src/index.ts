import { readFileSync } from "fs";
import chalk from "chalk";

const EXAMPLE_1 = "../example_1.txt";
const EXAMPLE_2 = "../example_2.txt";
const INPUT = "../input.txt";

class Section {
  private _numbers: [number, number][] = [];
  private _total: number = 0;

  constructor(public section: string) {
    this._numbers = this.findNumbers();
    this._total = this.calculateTotal();
  }

  private findNumbers(): [number, number][] {
    const regexp: RegExp = /mul\((\d{1,3}),(\d{1,3})\)/g;
    const matches = [...this.section.matchAll(regexp)];
    const numbers: [number, number][] = [];
    for (const match of matches) {
      numbers.push([parseInt(match[1]), parseInt(match[2])]);
    }
    return numbers;
  }

  private calculateTotal(): number {
    let total = 0;
    for (const [x, y] of this._numbers) {
      total += x * y;
    }
    return total;
  }

  get total(): number {
    return this._total;
  }
}

class Program {
  private _program: Section;
  private _validSubsections: Section[] = [];

  constructor(program: string) {
    this._program = new Section(program);
  }

  computeValidSubsections() {
    let validSubsections: string[] = [];
    let splitAtDont = this._program.section.split("don't()");
    // The first one is before the first "don't()" so it is valid
    validSubsections.push(splitAtDont[0]);
    splitAtDont = splitAtDont.slice(1);
    for (const s of splitAtDont) {
      // For the next ones, only the parts after the first "do()" are valid
      let splitSDo = s.split("do()");
      splitSDo = splitSDo.slice(1);
      validSubsections.push(...splitSDo);
    }
    this._validSubsections = validSubsections.map(
      (section) => new Section(section)
    );
  }

  getProgramTotal() {
    return this._program.total;
  }

  getValidSubsectionsTotal() {
    this.computeValidSubsections();
    let result = 0;
    for (const validSubsection of this._validSubsections) {
      result += validSubsection.total;
    }
    return result;
  }
}

function parseInputFile(inputFileName: string): Program {
  const fileContent = readFileSync(inputFileName, "utf-8");
  const lines = fileContent.trim().split("\n");
  const program = lines.join("");
  return new Program(program);
}

function part1(inputFileName: string): void {
  const program = parseInputFile(inputFileName);
  const result = program.getProgramTotal();
  console.log(
    `Part 1 for ${inputFileName.split("/").pop()}: ${chalk.green(result)}`
  );
}

function part2(inputFileName: string): void {
  const program = parseInputFile(inputFileName);
  const result = program.getValidSubsectionsTotal();
  console.log(
    `Part 2 for ${inputFileName.split("/").pop()}: ${chalk.green(result)}`
  );
}

part1(EXAMPLE_1);
part1(INPUT);
part2(EXAMPLE_2);
part2(INPUT);
