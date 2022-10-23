import puppeteer from "puppeteer";
import { MongoClient } from "mongodb";
import cron from "node-cron";

Object.defineProperty(Date.prototype, "YYYYMMDDHHMMSS", {
  value: function () {
    function pad2(n) {
      // always returns a string
      return (n < 10 ? "0" : "") + n;
    }

    return (
      this.getFullYear() +
      pad2(this.getMonth() + 1) +
      pad2(this.getDate()) +
      pad2(this.getHours()) +
      pad2(this.getMinutes()) +
      pad2(this.getSeconds())
    );
  },
});

let timeUpdate;

var browser = await puppeteer.launch({
  "headless": false,
  "defaultViewport": null,
  "args": ['--start-maximized'],
});
var page = await browser.newPage();

async function openBrowser(){
  
  
}


async function loopE(number, textTitle) {
  timeUpdate = new Date().YYYYMMDDHHMMSS();
  
  if(browser.isConnected()){
    console.log(browser.isConnected());
  } else {
    console.log("page is not open");
     browser = await puppeteer.launch({
      "headless": false,
      "defaultViewport": null,
      "args": ['--start-maximized'],
    });
     page = await browser.newPage();

  }

  await page.goto("https://www.goal.co/");
  await page.waitForSelector("h1");

  const elementHandles = await page.$$(
    " #todaytable > div:nth-child(5) > div.boardleft > div.subbboard > div > div.tp2 > a"
  );
  const propertyJsHandles = await Promise.all(
    elementHandles.map((handle) => handle.getProperty("href"))
  );
  const hrefs2 = await Promise.all(
    propertyJsHandles.map((handle) => handle.jsonValue())
  );
  console.log(hrefs2);
  // setTimeout(() => {
  //   console.log("Delayed for 1 second.");
  //    page.reload();
  // }, "1000")
  
}
// openBrowser()

cron.schedule("*/10 * * * * *", () => {
  openBrowser()
  loopE();
  console.log("running a task every 10 sec ");
});
