const Campaign = require('../models/campaign.model');

module.exports = async (campaignId, recipientEmail, updateData) => {
    try {
        // Find the campaign and update the recipient
        const campaign = await Campaign.findOneAndUpdate(
            { 
                _id: campaignId, 
                'recipients.email': recipientEmail 
            },
            { 
                $set: { 
                    'recipients.$': updateData 
                } 
            },
            { new: true }  // Return the updated document
        );

        if (campaign) {
            console.log('Recipient updated successfully:', campaign);
        } else {
            console.log('Recipient not found');
        }
    } catch (error) {
        console.error('Error updating recipient:', error);
    }
}