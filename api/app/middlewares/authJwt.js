const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const {apiError} = require('../utils/apiError');
const {apiResponse} = require('../utils/apiResponse');
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    // return res.status(403).send({ message: "No token provided!" });
    return res.status(403).json(new apiError(403, "No token provided!"));
  }

  jwt.verify(token,
            config.secret,
            (err, decoded) => {
              if (err) {
                // return res.status(401).send({
                //   message: "Unauthorized!",
                // });
                return res.status(401).json(new apiError(401, "Unauthorized!"));
              }
              req.userId = decoded.id;
              next();
            });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      // res.status(500).send({ message: err });
      res.status(500).json(new apiError(500, err));
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          // res.status(500).send({ message: err });
          res.status(500).json(new apiError(500, err));
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        // res.status(403).send({ message: "Require Admin Role!" });
        res.status(403).json(new apiError(403, "Require Admin Role!"));
        return;
      }
    );
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      // res.status(500).send({ message: err });
      res.status(500).json(new apiError(500, err));
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          // res.status(500).send({ message: err });
          res.status(500).json(new apiError(500, err));
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        // res.status(403).send({ message: "Require Moderator Role!" });
        res.status(403).json(new apiError(403, "Require Moderator Role!"));
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;
