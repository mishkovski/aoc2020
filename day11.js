const layout = require("fs")
  .readFileSync("day11.input", "utf-8")
  .split("\n")
  .map((row) => row.split(""));

// adjacent seats:
// [rowIndex - 1, columnIndex - 1] [rowIndex - 1, columnIndex] [rowIndex - 1, columnIndex + 1]
// [rowIndex, columnIndex - 1]     [rowIndex, columnIndex]     [rowIndex, columnIndex + 1]
// [rowIndex + 1, columnIndex - 1] [rowIndex + 1, columnIndex] [rowIndex + 1, columnIndex + 1]
const countRow = (layout, rowIndex, columnIndex, shiftArray) =>
  shiftArray.reduce(
    (sum, shift) =>
      layout[rowIndex][columnIndex + shift] === "#" ? sum + 1 : sum,
    0
  );

const countOccupiedAround = (layout, rowIndex, columnIndex) => {
  const firstRowCount =
    rowIndex - 1 >= 0
      ? countRow(layout, rowIndex - 1, columnIndex, [-1, 0, 1])
      : 0;
  const secondRowCount = countRow(layout, rowIndex, columnIndex, [-1, 1]);
  const thirdRowCount =
    rowIndex + 1 < layout.length
      ? countRow(layout, rowIndex + 1, columnIndex, [-1, 0, 1])
      : 0;
  return firstRowCount + secondRowCount + thirdRowCount;
};

const getNextLayout = (layout) =>
  layout.map((row, rowIndex) =>
    row.map((seat, columnIndex) => {
      const conditionForOccupied =
        layout[rowIndex][columnIndex] === "L" &&
        countOccupiedAround(layout, rowIndex, columnIndex) === 0;
      const conditionForEmpty =
        layout[rowIndex][columnIndex] === "#" &&
        countOccupiedAround(layout, rowIndex, columnIndex) >= 4;
      return conditionForOccupied
        ? "#"
        : conditionForEmpty
        ? "L"
        : layout[rowIndex][columnIndex];
    })
  );

const areLayoutsDifferent = (layout, nextLayout) =>
  layout.some((row, rowIndex) =>
    row.some(
      (seat, columnIndex) =>
        layout[rowIndex][columnIndex] !== nextLayout[rowIndex][columnIndex]
    )
  );

const changeLayout = (layout) => {
  const nextLayout = getNextLayout(layout);
  return areLayoutsDifferent(layout, nextLayout)
    ? changeLayout(nextLayout)
    : layout;
};

const part1Result = changeLayout(layout, 0).reduce(
  (sum, row) =>
    sum +
    row.reduce((rowSum, seat) => (seat === "#" ? rowSum + 1 : rowSum), 0),
  0
);

console.log(part1Result); //Your puzzle answer was 2166.

//part 2
const checkDirection = (
  layout,
  checkStopCondition,
  getNextPosition,
  position
) =>
  checkStopCondition(position)
    ? false
    : layout[position.rowIndex][position.columnIndex] === "#"
    ? true
    : layout[position.rowIndex][position.columnIndex] === "L"
    ? false
    : checkDirection(
        layout,
        checkStopCondition,
        getNextPosition,
        getNextPosition(position)
      );

const countOccupiedInAllDirections = (layout, position) =>
  [
    {
      //left
      position: { ...position, columnIndex: position.columnIndex - 1 },
      checkStopCondition: ({ columnIndex }) => columnIndex === -1,
      getNextPosition: (position) => ({
        ...position,
        columnIndex: position.columnIndex - 1,
      }),
    },
    {
      //top left
      position: {
        rowIndex: position.rowIndex - 1,
        columnIndex: position.columnIndex - 1,
      },
      checkStopCondition: ({ rowIndex, columnIndex }) =>
        rowIndex === -1 || columnIndex === -1,
      getNextPosition: (position) => ({
        columnIndex: position.columnIndex - 1,
        rowIndex: position.rowIndex - 1,
      }),
    },
    {
      //top
      position: { ...position, rowIndex: position.rowIndex - 1 },
      checkStopCondition: ({ rowIndex }) => rowIndex === -1,
      getNextPosition: (position) => ({
        ...position,
        rowIndex: position.rowIndex - 1,
      }),
    },
    {
      //top right
      position: {
        rowIndex: position.rowIndex - 1,
        columnIndex: position.columnIndex + 1,
      },
      checkStopCondition: ({ rowIndex, columnIndex }) =>
        rowIndex === -1 || columnIndex === layout[0].length,
      getNextPosition: (position) => ({
        columnIndex: position.columnIndex + 1,
        rowIndex: position.rowIndex - 1,
      }),
    },
    {
      //right
      position: { ...position, columnIndex: position.columnIndex + 1 },
      checkStopCondition: ({ columnIndex }) =>
        columnIndex === layout[0].length,
      getNextPosition: (position) => ({
        ...position,
        columnIndex: position.columnIndex + 1,
      }),
    },
    {
      //down right
      position: {
        rowIndex: position.rowIndex + 1,
        columnIndex: position.columnIndex + 1,
      },
      checkStopCondition: ({ rowIndex, columnIndex }) =>
        rowIndex === layout.length || columnIndex === layout[0].length,
      getNextPosition: (position) => ({
        columnIndex: position.columnIndex + 1,
        rowIndex: position.rowIndex + 1,
      }),
    },
    {
      //down
      position: { ...position, rowIndex: position.rowIndex + 1 },
      checkStopCondition: ({ rowIndex }) => rowIndex === layout.length,
      getNextPosition: (position) => ({
        ...position,
        rowIndex: position.rowIndex + 1,
      }),
    },
    {
      //down left
      position: {
        rowIndex: position.rowIndex + 1,
        columnIndex: position.columnIndex - 1,
      },
      checkStopCondition: ({ rowIndex, columnIndex }) =>
        rowIndex === layout.length || columnIndex === -1,
      getNextPosition: (position) => ({
        columnIndex: position.columnIndex - 1,
        rowIndex: position.rowIndex + 1,
      }),
    },
  ].reduce(
    (sum, direction) =>
      sum <= 5 &&
      checkDirection(
        layout,
        direction.checkStopCondition,
        direction.getNextPosition,
        direction.position
      )
        ? sum + 1
        : sum,
    0
  );

const getNextLayoutModified = (layout) =>
  layout.map((row, rowIndex) =>
    row.map((seat, columnIndex) => {
      const occupiedCount = countOccupiedInAllDirections(layout, {
        rowIndex,
        columnIndex,
      });
      const conditionForOccupied =
        layout[rowIndex][columnIndex] === "L" && occupiedCount === 0;
      const conditionForEmpty =
        layout[rowIndex][columnIndex] === "#" && occupiedCount >= 5;
      return conditionForOccupied
        ? "#"
        : conditionForEmpty
        ? "L"
        : layout[rowIndex][columnIndex];
    })
  );

const changeLayoutModified = (layout) => {
  const nextLayout = getNextLayoutModified(layout);
  return areLayoutsDifferent(layout, nextLayout)
    ? changeLayoutModified(nextLayout)
    : layout;
};

const part2Result = changeLayoutModified(layout, 0).reduce(
  (sum, row) =>
    sum +
    row.reduce((rowSum, seat) => (seat === "#" ? rowSum + 1 : rowSum), 0),
  0
);

console.log(part2Result); //Your puzzle answer was 1955.
