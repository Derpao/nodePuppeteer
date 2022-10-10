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

async function loopE(number, textTitle) {
  timeUpdate = new Date().YYYYMMDDHHMMSS();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://balldeaw.com/%e0%b8%97%e0%b8%b5%e0%b9%80%e0%b8%94%e0%b9%87%e0%b8%94%e0%b8%aa%e0%b9%80%e0%b8%95%e0%b9%87%e0%b8%9b/"
  );
  let dataHtml = "";

  //   let element = await page.$eval(".tded-columz");
  const row = await page.$$eval(".tded-columz", (tds) => {
    tds.map((tr) => {
      return tr.innerText;
    });
  });
  const rowS = await page.$$(".tded-columz", (tds) =>
    tds.map((tr) => {
      return tr.$("table > tbody");
    })
  );

  // console.log(rowS[number]);
  // console.log(rowS.length);

  const rowsTr = await rowS[number].$$("tr", (tds) =>
    tds.map((tr) => {
      return tr;
    })
  );
  var rowRealLenght = 0;
  if ((number == 0)) {
    rowRealLenght = rowsTr.length - 2;
  } else {
    rowRealLenght = rowsTr.length - 1;
  }

  console.log(rowsTr.length);
  for (let i = 2; i <= rowRealLenght; i++) {
    let elementTd1 = await rowsTr[i];
    let textTd1 = await page.evaluate(
      (elementTd1) => elementTd1.outerHTML,
      elementTd1
    );
    // console.log(textTd1);

    dataHtml += textTd1;
  }

  const JsonHtml = {
    title: textTitle,
    data: dataHtml,
    timeUpdated: timeUpdate,
  };
  await page.close();
  browser.close();
  // console.log(JsonHtml);
  return JsonHtml;
}

loopE(1);

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
      `${result.matchedCount}Tded document(s), updated ${result.modifiedCount} document(s) ${timeUpdate}`
    );
  } finally {
    // Ensures that the client will close when you finish/error

    console.log("client closed");
    await client.close();
  }
}

async function getData(number, textTitle) {
  try {
    return await loopE(number, textTitle);
  } catch (error) {
    console.log("error" + error);
  } finally {
    console.log("done");
  }
}

getData(0, "tded1")
  .then((data) => {
    mongoDb(data, "tded1").catch(console.dir);
  })
  .then(
    getData(1,"tded2").then((data) => {
      mongoDb(data, "tded2").catch(console.dir);
    })
  )
  .then(
    getData(2, "tded3").then((data) => {
      mongoDb(data, "tded3").catch(console.dir);
    })
  )
  .then(
    getData(3, "tded4").then((data) => {
      mongoDb(data, "tded4").catch(console.dir);
    })
  )


cron.schedule("*/30 * * * *", () => {
getData(0, "tded1")
  .then((data) => {
    mongoDb(data, "tded1").catch(console.dir);
  })
  .then(
    getData(1,"tded2").then((data) => {
      mongoDb(data, "tded2").catch(console.dir);
    })
  )
  .then(
    getData(2, "tded3").then((data) => {
      mongoDb(data, "tded3").catch(console.dir);
    })
  )
  .then(
    getData(3, "tded4").then((data) => {
      mongoDb(data, "tded4").catch(console.dir);
    })
  )
})

