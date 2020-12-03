import findSolution from "./find-solution.ts";
import findSolutionThree from "./find-solution-three.ts";

function day01(input: string) {
  const numbers = input.split("\n").map((l) => parseInt(l));
  const part1 = findSolution(numbers);
  console.log(`The product of two numbers adding up to 2020: ${part1}`);
  const part2 = findSolutionThree(numbers);
  console.log(`The product of three numbers adding up to 2020: ${part2}`);
}

export default day01;
