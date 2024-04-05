let days = 5;
let assuranceProbability = 0.98;
const numberOfSimulations = 500000;

let max = (a, b) => {
  if (a > b) return a;
  else return b;
};

function distanceTravelledByPerson(probability){
  return (38 - 35*probability)/2;
} 

let maxRadius = 0;
for (let i = 0; i < numberOfSimulations; i++) {
  let totalInfected = [0];
  totalInfected.push(0); // the distance of infected people from origin

  // simulation per day
  for (let j = 0; j < days; j++) {

    // distance of newly infected people per day
    let newInfected = [];

    // new infected per person per day
    totalInfected.forEach((person) => {
      let probability = Math.random();
      let dist = distanceTravelledByPerson(probability); 

      // probability of getting infected
      if (Math.random() <= assuranceProbability) { 
        newInfected.push(person + dist);
      }
    });

    // add the newly infected people per day to the total infected people
    newInfected.forEach((infectedPerson) => {
      totalInfected.push(infectedPerson);
    });
  }
  totalInfected.forEach((distanceByPerson) => {
      maxRadius = max(maxRadius, distanceByPerson);
    });
  }

console.log(maxRadius);
