const { google } = require('googleapis');

exports.getOAuthUrls = (creds) => {
    let oAuthUrls = [];

    creds.forEach(cred => {
        // Create an OAuth2 client
        const oAuth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
        );
        
        // Generate the URL for user consent
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://mail.google.com/']
        });

        oAuthUrls.push(authUrl);
    })

    return oAuthUrls;
}