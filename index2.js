// const { fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss_promised');
// const { fetchMyIP } = require('./iss_promised');
const { nextISSTimesForMyLocation } = require('./iss_promised');

// fetchMyIP()
//   .then(fetchCoordsByIP)
//   .then(fetchISSFlyOverTimes)
//   .then(body => console.log(body));

const printPassTimes = function(passTimes) {
  for (const times of flyOverTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(times.risetime);
    const duration = times.duration;
    
    console.log(`Next pass @ ${datetime} for ${duration} secs!`);

  }
};
  
nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  });