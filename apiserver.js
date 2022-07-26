import { createRequire } from "module";
const require = createRequire(import.meta.url);
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const fs = require("fs");
const http = require("http");
const https = require("https");
var request = require("request"); 
const cryptojs = require('crypto-js');

const express = require("express");
 
const app = express();
const cors = require('cors');
app.options('*', cors());

const asyncHandler = require("express-async-handler");
const result = require("dotenv").config();

request = require("request");
const bodyParser = require("body-parser");
var wget = require("node-wget");

const privateKey = fs.readFileSync("privkey.pem", "utf8");
const certificate = fs.readFileSync("fullchain.pem", "utf8");

const credentials = {
  key: privateKey,
  cert: certificate,
};

app.get("/ping", function (req, res) {
  console.log('nodejs ccalled');
	res.json({ message: "pong" });
});

app.use("/", express.static(path.join(__dirname, "/html")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.post("/getDBData", function (req, res) {

app.get("/getDBData", function (req, res) {
  res.json({data: [{"id":1, "price": 40}] });
});


app.post(
  "/addUser",
  asyncHandler(async (req, res, next) => {
    var  email_addr = req.body.email_addr;
    var  wallet_addr = req.body.wallet_addr;
    var  user_name = req.body.user_name;
    var  balance = req.body.balance;
    var  currency = req.body.currency;
    var  date_time = req.body.date_time;
    

        //  custJson[0].custId;
if (accId != 0) {
      res.json({ status: "success", accountNumber: accId });
  } else {
    res.json({ status: "error" });
  }


  })
);

//app.get("/getDBData", function (req, res) {
app.post("/getDBData", cors(),
  asyncHandler(async (req, res, next) => {
   const keyword = req.body.keyword;
    
    console.log("keyword " + keyword);

const data = [

    {

        id: "1",

        img: "/img/auction_1.jpg",

        date: "2021-12-09",

        title: "Virtual Worlds",

        seller_thumb: "/img/avatar_1.jpg",

        seller: "@Richard",

        price: "1.5 ETH",

        count: "1 of 1"

    },

    {

        id: "2",

        img: "/img/auction_2.jpg",

        date: "2021-10-05",

        title: "Collectibles",

        seller_thumb: "/img/avatar_2.jpg",

        seller: "@JohnDeo",

        price: "2.7 ETH",

        count: "1 of 1"

    },

    {

        id: "3",

        img: "/img/auction_3.jpg",

        date: "2021-09-15",

        title: "Arts",

        seller_thumb: "/img/avatar_3.jpg",

        seller: "@MKHblots",

        price: "2.3 ETH",

        count: "1 of 1"

    },

    {

        id: "4",

        img: "/img/auction_4.jpg",

        date: "2021-12-29",

        title: "Robotic Arts",

        seller_thumb: "/img/avatar_4.jpg",

        seller: "@RioArham",

        price: "1.8 ETH",

        count: "1 of 1"

    },

    {

        id: "5",

        img: "/img/auction_5.jpg",

        date: "2022-01-24",

        title: "Magazine Fall",

        seller_thumb: "/img/avatar_5.jpg",

        seller: "@ArtNox",

        price: "1.7 ETH",

        count: "1 of 1"

    },

    {

        id: "6",

        img: "/img/auction_6.jpg",

        date: "2022-03-30",

        title: "Inspiration",

        seller_thumb: "/img/avatar_6.jpg",

        seller: "@ArtNox",

        price: "1.7 ETH",

        count: "1 of 1"

    },

    {

        id: "7",

        img: "/img/auction_7.jpg",

        date: "2022-01-24",

        title: "Design Illusions",

        seller_thumb: "/img/avatar_7.jpg",

        seller: "@ArtNox",

        price: "1.7 ETH",

        count: "1 of 1"

    },

    {

        id: "8",

        img: "/img/auction_8.jpg",

        date: "2022-03-30",

        title: "Design Illusions",

        seller_thumb: "/img/avatar_8.jpg",

        seller: "@ArtNox",

        price: "1.7 ETH",

        count: "1 of 1"

    },

    {

        id: "9",

        img: "/img/auction_9.jpg",

        date: "2022-03-30",

        title: "Design Illusions",

        seller_thumb: "/img/avatar_4.jpg",

        seller: "@ArtNox",

        price: "1.7 ETH",

        count: "1 of 1"

    },

    {

        id: "10",

        img: "/img/auction_10.jpg",

        date: "2022-03-30",

        title: "Infinity",

        seller_thumb: "/img/avatar_1.jpg",

        seller: "@ArtNox",

        price: "1.7 ETH",

        count: "1 of 1"

    },

    {

        id: "11",

        img: "/img/auction_11.jpg",

        date: "2022-01-24",

        title: "Sports",

        seller_thumb: "/img/avatar_2.jpg",

        seller: "@ArtNox",

        price: "1.7 ETH",

        count: "1 of 1"

    },

    {

        id: "12",

        img: "/img/auction_12.jpg",

        date: "2022-03-30",

        title: "Characteristics",

        seller_thumb: "/img/avatar_3.jpg",

        seller: "@ArtNox",

        price: "1.7 ETH",

        count: "1 of 1"

    }

]

console.log("type = " + typeof data);

    res.json({data:data})	  
  })
);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(3000, () => {
  console.log("HTTPS Server running on port 3000");
});
