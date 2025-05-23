const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const FetchUser = async (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({
      msg: "Access Denied. No token provided",
    });
  }

  try {
    const data = await jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid Token",
    });
  }
};

module.exports = FetchUser;
