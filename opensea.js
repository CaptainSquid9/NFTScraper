const Puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const fs = require('fs');
const { setTimeout } = require("timers/promises");

Puppeteer.use(StealthPlugin())

Puppeteer.launch({headless: false, args: ['--window-size=1280,1800', '--unlimited-storage', '--full-memory-crash-report']}).then(async browser => {
    const start = Date.now();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1280,
        height: 1800
    });
    // This is well explained in the API
    await page.goto("https://opensea.io/collection/boredapeyachtclub?search[sortAscending]=true&search[sortBy]=CREATED_DATE", {"waitUntil" : "networkidle0"});
    await page.waitForSelector('.cf-browser-verification', {hidden: true});

    const Images = await page.evaluate(async () => {
        var totalHeight = 0;
        var distance = window.innerHeight / 2; // should be less than or equal to window.innerHeight
        var IHref = [];
        await new Promise((resolve) => {
            window.scrollBy(0, 600);
             const Timer = setInterval(async() => {
                if ( totalHeight <= document.body.scrollHeight - window.innerHeight) {
                    //Get Images
                    const ITag = document.querySelectorAll(".AssetMedia--img")
                    for (const tag of ITag) {
                            const object = tag.firstChild.firstChild;
                            if(!IHref.includes(object.src)) {
                                IHref.push(object.src);                       
                            }                       
                    }
                 }
                else {
                        clearInterval(Timer);
                        clearInterval(scroll)
                            resolve("");
                }
            }, 250);
            const scroll = setInterval(() => {
                window.scrollBy(0, distance / 2);
                totalHeight += distance / 2
            },250)
        });
        return IHref;
    });
    console.log(Images);
    var end = Date.now() - start;
    fs.writeFile("firsttest.txt", Images.join(' \n') +  "\n" + end, function (err) {
        if (err) return console.log(err);
        console.log('Success');
      });

      await page.close()
});
await browser.close();

