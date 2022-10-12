const e = require('express');
const puppeteer = require('puppeteer');

const limit = 10;

async function initBrowser() {
    const browser = await puppeteer.launch();

    return browser;
}

async function scrapeListN11(browser) {
    const page = await browser.newPage();
    const url = "https://www.n11.com/bilgisayar/dizustu-bilgisayar";
    await page.goto(url);

    let counter = 1;
    let pagenum = 1;
    let itemList = [];

    for(let i = 1; i <= limit && counter <= limit; i++){
        const [anchor] = await page.$x('/html/body/div[1]/div[3]/div/div[2]/div[2]/section/div[2]/ul/li['+i+']/div/div/a');
        if(anchor === undefined){
            await page.goto(url+"?ipg="+(++pagenum));
            i = 1;
            continue;
        }
        const hrefHandle = await anchor.getProperty('href');
        const href = await hrefHandle.jsonValue();
        itemList.push(href);

        counter++;
    }

    return itemList;
}

async function scrapeProductN11(browser, productLink){
    const page = await browser.newPage();
    await page.goto(productLink);

    let i = 0;
    console.log(productLink);
    const product = {
        "model": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Model"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
        "brand": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Marka"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
        "os": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="İşletim Sistemi"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
        "processor": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="İşlemci"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
        "procgen": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="İşlemci Modeli"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(res.indexOf(' ') + 1)),
        "ram": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Bellek Kapasitesi"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
        "capacity": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Disk Kapasitesi"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
        "storage": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Disk Türü"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
        "screen": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Ekran Boyutu"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(0, -1)).then(res => res.slice(1)),
        "score": await page.$x('//*[@id="unf-p-id"]/div/div[2]/div[2]/div[1]/div/div[2]/div[1]/div[2]/div[1]/strong').then((res) => page.evaluate(el => el.textContent, res[0])),
        "price": await page.$x('//*[@id="unf-p-id"]/div/div[2]/div[2]/div[1]/div/div[2]/div[2]/div[1]/div[1]/div/div/div/ins').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.split(".")).then(res => res[0].concat(res[1])).then(res => parseInt(res)),
        "site": "n11"
    };

    return product;
}

async function scrapeListVatan(browser) {
    const page = await browser.newPage();
    const url = "https://www.vatanbilgisayar.com/notebook/";
    await page.goto(url);

    let counter = 1;
    let pagenum = 1;
    let itemList = [];

    for(let i = 1; i < limit && counter < limit; i++){
        const [anchor] = await page.$x('//*[@id="productsLoad"]/div['+i+']/div[2]/a');
        if(anchor === undefined){
            await page.goto(url+"?page="+(++pagenum));
            i = 1;
            continue;
        }
        const hrefHandle = anchor.getProperty('href');
        const href = await hrefHandle.jsonValue();
        itemList.push(href);
        
        counter++;
    }

    return itemList;
}

(async () => {
    const browser = await initBrowser();
    const ListN11 = await scrapeListN11(browser);
    const ListVatan = await scrapeListVatan(browser);
    let productList = [];
    for(let i = 0; i < ListN11.length; i++){
        const product = await scrapeProductN11(browser, ListN11[i]);
        productList.push(product);
    }
    console.log(productList);
    browser.close();
})();