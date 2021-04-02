const fs = require("fs");

const lines = fs.readFileSync("day5.input", "utf8").split("\r\n");

const calculator = {
  F: (seat) => ({
    ...seat,
    row: [seat.row[0], Math.floor((seat.row[0] + seat.row[1]) / 2)],
  }),
  B: (seat) => ({
    ...seat,
    row: [Math.ceil((seat.row[0] + seat.row[1]) / 2), seat.row[1]],
  }),
  L: (seat) => ({
    ...seat,
    column: [
      seat.column[0],
      Math.floor((seat.column[0] + seat.column[1]) / 2),
    ],
  }),
  R: (seat) => ({
    ...seat,
    column: [
      Math.ceil((seat.column[0] + seat.column[1]) / 2),
      seat.column[1],
    ],
  }),
};

const getSeatId = (line) => {
  const { row, column } = line
    .split("")
    .reduce((seat, character) => calculator[character](seat), {
      row: [0, 127],
      column: [0, 7],
    });
  return row[0] * 8 + column[0];
};

const maxSeatId = lines.reduce((maxSeatId, line) => {
  const seatId = getSeatId(line);
  return seatId > maxSeatId ? seatId : maxSeatId;
}, 0);

console.log("Part 1 Result: ", maxSeatId);
console.log(maxSeatId === 922);

const allSeatIds = lines.map((line) => getSeatId(line));

const mySeat = Array.from(Array(128 * 8).keys()).find(
  (seatId) =>
    !allSeatIds.includes(seatId) &&
    allSeatIds.includes(seatId + 1) &&
    allSeatIds.includes(seatId - 1)
);

console.log("Part 2 Result: ", mySeat);
console.log(mySeat === 747);
