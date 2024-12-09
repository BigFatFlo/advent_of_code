import chalk from "chalk";
import { readFileSync } from "fs";

const EXAMPLE = "../example.txt";
const INPUT = "../input.txt";

class Matrix {
  private contents: string[][] = [];
  private height: number;
  private width: number;
  private letterPositions: { [key: string]: [number, number][] } = {
    X: [],
    A: [],
  };

  constructor(inputFileName: string) {
    const file = readFileSync(inputFileName, "utf-8");
    const lines: string[] = file.trim().split("\n");
    for (const line of lines) {
      this.contents.push(line.split(""));
    }
    this.height = this.contents.length;
    this.width = this.contents[0].length;
  }

  private findLetterPositions(letter: string): void {
    if (!(letter in this.letterPositions)) return;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.contents[i][j] == letter) {
          this.letterPositions[letter].push([i, j]);
        }
      }
    }
  }

  private checkForXmas(startRow: number, startCol: number): number {
    if (this.contents[startRow][startCol] !== "X") {
      return 0;
    }
    const directions = [
      // Left to right
      (k: number) => {
        return {
          row: startRow,
          col: startCol + k,
        };
      },
      // Right to left
      (k: number) => {
        return {
          row: startRow,
          col: startCol - k,
        };
      },
      // Downwards
      (k: number) => {
        return {
          row: startRow + k,
          col: startCol,
        };
      },
      // Upwards
      (k: number) => {
        return {
          row: startRow - k,
          col: startCol,
        };
      },

      // Diagonals
      (k: number) => {
        return {
          row: startRow + k,
          col: startCol + k,
        };
      },
      (k: number) => {
        return {
          row: startRow + k,
          col: startCol - k,
        };
      },
      (k: number) => {
        return {
          row: startRow - k,
          col: startCol + k,
        };
      },
      (k: number) => {
        return {
          row: startRow - k,
          col: startCol - k,
        };
      },
    ];

    const candidates: string[] = directions.map((dir) => {
      // Build the 4 letter word starting at the start position for each direction
      const word: string[] = [];
      for (let k = 0; k < 4; k++) {
        const { row, col } = dir(k);
        if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
          word.push(this.contents[row][col]);
        }
      }
      return word.join("");
    });
    // Count the number of occurences of "XMAS" in these words
    return candidates.filter((word) => word === "XMAS").length;
  }

  countXmases(): number {
    this.findLetterPositions("X");
    let result = 0;
    for (const [row, col] of this.letterPositions["X"]) {
      result += this.checkForXmas(row, col);
    }
    return result;
  }

  checkForMasCross(startRow: number, startCol: number): boolean {
    if (this.contents[startRow][startCol] !== "A") {
      return false;
    }
    const directions = [
      // NW-SE
      (k: number) => {
        return {
          row: startRow + k,
          col: startCol + k,
        };
      },
      // SW-NE
      (k: number) => {
        return {
          row: startRow - k,
          col: startCol + k,
        };
      },
    ];

    const diagonals: string[] = directions.map((dir) => {
      // Build the 4 letter word starting at the start position for each diagonal
      const word: string[] = [];
      for (let k = -1; k < 2; k++) {
        const { row, col } = dir(k);
        if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
          word.push(this.contents[row][col]);
        }
      }
      return word.join("");
    });
    return (
      ["MAS", "SAM"].includes(diagonals[0]) &&
      ["MAS", "SAM"].includes(diagonals[1])
    );
  }

  countMasCrosses(): number {
    this.findLetterPositions("A");
    let result = 0;
    for (const [row, col] of this.letterPositions["A"]) {
      if (this.checkForMasCross(row, col)) result++;
    }
    return result;
  }
}

function part1(inputFileName: string): void {
  const matrix = new Matrix(inputFileName);
  const result = matrix.countXmases();
  console.log(
    `Part 1 for ${inputFileName.split("/").pop()}: ${chalk.green(result)}`
  );
}

function part2(inputFileName: string): void {
  const matrix = new Matrix(inputFileName);
  const result = matrix.countMasCrosses();
  console.log(
    `Part 2 for ${inputFileName.split("/").pop()}: ${chalk.green(result)}`
  );
}

part1(EXAMPLE);
part1(INPUT);
part2(EXAMPLE);
part2(INPUT);
