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
  await page.goto("https://balldeaw.com/");
  let dataHtml = "";

  const rowS = await page.$$(".elementor-shortcode", (tds) =>
    tds.map((tr) => {
      return tr.$("table");
    })
  );

  console.log(rowS[number]);
  console.log(rowS.length);

  const rowsTr = await rowS[number].$$("table", (tds) =>
    tds.map((tr) => {
      return tr;
    })
  );
  var rowRealLenght = 0;
  if (number == 0) {
    rowRealLenght = rowsTr.length - 2;
  } else {
    rowRealLenght = rowsTr.length - 1;
  }

  // console.log(rowsTr.length);
  for (let i = 0; i <= rowsTr.length - 1; i++) {
    let elementTd1 = await rowsTr[i];
    let textTd1 = await page.evaluate(
      (elementTd1) => elementTd1.outerHTML,
      elementTd1
    );

    let newText = textTd1.replaceAll(
      `src="//balldeaw.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif"`,
      ``
    );

    //    newText = newText.replace(`data-src=`,`src=`)
    //    console.log(newText);
    dataHtml += newText.replaceAll(`data-src=`, `src=`);
    //   console.log(dataHtml);
  }

  const JsonHtml = {
    title: textTitle,
    data: dataHtml,
    timeUpdated: timeUpdate,
  };
  await page.close();
  browser.close();
//   console.log(JsonHtml);
  return JsonHtml;
}




async function mongoDb(data, textTitle) {
    var mongoUrl1 =
      "mongodb+srv://derpao:Derpao1150@derpao.5bu5jxd.mongodb.net/football?retryWrites=true&w=majority";
  
    let client;
    if (!client) {
      console.log("client connecting tdedBalldeaw");
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

//   loopE(1, "tdedBalldeaw");
  getData(1, "tdedBalldeaw")
  .then((data) => {
    mongoDb(data, "tdedBalldeaw").catch(console.dir);
  })
  

  cron.schedule("*/30 * * * *", () => {
    getData(1, "tdedBalldeaw")
    .then((data) => {
      mongoDb(data, "tdedBalldeaw").catch(console.dir);
    })

  });