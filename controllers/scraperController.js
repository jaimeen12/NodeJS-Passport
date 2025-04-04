import puppeteer from 'puppeteer';

export async function getPortswigger (email, password)  {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
         headless: true, 
         defaultViewport: {
            width: 1100,
            height: 1000
        }
    });
    const page = await browser.newPage();
    

    // Navigate the page to a URL
    await page.goto('https://portswigger.net/users',{waitUntil: 'load', timeout: 0});
    await page.waitForSelector('#EmailAddress')
    await page.type("#EmailAddress", email)
    await page.waitForSelector('#Password')
    await page.type("#Password", password)
    await page.click("#Login");
    //await page.waitForSelector('.mega-nav-link')
    await page.waitForNavigation()
    //await page.click("a[href$='web-security']");
    //await page.click("a[href$='https://portswigger.net/web-security/learning-paths']");
    
    //await page.click("a[href$='web-security/all-topics']");
   /* const paragraph = await page.evaluate(() => {
        const bookElements = document.querySelector(".radial-text-element-total");
        return bookElements.innerText;
})
        console.log(paragraph)
*/
    await page.goto("https://portswigger.net/web-security/all-labs",{waitUntil: 'load', timeout: 0});
   /* await page.waitForNavigation()

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await sleep(3000);
*/
   const paragraph2 = await page.evaluate(() => {
        const bookElements2 = document.querySelectorAll(".widgetcontainer-lab-link.is-notsolved");
        return Array.from(bookElements2).map((book) => {
            const title = book.querySelector('.flex-columns a').innerText;
            const status = book.querySelector('.lab-status-icon').innerText;
            return {title,status};
        })
})
        return paragraph2


    //await page.click("[type=submit]") // Click on submit button
    //await page.screenshot({ path: "output/screenshot.png" }); // Take screenshot of the page
    
    //await page.close();
    //await browser.close();
};
