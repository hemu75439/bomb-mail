const db = require("../models");
const User = db.user;
const Plan = db.plan;


exports.addPlan = async (req, res) => {
  const plan = await Plan.findById(req.body.planId);
  if(!plan) return res.status(500).send({ message: "Invalid plan!" });

  const plan_valid_till = new Date();
  plan_valid_till.setDate(plan_valid_till.getDate() + plan.validity);

  const user = await User.findOneAndUpdate(
    { $or: [{ username: req.body.user}, {email: req.body.user}]},
    {
      active_plan: plan,
      plan_valid_till
    },
    {new: true, lean: true}
  ).populate("active_plan", "-__v").populate("roles", "-__v");

  res.status(200).send({
    message: "Plan added!",
    data: {
      ...user, password: null, 
      roles: user.roles.map(e => "ROLE_" + e.name.toUpperCase())
    }
  });
};


exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};