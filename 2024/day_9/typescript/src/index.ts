import chalk from "chalk";
import { readFileSync } from "fs";

const EXAMPLE = "../example.txt";
const INPUT = "../input.txt";

class File {
  constructor(
    public id: number,
    public start: number,
    public size: number,
    public moved: boolean = false
  ) {}
}

class FreeSpace {
  constructor(public start: number, public size: number) {}
}

class BlockMap {
  public files: File[] = [];
  public freeSpaces: FreeSpace[] = [];

  constructor(inputFileName: string) {
    const diskMap = this.parseInput(inputFileName);
    let currentFileId = 0;
    let currentPosition = 0;
    for (let i = 0; i < diskMap.length; i++) {
      const d = diskMap[i];
      if (i % 2 == 0) {
        if (d > 0) {
          this.files.push(new File(currentFileId, currentPosition, d));
        }
        currentFileId += 1;
      } else {
        if (d > 0) {
          // Free spaces are stored in reverse order, so that we can get the first one with a simple pop
          this.freeSpaces.unshift(new FreeSpace(currentPosition, d));
        }
      }
      currentPosition += d;
    }
  }

  parseInput(inputFileName: string): number[] {
    const inputFile = readFileSync(inputFileName, "utf-8");
    const diskMap: number[] = inputFile.trim().split("").map(Number);
    return diskMap;
  }

  fillFirstFreeSpace() {
    let lastFile = this.files.pop();
    let firstFreeSpace = this.freeSpaces.pop();
    if (!lastFile || !firstFreeSpace) {
      return;
    }
    if (firstFreeSpace.size > lastFile.size) {
      // Moving file completely
      lastFile.start = firstFreeSpace.start;
      // Reducing size of free space
      firstFreeSpace.size -= lastFile.size;
      firstFreeSpace.start += lastFile.size;
      // The free space isn't empty, so we add back
      this.freeSpaces.push(firstFreeSpace);
      // Moving the file to head of the list so that it's ignored after this
      this.files.unshift(lastFile);
    } else if (firstFreeSpace.size == lastFile.size) {
      // The free space disappears, no need to add it back
      lastFile.start = firstFreeSpace.start;
      // Moving the file to head of the list so that it's ignored after this
      this.files.unshift(lastFile);
    } else if (firstFreeSpace.size < lastFile.size) {
      // Split file in two
      const newFile = new File(
        lastFile.id,
        firstFreeSpace.start,
        firstFreeSpace.size
      );
      // The original file is smaller now
      lastFile.size -= firstFreeSpace.size;
      // Moving the new file to head of the list so that it's ignored after this
      this.files.unshift(newFile);
      this.files.push(lastFile);
    }
  }

  fillFreeSpaces() {
    while (
      this.freeSpaces.length > 0 &&
      this.freeSpaces[this.freeSpaces.length - 1].start <
        this.files[this.files.length - 1].start
    ) {
      this.fillFirstFreeSpace();
    }
  }

  fillFirstFreeSpaceNoFragmentation() {
    const lastFile = this.files.pop();
    if (!lastFile) {
      return;
    }
    // Need to find first free space where the file fits
    let i = this.freeSpaces.length - 1;
    while (i >= 0 && !lastFile.moved) {
      let firstFreeSpace = this.freeSpaces[i];
      // Keep going only while there are free spaces before the file
      if (firstFreeSpace.start < lastFile.start) {
        // Same process as with fragmentation, expect no case for splitting file in two
        if (firstFreeSpace.size > lastFile.size) {
          lastFile.start = firstFreeSpace.start;
          firstFreeSpace.size -= lastFile.size;
          firstFreeSpace.start += lastFile.size;
          this.freeSpaces[i] = firstFreeSpace;
          this.files.unshift(lastFile);
          lastFile.moved = true;
        } else if (firstFreeSpace.size == lastFile.size) {
          lastFile.start = firstFreeSpace.start;
          this.freeSpaces.splice(i, 1);
          this.files.unshift(lastFile);
          lastFile.moved = true;
        } else {
          i -= 1;
        }
      } else {
        break;
      }
    }
    // No free space was found where the file fits, it doesn't move but we
    // mark it as moved to ignore it after this
    if (!lastFile.moved) {
      lastFile.moved = true;
      this.files.unshift(lastFile);
    }
  }

  fillFreeSpacesNoFragmentation() {
    while (
      this.freeSpaces.length > 0 &&
      this.files.some((file) => !file.moved)
    ) {
      this.fillFirstFreeSpaceNoFragmentation();
    }
  }

  calculateChecksum(): number {
    let checksum = 0;
    for (const file of this.files) {
      for (let i = file.start; i < file.start + file.size; i++) {
        checksum += i * file.id;
      }
    }
    return checksum;
  }
}

function part1(inputFileName: string) {
  console.time(`Part 1 for ${inputFileName.split("/").pop()}`);
  const blockMap = new BlockMap(inputFileName);
  blockMap.fillFreeSpaces();
  const result = blockMap.calculateChecksum();
  console.log(
    `Part 1 for ${inputFileName.split("/").pop()}: ${chalk.green(result)}`
  );
  console.timeEnd(`Part 1 for ${inputFileName.split("/").pop()}`);
}

function part2(inputFileName: string) {
  console.time(`Part 2 for ${inputFileName.split("/").pop()}`);
  const blockMap = new BlockMap(inputFileName);
  blockMap.fillFreeSpacesNoFragmentation();
  const result = blockMap.calculateChecksum();
  console.log(
    `Part 2 for ${inputFileName.split("/").pop()}: ${chalk.green(result)}`
  );
  console.timeEnd(`Part 2 for ${inputFileName.split("/").pop()}`);
}

part1(EXAMPLE);
part1(INPUT);
part2(EXAMPLE);
part2(INPUT);
