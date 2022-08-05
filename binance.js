const Puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const fs = require('fs')

Puppeteer.use(StealthPlugin())

Puppeteer.launch({headless: false}).then(async browser => {
    const start = Date.now();
    const page = await browser.newPage();
    await page.goto("https://www.binance.com/en/nft/search-result?tab=nft&keyword=ben&order=list_time%40-1", {"waitUntil" : "networkidle0"});
    await page.setViewport({
        width: 1200,
        height: 800
    });         
    await page.screenshot({path: "binance.png"});
    await page.$eval( 'button.css-1dn3rsy', form => form.click() );

    await autoScroll(page);
    await page.waitForTimeout(2000);

    const Images = await page.evaluate(() => {
        const ITag = document.querySelectorAll(".css-2r2ti0")
        let IHref = [];
        ITag.forEach((tag) => {
            const object = tag.firstChild.firstChild;
            if (object.src != null) {
                IHref.push(object.src);
            }
        });
        return IHref;
    });
    
    console.log(Images);
    await browser.close();
    var end = Date.now() - start;
    fs.writeFile("nftsrc.txt", Images.join(' \n') +  "\n" + end, function (err) {
        if (err) return console.log(err);
        console.log('Error > nftsrc.txt');
      });
});

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 200;
            var checking = true;
            var timer = setInterval(() => {
                if (checking) {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    checking = false
                    setTimeout(() => {
                        scrollHeight = document.body.scrollHeight;
                        if(totalHeight >= scrollHeight - window.innerHeight){
                        clearInterval(timer);
                        resolve();
                        }
                        checking = true
                    }, 3000);
                }
            }
            }, 100);
        });
    });

}