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

var fixed_percentage = 0.1;

const privateKey = fs.readFileSync("privkey.pem", "utf8");
const certificate = fs.readFileSync("fullchain.pem", "utf8");

const credentials = {
  key: privateKey,
  cert: certificate,
};

var email_addr_admin = "admin@peac.io";
var wallet_addr_admin = "0x";

var userSchema = new mongoose.Schema({
    email_addr : { type: String, default: null},
    wallet_addr : {type: String, default: null},
    user_name : {type: String, default: null},  
    balance : {type: String, default: null}, 
    currency : {type: String, default: null}, 
    date_time : {type: Date, default: null},
    pass_code : {type: String, default: null},
});


var txnSchema = new mongoose.Schema({
    email_addr_from : { type: String, default: null},
    wallet_addr_from : {type: String, default: null},
    user_name_from : {type: String, default: null},  

    email_addr_to : { type: String, default: null},
    wallet_addr_to : {type: String, default: null},
    user_name_to : {type: String, default: null},  

    email_addr_admin : { type: String, default: null},
    wallet_addr_admin : {type: String, default: null},
    user_name_admin : {type: String, default: null},  

    currency : {type: String, default: null}, 
    amount : {type: Number, default: null},
    txn_fee : {type: Number, default: null},
    date_time : {type: Date, default: null},
});

var userModel = mongoose.model("userModel", userSchema);
var txnModel = mongoose.model("txnModel", txnSchema);
  
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
    var  pass_code = req.body.pass_code;
    var  date_time = new Date();
    
    var userJson = {
        "email_addr": email_addr,
        "wallet_addr": wallet_addr,
        "user_name": user_name,
        "balance": balance,
        "currency": currency,
        "pass_code": pass_code,
        "date_time": date_time,
    }

    await userModel.create(userJson);

    res.status(200).json({ status: "success" });
   


  })
);

app.post(
    "/addTxn",
    asyncHandler(async (req, res, next) => {
    let  email_addr_from = req.body.email_addr_from;
    let  wallet_addr_from = req.body.wallet_addr_from;
    let  user_name_from = req.body.user_name_from;
    let  currency = req.body.currency_from;
    let  pass_code = req.body.pass_code; // check against db value

    let  date_time = new Date();
    let  amount = req.body.amount;
    let  txn_fee = fixed_percentage*amount;
    
    let  email_addr_to = req.body.email_addr_to;
    let  wallet_addr_to = req.body.wallet_addr_to;
    let  user_name_to = req.body.user_name_to;

    let txnJson = {
        "email_addr_from": email_addr_from,
        "email_addr_to": email_addr_to,
        "email_addr_admin": email_addr_admin,
        "wallet_addr_from": wallet_addr_from,
        "wallet_addr_to": wallet_addr_to,
        "wallet_addr_admin": wallet_addr_admin,
        "user_name_from": user_name_from,
        "user_name_to": user_name_to,
        "currency": currency,
        "amount": amount,
        "date_time": date_time,
        "txn_fee": txn_fee,
    };

    let filterJsonSender = {"email_addr": email_addr_from};
    try {
        let userJsonSender = await userModel.findOne(filterJsonSender);
        if (!(userJsonSender)) {
            res.status(400).json({ status: "error", "msg": "email not found "+ email_addr_from});
        }

    } catch (err) {
        res.status(400).json({ status: "error", "msg": "db error "+ err});
    }

    let filterJsonReceiver = {"email_addr": email_addr_to};
    let userJsonReceiver = await userModel.findOne(filterJsonReceiver);

    if (!(userJsonReceiver)) {
        res.status(400).json({ status: "error", "msg": "email not found "+ email_addr_to});
    } 

    let filterJsonAdmin = {"email_addr": email_addr_admin};
    let userJsonAdmin = await userModel.findOne(filterJsonAdmin);

    if (!(userJsonAdmin)) {
        res.status(400).json({ status: "error", "msg": "email not found "+ email_addr_admin});
    }

    if (userJsonSender.balance >= (amount+txn_fee)) {
        let newBalanceSender = userJsonSender.balance - txn_fee - amount;
        let updateJsonSender = { "balance" : newBalanceSender};
        await updateUserDB(filterJsonSender, updateJsonSender);
    
    } else {
        res.status(400).json({ status: "error", "msg": "balance too low "+ userRec.balance + " for " + amount_from});
    }

    let newBalanceReceiver = userJsonReceiver.balance + amount;
    let updateJsonReceiver = { "balance" : newBalanceReceiver};
    
    await userModel.findOneAndUpdate(filterJsonReceiver, updateJsonReceiver);

    let newBalanceAdmin = userJsonAdmin.balance + txn_fee;
    let updateJsonAdmin = { "balance" : newBalanceAdmin};
    
    await userModel.findOneAndUpdate(filterJsonAdmin, updateJsonAdmin);
    await txnModel.create(txnJson);

    res.status(200).json({ status: "success"});
  
         
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
