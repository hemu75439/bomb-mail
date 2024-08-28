const createAttachmentFromHTML = require("./createAttachmentFromHTML");
const createTransport = require("./createTransport");
const updateRecipient = require("./updateRecipient");
const randomNameGen = require("./randomNameGenerator");

module.exports = (campaign) =>
  new Promise(async (resolve, r) => {
    try {
      // Setup email data
      const {
        sender_name,
        random_sender_name,
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

      // Check if html_code has #EMAIL# keyword
      let commonAttachment = !html_code.includes("#EMAIL#");

      if (html_code && commonAttachment) {
        // Create attachment with html_code, html_code_type
        const [filename, path] = await createAttachmentFromHTML(
          html_code,
          html_code_type
        );
        message.attachments.push({ filename, path });
        console.log("attachments attached... ", attachments);
      }

      const { credentials, recipients } = campaign;

      if (credentials?.length && recipients?.length) {
        // Setup Creds (Use a cred until it goes out of limit)
        let credIndex = 0;
        let transporter = createTransport(credentials[credIndex]);
        let failedEmails = [];

        // Loop over all recipients until done or out of creds
        for (let i = 0; i < recipients?.length; i++) {
          // setTimeout(async () => {
          const r = recipients[i];
          if (!r.sent) {
            try {
              message["to"] = r.email;

              if (!!sender_name) {
                message["from"] = sender_name;
              }

              if (random_sender_name) {
                message["from"] = randomNameGen();
              }

              if (html_code && !commonAttachment) {
                // Create attachment with html_code, html_code_type
                // while replacing #EMAIL# keyword with recipient email
                const [filename, path] = await createAttachmentFromHTML(
                  html_code.replace(/#EMAIL#/g, r.email),
                  html_code_type
                );
                message.attachments = [{ filename, path }];
                console.log("attachments attached... ", attachments);
              }

              // Send email
              await transporter.sendMail(message);
              await updateRecipient(campaign._id, r.email, {
                email: r.email,
                sent: true,
                last_sent: new Date(),
              });
              console.log("Email sent to recipient :: ", i);

              // after sending email, reset credIndex and empty attachments
              credIndex = 0;
              message.attachments = [];
            } catch (e) {
              console.log("Error in transporter.sendMail :: ", e);
              failedEmails.push(r);
              credIndex++;
              if (credIndex < credentials?.length) {
                transporter = createTransport(credentials[credIndex]);
              } else {
                throw new Error("Credentials exhausted!");
              }
            }
          }

          if (i == recipients?.length - 1) {
            resolve(!failedEmails?.length);
          }
          // }, 1000);
        }
        // console.log('failedEmails :: ', failedEmails)
      } else {
        throw new Error("Credentials or Recipients info insufficient!");
      }
    } catch (e) {
      console.log("Error in transporter :: ", e);
      resolve(false);
    }
  });
