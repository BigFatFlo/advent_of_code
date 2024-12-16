import chalk from "chalk";
import { readFileSync } from "fs";

const EXAMPLE = "../example.txt";
const INPUT = "../input.txt";

class Matrix {
  private matrix: string[][];
  private height: number;
  private width: number;
  private start: [number, number, string];
  private position: [number, number, string] = [-1, -1, "None"];
  private obstacles: [number, number][] = [];
  private obstacleMap: { rows: number[][]; cols: number[][] } = {
    rows: [],
    cols: [],
  };
  private path: [number, number, string][] = [];
  private visitedPositions: [number, number][] = [];

  constructor(inputFileName: string) {
    const file = readFileSync(inputFileName, "utf-8");
    const lines = file.trim().split("\n");
    this.matrix = [];
    for (const line of lines) {
      this.matrix.push(line.split(""));
    }
    this.height = this.matrix.length;
    this.width = this.matrix[0].length;
    this.findStart();
    this.start = this.position;
    this.findObstacles();
    this.buildObstacleMap();
    this.findPath();
    this.findVisitedPositions();
  }

  private findStart(): void {
    for (const [i, row] of this.matrix.entries()) {
      for (const [j, value] of row.entries()) {
        if (value == ">") {
          this.position = [i, j, "right"];
        } else if (value == "<") {
          this.position = [i, j, "left"];
        } else if (value == "^") {
          this.position = [i, j, "up"];
        } else if (value == "v") {
          this.position = [i, j, "down"];
        }
      }
    }
  }

  private findObstacles(): void {
    for (const [i, row] of this.matrix.entries()) {
      for (const [j, value] of row.entries()) {
        if (value == "#") {
          this.obstacles.push([i, j]);
        }
      }
    }
  }

  private buildObstacleMap(): void {
    this.obstacleMap.rows = Array.from({ length: this.height }, () => []);
    this.obstacleMap.cols = Array.from({ length: this.width }, () => []);
    for (const [row, col] of this.obstacles) {
      let i = 0;
      while (
        i < this.obstacleMap.rows[row].length &&
        col > this.obstacleMap.rows[row][i]
      ) {
        i += 1;
      }
      this.obstacleMap.rows[row].splice(i, 0, col);
      i = 0;
      while (
        i < this.obstacleMap.cols[col].length &&
        row > this.obstacleMap.cols[col][i]
      ) {
        i += 1;
      }
      this.obstacleMap.cols[col].splice(i, 0, row);
    }
  }

  private goToNextPosition(): void {
    const [currentRow, currentCol, currentDirection] = this.position;
    switch (currentDirection) {
      case "right": {
        // Check if an obstacle is in the same row, to the right
        for (const col of this.obstacleMap.rows[currentRow]) {
          if (col > currentCol) {
            // If so, return the position right before the obstacle
            this.position = [currentRow, col - 1, "down"];
            return;
          }
        }
        // If no obstacle, then the guard leaves the grid
        this.position = [currentRow, this.width, currentDirection];
        break;
      }
      case "left": {
        // Check if an obstacle is in the same row, to the left
        for (const col of [...this.obstacleMap.rows[currentRow]].reverse()) {
          if (col < currentCol) {
            // If so, return the position right before the obstacle
            this.position = [currentRow, col + 1, "up"];
            return;
          }
        }
        // If no obstacle, then the guard leaves the grid
        this.position = [currentRow, -1, currentDirection];
        break;
      }
      case "down": {
        // Check if an obstacle is in the same column, down from the current position
        for (const row of this.obstacleMap.cols[currentCol]) {
          if (row > currentRow) {
            // If so, return the position right before the obstacle
            this.position = [row - 1, currentCol, "left"];
            return;
          }
        }
        // If no obstacle, then the guard leaves the grid
        this.position = [this.height, currentCol, currentDirection];
        break;
      }
      case "up": {
        // Check if an obstacle is in the same column, up from the current position
        for (const row of [...this.obstacleMap.cols[currentCol]].reverse()) {
          if (row < currentRow) {
            // If so, return the position right before the obstacle
            this.position = [row + 1, currentCol, "right"];
            return;
          }
        }
        // If no obstacle, then the guard leaves the grid
        this.position = [-1, currentCol, currentDirection];
        break;
      }
      default: {
        this.position = [-1, -1, "None"];
      }
    }
  }

  private findPath(): void {
    this.path.push(this.position);
    while (
      this.position[0] >= 0 &&
      this.position[0] < this.height &&
      this.position[1] >= 0 &&
      this.position[1] < this.width
    ) {
      this.goToNextPosition();
      this.path.push(this.position);
    }
  }

  private findVisitedPositions(): void {
    for (let i = 0; i < this.path.length - 1; i++) {
      const [currentRow, currentCol] = this.path[i];
      const [nextRow, nextCol] = this.path[i + 1];
      if (currentRow === nextRow) {
        for (
          let col = Math.min(currentCol, nextCol);
          col < Math.max(currentCol, nextCol) + 1;
          col++
        ) {
          if (
            currentRow >= 0 &&
            currentRow < this.height &&
            col >= 0 &&
            col < this.width
          ) {
            if (
              !this.visitedPositions.some(
                ([r, c]) => r === currentRow && c === col
              )
            ) {
              this.visitedPositions.push([currentRow, col]);
            }
          }
        }
      } else if (currentCol === nextCol) {
        for (
          let row = Math.min(currentRow, nextRow);
          row < Math.max(currentRow, nextRow) + 1;
          row++
        ) {
          if (
            currentCol >= 0 &&
            currentCol < this.width &&
            row >= 0 &&
            row < this.height
          ) {
            if (
              !this.visitedPositions.some(
                ([r, c]) => r === row && c === currentCol
              )
            ) {
              this.visitedPositions.push([row, currentCol]);
            }
          }
        }
      }
    }
  }

  nbOfVisitedPositions(): number {
    return this.visitedPositions.length;
  }

  private loopFound(): boolean {
    const path = [];
    this.position = this.start;
    path.push(this.position);
    while (
      this.position[0] >= 0 &&
      this.position[0] < this.height &&
      this.position[1] >= 0 &&
      this.position[1] < this.width
    ) {
      this.goToNextPosition();
      if (
        path.some(
          ([r, c, d]) =>
            r === this.position[0] &&
            c === this.position[1] &&
            d === this.position[2]
        )
      ) {
        return true;
      }
      path.push(this.position);
    }
    return false;
  }

  private addObstacle(row: number, col: number): void {
    this.obstacleMap.rows[row].push(col);
    this.obstacleMap.cols[col].push(row);
    this.obstacleMap.rows[row].sort((a, b) => a - b);
    this.obstacleMap.cols[col].sort((a, b) => a - b);
  }

  private removeObstacle(row: number, col: number): void {
    this.obstacleMap.rows[row] = this.obstacleMap.rows[row].filter(
      (c) => c !== col
    );
    this.obstacleMap.cols[col] = this.obstacleMap.cols[col].filter(
      (r) => r !== row
    );
  }

  nbOfLoopsPossible(): number {
    let result = 0;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (
          this.matrix[i][j] === "." &&
          this.visitedPositions.some(([r, c]) => r === i && c === j)
        ) {
          this.addObstacle(i, j);
          if (this.loopFound()) {
            result += 1;
          }
          this.removeObstacle(i, j);
        }
      }
    }
    return result;
  }
}

function part1(inputFileName: string) {
  console.time(`Part 1 for ${inputFileName.split("/").pop()}`);
  const matrix = new Matrix(inputFileName);
  const result = matrix.nbOfVisitedPositions();
  console.log(
    `Part 1 for ${inputFileName.split("/").pop()}: ${chalk.green(result)}`
  );
  console.timeEnd(`Part 1 for ${inputFileName.split("/").pop()}`);
}

function part2(inputFileName: string) {
  console.time(`Part 2 for ${inputFileName.split("/").pop()}`);
  const matrix = new Matrix(inputFileName);
  const result = matrix.nbOfLoopsPossible();
  console.log(
    `Part 2 for ${inputFileName.split("/").pop()}: ${chalk.green(result)}`
  );
  console.timeEnd(`Part 2 for ${inputFileName.split("/").pop()}`);
}

part1(EXAMPLE);
part1(INPUT);
part2(EXAMPLE);
part2(INPUT);
