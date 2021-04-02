const input = require("fs")
  .readFileSync("day12.input", "utf-8")
  .split("\n")
  .map((line) => ({ action: line[0], value: parseInt(line.substring(1)) }));

const INITIAL_LOCATION = {
  west: 0,
  north: 0,
};

const DIRECTIONS = ["E", "S", "W", "N"];

const getNextDirection = (direction, action, value) => {
  const shift = ((action === "R" ? 1 : -1) * value) / 90; // assumption is that the values are: 90, 180, 270
  const nextDirectionIndex = (DIRECTIONS.indexOf(direction) + shift) % 4;
  return DIRECTIONS[
    nextDirectionIndex >= 0 ? nextDirectionIndex : 4 + nextDirectionIndex
  ];
};

const ACTION_MAP = {
  W: (state, value) => ({ ...state, west: state.west + value }),
  E: (state, value) => ({ ...state, west: state.west - value }),
  N: (state, value) => ({ ...state, north: state.north + value }),
  S: (state, value) => ({ ...state, north: state.north - value }),
  L: (state, value) => ({
    ...state,
    direction: getNextDirection(state.direction, "L", value),
  }),
  R: (state, value) => ({
    ...state,
    direction: getNextDirection(state.direction, "R", value),
  }),
  F: (state, value) => ({ ...ACTION_MAP[state.direction](state, value) }),
};

const part1Result = input.reduce(
  (state, line) => ACTION_MAP[line.action](state, line.value),
  { ...INITIAL_LOCATION, direction: "E" }
);
console.log(Math.abs(part1Result.north) + Math.abs(part1Result.west)); //Your puzzle answer was 938.

//part 2
const INITIAL_WAYPOINT_LOCATION = {
  xDirection: "E",
  xValue: 10,
  yDirection: "N",
  yValue: 1,
};

const INITIAL_STATE = {
  ...INITIAL_LOCATION,
  ...INITIAL_WAYPOINT_LOCATION,
};

const WAYPOINT_ACTION_MAP = {
  W: (state, value) => ({
    ...state,
    ...(state.xDirection === "E"
      ? state.xValue - value > 0
        ? { xValue: state.xValue - value }
        : { xValue: value - state.xValue, xDirection: "W" }
      : { xValue: state.xValue + value }),
  }),
  E: (state, value) => ({
    ...state,
    ...(state.xDirection === "W"
      ? state.xValue - value > 0
        ? { xValue: state.xValue - value }
        : { xValue: value - state.xValue, xDirection: "E" }
      : { xValue: state.xValue + value }),
  }),
  N: (state, value) => ({
    ...state,
    ...(state.yDirection === "S"
      ? state.yValue - value > 0
        ? { yValue: state.yValue - value }
        : { yValue: value - state.yValue, yDirection: "N" }
      : { yValue: state.yValue + value }),
  }),
  S: (state, value) => ({
    ...state,
    ...(state.yDirection === "N"
      ? state.yValue - value > 0
        ? { yValue: state.yValue - value }
        : { yValue: value - state.yValue, yDirection: "S" }
      : { yValue: state.yValue + value }),
  }),
  L: (state, value) => ({
    ...state,
    ...getNextWaypointState(state, "L", value),
  }),
  R: (state, value) => ({
    ...state,
    ...getNextWaypointState(state, "R", value),
  }),
};

const oppositeDirection = {
  N: "S",
  S: "N",
  W: "E",
  E: "W",
};

const getNextWaypointState = (state, direction, value) => {
  const nextXDirection = getNextDirection(state.xDirection, direction, value);
  const nextYDirection = getNextDirection(state.yDirection, direction, value);

  return oppositeDirection[nextXDirection] == state.xDirection
    ? {
        xDirection: nextXDirection,
        yDirection: nextYDirection,
      }
    : {
        xDirection: nextYDirection,
        yDirection: nextXDirection,
        xValue: state.yValue,
        yValue: state.xValue,
      };
};

const isWaypointAction = (action) =>
  ["W", "E", "N", "S", "L", "R"].includes(action);

const calculateShipLocation = (state, value) => ({
  ...state,
  west:
    state.xDirection === "W"
      ? state.west + value * state.xValue
      : state.west - value * state.xValue,
  north:
    state.yDirection === "N"
      ? state.north + value * state.yValue
      : state.north - value * state.yValue,
});

const part2Result = input.reduce(
  (state, line) =>
    isWaypointAction(line.action)
      ? WAYPOINT_ACTION_MAP[line.action](state, line.value)
      : calculateShipLocation(state, line.value),
  { ...INITIAL_STATE }
);

console.log(Math.abs(part2Result.north) + Math.abs(part2Result.west)); //Your puzzle answer was 54404.
