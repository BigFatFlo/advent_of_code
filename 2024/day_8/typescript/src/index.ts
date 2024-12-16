import chalk from "chalk";
import { readFileSync } from "fs";

const EXAMPLE = "../example.txt";
const INPUT = "../input.txt";

type Coordinates = { r: number; c: number };

class Matrix {
  private matrix: string[][] = [];
  private height: number;
  private width: number;
  private antennas: Map<string, Coordinates[]> = new Map();

  constructor(inputFileName: string) {
    const file = readFileSync(inputFileName, "utf-8");
    const lines = file.trim().split("\n");
    for (const line of lines) {
      this.matrix.push(line.split(""));
    }
    this.height = this.matrix.length;
    this.width = this.matrix[0].length;
    this.findAntennas();
  }

  private findAntennas() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const c = this.matrix[i][j];
        if (c !== ".") {
          if (this.antennas.has(c)) {
            this.antennas.get(c)?.push({ r: i, c: j });
          } else {
            this.antennas.set(c, [{ r: i, c: j }]);
          }
        }
      }
    }
  }

  private findAntinodesForAntennasWithDistance(
    a0: Coordinates,
    a1: Coordinates
  ): Coordinates[] {
    const row_distance = a0.r - a1.r;
    const col_distance = a0.c - a1.c;
    const result: Coordinates[] = [];
    for (const { r, c } of [
      { r: a0.r + row_distance, c: a0.c + col_distance },
      { r: a1.r - row_distance, c: a1.c - col_distance },
    ]) {
      if (r >= 0 && r < this.height && c >= 0 && c < this.width) {
        result.push({ r, c });
      }
    }
    return result;
  }

  private findAntinodesForAntennasWithoutDistance(
    a0: Coordinates,
    a1: Coordinates
  ): Coordinates[] {
    let row_distance = a0.r - a1.r;
    let col_distance = a0.c - a1.c;
    const div = gcd(row_distance, col_distance);
    row_distance = Math.floor(row_distance / div);
    col_distance = Math.floor(col_distance / div);
    const result: Coordinates[] = [];
    for (const rate of [-1, 1]) {
      let i = 0;
      let antinode_r = a0.r + rate * i * row_distance;
      let antinode_c = a0.c + rate * i * col_distance;
      while (
        antinode_r >= 0 &&
        antinode_r < this.height &&
        antinode_c >= 0 &&
        antinode_c < this.width
      ) {
        const antinode: Coordinates = { r: antinode_r, c: antinode_c };
        result.push(antinode);
        i += 1;
        antinode_r = a0.r + rate * i * row_distance;
        antinode_c = a0.c + rate * i * col_distance;
      }
    }
    return result;
  }

  private findAntinodes(
    antinodesFindingFunction: (
      a0: Coordinates,
      a1: Coordinates
    ) => Coordinates[]
  ): Coordinates[] {
    // Use a set to ensure uniqueness of each antinode
    const antinodeSet = new Set<string>();
    for (const antennas of this.antennas.values()) {
      // Go through all combinations of two antennas of same frequency
      for (let i = 0; i < antennas.length; i++) {
        for (let j = i + 1; j < antennas.length; j++) {
          const newAntinodes = antinodesFindingFunction(
            antennas[i],
            antennas[j]
          );
          for (const antinode of newAntinodes) {
            // Convert coordinates to a unique string value to store in the set
            antinodeSet.add(`${antinode.r},${antinode.c}`);
          }
        }
      }
    }
    // Convert the set back to an array
    return Array.from(antinodeSet).map((str) => {
      const [r, c] = str.split(",").map(Number);
      return { r, c };
    });
  }

  nbOfAntinodesWithDistance() {
    const antinodes = this.findAntinodes(
      this.findAntinodesForAntennasWithDistance.bind(this)
    );
    return antinodes.length;
  }

  nbOfAntinodesWithoutDistance() {
    const antinodes = this.findAntinodes(
      this.findAntinodesForAntennasWithoutDistance.bind(this)
    );
    return antinodes.length;
  }
}

function gcd(a: number, b: number) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function part1(inputFileName: string) {
  console.time(`Part 1 for ${inputFileName.split("/").pop()}`);
  const matrix = new Matrix(inputFileName);
  const result = matrix.nbOfAntinodesWithDistance();
  console.log(
    `Part 1 for ${inputFileName.split("/").pop()}: ${chalk.green(result)}`
  );
  console.timeEnd(`Part 1 for ${inputFileName.split("/").pop()}`);
}

function part2(inputFileName: string) {
  console.time(`Part 2 for ${inputFileName.split("/").pop()}`);
  const matrix = new Matrix(inputFileName);
  const result = matrix.nbOfAntinodesWithoutDistance();
  console.log(
    `Part 2 for ${inputFileName.split("/").pop()}: ${chalk.green(result)}`
  );
  console.timeEnd(`Part 2 for ${inputFileName.split("/").pop()}`);
}

part1(EXAMPLE);
part1(INPUT);
part2(EXAMPLE);
part2(INPUT);
