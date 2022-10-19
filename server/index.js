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
    let sql = 'SELECT * FROM products';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.listen(8080, () => {
    console.log("Server running on port 8080.");
});