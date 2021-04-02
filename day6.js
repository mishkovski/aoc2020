const fs = require("fs");

const puzzleInput = fs.readFileSync("day6.input", "utf8");

const part1Result = puzzleInput
  .split("\r\n\r\n")
  .map((group) =>
    group
      .replace(/\r?\n|\r/g, "")
      .split("")
      .reduce((uniqueChars, char) => uniqueChars.add(char), new Set())
  )
  .reduce((count, group) => count + group.size, 0);

console.log("Part 1 Result: ", part1Result);
console.log(part1Result === 6542);

const part2Result = puzzleInput.split("\r\n\r\n").reduce((count, group) => {
  const forms = group.split("\n");

  const questionCount = forms.reduce((questionCount, form) => {
    form.split("").forEach((char) => {
      if (questionCount[char]) {
        questionCount[char] += 1;
      } else {
        questionCount[char] = 1;
      }
    });
    return questionCount;
  }, {});

  return (
    count +
    Object.entries(questionCount).filter(
      (question) => question[1] === forms.length
    ).length
  );
}, 0);

console.log("Part 2 Result: ", part2Result);
console.log(part2Result === 3299);
