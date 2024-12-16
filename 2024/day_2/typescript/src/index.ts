import { readFileSync } from "fs";
import chalk from "chalk";

const EXAMPLE = "../example.txt";
const INPUT = "../input.txt";

class Report {
  constructor(private levels: number[]) {}

  isSafe(): boolean {
    if (this.levels[1] === this.levels[0]) {
      return false;
    }
    const rate: number = this.levels[1] > this.levels[0] ? 1 : -1;
    for (let i = 0; i < this.levels.length; i++) {
      const growth: number = this.levels[i + 1] - this.levels[i];
      if (growth * rate <= 0) {
        return false;
      }
      if (Math.abs(growth) < 1 || Math.abs(growth) > 3) {
        return false;
      }
    }
    return true;
  }

  removeOneLevel(): Report[] {
    const alternativeReports: Report[] = [];
    for (let i = 0; i < this.levels.length; i++) {
      const newLevels: number[] = [];
      for (let j = 0; j < this.levels.length; j++) {
        if (j !== i) {
          newLevels.push(this.levels[j]);
        }
      }
      alternativeReports.push(new Report(newLevels));
    }
    return alternativeReports;
  }

  canBeSafe(): boolean {
    if (this.isSafe()) {
      return true;
    }
    for (const alternativeReport of this.removeOneLevel()) {
      if (alternativeReport.isSafe()) {
        return true;
      }
    }
    return false;
  }
}

function getReports(inputFileName: string): Report[] {
  const fileContent = readFileSync(inputFileName, "utf-8");
  const lines = fileContent.trim().split("\n");
  const reports: Report[] = [];

  for (const line of lines) {
    const report = new Report(line.trim().split(" ").map(Number));
    reports.push(report);
  }

  return reports;
}

function part1(inputFileName: string): void {
  console.time(`Part 1 for ${inputFileName}`);
  const reports: Report[] = getReports(inputFileName);
  let safeReports: number = 0;
  for (const report of reports) {
    if (report.isSafe()) {
      safeReports += 1;
    }
  }
  console.log(
    `Part 1 for ${inputFileName.split("/").pop()}: ${chalk.green(safeReports)}`
  );
  console.timeEnd(`Part 1 for ${inputFileName}`);
}

part1(EXAMPLE);
part1(INPUT);

function part2(inputFileName: string): void {
  console.time(`Part 2 for ${inputFileName}`);
  const reports: Report[] = getReports(inputFileName);
  let safeReports: number = 0;
  for (const report of reports) {
    if (report.canBeSafe()) {
      safeReports += 1;
    }
  }
  console.log(
    `Part 2 for ${inputFileName.split("/").pop()}: ${chalk.green(safeReports)}`
  );
  console.timeEnd(`Part 2 for ${inputFileName}`);
}

part2(EXAMPLE);
part2(INPUT);
