const jwt = require('jsonwebtoken');

// التوكن بيحمل جوّاه الـ id والـ role عشان الفرونت يقرأهم بـ jwtDecode
exports.signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

exports.verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
