const mongoose = require("mongoose");

const Plan = mongoose.model(
  "Plan",
  new mongoose.Schema({
    name: String,
    validity: Number, // always in days
    version: Number, // 1.0
    price: Number,
    active: Boolean
  }, {timestamps: true})
);

module.exports = Plan;
