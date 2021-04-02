const entries = require("fs")
  .readFileSync("day1.input", "utf-8")
  .split("\n")
  .map((line) => parseInt(line));

const part1Result = entries
  .map((entry) => [
    entry,
    entries.find((secondEntry) => entry + secondEntry === 2020),
  ])
  .find((entry) => entry[1] !== undefined)
  .reduce((product, entry) => product * entry, 1);

console.log(part1Result);

const day1Part2 = (entries) => {
  let triplet;
  entries.find((firstEntry, firstEntryIndex) =>
    entries.find((secondEntry, secondEntryIndex) => {
      const lastMatchingEntry = entries.find(
        (thirdEntry, thirdEntryIndex) =>
          firstEntry + secondEntry + thirdEntry == 2020 &&
          firstEntryIndex !== secondEntryIndex &&
          secondEntryIndex !== thirdEntryIndex
      );
      if (lastMatchingEntry) {
        triplet = [firstEntry, secondEntry, lastMatchingEntry];
        return true;
      }
      return false;
    })
  );
  return triplet ? triplet[0] * triplet[1] * triplet[2] : "no result";
};

const part2Result = day1Part2(entries);
console.log(part2Result);
