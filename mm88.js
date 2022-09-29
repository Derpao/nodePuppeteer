const puppeteer = require('puppeteer');


async function start(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://mm88jackpot.mm88admin.com');
    await page.type("body > div.login-box > div.card.bg-gradient-dark > div.card-body.login-card-body.bg-gradient-dark > form > div:nth-child(2) > input", "derpao@mm88jackpot.com")
    await page.type("body > div.login-box > div.card.bg-gradient-dark > div.card-body.login-card-body.bg-gradient-dark > form > div:nth-child(3) > input", "Derpao1150")
    await page.screenshot({                      // Screenshot the website using defined options
 
      path: "./screenshotBefore.png",                   // Save the screenshot in current directory
   
      fullPage: true                              // take a fullpage screenshot
   
    })
    await Promise.all([
        
        page.click("body > div.login-box > div.card.bg-gradient-dark > div.card-body.login-card-body.bg-gradient-dark > form > div.row > div.col-5 > button"),
        page.waitForNavigation(),
        
        // page.waitForNavigation()


        
    ])

    // await page.goto("https://mm88jackpot.mm88admin.com/customer/user-point?point_id=5792&mm_user=mmf88fa1002");
    // await page.screenshot({                      // Screenshot the website using defined options
 
    //     path: "./screenshot.png",                   // Save the screenshot in current directory
     
    //     fullPage: true                              // take a fullpage screenshot
     
    //   })

      
      await Promise.all([
        
        page.type("body > div.wrapper > div.content-wrapper > div.content > div > div:nth-child(2) > div > div > div.card-body > form > div:nth-child(4) > div:nth-child(1) > div > input", "10"),
        page.type("body > div.wrapper > div.content-wrapper > div.content > div > div:nth-child(2) > div > div > div.card-body > form > div:nth-child(5) > div > div > textarea", "auto"),
        page.click("body > div.wrapper > div.content-wrapper > div.content > div > div:nth-child(2) > div > div > div.card-body > form > div:nth-child(6) > div > button"), 
        page.waitForNavigation(),

        
    ])
    
    // await page.goto('https://mm88jackpot.mm88admin.com/customer/user-point');
    // await page.waitForNavigation()
    
     
     await page.close(); 


     browser.close();
}

start()
