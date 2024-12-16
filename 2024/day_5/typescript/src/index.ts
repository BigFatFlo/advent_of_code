import chalk from "chalk";
import { readFileSync } from "fs";

const EXAMPLE = "../example.txt";
const INPUT = "../input.txt";

class Input {
  private rules: number[][] = [];
  private updates: number[][] = [];
  private predecessors: { [key: number]: number[] } = {};

  constructor(inputFileName: string) {
    const file = readFileSync(inputFileName, "utf-8");
    const lines = file.trim().split("\n");
    let readingRules: boolean = true;
    for (const line of lines) {
      if (!line) {
        readingRules = false;
        continue;
      }
      if (readingRules) {
        this.rules.push(
          line.split("|").map((stringNumber) => parseInt(stringNumber))
        );
      } else {
        this.updates.push(
          line.split(",").map((stringNumber) => parseInt(stringNumber))
        );
      }
    }
  }

  private fillPredecessors() {
    for (const [x, y] of this.rules) {
      if (y in this.predecessors) {
        this.predecessors[y].push(x);
      } else {
        this.predecessors[y] = [x];
      }
    }
  }

  private checkUpdate(update: number[]) {
    let correct = true;
    for (let i = 0; i < update.length; i++) {
      for (let j = 0; j < update.length; j++) {
        if (
          (j < i &&
            update[j] in this.predecessors &&
            this.predecessors[update[j]].includes(update[i])) ||
          (j > i &&
            update[i] in this.predecessors &&
            this.predecessors[update[i]].includes(update[j]))
        ) {
          correct = false;
          break;
        }
      }
      if (!correct) {
        break;
      }
    }
    return correct;
  }

  private getMiddlePage(update: number[]) {
    return update[Math.floor(update.length / 2)];
  }

  private reorderUpdate(incorrectUpdate: number[]) {
    const reorderedUpdate: number[] = [];
    for (const [x, y] of this.rules) {
      if (incorrectUpdate.includes(x) && incorrectUpdate.includes(y)) {
        if (!reorderedUpdate.includes(x) && !reorderedUpdate.includes(y)) {
          // Insert x and y in order
          reorderedUpdate.push(x, y);
        } else if (
          !reorderedUpdate.includes(x) &&
          reorderedUpdate.includes(y)
        ) {
          // Insert x right before y
          reorderedUpdate.splice(reorderedUpdate.indexOf(y), 0, x);
        } else if (
          reorderedUpdate.includes(x) &&
          !reorderedUpdate.includes(y)
        ) {
          // Insert y right after x
          reorderedUpdate.splice(reorderedUpdate.indexOf(x) + 1, 0, y);
        } else if (reorderedUpdate.includes(x) && reorderedUpdate.includes(y)) {
          if (reorderedUpdate.indexOf(x) < reorderedUpdate.indexOf(y)) {
            continue;
          }
          // The only complicated case: both pages are already in
          // the list but in the wrong order. So we need to swap them.
          // But we need to be sure to move the pages between them
          // that need to be moved to stay in order.
          const pagesToMove: number[] = [];
          let i = reorderedUpdate.indexOf(y) + 1;
          let end = reorderedUpdate.indexOf(x);
          // Remove the page with the highest index
          reorderedUpdate.splice(end, 1);
          while (i < end) {
            // If the current page needs to be before the page we're moving,
            // we need to move the current page as well
            if (
              x in this.predecessors &&
              this.predecessors[x].includes(reorderedUpdate[i])
            ) {
              pagesToMove.push(reorderedUpdate.splice(i, 1)[0]);
              end -= 1;
            } else {
              i += 1;
            }
          }
          pagesToMove.push(x);
          // Now we just insert the pages that needed to move back into the list, at the right index.
          reorderedUpdate.splice(reorderedUpdate.indexOf(y), 0, ...pagesToMove);
        }
      }
    }
    return reorderedUpdate;
  }

  sumMiddlePagesOfCorrectUpdates() {
    this.fillPredecessors();
    let result = 0;
    for (const update of this.updates) {
      if (this.checkUpdate(update)) {
        result += this.getMiddlePage(update);
      }
    }
    return result;
  }

  sumMiddlePagesOfReorderedUpdates() {
    this.fillPredecessors();
    let result = 0;
    for (const update of this.updates) {
      if (!this.checkUpdate(update)) {
        result += this.getMiddlePage(this.reorderUpdate(update));
      }
    }
    return result;
  }
}

function part1(inputFileName: string) {
  console.time(`Part 1 for ${inputFileName.split("/").pop()}`);
  const input = new Input(inputFileName);
  const result = input.sumMiddlePagesOfCorrectUpdates();
  console.log(
    `Part 1 for ${inputFileName.split("/").pop()}: ${chalk.green(result)}`
  );
  console.timeEnd(`Part 1 for ${inputFileName.split("/").pop()}`);
}

function part2(inputFileName: string) {
  console.time(`Part 2 for ${inputFileName.split("/").pop()}`);
  const input = new Input(inputFileName);
  const result = input.sumMiddlePagesOfReorderedUpdates();
  console.log(
    `Part 2 for ${inputFileName.split("/").pop()}: ${chalk.green(result)}`
  );
  console.timeEnd(`Part 2 for ${inputFileName.split("/").pop()}`);
}

part1(EXAMPLE);
part1(INPUT);
part2(EXAMPLE);
part2(INPUT);
