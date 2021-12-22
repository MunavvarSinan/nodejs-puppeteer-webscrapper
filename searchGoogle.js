const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const DataModel = require('./model/dataModel');
const solve = require('./solve');
const searchGoogle = async (searchQuery) => {
  puppeteerExtra.use(pluginStealth());
  const browser = await puppeteerExtra.launch({
    dumpio: false,
    headless: false,
    ignoreHTTPSErrors: true,
    args: [
      '--window-size=360,500',
      '--window-position=000,000',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=IsolateOrigins',
      ' --disable-site-isolation-trials',
    ],
  });

  const page = await browser.newPage();
  await page.goto('https://www.google.com');

  const checkForCaptcha = await page.$('.g-recaptcha');
  if (checkForCaptcha) {
    solve(page);
  }
  await page.waitForSelector('input[aria-label="Search"]', { visible: true });

  await page.type('input[aria-label="Search"]', searchQuery);
  await Promise.all([page.waitForNavigation(), page.keyboard.press('Enter')]);

  await page.waitForSelector('.LC20lb', { visible: true });

  const searchResults = await page.evaluate(() =>
    [...document.querySelectorAll('.LC20lb')].map((e) => ({
      title: e.innerText,
      url: e.parentNode.href,
    }))
  );
  searchResults.forEach(async (result) => {
    const datas = {
      title: result.title,
      url: result.url,
    };

    DataModel.find((err) => {
      if (err) throw err;
      const newData = new DataModel(datas);
      console.log(`A new data was created:\n${JSON.stringify(datas)}`);
      return newData.save().catch((err) => console.log(err));
    }).clone();
  });

  await browser.close();

  return searchResults;
};

module.exports = searchGoogle;
