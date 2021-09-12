require('dotenv').config();
const express = require("express");
var bodyParser = require('body-parser')
const app = express();
const hostname = 'localhost'
const port = process.env.PORT || 5000;


app.set('view-engine','ejs');
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

require("./modules/conn");
app.use(require("./routes/index"));

app.listen(port, ()=> {
    console.log(`server run at http://${hostname}:${port}/`)
});




