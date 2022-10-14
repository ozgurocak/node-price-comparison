const { response } = require('express');
const e = require('express');
const puppeteer = require('puppeteer');

const limit = 10;

async function initBrowser() {
    const browser = await puppeteer.launch({ headless: true });

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
            await page.goto(url+"?pg="+(++pagenum));
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

    const [processor_element] = await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="İşlemci"]/following-sibling::p');
    let processor = await page.evaluate(el => el.textContent, processor_element).then(res => res.slice(1));
    if(processor.indexOf(" ") != -1)
        processor = processor.slice(processor.indexOf(" ")+1);

    console.log(productLink);
    const product = {
        "modelname": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Model"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
        "brand": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Marka"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
        "os": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="İşletim Sistemi"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
        "processor": processor,
        "processorgen": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="İşlemci Modeli"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(res.indexOf(' ') + 1)),
        "ram": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Bellek Kapasitesi"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
        "capacity": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Disk Kapasitesi"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
        "storage": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Disk Türü"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
        "screen": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Ekran Boyutu"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(0, -1)).then(res => res.slice(1)),
        "score": await page.$x('//*[@id="unf-p-id"]/div/div[2]/div[2]/div[1]/div/div[2]/div[1]/div[2]/div[1]/strong').then((res) => page.evaluate(el => el.textContent, res[0])),
        "price": await page.$x('//*[@id="unf-p-id"]/div/div[2]/div[2]/div[1]/div/div[2]/div[2]/div[1]/div[1]/div/div/div/ins').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.split(".")).then(res => res[0].concat(res[1])).then(res => parseFloat(res)),
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
        const hrefHandle = await anchor.getProperty('href');
        const href = await hrefHandle.jsonValue();
        itemList.push(href);
        
        counter++;
    }

    return itemList;
}

async function scrapeProductVatan(browser, productLink) {
    const page = await browser.newPage();
    await page.goto(productLink);

    const [brand_element] = await page.$x('/html/body/main/div/div[1]/div/div/div/ul/li[4]/a');
    let brand = await page.evaluate(el => el.textContent, brand_element);
    if(brand != "HP"){
        brand = brand.toLowerCase();
        brand = brand.charAt(0).toUpperCase() + brand.slice(1);
    }

    console.log(productLink);
    await page.click('body > main > div > div.wrap-product-info > div.product-info-head > div > ul > li:nth-child(2) > a');
    const product = {
        "modelname": await page.$x('/html/body/main/div/div[1]/div/div/div/ul/li[5]/a').then((res) => page.evaluate(el => el.textContent, res[0])),
        "brand": brand,
        "os": await page.$x('//div[@id="urun-ozellikleri"]//td[text()="İşletim Sistemi"]/following-sibling::td/p[1]').then((res) => page.evaluate(el => el.textContent, res[0])),
        "processor": await page.$x('//div[@id="urun-ozellikleri"]//td[text()="İşlemci Teknolojisi"]/following-sibling::td/p[1]').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.replace('™', '')),
        "processorgen": await page.$x('//div[@id="urun-ozellikleri"]//td[text()="İşlemci Nesli"]/following-sibling::td/p[1]').then((res) => page.evaluate(el => el.textContent, res[0])),
        "ram": await page.$x('//div[@id="urun-ozellikleri"]//td[text()="Ram (Sistem Belleği)"]/following-sibling::td/p[1]').then((res) => page.evaluate(el => el.textContent, res[0])),
        "capacity": await page.$x('//div[@id="urun-ozellikleri"]//td[text()="Disk Kapasitesi"]/following-sibling::td/p[1]').then((res) => page.evaluate(el => el.textContent, res[0])),
        "storage": await page.$x('//div[@id="urun-ozellikleri"]//td[text()="Disk Türü"]/following-sibling::td/p[1]').then((res) => page.evaluate(el => el.textContent, res[0])),
        "screen": await page.$x('//div[@id="urun-ozellikleri"]//td[text()="Ekran Boyutu"]/following-sibling::td/p[1]').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.split(" ")).then(res => res[0]),
        "score": await page.$x('//*[@id="topAverageRank"]').then((res) => page.evaluate(el => el.getAttribute('style'), res[0])).then(res => res.split(" ")).then(res => res[1].split("%")).then(res => parseFloat(res[0])/100*5),
        "price": await page.$x('/html/body/main/div/div[4]/div/div/div/div/div[2]/div[3]/div/div/div[2]/div[1]/span[1]').then(res => page.evaluate(el => el.textContent, res[0])).then(res => res.split(".")).then(res => res[0].concat(res[1])).then(res => parseFloat(res)),
        "site": "Vatan Bilgisayar"
    };

    return product;
}

async function scrapeListTrendyol(browser) {
    const page = await browser.newPage();
    const url = "https://www.trendyol.com/laptop-x-c103108";
    await page.goto(url, {timeout: 0, waitUntil: 'networkidle0'});
    await new Promise(res => setTimeout(res, 2000));

    let counter = 1;
    let pagenum = 1;
    let itemList = [];
    let add = 0;

    await page.click("#onetrust-accept-btn-handler");
    for(let i = 1; i < limit && counter < limit; i++){
        if(pagenum == 1) add = 1;
        else add = 0;
        const [anchor] = await page.$x('//*[@id="search-app"]/div/div[1]/div[2]//div[1]/div/div['+(i+add)+']/div[1]/a');       
        if(anchor === undefined){
            console.log("Loading next page");
            await page.goto(url+"?pi="+(++pagenum));
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

async function scrapeProductTrendyol(browser, productLink) {
    const page = await browser.newPage();
    await page.goto(productLink);

    let score = 0;

    for(let i = 1; i <= 5; i++){
        const [star] = await page.$x('//*[@id="product-detail-app"]/div/div[2]/div[1]/div[2]/div[2]/div[2]/div/div/div[3]/div/div[1]/div[1]/div/div/div/div['+i+']/div[2]');
        if(star === undefined){
            score = 0;
            break;
        }
        const val = await page.evaluate(el => el.getAttribute('style'), star).then(res => res.split(" ")).then(res => res[1].split("%")).then(res => parseInt(res[0]));
        if(val == 100){score++; continue;}
        else {
            score = score + (parseFloat(val)/100);
            break;
        }
    }

    const [processor_element] = await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="İşlemci Tipi"]/following-sibling::span/b');
    let processor = await page.evaluate(el => el.textContent, processor_element);
    if(processor.indexOf(" ") != -1)
        processor = processor.slice(processor.indexOf(" ")+1);

    const brandname = await page.$x('//*[@id="marketing-product-detail-breadcrumb"]/div/a[6]/span').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.split(" "));
    console.log(brandname[0]);
    console.log(productLink);
    const product = {
        "modelname": await page.$x('//*[@id="product-detail-app"]/div/div[2]/div[1]/div[2]/div[2]//a[contains(text(), "'+brandname[0]+'")]/following-sibling::span').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),             
        "brand": brandname[0],
        "os": await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="İşletim Sistemi"]/following-sibling::span/b').then((res) => page.evaluate(el => el.textContent, res[0])),
        "processor": processor,
        "processorgen": await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="İşlemci Modeli"]/following-sibling::span/b').then((res) => page.evaluate(el => el.textContent, res[0])),
        "ram": await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="Ram (Sistem Belleği)"]/following-sibling::span/b').then((res) => page.evaluate(el => el.textContent, res[0])),
        "capacity": await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="SSD Kapasitesi"]/following-sibling::span/b').then((res) => page.evaluate(el => el.textContent, res[0])),
        "storage": "SSD",
        "screen": await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="Ekran Boyutu"]/following-sibling::span/b').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(0, (res.length - res.indexOf(" "))*-1)).then(res => res.split(",")).then(res => res[0]+"."+res[1]),
        "score": score,
        "price": await page.$x('//*[@id="product-detail-app"]/div/div[2]/div[1]/div[2]/div[2]//span[contains(text(), "TL")]').then(res => page.evaluate(el => el.textContent, res[0])).then(res => res.split(" ")).then(res => res[0].split(".")).then(res => res[0].concat(res[1])).then(res => parseFloat(res)),
        "site": "Trendyol"
    };

    return product;
}

async function scrapeListTeknosa(browser) {
    const page = await browser.newPage();
    const url = "https://www.teknosa.com/laptop-notebook-c-116004?sort=bestSellerPoint-desc"; 
    await page.goto(url);

    let counter = 1;
    let pagenum = 0;
    let itemList = [];

    for(let i = 1; i < limit && counter < limit; i++){
        const [anchor] = await page.$x('//*[@id="site-main"]/div/div[1]/div[1]/div/div/div[2]/div[2]/div[1]/div['+i+']/a');       
        if(anchor === undefined){
            await page.goto(url+"&page="+(++pagenum));
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

async function scrapeProductTeknosa(browser, productLink) {
    const page = await browser.newPage();
    await page.goto(productLink, {timeout: 0, waitUntil: 'networkidle0'});
    await page.setViewport({
        width: 1200,
        height: 900,
    });

    let price = 0;
    let [price_element] = await page.$x('//*[@id="pdp-main"]/div[2]/div[2]/div[8]/div//*[contains(text(), "TL")]');
    if(price_element === undefined){
        [price_element] = await page.$x('//*[@id="pdp-main"]/div[2]/div[2]/div[7]/div//*[contains(text(), "TL")]');
    }
    price = await page.evaluate(el => el.textContent, price_element).then(res => res.split(" ")).then(res => res[0].split(".")).then(res => res[0].concat(res[1])).then(res => parseFloat(res));

    const [processor_element] = await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[text()="İşlemci"]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[text()="İşlemci"]/preceding-sibling::*)+1]');
    let processor = await page.evaluate(el => el.textContent, processor_element);
    if(processor.indexOf(" ") != -1)
        processor = processor.slice(processor.indexOf(" ")+1);

    console.log(productLink);
    const product = {
        "modelname": await page.$x('//*[@id="pdp-main"]/div[2]/div[1]/h1').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(res.indexOf(" ")+1)),
        "brand": await page.$x('//*[@id="pdp-main"]/div[2]/div[1]/h1/b').then((res) => page.evaluate(el => el.textContent, res[0])),
        "os": await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[text()="İşletim Sistemi Yazılımı"]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[text()="İşletim Sistemi Yazılımı"]/preceding-sibling::*)+1]').then((res) => page.evaluate(el => el.textContent, res[0])),
        "processor": processor,
        "processorgen": await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[text()="İşlemci Nesli"]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[text()="İşlemci Nesli"]/preceding-sibling::*)+1]').then((res) => page.evaluate(el => el.textContent, res[0])).catch(res => "Belirtilmemiş"),
        "ram": await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[text()="Ram"]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[text()="Ram"]/preceding-sibling::*)+1]').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res+" GB"),
        "capacity": await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[contains(text(), "Kapasite")]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[contains(text(), "Kapasite")]/preceding-sibling::*)+1]').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res+" GB"),
        "storage": "SSD",
        "screen": await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[text()="Ekran Boyutu"]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[text()="Ekran Boyutu"]/preceding-sibling::*)+1]').then((res) => page.evaluate(el => el.textContent, res[0])),
        "score": 0,
        "price": price,
        "site": "Teknosa"
    };
    console.log("complete");
    return product;
}

(async () => {
    const browser = await initBrowser();
    const ListN11 = await scrapeListTeknosa(browser);
    //const ListVatan = await scrapeListVatan(browser);
    let productList = [];
    for(let i = 0; i < ListN11.length; i++){
        const product = await scrapeProductTeknosa(browser, ListN11[i]);
        productList.push(product);
    }
    /*for(let i = 0; i < ListVatan.length; i++){
        const product = await scrapeProductVatan(browser, ListVatan[i]);
        productList.push(product);
    }*/
    console.log(productList);
    //const product = await scrapeProductVatan(browser, ListVatan[3]);
    //console.log(product);
    browser.close();
})();