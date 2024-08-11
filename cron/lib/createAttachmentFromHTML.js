const PuppeteerHTMLPDF = require("puppeteer-html-pdf");
const nodeHtmlToImage = require('node-html-to-image');

module.exports = async (code, type='pdf') => {
    let path = null;
    let filename = null;

    try {
        if(type == 'img') {
            path = `${__dirname}/../file/${new Date().toISOString()}.png`;
            filename = 'invoice.png'
            const options = {
                output: path,
                html: code
            };
            await nodeHtmlToImage(options);
        } else {
            path = `${__dirname}/../file/${new Date().toISOString()}.pdf`;
            filename = 'invoice.pdf';
            const htmlPDF = new PuppeteerHTMLPDF();
            const options = {
                format: "A4",
                path
            };
            htmlPDF.setOptions(options);
            await htmlPDF.create(code);
        }
    } catch (error) {
        console.log("Error in creating attachment: ", error);
    }
    
    return [filename, path];
}