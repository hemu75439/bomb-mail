const { google } = require('googleapis');

exports.getOAuthUrls = (creds) => {
    let oAuthUrls = [];

    creds.forEach(cred => {
        if(cred.type == 'oauth' && !cred.refresh_token) {
            // Create an OAuth2 client
            const oAuth2Client = new google.auth.OAuth2(
                cred.client_id,
                cred.client_secret,
                cred.redirect_uris
            );
            
            // Generate the URL for user consent
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: ['https://mail.google.com/']
            });

            oAuthUrls.push({
                email: cred.email,
                authUrl
            });
        }
    })

    return oAuthUrls;
}