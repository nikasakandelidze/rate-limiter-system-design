# Rate limiters
In this repo we discuss the system design of rate limiters and some of the most popular algorithms and their concrete implementations.

# Algorithms
- Fixed window algorithm
- Rolling window log algorithm
- Rolling window counter algorithm

## Fixed window algorithm
## Rolling window log algorithm
#### State sample
![state](./assets/Screenshot%202022-11-28%20at%2013.37.32.png)
#### Pseudocode algorithm
![algorithm](./assets/Screenshot%202022-11-26%20at%2022.53.31.png)

## Rolling window counter algorithm
#### State sample
![state](./assets/Screenshot%202022-11-26%20at%2022.53.58.png)
#### Pseudocode algorithm
![algorithm](./assets/Screenshot%202022-11-26%20at%2023.05.24.png)

# High level System Design
![diagrma](./assets/Screenshot%202022-11-26%20at%2023.08.11.png)

# References
- https://cloud.google.com/architecture/rate-limiting-strategies-techniques
- https://www.enjoyalgorithms.com/blog/design-api-rate-limiter
- https://stripe.com/blog/rate-limiters
- https://blog.cloudflare.com/counting-things-a-lot-of-different-things/
- https://leetcode.com/discuss/interview-question/system-design/1616482/System-Design%3A-Rate-Limiter
- https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html
- https://konghq.com/blog/how-to-design-a-scalable-rate-limiting-algorithm
- https://engineering.classdojo.com/blog/2015/02/06/rolling-rate-limiter/
- https://shopify.dev/api/usage/rate-limits#rest-admin-api-rate-limits
- https://medium.com/@saisandeepmopuri/system-design-rate-limiter-and-data-modelling-9304b0d18250
- https://www.figma.com/blog/an-alternative-approach-to-rate-limiting/