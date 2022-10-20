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
      "/" +
      pad2(this.getMonth() + 1) +
      "/" +
      pad2(this.getDate()) +
      "/" +
      pad2(this.getHours()) +
      ":" +
      pad2(this.getMinutes()) +
      ":" +
      pad2(this.getSeconds())
    );
  },
});

let timeUpdate;

async function loopE(textTitle) {
  timeUpdate = new Date().YYYYMMDDHHMMSS();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.thairath.co.th/sport/footballscore/premierleague"
  );
  let dataHtml = "";

  const rowS = await page.$("table", (tds) =>
    tds.map((tr) => {
      return tr.$("tbody");
    })
  );
  console.log(rowS);

  console.log(rowS.length);

  const rowsTr = await rowS.$$("tr", (tds) =>
    tds.map((tr) => {
      return tr;
    })
  );
  var rowRealLenght = rowsTr.length - 1;

  for (let i = 1; i <= rowRealLenght; i++) {
    let elementTd1 = await rowsTr[i];
    let textTd1 = await page.evaluate(
      (elementTd1) => elementTd1.outerHTML,
      elementTd1
    );
    console.log(textTd1);

    dataHtml += textTd1;
  }

  const JsonHtml = {
    title: textTitle,
    data: dataHtml,
    timeUpdated: timeUpdate,
  };
  await page.close();
  browser.close();
  console.log(JsonHtml);
  return JsonHtml;
}

//   loopE("table_premier");

async function mongoDb(data, textTitle) {
  var mongoUrl1 =
    "mongodb+srv://derpao:Derpao1150@derpao.5bu5jxd.mongodb.net/football?retryWrites=true&w=majority";

  let client;
  if (!client) {
    console.log("client connecting tded");
    // client = await MongoClient.connect(finalUrlMongo);
    client = await MongoClient.connect(mongoUrl1);
  }

  try {
    const db = client.db();
    const footballCorrection = db.collection(textTitle);
    const filter = { title: data.title };
    const options = { upsert: true };

    const updateDoc = {
      $set: {
        title: data.title,
        data: data.data,
        timeUpdated: timeUpdate,
      },
    };

    const result = await footballCorrection.updateOne(
      filter,
      updateDoc,
      options
    );

    console.log(
      `${result.matchedCount}table_premier document(s), updated ${result.modifiedCount} document(s) ${timeUpdate}`
    );
  } finally {
    // Ensures that the client will close when you finish/error

    // console.log("client closed");
    await client.close();
  }
}

async function getData(textTitle) {
  try {
    return await loopE(textTitle);
  } catch (error) {
    console.log("error" + error);
  } finally {
    console.log("done");
  }
}

getData("table_premier").then((data) => {
  mongoDb(data, "table_premier").catch(console.dir);
});

cron.schedule("*/30 * * * *", () => {
  getData("table_premier").then((data) => {
    mongoDb(data, "table_premier").catch(console.dir);
  });
});
