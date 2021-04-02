const numbers = require("fs")
  .readFileSync("day10.input", "utf-8")
  .split("\n")
  .map((line) => parseInt(line));
