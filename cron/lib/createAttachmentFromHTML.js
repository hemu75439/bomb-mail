const PuppeteerHTMLPDF = require("puppeteer-html-pdf");
const puppeteer = require('puppeteer');

// Keeping browser here to not open it for every operation
let browser = null;

let retry = 0;
module.exports = async (code, type='pdf') => {
    let path = null;
    let filename = null;

    try {

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

        if(type == 'img') {
            path = `${__dirname}/../file/${new Date().toISOString()}.png`;
            filename = 'invoice.png'
            await page.screenshot({path});
        } else {
            path = `${__dirname}/../file/${new Date().toISOString()}.pdf`;
            filename = 'invoice.pdf';
            await page.pdf({
                path,
                format: 'A4',
                printBackground: true
            });
        }
        
        await page.close();
        // await browser.close();
        retry = 0;

    } catch (error) {
        console.log("Error in creating attachment: ", error);
        if(retry < 3) {
            retry++;
            await browser.close();
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
              });
            module.exports(code, type);
        }
    }
    
    return [filename, path];
}