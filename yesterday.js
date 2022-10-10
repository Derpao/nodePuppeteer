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
      this.getFullYear() + '/' +
      pad2(this.getMonth() + 1) +  '/' +
      pad2(this.getDate()) +  ' ' +
      pad2(this.getHours()) + ':' +
      pad2(this.getMinutes()) + ':' +
      pad2(this.getSeconds())
    );
  },
});

let timeUpdate;

async function loopE() {
  timeUpdate = new Date().YYYYMMDDHHMMSS();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.goal.co/");
  let dataHtml = "";

  const row = await page.$$eval(
    "#todaytable > div:nth-child(10) > div.utable > table > tbody > tr",
    (tds) =>
      tds.map((tr) => {
        return tr.innerText;
      })
  );

  // console.log(row.length);

  for (let i = 1; i <= row.length; i++) {
    // for (let i=1; i <= 30; i++ ){

    // let element = await page.$(
    //   "#todaytable > div:nth-child(10) > div.utable > table > tbody >  tr.update:nth-child(" +
    //     i +
    //     ")"
    // );
    let element = await page.$(
      "#todaytable > div:nth-child(10) > div.utable > table > tbody >  tr.utable_tr:nth-child(" +
        i +
        ")"
    );

    let element2 = await page.$(
      "#todaytable > div:nth-child(10) > div.utable > table > tbody >  tr:nth-child(" +
        i +
        ")"
    );

    let vote = await page.$(
      "#todaytable > div:nth-child(10) > div.utable > table > tbody >  tr:nth-child(" +
        i +
        ").votes"
    );

    // console.log(vote);

    if (vote == null) {
      if (element != null) {
        let elementTd1 = await element.$("td:nth-child(1)");
        let elementTd3 = await element.$("td:nth-child(3)");
        let elementTd = await element.$("td:nth-child(4)");
        let elementTd5 = await element.$("td:nth-child(5)");
        let elementTd6 = await element.$("td:nth-child(6)");
        let elementTd7 = await element.$("td:nth-child(7)");
        let elementTd8 = await element.$("td:nth-child(8)");
        let elementTd9 = await element.$("td:nth-child(9)");

        let elementClass = await element.$("td:nth-child(4) > span");
        let elementClass6 = await element.$("td:nth-child(6) > span");

        let text = await page.evaluate(
          (element) => element.textContent,
          element
        );

        let textTd1 = await page.evaluate(
          (elementTd1) => elementTd1.textContent,
          elementTd1
        );
        let textTd3 = await page.evaluate(
          (elementTd3) => elementTd3.textContent,
          elementTd3
        );
        let textTd = await page.evaluate(
          (elementTd) => elementTd.textContent,
          elementTd
        );
        let textTd5 = await page.evaluate(
          (elementTd5) => elementTd5.textContent,
          elementTd5
        );
        let textTd6 = await page.evaluate(
          (elementTd6) => elementTd6.textContent,
          elementTd6
        );
        let textTd7 = await page.evaluate(
          (elementTd7) => elementTd7.textContent,
          elementTd7
        );
        let textTd8 = await page.evaluate(
          (elementTd8) => elementTd8.textContent,
          elementTd8
        );
        let textTd9 = await page.evaluate(
          (elementTd9) => elementTd9.textContent,
          elementTd9
        );

        // let styleValue =  await page.$eval(
        //   (elementClass9) => elementClass9.getComputedStyle(elementClass9).getPropertyValue('background-color')

        // );

        if (text != null) {
          if (elementClass != null) {
            //className เจ้าบ้าน
            const className4 = await elementClass
              .getProperty("className")
              .then((cn) => cn.jsonValue())
              .then((classNameString) => classNameString.split(" "));
            const className6 = await elementClass6
              .getProperty("className")
              .then((cn) => cn.jsonValue())
              .then((classNameString) => classNameString.split(" "));

            //get backgroung color
            var bgColorClass = "";
            const styleValue = await page.$eval(
              "#todaytable > div:nth-child(10) > div.utable > table > tbody >  tr.utable_tr:nth-child(" +
                i +
                ") td:nth-child(9) > span",
              (el) => getComputedStyle(el).getPropertyValue("background-color")
            );
            if (styleValue) {
              if (styleValue == "rgba(0, 0, 0, 0)") {
                bgColorClass = "bgNoClor";
              }
              if (styleValue == "rgb(255, 0, 0)") {
                bgColorClass = "bgRedClor";
              }
              if (styleValue == "rgb(255, 89, 89)") {
                bgColorClass = "bgPingClor";
              }
              if (styleValue == "rgb(82, 86, 192)") {
                bgColorClass = "bgBlueClor";
              }
              if (styleValue == "rgb(51, 204, 0)") {
                bgColorClass = "bgGreenClor";
              }
              if (styleValue == "rgb(0, 255, 255)") {
                bgColorClass = "bgBClor";
              }
              if (styleValue == "rgb(161, 165, 248)") {
                bgColorClass = "bgPurpleClor";
              }
              

              
            }
            // if (styleValue == "rgba(0, 0, 0, 0)") {
            //   bgColorClass = "bgNoClor";
            //   console.log("rebbbbbbb");
            // }
            // if (styleValue == "rgb(255, 0, 0)") {
            //   bgColorClass = "bgRedClor";
            // }
            // if (styleValue == "rgb(255, 89, 89)") {
            //   bgColorClass = "bgPingClor";
            // }
            // if (styleValue == "rgb(82, 86, 192)") {
            //   bgColorClass = "bgBlueClor";
            // }

            var scoreLive = "scoreLive";

            if (
              textTd3.replace(/\s/g, "") == "FT" ||
              textTd3.replace(/\s/g, "") == "HT"
            ) {
              scoreLive = "scoreLiveFt";
            }
            dataHtml += `<tr class="utable_tr">
                    <td class="timeLive">${textTd1}</td>
                    <td class="${scoreLive}">${textTd3}</td>
                    <td class="homeTeam ${className4[0]} ${
              className4[1]
            }"> ${textTd.replace(/\s/g, "")}</td>
                    <td class="price">${textTd5}</td> 
                    <td class="awayTeam ${className6[0]} ${
              className6[1]
            }">${textTd6.replace(/\s/g, "")}</td>
                    <td class="halfScore">${textTd7}</td>
                    <td class="finalScore">${textTd8}</td>
                    <td class="comment ${bgColorClass}">${textTd9}</td> 
                    </tr>`;
          }
        }
      } else {
        let elementTd2 = await element2.$("td:nth-child(1)");
        let elementHead2 = await element2.$("td:nth-child(2)");
        let textTd2 = await page.evaluate(
          (elementTd2) => elementTd2.textContent,
          elementTd2
        );

        if (elementHead2 != null) {
          let textTd4 = await page.evaluate(
            (elementHead2) => elementHead2.textContent,
            elementHead2
          );

          dataHtml += `<tr class="utable_ht">
                     <td width="50">เวลา</td>
                     <td width="50">สด</td>
                     <td width="180">เจ้าบ้าน</td>
                     <td width="100">ราคาบอล</td>
                     <td width="180">ทีมเยือน</td>
                     <td width="55">ครึ่งแรก</td>
                     <td width="55">ผลบอล</td>
                     <td width="270">ทรรศนะฟุตบอลวันนี้/ทีเด็ดบอลคืนนี้</td>
                     </tr>`;
        }

        //  console.log(textTd2 + " /in else head tr ");
        else {
          dataHtml += `<tr>
                     <td class="utable_league" colspan="8">${textTd2}</td>
                     </tr>`;
        }
      }
    }

    // console.log(data.length);
    // console.log(data[1][1]);
  }
  //   console.log(dataHtml);
  const JsonHtml = {
    title: "api-football",
    data: dataHtml,
    timeUpdated: timeUpdate,
  };
  await page.close();
  browser.close();
  return JsonHtml;
}

async function getData() {
  try {
    return await loopE();
  } catch (error) {
    console.log("error" + error);
  } finally {
    // console.log("done");
  }
}

getData().then((data) => {
    mongoDb(data).catch(console.dir);
});

cron.schedule("*/30 * * * *", () => {
  getData().then((data) => {
    // console.log(data);
    mongoDb(data).catch(console.dir);
  });
  console.log("running a task every 1 hr ");
});

function timeMin() {
  const d = new Date();
  let minutes = d.getMinutes();
  const arrOfDigits = Array.from(String(minutes), Number);
  // console.log(arrOfDigits);
  let lastMi;
  if (arrOfDigits[1] != null) {
    // console.log("not null");

    lastMi = arrOfDigits[1];
    // console.log(lastMi);
  } else {
    // console.log("null");
    lastMi = arrOfDigits[0];
    // console.log(lastMi);
  }

  if (lastMi <= 4) {
    console.log("less then 4");
    return 1;
  } else {
    return 2;
  }
}

async function mongoDb(data) {
  let finalUrlMongo;
  var mongoUrl1 =
    "mongodb+srv://derpao:Derpao1150@derpao.5bu5jxd.mongodb.net/football?retryWrites=true&w=majority";
  var mongoUrl2 =
    "mongodb+srv://derpao:Derpao1150@derpao.huipx1f.mongodb.net/football?retryWrites=true&w=majority";

  if (timeMin() == 1) {
    finalUrlMongo = mongoUrl1;
  } else {
    finalUrlMongo = mongoUrl2;
  }

  let client;
  if (!client) {
    console.log("client connecting");
    // client = await MongoClient.connect(finalUrlMongo);
    client = await MongoClient.connect(mongoUrl1);
  }

  try {
    const db = client.db();
    const footballCorrection = db.collection("football-yesterday");
    const filter = { title: data.title };
    const options = { upsert: true };

    const updateDoc = {
      $set: {
        title: data.title,
        data: `<table>${data.data}</table>`,
        timeUpdated: timeUpdate,
      },
    };

    const result = await footballCorrection.updateOne(
      filter,
      updateDoc,
      options
    );

    console.log(
      `${result.matchedCount} yesterday updated ${result.modifiedCount} document(s) ${timeUpdate}`
    );
  } finally {
    // Ensures that the client will close when you finish/error

    console.log("client closed");
    await client.close();
  }
}
