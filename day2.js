const lines = require("fs").readFileSync("day2.input", "utf-8").split("\n");

const day2Part1 = (lines) =>
  lines.reduce((count, line) => {
    const lineParts = line.split(" ");
    const policyLimits = lineParts[0].split("-");
    const policyCharacter = lineParts[1].substring(0, 1);

    const numberOfOccurrences = lineParts[2]
      .split("")
      .filter((character) => character === policyCharacter).length;

    return numberOfOccurrences >= parseInt(policyLimits[0]) &&
      numberOfOccurrences <= parseInt(policyLimits[1])
      ? ++count
      : count;
  }, 0);

console.log(day2Part1(lines) === 636);

const xor = (condition1, condition2) =>
  condition1 ? !condition2 : condition2;

const day2Part2 = (lines) =>
  lines.reduce((count, line) => {
    const lineParts = line.split(" ");
    const [
      firstCharacterPosition,
      secondCharacterPosition,
    ] = lineParts[0].split("-").map((position) => parseInt(position) - 1);
    const policyCharacter = lineParts[1].substring(0, 1);
    const passwordCharacters = lineParts[2].split("");

    return xor(
      passwordCharacters[firstCharacterPosition] === policyCharacter,
      passwordCharacters.length >= secondCharacterPosition &&
        lineParts[2].split("")[secondCharacterPosition] === policyCharacter
    )
      ? ++count
      : count;
  }, 0);

console.log(day2Part2(lines) === 588);
