const jwt = require('jsonwebtoken');

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = payload;
    return next();
  } catch (error) {
    return next(new Error('Authentication error'));
  }
};

module.exports = { authenticateSocket };
