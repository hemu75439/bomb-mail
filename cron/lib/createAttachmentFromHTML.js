// const PuppeteerHTMLPDF = require("puppeteer-html-pdf");
// const nodeHtmlToImage = require('node-html-to-image');
// const puppeteer = require("puppeteer");
const replaceVariablesFromHTML = require("./replaceVariablesFromHTML");

module.exports = async (code, type = "pdf", campaign) => {
  let path = null;
  let filename = null;

  try {
    if (type == "img") {
      filename = "invoice.png";

      path = await replaceVariablesFromHTML(code, type, campaign);
    } else {
      filename = "invoice.pdf";
      path = await replaceVariablesFromHTML(code, type, campaign);

      // const htmlPDF = new PuppeteerHTMLPDF();
      // const options = {
      //   format: "A4",
      //   path,
      // };
      // htmlPDF.setOptions(options);
    }
  } catch (error) {
    console.log("Error in creating attachment: ", error);
  }

  return [filename, path];
};
