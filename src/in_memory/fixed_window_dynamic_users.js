const express = require("express");
const moment = require("moment");

const app = express();
const PORT = 3000;

const REQUESTS_LIMIT = 3;
const TIME_PERIOD=10;

/*
  Description:
    Here is the implementation of fixed window rate limiter algorithm.
    The idea is that each and every distinct user(identified by id) has their associated data for each and every time window chunck of length LIMIT and 
    They simply can't send more then N requests during period of LIMIT. After LIMIT time period is passed counter is refilled.
  Pros: 
    Easy to implement
  Cons:
    Can't protect API from sudden spikes in traffic, like having 2*N requests suddenly arrive at the near end of the N-th and at the near start of N+1-th time intervals.
    Due to in memory implementation of state can't work in distributed environment.

  Complexity:
    Time: O(1)
    Space: O(N)
*/
const fixedWindowLimiter = {};
const ttls={}


app.all("/api", (req, resp) => {
  const id = req.query.id;
  const now = moment().toISOString();
  if (fixedWindowLimiter[id]) {
    const [count, timestamp] = fixedWindowLimiter[id];
    if (count > 0) {
      fixedWindowLimiter[id] = [count - 1, timestamp];
      resp.status(200).send({ message: "ok" });
    } else {
      resp.status(429).send({ message: "Rate limit exceeded" });
    }
  } else {
    fixedWindowLimiter[id] = [REQUESTS_LIMIT - 1, now];
    /* Since this implementation is concerned with the case of dynamic + quickly changeing user 
    base we need to periodically remove elements not to fill up memory with statle data.*/
    ttls[id] = setTimeout(()=>{
      delete fixedWindowLimiter[id]
      delete ttls[id]
    }, TIME_PERIOD* 1000)
    resp.status(200).send({ message: "ok" });
  }
});


app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
