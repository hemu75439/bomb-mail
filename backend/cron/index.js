const cron = require('node-cron');
const getCampaign = require('./lib/getCampaign');
const sendEmails = require('./lib/sendEmails');
const updateCampaign = require('./lib/updateCampaign');
const mongoose = require('mongoose');

(
    async () => {
        await mongoose
                .connect(`${process.env?.MONGODB_URI || 'mongodb://root:12345@0.0.0.0:27017/bomb-mailer'}`, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    authSource: "admin"
                })
                .then(() => {
                    console.log('Mongo Connected!');
                    console.log('Cron server ready!');
                })
                .catch(err => {
                    console.error("Connection error", err);
                    process.exit();
                });
    }
)()

cron.schedule('5 * * * * *', async () => {
    console.log('Cron server activated :: ', new Date());

    console.log('Getting campaign...');
    const campaign = await getCampaign();

    if(campaign) {
        try {
            console.log('Campaign found sending emails...');
            await sendEmails(campaign);
            updateCampaign(campaign._id, {status: 'complete'});
        } catch(e) {
            console.log('Error in sending emails :: ', e);
            updateCampaign(campaign._id, {status: 'failed'});
        }
    }

    console.log('Cron server turning off :: ', new Date());
});