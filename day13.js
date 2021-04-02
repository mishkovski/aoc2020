// 939 - 939%59 + 59
// timestamp - timestamp%busId + busId

const [firstLine, secondLine] = `939
67,7,59,61`.split("\n");

const timestamp = parseInt(firstLine);
const busIds = secondLine
  .split(",")
  .filter((id) => id !== "x")
  .map((id) => parseInt(id));

const getEarliestDeparture = (busId, timestamp) =>
  timestamp - (timestamp % busId) + busId;

const part1 = busIds.reduce((result, busId) => {
  const nextBusDeparture = getEarliestDeparture(busId, timestamp);
  const currentState = {
    nextDeparture: nextBusDeparture,
    minutesToWait: nextBusDeparture - timestamp,
    busId,
  };
  if (result.nextDeparture) {
    return result.nextDeparture > nextBusDeparture ? currentState : result;
  }
  return currentState;
}, {});

//console.log(part1.busId * part1.minutesToWait); //Your puzzle answer was 6559.

const busIdsAndOffsets = secondLine
  .split(",")
  .map((id, index) => ({ id, offset: index }))
  .filter((entry) => entry.id !== "x")
  .map((entry) => ({
    ...entry,
    id: parseInt(entry.id),
  }));

//busIdsAndOffsets;

// const findTimeStamp = (busIdsAndOffsets, firstId, multiplier, timestamp) => {
//   //console.log(multiplier, timestamp)
//   if(timestamp > 100000) return timestamp
//   if (busIdsAndOffsets.every((entry) => (getEarliestDeparture(entry.id, timestamp) - entry.offset) === timestamp))
//     return timestamp
//   return findTimeStamp(busIdsAndOffsets, firstId, multiplier + 1, firstId * multiplier)
// };

// findTimeStamp(busIdsAndOffsets.slice(1), 67, 1, 0)

let found = false;
let tempTimestamp = 0;
let multiplier = 1;
const firstId = busIdsAndOffsets[0].id;

while (tempTimestamp < 754018) {
  const test = busIdsAndOffsets
    .slice(1)
    .every(
      (entry) =>
        getEarliestDeparture(entry.id, tempTimestamp) - entry.offset ===
        tempTimestamp
    );
  tempTimestamp = multiplier * firstId;
  multiplier = multiplier + 1;
}

// while (!found) {
//   if ( console.log(tempTimestamp) || tempTimestamp > 10 ||
//     busIdsAndOffsets
//       .slice(1)
//       .every(
//         (entry) =>
//           getEarliestDeparture(entry.id, tempTimestamp) - entry.offset ===
//           tempTimestamp
//       )
//   ) {
//     found = true;
//   } else {
//     tempTimestamp = firstId * multiplier;
//     multiplier += 1;
//   }
//   //   return findTimeStamp(busIdsAndOffsets, firstId, multiplier + 1, firstId * multiplier)
// }

console.log(tempTimestamp);

// busIdsAndOffsets.slice(1).every((entry) => console.log(entry, getEarliestDeparture(entry.id, 754018)) || (getEarliestDeparture(entry.id, 754018) - entry.offset) === 754018)

// x = 7*m1
// x+1 = 13*m2
// x+4 = 59*m3
// x+6 = 31*m4
// x+7 = 19*m5
