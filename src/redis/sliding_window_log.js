const express = require("express");
const moment = require("moment");
const redis = require('redis')

const app = express();
const PORT = 3000;

const REQUESTS_LIMIT = 3;
const TIME_PERIOD_SECONDS = 10;
const TIME_PERIOD_MILLIS=TIME_PERIOD_SECONDS * 1000;

const redisClient = redis.createClient();

app.all("/api", async (req, resp) => {
    const id = req.query.id;
    const now = moment().valueOf();
    const transaction = await redisClient.multi()
        .zRemRangeByScore(id, 0, now - TIME_PERIOD_MILLIS-1)
        .zAdd(id, { score: now, value: now.toString() })
        .zRange(id, 0, -1)
        .expire(id, TIME_PERIOD_SECONDS)
        .exec()
    if(transaction){
        const elements = transaction[2];
        if(elements.length > REQUESTS_LIMIT){
            resp.status(429).send({message: "Rate limit exceeded"})
        }else{
            resp.status(200).send({message: "ok"})
        }
    }else{
        resp.send({message:'Not ok'})
    }
});

const setupRedis = async () => {
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    redisClient.on('connect', ()=> console.log('connected'))
    await redisClient.connect()
}

setupRedis().then(res=>{  
    app.listen(PORT, (error) => {
        if (!error)
          console.log(
            "Server is Successfully Running, and App is listening on port " + PORT
          );
        else console.log("Error occurred, server can't start", error);
      });
})
.catch(e=>console.log(e))
