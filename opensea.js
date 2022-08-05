const Puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const fs = require('fs');
const { setTimeout } = require("timers/promises");

Puppeteer.use(StealthPlugin())

Puppeteer.launch({headless: false, args: [`--window-size=1280,1800`]}).then(async browser => {
    const start = Date.now();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1280,
        height: 1800
    });
    // This is well explained in the API
    await page.goto("https://opensea.io/collection/boredapeyachtclub", {"waitUntil" : "networkidle0"});
    
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
                        if (totalHeight > document.body.scrollHeight - window.innerHeight) {
                            clearInterval(Timer);
                            clearInterval(scroll)
                            resolve("");
                        }
                }
            }, 200);
            const scroll = setInterval(() => {
                window.scrollBy(0, distance / 2);
                totalHeight += distance / 2
            },300)
        });
        return IHref;
    });
    console.log(Images);
    var end = Date.now() - start;
    fs.writeFile("firsttest.txt", Images.join(' \n') +  "\n" + end, function (err) {
        if (err) return console.log(err);
        console.log('Error > nftsrc.txt');
      });

    const Images2 = await page.evaluate(async (Images) => {
        var totalHeight = 0;
        var distance = window.innerHeight / 2; // should be less than or equal to window.innerHeight
        var IHref = Images;
        await new Promise((resolve) => {
            window.scrollTo(0, 0);
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
                        if (totalHeight > document.body.scrollHeight - window.innerHeight) {
                            clearInterval(Timer);
                            clearInterval(scroll)
                            resolve("");
                        }
                }
            }, 100);
            const scroll = setInterval(() => {
                window.scrollBy(0, distance / 2);
                totalHeight += distance / 2
            },300)
        });
        return IHref;
    }, Images);
    await page.screenshot({path: "opensea.png"});
    console.log(Images2);

    console.log("done")

    var end = Date.now() - start;
    fs.writeFile("nftsrc.txt", Images2.join(' \n') +  "\n" + end, function (err) {
        if (err) return console.log(err);
        console.log('Error > nftsrc.txt');
      });
});
