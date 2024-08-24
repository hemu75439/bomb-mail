const config = require("../config/auth.config");
const db = require("../models");
const { apiResponse } = require("../utils/apiResponse");
const { apiError } = require("../utils/apiError");
const User = db.user;
const Role = db.role;

const log = console;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  log.info('Registering new user...');
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      log.error(err);
      // return res.status(500);
      return res.status(500).json(new apiError(500, "Error registering user", err));
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            log.error(err);
            // return res.status(500);
            return res.status(500).json(new apiError(500, "Error registering user", err));
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              log.error(err);
              // return res.status(500);
              return res.status(500).json(new apiError(500, "Error registering user", err));
            }
            log.info('User was registered successfully!');
            // res.json({ message: "User was registered successfully!" });
            res.status(200).json(new apiResponse(200, null, 'User was registered successfully!'));
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          log.error(err);
          // return res.status(500);
          return res.status(500).json(new apiError(500, "Error registering user", err));
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            log.error(err);
            return res.status(500);
          }
          log.info('User was registered successfully!');
          // res.json({ message: "User was registered successfully!" });
          res.status(200).json(new apiResponse(200, null, 'User was registered successfully!'));
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  log.info('Logging in user...');
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .populate("active_plan", "-__v")
    .exec((err, user) => {
      if (err) {
        log.error(err);
        // return res.status(500);
        return res.status(500).json(new apiError(500, "Error logging in user", err));
      }

      if (!user) {
        log.info("User Not found.");
        // return res.status(404).send({ message: "User Not found." });
        return res.status(404).json(new apiError(404, "User Not found."));
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        log.info("Invalid Password!");
        // return res.status(401).send({
        //   message: "Invalid Password!"
        // });
        return res.status(401).json(new apiError(401, "Invalid Password!"));
      }

      const token = jwt.sign(
        { id: user.id },
        config.secret,
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 86400, // 24 hours
        }
      );
        
      try {
        log.info('Login successful!')
        // return res.status(200).json({
        //   id: user._id,
        //   username: user.username,
        //   email: user.email,
        //   roles: user.roles.map(e => "ROLE_" + e.name.toUpperCase()),
        //   isPlanActive: !!(new Date() < new Date(user?.plan_valid_till || '')),
        //   accessToken: token
        // });
        return res.status(200).json(new apiResponse(
          200, {
            id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles.map(e => "ROLE_" + e.name.toUpperCase()),
            isPlanActive: !!(new Date() < new Date(user?.plan_valid_till || '')),
            accessToken: token
          },
          "Login successful!",
        ));
      }catch(e) {
        log.error(e);
        // return res.status(500);
        return res.status(500).json(new apiError(500, "Error logging in user", e));
      }
    });
};

exports.jwt = async (req, res) => {
  try {
    const token = req.params.token;
    if (!token) {
      log.error('No token provided');
      // return res.status(401).json({ message: 'No token provided' });
      return res.status(401).json(new apiError(401, 'No token provided'));
    }
  
    const decodedToken = jwt.verify(token, config.secret);
    log.info(JSON.stringify(decodedToken));
  
    const currentTime = Math.floor(Date.now() / 1000);
  
    if(decodedToken?.exp < currentTime) {
      log.error('Token expired');
      // res.status(401).json({message: 'Token expired'});
      return res.status(401).json(new apiError(401, 'Token expired'));
    }

    const user = await User.findById(decodedToken?.id).populate("roles", "-__v").populate("active_plan", "-__v");

    if(!user) {
      // return res.status(401).json({message: 'Invalid token'});
      return res.status(401).json(new apiError(401, 'Invalid token'));
    }

    // return res.status(200).json({
    //   id: user._id,
    //   username: user.username,
    //   email: user.email,
    //   roles: user.roles.map(e => "ROLE_" + e.name.toUpperCase()),
    //   isPlanActive: !!(new Date() < new Date(user?.plan_valid_till || ''))
    // });
    return res.status(200).json(new apiResponse(
      200, {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles.map(e => "ROLE_" + e.name.toUpperCase()),
        isPlanActive: !!(new Date() < new Date(user?.plan_valid_till || ''))
      },
      "Success!"
    ))
  } catch(e) {
    log.error(e);
    // res.status(401).json({message: 'Invalid token'});
    res.status(401).json(new apiError(401, 'Invalid token'));
  }
}