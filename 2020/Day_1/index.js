import numbers from "./puzzle-input.js";
import findSolution from "./find-solution.js"
import findSolutionThree from "./find-solution-three.js"

const product = findSolution(numbers);

console.log(`The product of two numbers adding up to 2020: ${product}`);

const productOfThree = findSolutionThree(numbers);

console.log(`The product of two numbers adding up to 2020: ${productOfThree}`);
