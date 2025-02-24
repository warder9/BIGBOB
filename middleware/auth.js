const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.header('Authorization').replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      throw new Error('User not found');
    }

    // Attach the user and token to the request object
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

module.exports = auth;