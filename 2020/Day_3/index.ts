const enum Square {
  OPEN = '.',
  TREE = '#'
}

function getSquares(input: string): Square[][] {
  return input.split('\n').map(line => line.split('') as Square[]);
}

async function day3(input: string) {
  const squares = getSquares(input);
  const slopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];
  const width = squares[0].length;

  const trees = [];

  for (const [dx, dy] of slopes) {
    let x = 0;
    let y = 0;
    let treesEncountered = 0;
    while(y < squares.length - 1) {
      x += dx;
      y += dy;
      const square = squares[y][x % width];
      if (square === Square.TREE) {
        treesEncountered += 1;
      }
    }

    trees.push(treesEncountered);
    console.log(`With Right ${dx}, down ${dy}, I encountered ${treesEncountered} trees.`);
  }

  console.log(`The product of trees encountered is ${trees.reduce((p, t) => p * t, 1)}`);
}

export default day3;
