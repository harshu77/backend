const jwt = require("jsonwebtoken");
require('dotenv').config();
const config = process.env;

const verifyToken = (req, res, next) => {
  const authorizationHeader =
     req.headers["Authorization"];

  const token = authorizationHeader.split(" ")[1]; 

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;




// const auth = require("./middleware/auth");

// app.post("/welcome", auth, (req, res) => {
//   res.status(200).send("Welcome 🙌 ");
// });
