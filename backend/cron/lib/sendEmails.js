const createAttachmentFromHTML = require("./createAttachmentFromHTML");
const createTransport = require("./createTransport");
const updateRecipient = require("./updateRecipient");

module.exports = async (campaign) => {
  // Setup email data
  const {
    subject,
    body,
    interactive_body,
    html_code,
    html_code_type,
    attachments,
  } = campaign;
  let message = {
    subject,
    text: body,
    html: interactive_body,
    attachments: attachments?.length
      ? attachments.map((url) => {
          return {
            path: url,
          };
        })
      : [],
  };

  if (html_code) {
    // Create attachment with html_code, html_code_type
    const att = createAttachmentFromHTML(html_code, html_code_type);
    message.attachments.push(att);
  }

  const { credentials, recipients } = campaign;

  if (credentials?.length && recipients?.length) {
    // Setup Creds (Use a cred until it goes out of limit)
    let credIndex = 0;
    let transporter = createTransport(credentials[credIndex]);

    // Loop over all recipients until done or out of creds
    for (let i = 0; i < recipients?.length; ) {
      const r = recipients[i];
      if (!r.sent) {
        try {
          message["to"] = r.email;
          // Send email
          transporter.sendMail(message, (error, info) => {
            if (error) {
              throw error;
            }

            // Update status sent, last_sent
            updateRecipient(campaign._id, r.email, {
              sent: true,
              last_sent: new Date(),
            });
            console.log('Email sent to recipient :: ', i);
            i++;
          });
        } catch (e) {
          credIndex++;
          if (credIndex < credentials?.length) {
            transporter = createTransport(credentials[credIndex]);
          } else {
            throw new Error('Credentials exhausted!');
          }
        }
      }
    }
  } else {
    throw new Error('Credentials or Recipients info insufficient!');
  }
};
