const db = require("../models");
const google = require('../lib/google-oauth');
const Campaign = db.campaign;


exports.createCampaign = async (req, res) => {
  
    const campaign = await Campaign.create(req.data);

    const oAuthUrls = google.getOAuthUrls(campaign.credentials);

    res.status(200).send({
        message: "Campaign Created!",
        data: { oAuthUrls }
    });
};


exports.updateCampaign = (req, res) => {
  res.status(200).send("updateCampaign.");
};

exports.getCampaignStatus = (req, res) => {
  res.status(200).send("getCampaignStatus.");
};

exports.getCampaign = (req, res) => {
  res.status(200).send("getCampaign.");
};

exports.getCampaignList = (req, res) => {
  res.status(200).send("getCampaignList.");
};