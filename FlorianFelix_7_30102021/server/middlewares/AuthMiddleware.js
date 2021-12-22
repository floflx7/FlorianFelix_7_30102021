const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accesstoken");

  if (accessToken) {
    try {
      const validToken = verify(accessToken, "importantsecret");
      req.user = validToken;
      if (validToken) {
        return next();
      }
    } catch (err) {
      return res.json({ error: err });
    }
  } else {
    return res.json({ error: "User not logged in!" });
  }
};

module.exports = { validateToken };
