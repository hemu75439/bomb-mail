const PuppeteerHTMLPDF = require("puppeteer-html-pdf");


module.exports = async (code, type) => {
    const htmlPDF = new PuppeteerHTMLPDF();
    const path = `${__dirname}/../pdf/${new Date().toISOString()}.pdf`;
    const options = {
        format: "A4",
        path
    };
    htmlPDF.setOptions(options);

    try {
        await htmlPDF.create(code);
        return path;
    } catch (error) {
        console.log("PuppeteerHTMLPDF error", error);
    }
}