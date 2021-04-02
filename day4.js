const fs = require("fs");

const passports = fs.readFileSync("day4.input", "utf8").split("\r\n\r\n");

//part one
const resultPart1 =
  passports.length -
  passports.filter((passport) =>
    ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"].some(
      (field) => !passport.includes(field)
    )
  ).length;

console.log("resultPart1: ", resultPart1);
console.log(resultPart1 === 208);

//part two
const cmHeightRule = (value) => !isNaN(value) && value >= 150 && value <= 193;
const inHeightRule = (value) => !isNaN(value) && value >= 59 && value <= 76;

const checks = [
  {
    fieldName: "byr",
    rule: (value) =>
      !!value &&
      value.length === 4 &&
      parseInt(value) >= 1920 &&
      parseInt(value) <= 2002,
  },
  {
    fieldName: "iyr",
    rule: (value) =>
      !!value &&
      value.length === 4 &&
      parseInt(value) >= 2010 &&
      parseInt(value) <= 2020,
  },
  {
    fieldName: "eyr",
    rule: (value) =>
      !!value &&
      value.length === 4 &&
      parseInt(value) >= 2020 &&
      parseInt(value) <= 2030,
  },
  {
    fieldName: "hgt",
    rule: (value) =>
      !!value &&
      ((value.includes("cm") && cmHeightRule(value.match("(.*?)cm")[1])) ||
        (value.includes("in") && inHeightRule(value.match("(.*?)in")[1]))),
  },
  {
    fieldName: "hcl",
    rule: (value) => !!value && /^#[a-f0-9]/.test(value),
  },
  {
    fieldName: "ecl",
    rule: (value) =>
      !!value &&
      ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(value),
  },
  {
    fieldName: "pid",
    rule: (value) => !!value && value.length === 9 && !isNaN(parseInt(value)),
  },
];

const pipe = (...functions) => (input) =>
  functions.reduce((output, current) => current.call(null, output), input);

const extractValue = (fieldName) => (passport) =>
  passport.includes(fieldName) &&
  passport.match(new RegExp(fieldName + ":(.*?)\\s"))[1];

const resultPart2 =
  passports.length -
  passports.filter((passport) =>
    checks.some(
      (check) =>
        !pipe(extractValue(check.fieldName), check.rule)(passport + " ")
    )
  ).length;

console.log("resultPart2: ", resultPart2);
console.log(resultPart2 === 167);
