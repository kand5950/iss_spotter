const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      return callback(error,null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;


    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      return callback(error,null);
    }

    const parsedBody = JSON.parse(body);
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }

    const { latitude, longitude } = parsedBody;

    callback(null, {latitude, longitude});
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
    const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
    request(url, (error, response, body) => {
      if (error) {
        return callback(error,null);
      }
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }

      const passes = JSON.parse(body).response;
      callback(null, passes);
    });
};

// //module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes  };

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error,null);
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error,null);
      }
      fetchISSFlyOverTimes(coords, (error, flyOverTimes) => {
        if (error) {
          return callback(error,null);
        }
        for (const times of flyOverTimes) {
          const datetime = new Date(0);
          datetime.setUTCSeconds(times.risetime);
          const duration = times.duration;
          
          console.log(`Next pass @ ${datetime} for ${duration} secs!`);
        }
      
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };


