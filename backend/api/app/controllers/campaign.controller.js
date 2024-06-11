const db = require("../models");
const googleAuth = require('../lib/google-oauth');
const Campaign = db.campaign;
const { google } = require('googleapis');

exports.createCampaign = async (req, res) => {
    const campaign = await Campaign.create(req.body);

    const oAuthUrls = googleAuth.getOAuthUrls(campaign.credentials);

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
      data['oAuthUrls'] = googleAuth.getOAuthUrls(campaign.credentials);
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

exports.googleAuth = async (req, res) => {

  console.log(req.params, req.query)
  const campaign = await Campaign.findById(req.params.id).lean();
  const cred = campaign.credentials.find(e => e.email == req.params.email);
  console.log('cred :: ', cred)

  const oAuth2Client = new google.auth.OAuth2(
    cred.client_id,
    cred.client_secret,
    cred.redirect_uris
  );

  oAuth2Client.getToken(req.query.code, async (err, token) => {
    if (err) return console.error('Error retrieving access token:', err);
    
    console.log('\n\nToken :: ', token, '\n\n', {...cred, ...token});
    try {
      const campaign = await Campaign.findOneAndUpdate(
        { 
          _id: req.params.id, 
          'credentials.email': req.params.email
        },
        { 
            $set: { 
                'credentials.$': {...cred, ...token}
            } 
        },
        { new: true }  // Return the updated document
      );
      console.log('Updated cred :: ', campaign.credentials);

    }catch(e) {
      console.log('Error :: ', e);
    }
  });

  return res.json({message: 'Success'});
}