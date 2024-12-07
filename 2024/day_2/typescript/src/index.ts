import { readFileSync } from "fs";
import chalk from "chalk";

const EXAMPLE = "../example.txt";
const INPUT = "../input.txt";

class Report {
  constructor(private levels: number[]) {}

  is_safe(): boolean {
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

  remove_one_level(): Report[] {
    const alternative_reports: Report[] = [];
    for (let i = 0; i < this.levels.length; i++) {
      const new_levels: number[] = [];
      for (let j = 0; j < this.levels.length; j++) {
        if (j !== i) {
          new_levels.push(this.levels[j]);
        }
      }
      alternative_reports.push(new Report(new_levels));
    }
    return alternative_reports;
  }

  can_be_safe(): boolean {
    if (this.is_safe()) {
      return true;
    }
    for (const alternative_report of this.remove_one_level()) {
      if (alternative_report.is_safe()) {
        return true;
      }
    }
    return false;
  }
}

function get_reports(input_file_name: string): Report[] {
  const fileContent = readFileSync(input_file_name, "utf-8");
  const lines = fileContent.trim().split("\n");
  const reports: Report[] = [];

  for (const line of lines) {
    const report = new Report(line.trim().split(" ").map(Number));
    reports.push(report);
  }

  return reports;
}

function part_1(input_file_name: string): void {
  const reports: Report[] = get_reports(input_file_name);
  let safe_reports: number = 0;
  for (const report of reports) {
    if (report.is_safe()) {
      safe_reports += 1;
    }
  }
  console.log(
    `Part 1 for ${input_file_name.split("/").pop()}: ${chalk.green(
      safe_reports
    )}`
  );
}

part_1(EXAMPLE);
part_1(INPUT);

function part_2(input_file_name: string): void {
  const reports: Report[] = get_reports(input_file_name);
  let safe_reports: number = 0;
  for (const report of reports) {
    if (report.can_be_safe()) {
      safe_reports += 1;
    }
  }
  console.log(
    `Part 2 for ${input_file_name.split("/").pop()}: ${chalk.green(
      safe_reports
    )}`
  );
}

part_2(EXAMPLE);
part_2(INPUT);
