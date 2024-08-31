const PuppeteerHTMLPDF = require("puppeteer-html-pdf");
// const nodeHtmlToImage = require('node-html-to-image');
const puppeteer = require('puppeteer');

// Keeping browser here to not open it for every operation
let browser = null;

module.exports = async (code, type='pdf') => {
    let path = null;
    let filename = null;

    try {
        if(type == 'img') {
            path = `${__dirname}/../file/${new Date().toISOString()}.png`;
            filename = 'invoice.png'

            if(!browser) {
                browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                  });
            }
            const page = await browser.newPage();
            await page.setViewport({
                height: 1200,
                width: 800,
                deviceScaleFactor: 1,
            });            
            await page.setContent(code);
            await page.screenshot({path});
            // await browser.close();
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