/**
 * 
 * @param {Array.<number>} input input numbers
 * @returns {number}
 */
function findSolution(input) {
  const targetSum = 2020;

  for (let i = 0; i<input.length;i++) {
    const a = input[i];
    for (let j = 0; j < input.length; j++) {
      const b = input[j];
      const sum = a + b;
      if (sum === targetSum) {
        return a * b;
      }
    }
  }
}

export default findSolution;
