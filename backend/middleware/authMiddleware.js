const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User'); // Optional, if you want to validate from DB

const authMiddleware = asyncHandler(async (req, res, next) => {
   
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT_SECRET not set in environment');
    }

    const decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });

    // Optional: fetch full user info from DB
    // const user = await User.findById(decoded.id);
    // if (!user) return res.status(401).json({ message: 'User not found' });
    // req.user = user;

    req.user = decoded; // attach decoded token info
    next();
});

module.exports = authMiddleware;
