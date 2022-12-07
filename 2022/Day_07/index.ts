// Solution for 2022, day 07
import { lines, parse } from '../../utils/input.ts';
import { Logger } from '../../utils/log.ts';
import { assertEquals } from '../../utils/test.ts';

const logger = new Logger(Logger.Level.Info);

interface File {
  name: string;
  size: number;
}

interface Directory {
  name: string;
  files: Record<string, File>;
  dirs: Record<string, Directory>;
}

type PuzzleInput = Directory;

function parseInput(input: string): PuzzleInput {
  const root: Directory = {
    name: '/',
    files: {},
    dirs: {}
  };
  let currentDir = root;

  for (const ln of lines(input).slice(1)) {
    if (ln.startsWith('$')) {
      if (ln.startsWith('$ cd')) {
        const dirName = ln.replace('$ cd ', '');
        currentDir = currentDir.dirs[dirName];
      }
    } else {
      if (ln.startsWith('dir')) {
        const dirName = ln.replace('dir ', '');
        currentDir.dirs[dirName] = {name: dirName, dirs: {'..': currentDir}, files: {}};
      } else {
        const [size, name] = ln.split(' ');
        currentDir.files[name] = {name, size: parse.int(size)};
      }
    }
  }

  return root;
}

function part1(root: Directory): number {
  let sum = 0;

  function calcSize(dir: Directory): number {
    const filesSize = Object.values(dir.files).reduce((a, b) => a + b.size, 0);
    const subDirs = Object.entries(dir.dirs).filter(([name]) => name !== '..');
    const dirsSize = subDirs.reduce((s, [, dir]) => s + calcSize(dir), 0);

    const total = filesSize + dirsSize;
    if (total <= 100000) sum += total;

    return total;
  }

  calcSize(root);
  return sum;
}

function part2(root: Directory): number {
  function calcSize(dir: Directory): number {
    const filesSize = Object.values(dir.files).reduce((a, b) => a + b.size, 0);
    const subDirs = Object.entries(dir.dirs).filter(([name]) => name !== '..');
    const dirsSize = subDirs.reduce((s, [, dir]) => s + calcSize(dir), 0);

    return filesSize + dirsSize;
  }

  function findDirToDelete(dir: Directory): number {
    const filesSize = Object.values(dir.files).reduce((a, b) => a + b.size, 0);
    const subDirs = Object.entries(dir.dirs).filter(([name]) => name !== '..');
    const dirsSize = subDirs.reduce((s, [, dir]) => s + findDirToDelete(dir), 0);

    const total = filesSize + dirsSize;
    if ((total + sizeLeft > 30000000) && total < deletedDirSize) {
      deletedDirSize = total;
    }

    return total;
  }

  const totalSize = calcSize(root);
  const sizeLeft = 70000000 - totalSize;
  let deletedDirSize = totalSize;
  findDirToDelete(root);
  return deletedDirSize;
}

export default function run(input: string) {

  test1();
  const parsedInput = parseInput(input);

  logger.info(`Part1: ${part1(parsedInput)}`);

  test2();
  logger.info(`Part2: ${part2(parsedInput)}`);
}

const testInput = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

function test1() {
  assertEquals(part1(parseInput(testInput)), 95437);

  logger.info('Tests for Part 1 OK');
}

function test2() {
  assertEquals(part2(parseInput(testInput)), 24933642);

  logger.info('Tests for Part 2 OK');
}
