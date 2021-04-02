const lines = require("fs").readFileSync("day8.input", "utf-8").split("\n");

const getParts = (splitLine) => ({
  command: splitLine[0],
  value: parseInt(splitLine[1]),
});
const processLine = (line) => getParts(line.split(" "));

const runCommand = (
  { command, value },
  lines,
  currentIndex,
  acc,
  visitedIndices
) =>
  visitedIndices.includes(currentIndex)
    ? { acc, currentIndex }
    : currentIndex === lines.length - 1
    ? {
        acc: command === "acc" ? acc + value : acc,
        currentIndex,
      }
    : run(
        lines,
        command === "jmp" ? currentIndex + value : currentIndex + 1,
        command === "acc" ? acc + value : acc,
        [...visitedIndices, currentIndex]
      );

const run = (lines, currentIndex = 0, acc = 0, visitedIndices = []) =>
  runCommand(
    processLine(lines[currentIndex]),
    lines,
    currentIndex,
    acc,
    visitedIndices
  );

const switchCommands = (line) =>
  line.includes("nop")
    ? line.replace("nop", "jmp")
    : line.replace("jmp", "nop");

const fixAndRun = (lines, index = 0) => {
  const result = run(
    Object.assign([], lines, {
      [index]: switchCommands(lines[index]),
    })
  );
  if (result.currentIndex === lines.length - 1) return result.acc;
  return fixAndRun(lines, index + 1);
};

console.log(run(lines).acc); //Your puzzle answer was 1814.
console.log(fixAndRun(lines)); //Your puzzle answer was 1056.
