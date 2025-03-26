const KEY = '372eac61deae3b262008bf379a00e644-f6202374-aa0b72b7'
const DOMAIN = 'sandbox087997c4919c4462abd0260b369e8c59.mailgun.org'


const createAttachmentFromHTML = require("./createAttachmentFromHTML");
const updateRecipient = require("./updateRecipient");
const randomNameGen = require("./randomNameGenerator");
const randomStr = require("./randomString");
const fs = require("fs");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

module.exports = (campaign) =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        sender_name,
        random_sender_name,
        subject,
        body,
        interactive_body,
        html_code,
        html_code_type,
        attachments,
        credentials,
        recipients,
      } = campaign;

      // if (!credentials?.length || !recipients?.length) {
      //   throw new Error("Credentials or Recipients info insufficient!");
      // }

      // Setup Mailgun
      const mg = new Mailgun(formData);
      const mailgun = mg.client({ username: "api", key: KEY });
      const domain = DOMAIN;
      let failedEmails = [];

      let commonAttachment = !html_code.includes("#EMAIL#");

      for (let i = 0; i < recipients.length; i++) {
        const r = recipients[i];
        if (!r.sent) {
          try {
            let message = {
              from: sender_name || (random_sender_name ? randomNameGen() : "") + `<mailgun@${DOMAIN}>`,
              to: r.email,
              subject: subject.replace(/#EMAIL#/g, r.email).replace(/#TOKEN#/g, `#${randomStr(12)}`),
              text: body.replace(/#EMAIL#/g, r.email).replace(/#TOKEN#/g, `#${randomStr(12)}`),
              html: interactive_body.replace(/#EMAIL#/g, r.email).replace(/#TOKEN#/g, `#${randomStr(12)}`),
              attachment: [],
            };

            if (attachments?.length) {
              message.attachment = attachments.map((url) => fs.createReadStream(url));
            }

            let filePath = null;
            if (html_code) {
              if (commonAttachment) {
                const [filename, path] = await createAttachmentFromHTML(html_code, html_code_type);
                message.attachment.push(fs.createReadStream(path));
              } else {
                const [filename, path] = await createAttachmentFromHTML(
                  html_code.replace(/#EMAIL#/g, r.email),
                  html_code_type
                );
                message.attachment = [fs.createReadStream(path)];
                filePath = path;
              }
            }

            await mailgun.messages.create(domain, message);
            await updateRecipient(campaign._id, r.email, {
              email: r.email,
              sent: true,
              last_sent: new Date(),
            });
            console.log(`Email sent to recipient :: ${i} - ${r.email}`);

            if (filePath) {
              try {
                fs.unlinkSync(filePath);
                console.log("File deleted successfully");
              } catch (err) {
                console.error(`Error deleting file: ${err.message}`);
              }
            }
          } catch (e) {
            console.log("Error sending email via Mailgun ::", e);
            failedEmails.push(r);
          }
        }
      }
      resolve(!failedEmails.length);
    } catch (e) {
      console.log("Error in Mailgun integration ::", e);
      resolve(false);
    }
  });
