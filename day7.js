const fs = require("fs");

const puzzleInput = fs.readFileSync("day7.input", "utf8");

const lines = puzzleInput.split("\r\n");

const searchTerm = "shiny gold";

const getParentColor = (parent) => parent.replace(/\sbags/, "");

const getChildrenColors = (children) =>
  children
    .replace(/\sbags/g, "")
    .replace(/\sbag/g, "")
    .replace(".", "")
    .split(", ")
    .map((child) => child.substring(2));

const processLine = (line) => {
  const [parent, children] = line.split(" contain ");

  return {
    parent: getParentColor(parent),
    children: getChildrenColors(children),
  };
};

const rulesMap = lines.reduce((rulesMap, line) => {
  const { parent, children } = processLine(line);
  rulesMap[parent] = children;
  return rulesMap;
}, {});

const containerColorsMap = Object.entries(rulesMap).reduce(
  (containerColorsMap, entry) => {
    entry[1].forEach((child) => {
      if (!containerColorsMap[child]) {
        containerColorsMap[child] = [entry[0]];
      } else {
        containerColorsMap[child].push(entry[0]);
      }
    });
    return containerColorsMap;
  },
  {}
);

const findAllContainers = (containers, allContainers) => {
  allContainers = [...allContainers, ...containers];
  const nextContainers = containers.reduce(
    (nextContainers, container) => [
      ...nextContainers,
      ...(containerColorsMap[container] ? containerColorsMap[container] : []),
    ],
    []
  );
  if (nextContainers.length === 0) {
    return allContainers;
  } else {
    return findAllContainers(nextContainers, allContainers);
  }
};

const allContainers = Array.from(
  new Set(findAllContainers([searchTerm], []))
);

console.log(allContainers.length - 1); //part1 result: 115

// part 2
const children = `4 plaid lavender bags, 5 striped violet bags, 4 plaid chartreuse bags.`;

const getChildren = (children) =>
  children
    .replace(/\sbags/g, "")
    .replace(/\sbag/g, "")
    .replace(".", "")
    .split(", ")
    .map((child) => ({ color: child.substring(2), count: child.charAt(0) }));

const processLineNew = (line) => {
  const [parent, children] = line.split(" contain ");

  return {
    parent: getParentColor(parent),
    children: getChildren(children),
  };
};

const rulesMapNew = lines.reduce((rulesMap, line) => {
  const { parent, children } = processLineNew(line);
  rulesMap[parent] = children;
  return rulesMap;
}, {});

//console.log(rulesMapNew);

const findAllBags = (bags, allBags) => {
  allBags = [...allBags, ...bags];
  const nextBags = bags.reduce(
    (nextBags, bag) => [
      ...nextBags,
      ...(rulesMapNew[bag.color]
        ? rulesMapNew[bag.color].map((child) => ({
            ...child,
            count: child.count * bag.count,
          }))
        : []),
    ],
    []
  );
  if (nextBags.length === 0) {
    return allBags;
  } else {
    return findAllBags(nextBags, allBags);
  }
};

console.log(
  findAllBags([{ color: searchTerm, count: 1 }], []).reduce(
    (count, bag) => (bag.count ? count + bag.count : count),
    0
  ) - 1
); //part2 result: 1250
