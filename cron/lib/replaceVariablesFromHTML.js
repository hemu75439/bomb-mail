const puppeteer = require("puppeteer");

module.exports = async (code, type = "pdf", campaign) => {
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
  for (let i = 0; i < recipients.length; i++) {
    const path =
      type == "img"
        ? `${__dirname}/../file/${new Date().toISOString()}.png`
        : `${__dirname}/../file/${new Date().toISOString()}.pdf`;
    const email = recipients[i].email;
    await page.setContent(code.replace(/#EMAIL/g, email));
    type == "img"
      ? await page.screenshot({ path })
      : await page.pdf({ path, format: "A4" });
  }
};
