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
  dbKey : {type: String, default: null, unique: true, required: true, index: true},
  manName : {type: String, default: null},
  partNumber : {type: String, default: null},
  manPartNumber : {type: String, default: null},
  partOption : {type: String, default: null},
  partDesc : {type: String, default: null},
  partShortDesc : {type: String, default: null},
  partImgUrl : {type: String, default: null},
  partTechImgUrl : {type: String, default: null},
  partSalePrice : {type: Number, default: null},
  partManPrice : {type: Number, default: null},
  currency : {type: String, default: null},
  merchantId : {type: Number, default: null},
  merchantName : {type: String, default: null},
  deliveryCharge : {type: Number, default: null},
});

var houseSchema = new mongoose.Schema({
  houseId : { type: Number, default: null},
  dbKey : {type: String, default: null, unique: true, required: true, index: true},
  assetOwnerName : {type: String, default: null},
  assetAddress : {type: String, default: null},
  assetValue : {type: Number, default: null},
  assetNumberShares : {type: Number, default: null},
  hasTenant : {type: Boolean, default: null},
  hasGarden : {type: Boolean, default: null},
  hasParking : {type: Boolean, default: null},
  assetImageUrl : {type: String, default: null},
  assetUrl : {type: String, default: null},
  assetIncome : {type: Number, default: null},
  assetYield : {type: Number, default: null},
  assetNumberBathrooms : {type: Number, default: null},
  assetNumberBedrooms : {type: Number, default: null},
  assetHouseType : {type: String, default: null},
  hasDoubleGlazing : {type: Boolean, default: null},
  assetRiskRating : {type: Number, default: null},
  assetPreferredNotary : {type: String, default: null},
  currency: {type: String, default: null},
});

var partDBRec = mongoose.model("part", partSchema);
var houseDBRec = mongoose.model("house", houseSchema);

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
const updateRec = async (partRec, dbKey) => {

	var rtn = 0;
        rtn =              await partDBRec.updateOne(
		          {'dbKey': dbKey},
		          {$set: partRec},
		          )
                 
return rtn;
}
const insertRec = async (partRec) => {
	var rtn = 0;
                rtn = await partRec.save( async (err, doc) => {
                            return(err ? rtn=1 : rtn=0);
	                  })

 return rtn;
}


const addPartDB  = async  (
 dbKey,
 productId,
  manName,
  partNumber,
  manPartNumber,
  partOption,
  partDesc,
  partShortDesc,
  partImgUrl,
  partTechImgUrl,
  partSalePrice,
  partManPrice,
  currency,
  merchantId,
  merchantName,
  deliveryCharge
 ) => {

	 let jsonDB= {
	    dbKey: dbKey,
	    productId: productId,
            manName: manName,
            partNumber: partNumber,
            manPartNumber: manPartNumber,
            partOption: partOption,
            partDesc: partDesc,
            partShortDesc: partShortDesc,
            partImgUrl: partImgUrl,
            partTechImgUrl: partTechImgUrl,
            partSalePrice: partSalePrice,
            partManPrice: partManPrice,
            currency: currency,
            merchantId: merchantId,
            merchantName: merchantName,
            deliveryCharge: deliveryCharge
         };
	 let partRec = new partDBRec (jsonDB);
         console.log(partRec);
         let rtn = 0;
         var found = false; 
         found = await partDBRec.findOne({'dbKey': dbKey});
         if (found) 
           rtn = await updateRec(jsonDB, dbKey);
	 else 
           rtn = await insertRec(partRec);

         
	 return rtn;

}
const addHouseDB  = async  (
  houseId,
  dbKey,
  assetOwnerName,
  assetAddress,
  assetValue,
  assetNumberShares,
  hasTenant,
  hasGarden,
  hasParking,
  assetImageUrl,
  assetUrl,
  assetIncome,
  assetYield,
  assetNumberBathrooms,
  assetNumberBedrooms,
  assetHouseType,
  hasDoubleGlazing,
  assetRiskRating,
  assetPreferredNotary,
  currency,
 ) => {

	 let jsonDB= {
		 houseId: houseId,
  dbKey: dbKey,
  assetOwnerName: assetOwnerName,
  assetAddress: assetAddress,
  assetValue: assetValue,
  assetNumberShares: assetNumberShares,
  hasTenant: hasTenant,
  hasGarden: hasGarden,
  hasParking: hasParking,
  assetImageUrl: assetImageUrl,
  assetUrl: assetUrl,
  assetIncome: assetIncome,
  assetYield: assetYield,
  assetNumberBathrooms: assetNumberBathrooms,
  assetNumberBedrooms: assetNumberBedrooms,
  assetHouseType: assetHouseType,
  hasDoubleGlazing: hasDoubleGlazing,
  assetRiskRating: assetRiskRating,
  assetPreferredNotary: assetPreferredNotary,
  currency: currency,
         };
	 let houseRec = new houseDBRec (jsonDB);
         console.log(houseRec);
         let rtn = 0;
         var found = false; 
         found = await houseDBRec.findOne({'dbKey': dbKey});
         if (found) 
           rtn = await updateRec(jsonDB, dbKey);
	 else 
           rtn = await insertRec(houseRec);

         
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
//app.get("/searchDB", function (req, res) {
// OCcurl https://peacioapi.com:3000/searchDB/hello%20there
app.get("/searchDB/:query", cors(),
  asyncHandler(async (req, res, next) => {
	  let x = req.params.query;
	  let recs = await partDBRec.find({
		 $or: [
			 {partDesc: { $regex: '.*' + x  + '.*', $options: 'i' }},
			 {manName: { $regex: '.*' + x  + '.*', $options: 'i' }},
			 {partNumber: { $regex: '.*' + x  + '.*', $options: 'i' }},
			 {partOption: { $regex: '.*' + x  + '.*', $options: 'i' }},

		 ]
	  
	  })
	  console.log(x);
	  console.log(recs);
  res.json({data: [recs] });
})
)	

app.get("/searchHouseDB/:query", cors(),
  asyncHandler(async (req, res, next) => {
	  let x = req.params.query;
	  let recs = await houseDBRec.find({
		 $or: [
			 {assetAddress: { $regex: '.*' + x  + '.*', $options: 'i' }},

		 ]
	  
	  })
	  console.log(x);
	  console.log(recs);
  res.json({data: [recs] });
})

app.get("/getPart/:query", cors(),
  asyncHandler(async (req, res, next) => {
	  let x = req.params.query;
	  let xstr = "";
	  if (x) xstr=x.toString();
	  let json={dbKey: { $regex:  x , $options: 'i' }}

	  let recs = await partDBRec.findOne(json);

	  console.log(json);
	  console.log(x);
	  console.log(xstr);
	  console.log(recs);
  res.json({data: [recs] });
})
)	


app.get("/getHouse/:query", cors(),
  asyncHandler(async (req, res, next) => {
	  let x = req.params.query;
	  let xstr = "";
	  if (x) xstr=x.toString();
	  let json={dbKey: { $regex:  x , $options: 'i' }}

	  let recs = await partDBRec.findOne(json);

	  console.log(json);
	  console.log(x);
	  console.log(xstr);
	  console.log(recs);
  res.json({data: [recs] });
})
)

app.post("/checkout", cors(),
  asyncHandler(async (req, res, next) => {
    
    let data = {url: 'https://peac.io'};

    res.json({data:data})	  
  })
);
app.post("/checkouthouse", cors(),
  asyncHandler(async (req, res, next) => {
    
    let data = {url: 'https://flowswap.net'};

    res.json({data:data})	  
  })
);
//app.get("/getDBData", function (req, res) {
app.post("/getDBData", cors(),
  asyncHandler(async (req, res, next) => {
   const keyword = req.body.keyword;
    
    console.log(req.body);
    console.log("keyword " + keyword);
    let data = {test: 'test'};

    res.json({data:data})	  
  })
);

app.post("/addHouseAPI", cors(),
   const houseId = 0;
   const assetOwnerName = req.body.assetOwnerName;
   const assetAddress  = req.body.assetAddress;
   const assetValue = req.body.assetValue;
   const assetNumberShares = req.body.assetNumberShares;
   const hasTenant = req.body.hasTenant;
   const hasGarden = req.body.hasGarden;
   const hasParking = req.body.hasParking;
   const assetImageUrl = req.body.assetImageUrl;
   const assetUrl = req.body.assetUrl;
   const assetIncome = req.body.assetIncome;
   const assetYield = req.body.assetYield;
   const assetNumberBathrooms = req.body.assetNumberBathrooms;
   const assetNumberBedrooms = req.body.assetNumberBedrooms;
   const assetHouseType =req.body.assetHouseType;
   const hasDoubleGlazing = req.body.hasDoubleGlazing;
   const assetRiskRating = req.body.assetRiskRating;
   const assetPreferredNotary = req.body.assetPreferredNotary;
   const currency = req.body.currency;

   const dbKey = assetAddress;
   console.log(req.body);
// let rtn = 9;
   let rtn = await addHouseDB (
  houseId,
  dbKey,
  assetOwnerName,
  assetAddress,
  assetValue,
  assetNumberShares,
  hasTenant,
  hasGarden,
  hasParking,
  assetImageUrl,
  assetUrl,
  assetIncome,
  assetYield,
  assetNumberBathrooms,
  assetNumberBedrooms,
  assetHouseType,
  hasDoubleGlazing,
  assetRiskRating,
  currency,
    );

    res.json({rtn:rtn})	  
  })
);
app.post("/addPartAPI", cors(),
  asyncHandler(async (req, res, next) => {
   const productId = 0;
   const manName = req.body.manName;
   const partNumber = req.body.partNumber;
   const manPartNumber = req.body.manPartNumber;
   const partOption = req.body.partOption;
   const partDesc = req.body.partDesc;
   const partShortDesc = req.body.partShortDesc;
   const partImgUrl = req.body.partImgUrl;
   const partTechImgUrl = req.body.partTechImgUrl;
   const partSalePriceStr = req.body.partSalePrice;
   const partManPriceStr = req.body.partManPrice;
   const currency = req.body.currency;
   const merchantIdStr = req.body.merchantId;
   const merchantName = req.body.merchantName;
   const deliveryChargeStr = req.body.deliveryCharge;

   const partSalePrice = partSalePriceStr ? parseFloat(partSalePriceStr).toFixed(2) : 0;
   const partManPrice = partManPriceStr ? parseFloat(partManPriceStr).toFixed(2) : 0;
   const merchantId = merchantIdStr ? parseInt(merchantIdStr) : 0;
   const deliveryCharge = deliveryChargeStr ? parseFloat(deliveryChargeStr).toFixed(2) : 0;
   const dbKey = manName + "-" + partNumber;
   console.log(req.body);
// let rtn = 9;
   let rtn = await addPartDB (
      dbKey,
      productId,
      manName,
      partNumber,
      manPartNumber,
      partOption,
      partDesc,
      partShortDesc,
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
const httpServer = http.createServer(app);

httpsServer.listen(3000, () => {
//httpServer.listen(3000, () => {
  console.log("HTTPS Server running on port 3000");
});
	
