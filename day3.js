const rows = require("fs")
  .readFileSync("day3.input", "utf-8")
  .split("\r\n")
  .map((row) => row.split(""));

const move = (x, y, count, rows, xDelta, yDelta) =>
  x < rows.length - 1
    ? y + yDelta < rows[0].length
      ? move(
          x + xDelta,
          y + yDelta,
          rows[x][y] === "#" ? count + 1 : count,
          rows,
          xDelta,
          yDelta
        )
      : move(
          x + xDelta,
          y - rows[0].length + yDelta,
          rows[x][y] === "#" ? count + 1 : count,
          rows,
          xDelta,
          yDelta
        )
    : rows[x][y] === "#"
    ? count + 1
    : count;

console.log(move(0, 0, 0, rows, 1, 3) === 189);

const product = [
  [1, 1],
  [1, 3],
  [1, 5],
  [1, 7],
  [2, 1],
].reduce(
  (product, deltas) => product * move(0, 0, 0, rows, deltas[0], deltas[1]),
  1
);

console.log(product === 1718180100);
