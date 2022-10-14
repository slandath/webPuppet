const values = require("./auth.json");
const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function start() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const contacts = [];

  await page.goto(values.login_url);

  await page.type(values.username_field, values.username_value);
  await page.type(values.password_field, values.password_value);
  await page.click(values.submit_button);
  await page.waitForSelector(values.new_screen_selector);

  for (let i = 1; i < 5; i++) {
    await page.goto(values.main_url + `${i}`);
    const names = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('ul.wppb-profile li span')).map(
        (x) => x.textContent
      );
    });
    contacts.push(names);
    console.log(i);
  }

  await fs.writeFile("contacts.csv", contacts.join("\t\r"));

  await browser.close();

  console.log("Scrape is done!")
}

start();
