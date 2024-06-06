const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.plan = require("./plan.model");
db.campaign = require("./campaign.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;