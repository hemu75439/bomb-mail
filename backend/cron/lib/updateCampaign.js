const Campaign = require('../models/campaign.model');

module.exports = async (campaignId, updateData) => {
    try {
        // Find the campaign and update the recipient
        const campaign = await Campaign.findByIdAndUpdate(campaignId, updateData,
            { new: true }  // Return the updated document
        );

        if (campaign) {
            console.log('Campaign updated successfully:', campaign);
        } else {
            console.log('Campaign not found');
        }
    } catch (error) {
        console.error('Error updating Campaign:', error);
    }
}