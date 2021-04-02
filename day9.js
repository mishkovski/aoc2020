const numbers = require("fs")
  .readFileSync("day9.input", "utf-8")
  .split("\n")
  .map((line) => parseInt(line));

const preambleLength = 25;

const getPreviousNumbers = (numbers, index) =>
  numbers.slice(index - preambleLength, index);

const findInvalidNumber = (numbers) =>
  numbers
    .slice(preambleLength)
    .find(
      (currentNumber, index) =>
        !getPreviousNumbers(
          numbers,
          index + preambleLength
        ).some((firstNumber) =>
          getPreviousNumbers(numbers, index + preambleLength).some(
            (secondNumber) => firstNumber + secondNumber === currentNumber
          )
        )
    );

const invalidNumber = findInvalidNumber(numbers);
console.log(invalidNumber); //Your puzzle answer was 20874512.

const calculateSum = (numbers, index, sum = 0) =>
  sum >= invalidNumber
    ? { lastIndex: index, sum }
    : calculateSum(numbers, index + 1, sum + numbers[index]);

const findEncryptionWeakness = (numbers, index = 0) => {
  const { lastIndex, sum } = calculateSum(numbers, index);
  if (sum === invalidNumber) {
    const sortedNumbers = numbers
      .slice(index, lastIndex)
      .sort((i, j) => i - j);
    return sortedNumbers[0] + sortedNumbers[sortedNumbers.length - 1];
  }
  return findEncryptionWeakness(numbers, index + 1);
};

console.log(findEncryptionWeakness(numbers)); //Your puzzle answer was 3012420.
