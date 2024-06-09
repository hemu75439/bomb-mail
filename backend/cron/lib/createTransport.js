

module.exports = (cred) => {
    let auth = {} 
    
    if(cred.type == 'oauth') {
        auth = {
          type: 'OAuth2',
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

    return nodemailer.createTransport({ service: 'gmail', auth });
}