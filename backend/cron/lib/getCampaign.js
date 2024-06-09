const Campaign = require('../models/campaign.model');

module.exports = async () => {

    return await Campaign.findOne({status: 'in-progress'}).sort({ createdAt: 1 });
}