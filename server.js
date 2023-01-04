import { createRequire } from "module";
const require = createRequire(import.meta.url);
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/peacio');

var partSchema = new mongoose.Schema({
  productId : { type: Number, default: null},
  manName : {type: String, default: null},
  partNumber : {type: String, default: null},
  manPartNumber : {type: String, default: null},
  partDesc : {type: String, default: null},
  partImgUrl : {type: String, default: null},
  partTechImgUrl : {type: String, default: null},
  partSalePrice : {type: Number, default: null},
  partManPrice : {type: Number, default: null},
  currency : {type: String, default: null},
  merchantId : {type: Number, default: null},
  merchantName : {type: String, default: null},
  deliveryCharge : {type: Number, default: null},
});

var partDBRec = mongoose.model("part", partSchema);

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
// https://github.com/zillerium/tradedeal/blob/13db313ba4ca5d02c619ce3e60391fa7d05c5967/mongoavg.js
const credentials = {
  key: privateKey,
  cert: certificate,
};

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

const addPartDB  = async  (
 productId,
  manName,
  partNumber,
  manPartNumber,
  partDesc,
  partImgUrl,
  partTechImgUrl,
  partSalePrice,
  partManPrice,
  currency,
  merchantId,
  merchantName,
  deliveryCharge
 ) => {

	 let partRec = new partDBRec ({
	    productId: productId,
            manName: manName,
            partNumber: partNumber,
            manPartNumber: manPartNumber,
            partDesc: partDesc,
            partImgUrl: partImgUrl,
            partTechImgUrl: partTechImgUrl,
            partSalePrice: partSalePrice,
            partManPrice: partManPrice,
            currency: currency,
            merchantId: merchantId,
            merchantName: merchantName,
            deliveryCharge: deliveryCharge
         });
         console.log(partRec);
         let rtn = 0;
	 await partRec.save( async (err, doc) => {
            if (err) {
		    throw err;
		    rtn = 1;
	    }
	 })

	 return rtn;

}

app.get("/ping", cors(),
  asyncHandler(async (req, res, next) => {

  console.log('nodejs ccalled');
	res.json({ message: "pong" });
  }));

//app.get("/ping", function (req, res) {
//  console.log('nodejs ccalled');
//	res.json({ message: "pong" });
//});
app.get("/getDBData1", function (req, res) {
  res.json({data: [{"id":1, "price": 40}] });
});


//app.get("/getDBData", function (req, res) {
app.post("/getDBData", cors(),
  asyncHandler(async (req, res, next) => {
   const keyword = req.body.price;
    
    console.log("keyword " + keyword);
    let data = {test: 'test'};

    res.json({data:data})	  
  })
);

app.post("/addPartData", cors(),
  asyncHandler(async (req, res, next) => {
   const productId = req.body.productId;
   const manName = req.body.manName;
   const partNumber = req.body.partNumber;
   const manPartNumber = req.body.manPartNumber;
   const partDesc = req.body.partDesc;
   const partImgUrl = req.body.partImgUrl;
   const partTechImgUrl = req.body.partTechImgUrl;
   const partSalePrice = req.body.partSalePrice;
   const partManPrice = req.body.partManPrice;
   const currency = req.body.currency;
   const merchantId = req.body.merchantId;
   const merchantName = req.body.merchantName;
   const deliveryCharge = = req.body.deliveryCharge;

   let rtn = await addPartDB (
      productId,
      manName,
      partNumber,
      manPartNumber,
      partDesc,
      partImgUrl,
      partTechImgUrl,
      partSalePrice,
      partManPrice,
      currency,
      merchantId,
      merchantName,
      deliveryCharge
    );

    res.json({rtn:rtn})	  
  })
);
const httpsServer = https.createServer(credentials, app);
//const httpServer = http.createServer(app);

httpsServer.listen(3000, () => {
  console.log("HTTPS Server running on port 3000");
});
	
