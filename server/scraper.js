const puppeteer = require('puppeteer');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'yazlab_test'
});

<<<<<<< HEAD
const limit = 190;
=======
const limit = 20;
>>>>>>> bad60968958b3a1e7cec8b7847e2ea047841de82

async function initBrowser() {
    const browser = await puppeteer.launch({ headless: true });

    return browser;
}

async function scrapeListN11(browser) {
    const page = await browser.newPage();
    const url = "https://www.n11.com/bilgisayar/dizustu-bilgisayar";
    await page.goto(url, {timeout: 0, waitUntil: 'networkidle0'});

    let counter = 1;
    let pagenum = 1;
    let itemList = [];

    for(let i = 1; (counter <= limit) && (i <= limit); i++){
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
    await page.goto(productLink, {timeout: 0, waitUntil: 'networkidle0'});

    console.log(productLink);
    const [processor_element] = await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="İşlemci"]/following-sibling::p');
    if(processor_element === undefined) return null;
    let processor = await page.evaluate(el => el.textContent, processor_element).then(res => res.slice(1));
    if(processor.indexOf(" ") != -1)
        processor = processor.slice(processor.indexOf(" ")+1);

    const [price_element] = await page.$x('//*[@id="unf-p-id"]/div/div[2]/div[2]/div[1]/div/div[2]/div[2]/div[1]/div[1]/div/div/div/ins');
    let price = "";
    try {
        price = await page.evaluate(el => el.textContent, price_element).then(res => res.split(".")).then(res => res[0].concat(res[1])).then(res => parseFloat(res));
    } catch (error) {
        return null;
    }

    try {
        const product = {
            "modelname": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Model"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
            "img": await page.$x('//*[@id="unf-p-id"]/div/div[2]/div[2]/div[1]/div/div[1]/div[2]/div/a/img').then((res) => res[0].getProperty('src')).then(res => res.jsonValue()),
            "brand": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Marka"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
            "os": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="İşletim Sistemi"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
            "processor": processor,
            "processorgen": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="İşlemci Modeli"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(res.indexOf(' ') + 1)),
            "ram": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Bellek Kapasitesi"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
            "capacity": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Disk Kapasitesi"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
            "storage": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Disk Türü"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),
            "screen": await page.$x('//*[@id="unf-prop"]/div/ul//p[text()="Ekran Boyutu"]/following-sibling::p').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(0, -1)).then(res => res.slice(1)),
            "score": await page.$x('//*[@id="unf-p-id"]/div/div[2]/div[2]/div[1]/div/div[2]/div[1]/div[2]/div[1]/strong').then((res) => page.evaluate(el => el.textContent, res[0])),
            "price": price,
            "site": "n11",
            "url": productLink
        };
        await page.close();
        return product;
    } catch (error) {
        return null;
    }
}

async function scrapeListVatan(browser) {
    const page = await browser.newPage();
    const url = "https://www.vatanbilgisayar.com/notebook/";
    await page.goto(url);

    let counter = 1;
    let pagenum = 1;
    let itemList = [];

    for(let i = 1; (counter <= limit) && (i <= limit); i++){
        const [anchor] = await page.$x('//*[@id="productsLoad"]/div['+i+']/div[2]/a');
        if(anchor === undefined){
            await page.goto(url+"?page="+(++pagenum));
            console.log("pg: "+pagenum);
            i = 1;
            continue;
        }
        const hrefHandle = await anchor.getProperty('href');
        const href = await hrefHandle.jsonValue();
        itemList.push(href);
        console.log("pushed "+counter);
        
        counter++;
    }

    return itemList;
}

async function scrapeProductVatan(browser, productLink) {
    const page = await browser.newPage();
    await page.goto(productLink, {waitUntil: 'load', timeout: 0});

    const [brand_element] = await page.$x('/html/body/main/div/div[1]/div/div/div/ul/li[4]/a');
    let brand = await page.evaluate(el => el.textContent, brand_element);
    if(brand != "HP"){
        brand = brand.toLowerCase();
        brand = brand.charAt(0).toUpperCase() + brand.slice(1);
    }

    console.log(productLink);
    await page.click('body > main > div > div.wrap-product-info > div.product-info-head > div > ul > li:nth-child(2) > a');
    try {
        const product = {
            "modelname": await page.$x('/html/body/main/div/div[1]/div/div/div/ul/li[5]/a').then((res) => page.evaluate(el => el.textContent, res[0])),
            "img": await page.$x('//*[@id="product-detail"]/div/div[1]/div[2]/a/img').then((res) => res[0].getProperty('srcset')).then(res => res.jsonValue()),
            "brand": brand,
            "os": await page.$x('//div[@id="urun-ozellikleri"]//td[text()="İşletim Sistemi"]/following-sibling::td/p[1]').then((res) => page.evaluate(el => el.textContent, res[0])),
            "processor": await page.$x('//div[@id="urun-ozellikleri"]//td[text()="İşlemci Teknolojisi"]/following-sibling::td/p[1]').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.replace('™', '')),
            "processorgen": await page.$x('//div[@id="urun-ozellikleri"]//td[text()="İşlemci Nesli"]/following-sibling::td/p[1]').then((res) => page.evaluate(el => el.textContent, res[0])),
            "ram": await page.$x('//div[@id="urun-ozellikleri"]//td[text()="Ram (Sistem Belleği)"]/following-sibling::td/p[1]').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.split(" ")).then(res => res[0]+" GB"),
            "capacity": await page.$x('//div[@id="urun-ozellikleri"]//td[text()="Disk Kapasitesi"]/following-sibling::td/p[1]').then((res) => page.evaluate(el => el.textContent, res[0])),
            "storage": await page.$x('//div[@id="urun-ozellikleri"]//td[text()="Disk Türü"]/following-sibling::td/p[1]').then((res) => page.evaluate(el => el.textContent, res[0])),
            "screen": await page.$x('//div[@id="urun-ozellikleri"]//td[text()="Ekran Boyutu"]/following-sibling::td/p[1]').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.split(" ")).then(res => res[0]),
            "score": await page.$x('//*[@id="topAverageRank"]').then((res) => page.evaluate(el => el.getAttribute('style'), res[0])).then(res => res.split(" ")).then(res => res[1].split("%")).then(res => parseFloat(res[0])/100*5),
            "price": await page.$x('/html/body/main/div/div[4]/div/div/div/div/div[2]//div/div/div[2]/div[1]/span[1]').then(res => page.evaluate(el => el.textContent, res[0])).then(res => res.split(".")).then(res => res[0].concat(res[1])).then(res => parseFloat(res)),
            "site": "Vatan Bilgisayar",
            "url": productLink
        };
        await page.close();
        return product;
    } catch (error) {
        return null;
    }

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
    for(let i = 1; (counter <= limit) && (i <= limit); i++){
        if(pagenum == 1) add = 1;
        else add = 0;
        const [anchor] = await page.$x('//*[@id="search-app"]/div/div[1]/div[2]//div/div['+(i+add)+']/div[1]/a');
                                        //*[@id="search-app"]/div/div[1]/div[2]/div[5]/div[1]/div/div[2]/div[1]/a       
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
    await page.goto(productLink, {waitUntil: 'load', timeout: 0});

    console.log(productLink);

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

    const [screen_element] = await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="Ekran Boyutu"]/following-sibling::span/b');
    let screen_temp = await page.evaluate(el => el.textContent, screen_element).then(res => res.slice(0, (res.length - res.indexOf(" "))*-1)).then(res => res.split(","));
    let screen = "";
    if(screen_temp[1] === undefined)
        screen = screen_temp[0];
    else
        screen = screen_temp[0]+"."+screen_temp[1];

    const brandname = await page.$x('//*[@id="product-detail-app"]/div/div[2]/div[1]/div[2]/div[2]//div/div/div[1]/h1').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.split(" "));
    console.log(brandname[0]);
<<<<<<< HEAD
    try {
        const product = {
            "modelname": await page.$x('//*[@id="product-detail-app"]/div/div[2]/div[1]/div[2]/div[2]//*[contains(text(), "'+brandname[0]+'")]/parent::*//span').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),             
            "img": await page.$x('//*[@id="product-detail-app"]/div/div[2]/div[1]/div[2]/div[1]/div/div[1]/div/div/img').then((res) => res[0].getProperty('src')).then(res => res.jsonValue()),
            "brand": brandname[0],
            "os": await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="İşletim Sistemi"]/following-sibling::span/b').then((res) => page.evaluate(el => el.textContent, res[0])),
            "processor": processor,
            "processorgen": await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="İşlemci Modeli"]/following-sibling::span/b').then((res) => page.evaluate(el => el.textContent, res[0])),
            "ram": await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="Ram (Sistem Belleği)"]/following-sibling::span/b').then((res) => page.evaluate(el => el.textContent, res[0])),
            "capacity": await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="SSD Kapasitesi"]/following-sibling::span/b').then((res) => page.evaluate(el => el.textContent, res[0])),
            "storage": "SSD",
            "screen": screen,
            "score": score,
            "price": await page.$x('//*[@id="product-detail-app"]/div/div[2]/div[1]/div[2]/div[2]//span[contains(text(), "TL")]').then(res => page.evaluate(el => el.textContent, res[0])).then(res => res.split(" ")).then(res => res[0].split(".")).then(res => res[0].concat(res[1])).then(res => parseFloat(res)),
            "site": "Trendyol",
            "url": productLink
        };
    
        await page.close();
        return product;
    } catch (error) {
        return null;
    }
    
=======
    const product = {
        "modelname": await page.$x('//*[@id="product-detail-app"]/div/div[2]/div[1]/div[2]/div[2]//*[contains(text(), "'+brandname[0]+'")]/parent::*//span').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(1)),             
        "img": await page.$x('//*[@id="product-detail-app"]/div/div[2]/div[1]/div[2]/div[1]/div/div[1]/div/div/img').then((res) => res[0].getProperty('src')).then(res => res.jsonValue()),
        "brand": brandname[0],
        "os": await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="İşletim Sistemi"]/following-sibling::span/b').then((res) => page.evaluate(el => el.textContent, res[0])),
        "processor": processor,
        "processorgen": await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="İşlemci Modeli"]/following-sibling::span/b').then((res) => page.evaluate(el => el.textContent, res[0])),
        "ram": await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="Ram (Sistem Belleği)"]/following-sibling::span/b').then((res) => page.evaluate(el => el.textContent, res[0])),
        "capacity": await page.$x('//*[@id="product-detail-app"]/div/section/div/ul//span[text()="SSD Kapasitesi"]/following-sibling::span/b').then((res) => page.evaluate(el => el.textContent, res[0])),
        "storage": "SSD",
        "screen": screen,
        "score": score,
        "price": await page.$x('//*[@id="product-detail-app"]/div/div[2]/div[1]/div[2]/div[2]//div/span[contains(text(), "TL")]').then(res => page.evaluate(el => el.textContent, res[0])).then(res => res.split(" ")).then(res => res[0].split(".")).then(res => res[0].concat(res[1])).then(res => parseFloat(res)),
        "site": "Trendyol",
        "url": productLink
    };

    await page.close();
    return product;
>>>>>>> bad60968958b3a1e7cec8b7847e2ea047841de82
}

async function scrapeListTeknosa(browser) {
    const page = await browser.newPage();
    const url = "https://www.teknosa.com/laptop-notebook-c-116004?sort=bestSellerPoint-desc"; 
    await page.goto(url, {waitUntil: 'load', timeout: 0});

    let counter = 1;
    let pagenum = 0;
    let itemList = [];

    for(let i = 1; (counter <= limit) && (i <= limit); i++){
        const [anchor] = await page.$x('//*[@id="site-main"]/div/div[1]/div[1]/div/div/div[2]/div[2]/div[1]/div['+i+']/a');       
        if(anchor === undefined){
            await page.goto(url+"&page="+(++pagenum), {waitUntil: 'load', timeout: 0});
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
    //let [price_element] = await page.$x('//*[@id="pdp-main"]/div[2]/div[2]/div[9]/div//*[contains(text(), "TL")]');
    let [price_element] = await page.$x('//*[@id="pdp-main"]/div[2]/div[2]/div[8]/div//*[contains(text(), "TL")]');
    if(price_element === undefined){
        console.log("u");
        [price_element] = await page.$x('//*[@id="pdp-main"]/div[2]/div[2]/div[7]/div//*[contains(text(), "TL")]');
        if(price_element === undefined) return null;
    }
    price = await page.evaluate(el => el.textContent, price_element).then(res => res.split(" ")).then(res => res[0].split(".")).then(res => res[0].concat(res[1])).then(res => parseFloat(res));

    const [processor_element] = await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[text()="İşlemci"]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[text()="İşlemci"]/preceding-sibling::*)+1]');
    let processor = await page.evaluate(el => el.textContent, processor_element);
    if(processor.indexOf(" ") != -1)
        processor = processor.slice(processor.indexOf(" ")+1);

    let [capacity_element] = await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[contains(text(), "Toplam Depolama Kapasitesi")]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[contains(text(), "Toplam Depolama Kapasite")]/preceding-sibling::*)+1]');
    let capacity = "";
    let disk_type = "SSD";
    if(capacity_element === undefined){
        [capacity_element] = await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[contains(text(), "SSD Kapasitesi")]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[contains(text(), "SSD Kapasitesi")]/preceding-sibling::*)+1]');     
        if(capacity_element === undefined){
            [capacity_element] = await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[contains(text(), "HDD Kapasitesi")]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[contains(text(), "HDD Kapasitesi")]/preceding-sibling::*)+1]');
            disk_type = "HDD";
            capacity = await page.evaluate(el => el.textContent, capacity_element);
        }
        else{
            capacity = await page.evaluate(el => el.textContent, capacity_element);
            if(capacity == "Yok"){
                [capacity_element] = await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[contains(text(), "HDD Kapasitesi")]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[contains(text(), "HDD Kapasitesi")]/preceding-sibling::*)+1]');
                disk_type = "HDD";
                capacity = await page.evaluate(el => el.textContent, capacity_element);
            }
            else disk_type = "SSD";
        }
    }
    else{
        capacity = await page.evaluate(el => el.textContent, capacity_element).then(res => res+" GB");
    }

    const [ram_element] = await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[text()="Ram"]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[text()="Ram"]/preceding-sibling::*)+1]');
    let ram = await page.evaluate(el => el.textContent, ram_element);
    if(!ram.includes("GB")) ram = ram.concat(" GB");

    console.log(productLink);
    const product = {
        "modelname": await page.$x('//*[@id="pdp-main"]/div[2]/div[1]/h1').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.slice(res.indexOf(" ")+1)),
        "img": await page.$x('//*[@id="pdp-gallery"]//img').then((res) => res[0].getProperty('srcset')).then(res => res.jsonValue()),
        "brand": await page.$x('//*[@id="pdp-main"]/div[2]/div[1]/h1/b').then((res) => page.evaluate(el => el.textContent, res[0])),
        "os": await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[text()="İşletim Sistemi Yazılımı"]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[text()="İşletim Sistemi Yazılımı"]/preceding-sibling::*)+1]').then((res) => page.evaluate(el => el.textContent, res[0])),
        "processor": processor,
        "processorgen": await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[text()="İşlemci Nesli"]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[text()="İşlemci Nesli"]/preceding-sibling::*)+1]').then((res) => page.evaluate(el => el.textContent, res[0])).catch(res => "Belirtilmemiş"),
        "ram": ram,
        "capacity": capacity,
        "storage": disk_type,
        "screen": await page.$x('//*[@id="pdp-technical"]/div/div[1]/div/table[count(//th[text()="Ekran Boyutu"]/parent::*/parent::*/parent::table/preceding-sibling::table)+1]//td[count(//th[text()="Ekran Boyutu"]/preceding-sibling::*)+1]').then((res) => page.evaluate(el => el.textContent, res[0])).then(res => res.split(" ")).then(res => res[0]),
        "score": 0,
        "price": price,
        "site": "Teknosa",
        "url": productLink
    };
    console.log("complete");
    await page.close();
    return product;
}

async function checkDuplicate(attrib, table, column, column_id){
    return new Promise((resolve, reject) => {
        try {
            db.query('SELECT '+column_id+' FROM '+table+' WHERE '+column+' = ?', [attrib], (err, res) => {
                if (err) return reject(err);
                if(res.length == 0) return resolve(0);
                else return resolve(res[0]);
            });
        } catch (e) {
            reject(e);
        }
    });
}

async function checkProductDuplicate(brand_id, proc_id, ram_id, cap_id, screen_id){
    return new Promise((resolve, reject) => {
        try {
            db.query('SELECT pid FROM products WHERE brand_id = ? AND proc_id = ? AND ram_id = ? AND cap_id = ? AND screen_id = ?', [brand_id, proc_id, ram_id, cap_id, screen_id], (err, res) => {
                if(err) return reject(err);
                if(res.length == 0) return resolve(false);
                else return resolve(true);
            });
        } catch (e) {
            reject(e);
        }
    });
}

async function checkSiteDuplicate(s_name){
    return new Promise((resolve, reject) => {
        try {
            db.query('SELECT sid FROM sites WHERE s_name = ?', [s_name], (err, res) => {
                if(err) return reject(err);
                if(res.length == 0) return resolve(false);
                else return resolve(res[0].sid);
            });
        } catch (e) {
            reject(e);
        }
    });
}

async function checkPriceDuplicate(sid, pid){
    return new Promise((resolve, reject) => {
        try {
            db.query('SELECT sid, pid FROM scores_prices WHERE sid = ? AND pid = ?', [sid, pid], (err, res) => {
                if(err) return reject(err);
                if(res.length == 0) return resolve(false);
                else return resolve(true);
            });
        } catch (e) {
            reject(e);
        }
    });
}

async function getProductID(brand_id, ram_id, proc_id, cap_id, screen_id){
    return new Promise((resolve, reject) => {
        try {
            db.query('SELECT pid FROM products WHERE brand_id = ? AND proc_id = ? AND ram_id = ? AND cap_id = ? AND screen_id = ?', [brand_id, proc_id, ram_id, cap_id, screen_id], (err, res) => {
                if(err) return reject(err);
                return resolve(res[0].pid);
            });
        } catch (e) {
            reject(e);
        }
    });
}

async function insertValues(attrib, table, column){
    return new Promise((resolve, reject) => {
        try {
            db.query('INSERT INTO '+table+'('+column+') VALUES (?)', [attrib], (err, res) => {
                if (err) return reject(err);
                return resolve(res);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function insertItem(itemList){
    for(let i = 0; i < itemList.length; i++){
        if(itemList[i].url.length > 200) continue;

        console.log(i);
        let proc_id = await checkDuplicate(itemList[i].processor, "processors", "proc_model", "proc_id").then(res => res.proc_id);
        if(!proc_id) await insertValues(itemList[i].processor, "processors", "proc_model");
        proc_id = await checkDuplicate(itemList[i].processor, "processors", "proc_model", "proc_id").then(res => res.proc_id);

        let brand_id = await checkDuplicate(itemList[i].brand, "brands", "brand_name", "brand_id").then(res => res.brand_id);
        if(!brand_id) await insertValues(itemList[i].brand, "brands", "brand_name");
        brand_id = await checkDuplicate(itemList[i].brand, "brands", "brand_name", "brand_id").then(res => res.brand_id);

        let os_id = await checkDuplicate(itemList[i].os, "os", "os_name", "os_id").then(res => res.os_id);
        if(!os_id) await insertValues(itemList[i].os, "os", "os_name");
        os_id = await checkDuplicate(itemList[i].os, "os", "os_name", "os_id").then(res => res.os_id);

        let ram_id = await checkDuplicate(itemList[i].ram, "ram", "ram", "ram_id").then(res => res.ram_id);
        if(!ram_id) await insertValues(itemList[i].ram, "ram", "ram");
        ram_id = await checkDuplicate(itemList[i].ram, "ram", "ram", "ram_id").then(res => res.ram_id);

        let cap_id = await checkDuplicate(itemList[i].capacity, "disk_capacity", "cap", "cap_id").then(res => res.cap_id);
        if(!cap_id) await insertValues(itemList[i].capacity, "disk_capacity", "cap");
        cap_id = await checkDuplicate(itemList[i].capacity, "disk_capacity", "cap", "cap_id").then(res => res.cap_id);

        let storage_id = await checkDuplicate(itemList[i].storage, "storages", "storage", "storage_id").then(res => res.storage_id);
        if(!storage_id) await insertValues(itemList[i].storage, "storages", "storage");
        storage_id = await checkDuplicate(itemList[i].storage, "storages", "storage", "storage_id").then(res => res.storage_id);

        let screen_id = await checkDuplicate(itemList[i].screen, "screen", "screen_dim", "screen_id").then(res => res.screen_id);
        if(!screen_id) await insertValues(itemList[i].screen, "screen", "screen_dim");
        screen_id = await checkDuplicate(itemList[i].screen, "screen", "screen_dim", "screen_id").then(res => res.screen_id);

        const isDuplicate = await checkProductDuplicate(brand_id, proc_id, ram_id, cap_id, screen_id);
        if(!isDuplicate){
            db.query('INSERT INTO products(model, img, brand_id, proc_id, proc_gen, os_id, ram_id, cap_id, storage_id, screen_id) VALUES (?)',
            [[
                itemList[i].modelname,
                itemList[i].img,
                brand_id,
                proc_id,
                itemList[i].processorgen,
                os_id,
                ram_id,
                cap_id,
                storage_id,
                screen_id,
            ]], (err, res) => {
                if (err) throw err;
            });
        }

        const isSiteDuplicate = await checkSiteDuplicate(itemList[i].site);
        if(!isSiteDuplicate){
            db.query('INSERT INTO sites(s_name) VALUES (?)', itemList[i].site, (err, res) => {if(err) throw err;});
        }
        const sid = await checkSiteDuplicate(itemList[i].site);
        const pid = await getProductID(brand_id, ram_id, proc_id, cap_id, screen_id);

        const isPriceDuplicate = await checkPriceDuplicate(sid, pid);
        if(!isPriceDuplicate){
            db.query('INSERT INTO scores_prices VALUES (?)', [[sid, pid, parseFloat(itemList[i].score), itemList[i].price, itemList[i].url]]);
        }
    }
}

(async () => {
    db.connect((err) => {
        if (err) throw err;
        console.log("MySql connected.");
    });

    const browser = await initBrowser();
    /*const ListN11 = await scrapeListN11(browser);
    console.log("N11 OK");
    const ListVatan = await scrapeListVatan(browser);
    console.log("Vatan OK");*/
    const ListTrendyol = await scrapeListTrendyol(browser);
    console.log("Trendyol OK");
    const ListTeknosa = await scrapeListTeknosa(browser);
    console.log("Teknosa OK");
    //let productListN11 = [];
    //let productListVatan = [];
    let productListTrendyol = [];
    let productListTeknosa = [];
    /*for(let i = 0; i < ListN11.length; i++){
        const product = await scrapeProductN11(browser, ListN11[i]);
        if(product === null) continue;
        productListN11.push(product);
    }
    for(let i = 0; i < ListVatan.length; i++){
        const product = await scrapeProductVatan(browser, ListVatan[i]);
        if(product === null) continue;
        productListVatan.push(product);
    }*/
    for(let i = 0; i < ListTrendyol.length; i++){
        const product = await scrapeProductTrendyol(browser, ListTrendyol[i]);
        if(product === null) continue;
        productListTrendyol.push(product);
    }
    for(let i = 0; i < ListTeknosa.length; i++){
        const product = await scrapeProductTeknosa(browser, ListTeknosa[i]);
        if(product === null) continue;
        productListTeknosa.push(product);
    }

    console.log("Scraped data of all products.");

    //await insertItem(productListN11);
    //await insertItem(productListVatan);
    await insertItem(productListTrendyol);
    await insertItem(productListTeknosa);

    console.log("Insertion complete.");
    db.end();
    browser.close();
})();