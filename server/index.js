const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'yazlab_test'
});
const app = express();
app.use(express.json());
app.use(cors());
const router = express.Router();

db.connect((err) => {
    if (err) throw err;
    console.log("MySql connected.");
});

app.get("/getproducts", async(req, res) => {
    let sql = 'SELECT DISTINCT p.pid, p.model, p.img, b.brand_name FROM products p, brands b WHERE b.brand_id = p.brand_id';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get("/getproductshighestprice", async(req, res) => {
    let sql = 'SELECT DISTINCT p.pid, p.model, p.img, b.brand_name FROM products p, brands b WHERE b.brand_id = p.brand_id ORDER BY(SELECT MAX(price) FROM scores_prices sp WHERE sp.pid = p.pid) DESC';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get("/getproductslowestprice", async(req, res) => {
    let sql = 'SELECT DISTINCT p.pid, p.model, p.img, b.brand_name FROM products p, brands b WHERE b.brand_id = p.brand_id ORDER BY(SELECT MIN(price) FROM scores_prices sp WHERE sp.pid = p.pid) ASC';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get("/getproductshighestscore", async(req, res) => {
    let sql = 'SELECT DISTINCT p.pid, p.model, p.img, b.brand_name FROM products p, brands b WHERE b.brand_id = p.brand_id ORDER BY(SELECT MAX(score) FROM scores_prices sp WHERE sp.pid = p.pid) DESC';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get("/getproductslowestscore", async(req, res) => {
    let sql = 'SELECT DISTINCT p.pid, p.model, p.img, b.brand_name FROM products p, brands b WHERE b.brand_id = p.brand_id ORDER BY(SELECT MIN(score) FROM scores_prices sp WHERE sp.pid = p.pid) ASC';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get("/getproductdata", async(req, res) => {
    let sql = 'SELECT DISTINCT sp.price, s.s_name FROM scores_prices sp, sites s WHERE s.sid = sp.sid AND pid = '+req.query.product_id;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get("/getbrands", async(req, res) => {
    let sql = 'SELECT * FROM brands';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get("/getram", async(req, res) => {
    let sql = 'SELECT * FROM ram';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get("/getprocessors", async(req, res) => {
    let sql = 'SELECT * FROM processors';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get("/getos", async(req, res) => {
    let sql = 'SELECT * FROM os';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get("/getcap", async(req, res) => {
    let sql = 'SELECT * FROM disk_capacity';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get("/getstorages", async(req, res) => {
    let sql = 'SELECT * FROM storages';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get("/getproductsfiltered", async(req, res) => {
    let sql = 'SELECT DISTINCT p.pid, p.model, p.img, b.brand_name FROM products p, scores_prices sp, brands b WHERE b.brand_id = p.brand_id AND p.pid = sp.pid';
    if(req.query.min_price !== undefined) if(req.query.min_price.length > 0) sql += ' AND sp.price > '+req.query.min_price;
    if(req.query.max_price !== undefined) if(req.query.max_price.length > 0) sql += ' AND sp.price < '+req.query.max_price;
    if(req.query.brand_id !== undefined) if(req.query.brand_id.length > 0) sql += ' AND p.brand_id = '+req.query.brand_id;
    if(req.query.ram_id !== undefined) if(req.query.ram_id.length > 0) sql += ' AND p.ram_id = '+req.query.ram_id;
    if(req.query.proc_id !== undefined) if(req.query.proc_id.length > 0) sql += ' AND p.proc_id = '+req.query.proc_id;
    if(req.query.cap_id !== undefined) if(req.query.cap_id.length > 0) sql += ' AND p.cap_id = '+req.query.cap_id;
    if(req.query.storage_id !== undefined) if(req.query.storage_id.length > 0) sql += ' AND p.storage_id = '+req.query.storage_id;

    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.get("/getproductdetails", async(req, res) => {
    let sql = 'SELECT DISTINCT p.model, p.img, p.proc_gen, b.brand_name, pr.proc_model, r.ram, o.os_name, c.cap, st.storage, sc.screen_dim, sp.price, sp.score, sp.url, si.s_name FROM products p, brands b, processors pr, ram r, os o, disk_capacity c, storages st, screen sc, scores_prices sp, sites si WHERE si.sid = sp.sid AND p.brand_id = b.brand_id AND p.proc_id = pr.proc_id AND p.ram_id = r.ram_id AND p.os_id = o.os_id AND p.cap_id = c.cap_id AND p.screen_id = sc.screen_id AND p.storage_id = st.storage_id AND p.pid = sp.pid AND p.pid = '+req.query.product_id;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.listen(8080, () => {
    console.log("Server running on port 8080.");
});