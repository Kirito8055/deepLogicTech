let days = 5;
let assuranceProbability = 0.98;
const numberOfSimulations = 50000;
let distances = [];

// function to extrapolate the distance according to distance v/s probability equation
function distanceTravelledByPerson(probability) {
  return (38 - 35 * probability) / 2;
}

// many simulations
for (let i = 0; i < numberOfSimulations; i++) {
  let totalInfected = [0];

  // simulation per day
  for (let j = 0; j < days; j++) {
    let newInfected = [];
    for (let i = 0; i < totalInfected.length; i++) {
      let probability = Math.random();
      let dist = distanceTravelledByPerson(probability);
      totalInfected[i] += dist;
      newInfected.push(totalInfected[i]);
    }
    newInfected.forEach((infectedPerson) => {
      totalInfected.push(infectedPerson);
    });
  }
  let maxRadius = 0;
  totalInfected.forEach((distanceByPerson) => {
    maxRadius = Math.max(maxRadius, distanceByPerson);
  });
  distances.push(maxRadius);
}
distances.sort();
console.log(distances[0.02 * numberOfSimulations]/2);
