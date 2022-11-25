const express = require("express");
const moment = require("moment");

const app = express();
const PORT = 3000;

const REQUESTS_LIMIT = 3;
const TIME_PERIOD = 10;

/*
  Description:
   Here is the implementation of sliding window log rate limiting algorithm.
   The basic idea of the algorithm is to look at previous request issued during now-interval time difference and count whether limit has been reached.
   This way no sudden spike load-s will happen at the time interval edges
  Pros: 
    Doesn't allow sudden spikes in load and evens out all the requests.
    Precise in the rate limiting of requests
  Cons:
    High memory consumption rate
    Still collects timestamp in logs even if the request was blocked
    If users doesn't stop pinging requests for cool down period of time he will always get blocked since all blocked requests also get stored.
*/
const slidingWindowLog = {};
const ttls = {};

app.all("/api", (req, resp) => {
  const id = req.query.id;
  const now = moment().toISOString();
  const timestamps = slidingWindowLog[id] || []
  const removedOldTimeStamps = timestamps.filter(timestamp=>moment(now).diff(moment(timestamp), 'seconds') <= TIME_PERIOD)
  removedOldTimeStamps.push(now)
  const newTimeStamps = removedOldTimeStamps;
  // Update in memory ttl mechanisms so that if user hasn't sent a request for a long time invalidate it's entry to optimize the storage
  const ttl = ttls[id];
  if(ttl) clearTimeout(ttl)
  ttls[id] = setTimeout(()=>{
    delete slidingWindowLog[id];
    delete ttls[id];
  }, TIME_PERIOD*1000)
  slidingWindowLog[id]=newTimeStamps

  if(newTimeStamps.length > REQUESTS_LIMIT){
    resp.status(429).send({ message: "Rate limit exceeded" });
  }else{
    resp.status(200).send({message: 'ok'});
  }
});

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
