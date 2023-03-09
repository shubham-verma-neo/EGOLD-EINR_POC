const express = require("express")
const app = express()
require("dotenv").config()
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const { id, web3, networkID, EINRAddress, EINRContract, EUSDAddress, EUSDContract, EGOLDAddress, EGOLDContract, InventoryAddress, InventoryContract } = require('../server/startup/web3');
console.log(id, EUSDAddress);
// require('./startup/web3');
require('./startup/mongoDB')();
require('./startup/routes')(app, express);
require('./routes/cron');


app.listen(process.env.PORT || 4000, () => {
    console.log("Sever is listening on port 4000")
})