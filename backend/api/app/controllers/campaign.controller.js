const db = require("../models");
const google = require('../lib/google-oauth');
const Campaign = db.campaign;


exports.createCampaign = async (req, res) => {
    const campaign = await Campaign.create(req.body);

    const oAuthUrls = google.getOAuthUrls(campaign.credentials);

    res.status(200).send({
        message: "Campaign Created!",
        data: { id: campaign.id, oAuthUrls }
    });
};


exports.updateCampaign = async (req, res) => {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {new: true, returnDocument: "after"});
    console.log(campaign, req.body)
    let data = { id: campaign._id };
    if(req.body.credentials) {
      data['oAuthUrls'] = google.getOAuthUrls(campaign.credentials);
    }

    res.status(200).send({
        message: "Campaign Updated!",
        data
    });
};

exports.getCampaignStatus = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  const status = {
    status: campaign.status,
    emailSent: (campaign.recipients.filter(e => e.sent)).length,
    totalRecipients: campaign.recipients?.length,
  }
  res.status(200).send({
    message: "Success!",
    data: status
  });
};

exports.getCampaign = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  res.status(200).send({
    message: "Success!",
    data: campaign
  });
};

exports.getCampaignList = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  const campaigns = await Campaign.find({})
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .skip(skip)
    .limit(limit);

  const totalCampaigns = await Campaign.countDocuments({});

  res.status(200).send({
    message: "Success!",
    data: {
      totalCampaigns,
      currentPage: page,
      campaigns
    }
  });
};