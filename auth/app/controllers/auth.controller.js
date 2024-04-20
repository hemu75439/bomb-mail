const config = require("../config/auth.config");
const db = require("../models");
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
      return res.status(500);
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            log.error(err);
            return res.status(500);
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              log.error(err);
              return res.status(500);

            }
            log.info('User was registered successfully!');
            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          log.error(err);
          return res.status(500);
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            log.error(err);
            return res.status(500);
          }
          log.info('User was registered successfully!');
          res.send({ message: "User was registered successfully!" });
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
        return res.status(500);
      }

      if (!user) {
        log.info("User Not found.");
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        log.info("Invalid Password!");
        return res.status(401).send({
          message: "Invalid Password!"
        });
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
        return res.status(200).json({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles.map(e => "ROLE_" + e.name.toUpperCase()),
          isPlanActive: !!(new Date() < new Date(user?.plan_valid_till || '')),
          accessToken: token
        });
      }catch(e) {
        log.error(e);
        return res.status(500);
      }
    });
};

exports.jwt = async (req, res) => {
  try {
    const token = req.params.token;
    if (!token) {
      log.error('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const decodedToken = jwt.verify(token, config.secret);
    log.info(JSON.stringify(decodedToken));
  
    const currentTime = Math.floor(Date.now() / 1000);
  
    if(decodedToken?.exp < currentTime) {
      log.error('Token expired');
      res.status(401).json({message: 'Token expired'});
    }

    const user = await User.findById(decodedToken?.id).populate("roles", "-__v").populate("active_plan", "-__v");

    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(e => "ROLE_" + e.name.toUpperCase()),
      isPlanActive: !!(new Date() < new Date(user?.plan_valid_till || ''))
    });
  } catch(e) {
    log.error(e);
    res.send(401).json({message: 'Invalid token'});
  }
}