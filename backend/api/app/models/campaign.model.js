const mongoose = require("mongoose");

const Recipient = new mongoose.Schema({
    email: String,
    sent: {
        type: Boolean,
        default: false
    },
    last_sent: Date,
    last_read: Date
});

const Credential = new mongoose.Schema({
    email: String,
    
    // Google Client Secret from setup GMAIL API
    client_id: String,
    project_id: String,
    auth_uri: String,
    token_uri: String,
    auth_provider_x509_cert_url: String,
    client_secret: String,
    redirect_uris: [String],
    
    // Auth code google redirects us with
    last_auth_code: String,
    
    // Token generated from OAuth of google account 
    access_token: String,
    refresh_token: String,
    scope: String,
    token_type: String,
    expiry_date: Number
});

const Campaign = mongoose.model(
  "Campaign",
  new mongoose.Schema({
    name: String,

    // Sending Options
    subject: String,
    credentials: [Credential],
    recipients: [Recipient],
    sender_name: String,
    random_sender_name: Boolean,
    delay: Number,
    delay_after: Number,
    attachments: [String],
    random_header: Boolean,

    // Email Contents
    body: String,
    html_code: String,
    html_code_type: {
        type: String,
        enum: ['img', 'pdf', 'img-pdf'],
        default: 'img-pdf'
    },
    interactive_body: String,
  }, {timestamps: true})
);

module.exports = Campaign;