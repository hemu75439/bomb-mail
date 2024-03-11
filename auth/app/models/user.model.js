const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    active: {type: Boolean, default: true},

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],

    active_plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan"
    },
    plan_valid_till: Date
    
  }, {timestamps: true})
);

module.exports = User;
