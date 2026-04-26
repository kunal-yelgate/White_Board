const rateLimit = require('express-rate-limit');

const socketRateLimiter = rateLimit({
  windowMs: 1000,
  max: 20,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please slow down.' });
  },
});

module.exports = { socketRateLimiter };
