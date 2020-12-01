/**
 *
 * @param {Array.<number>} input input numbers
 * @returns {number}
 */
function findSolutionThree(input) {
  const targetSum = 2020;

  for (let i = 0; i < input.length; i++) {
    const a = input[i];
    for (let j = 0; j < input.length; j++) {
      const b = input[j];
      for (let k = 0; k < input.length; k++) {
        const c = input[k];
        const sum = a + b + c;
        if (sum === targetSum) {
          return a * b * c;
        }
      }
    }
  }
}

export default findSolutionThree;
