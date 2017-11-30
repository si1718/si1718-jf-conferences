var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require("path");
var cors = require("cors");

var app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://jihaneF:jihaneF@ds151355.mlab.com:51355/si1718-jf-conferences";

var port = (process.env.PORT || 10000);
var baseURL = "/api/v1";

var db;

var conferencesAPIv1 = require("./api/v1/conferences.js");

MongoClient.connect(mdbURL, { native_parser: true }, function(err, database) {

    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    db = database.collection("conferences");
    conferencesAPIv1.register(app, db, baseURL);

    app.listen(port, () => {
        console.log("Web server is listening on port " + port);
    });

});
