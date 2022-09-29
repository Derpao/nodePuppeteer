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

async function loopE() {
  timeUpdate = new Date().YYYYMMDDHHMMSS();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://balldeaw.com/%e0%b8%97%e0%b8%b5%e0%b9%80%e0%b8%94%e0%b9%87%e0%b8%94%e0%b8%aa%e0%b9%80%e0%b8%95%e0%b9%87%e0%b8%9b/"
  );
  let dataHtml = "";

//   let element = await page.$eval(".tded-columz");
  const row = await page.$$eval(
    ".tded-columz",
    (tds) => {
        tds.map((tr) => {
            return tr.innerText;
          })
    }
      
  );
  const rowS = await page.$$(
    ".tded-columz",
    (tds) =>
      tds.map((tr) => {
        return  tr.$("table > tbody");
      })
  );


 console.log(rowS[0]);
 let elementTd1 = await rowS[0].$("tr:nth-child(3) > td:nth-child(2)")
 console.log(elementTd1);

 let textTd1 = await page.evaluate(
    (elementTd1) => elementTd1.textContent,
    elementTd1
  );

  console.log(textTd1);
// console.log(row[1]);
// rowS.forEach(function(x){
//     let elementTd1 = await rowS.$("table > tbody > tr:nth-child(3)")
//     console.log(x);
// })


// let elementTd1 = await rowS.$("table > tbody > tr:nth-child(3)")

}

loopE();
