const puppeteer = require("puppeteer");

async function replaceVariablesFromHTML(code, type = "pdf", campaign) {
  const { recipients } = campaign;
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({
    height: 1200,
    width: 800,
    deviceScaleFactor: 1,
  });

  // Replace #EMAIL with recipient_email
  for (let r = 0; r < recipients.length; r++) {
    const path =
      type == "img"
        ? `${__dirname}/../file/${new Date().toISOString()}_${r}.png`
        : `${__dirname}/../file/${new Date().toISOString()}_${r}.pdf`;
    const email = recipients[r].email;
    await page.setContent(code.replace(/#EMAIL/g, email));
    type == "img"
      ? await page.screenshot({ path })
      : await page.pdf({ path, format: "A4" });
  }

  return path;
}

module.exports = replaceVariablesFromHTML;
