const nodemailer = require('nodemailer');

module.exports = (cred) => {
    let auth = {} 
    
    if(cred.type == 'oauth') {
        auth = {
          type: 'OAuth2',
          user: cred.email,
          clientId: cred.client_id,
          clientSecret: cred.client_secret,
          refreshToken: cred.refresh_token
        }
    }
    
    if(cred.type == 'app-password') {
        auth = {
            user: cred.email,
            pass: cred.app_password
        }
    }
    console.log('creds :: ', { service: 'gmail', auth });
    return nodemailer.createTransport({ service: 'gmail', auth });
}