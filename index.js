var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require("path");
var cors = require("cors");
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(helmet());

var MongoClient = require('mongodb').MongoClient;
//var mdbURL = "mongodb://jihaneF:jihaneF@ds151355.mlab.com:51355/si1718-jf-conferences";
var mdbURL = "mongodb://jiji:jiji@ds141766.mlab.com:41766/si1718-jf-conferences2";

var port = (process.env.PORT || 10000);
var baseURL = "/api/v1";

var db;
var db3;
var db4;
var conferencesAPIv1 = require("./api/v1/conferences.js");
var conferencesAPIv11 = require("./api/v1.1/conferences.js");
var batchAPIv1 = require("./api/v1/batch.js");
var recommendationsAPIv1 = require("./api/v1/recommendations.js");


MongoClient.connect(mdbURL, { native_parser: true }, function(err, database) {

    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    db = database.collection("conferences");
    conferencesAPIv1.register(app, db, baseURL);
    db3 = database.collection("batch");
    batchAPIv1.register(app, db3, baseURL);
    db4 = database.collection("recommendations");
    recommendationsAPIv1.register(app,db4,baseURL);
});

app.listen(port, () => {
    console.log("Web server is listening on port " + port);
});

// Api with security
//var mdbURL2 = "mongodb://jihaneF:jihaneF@ds151355.mlab.com:51355/si1718-jf-conferences";
var mdbURL2 = "mongodb://jiji:jiji@ds141766.mlab.com:41766/si1718-jf-conferences2"

var baseURL1 = "/api/v1.1";


// Api with jwt
/*var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://si1718-jf-conferences.eu.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://si1718-jf-conferences.herokuapp.com/api/v1.1/conferences',
    issuer: "https://si1718-jf-conferences.eu.auth0.com/",
    algorithms: ['RS256']
});*/

//app.use(jwtCheck);

var jwtCheck = jwt({
    secret: "c02KIxM3bXkMbA1paYCdJWN9OFnzu75_K6fUPdgp-iDPWke68Yjr9cR-U9Gmp8kw"
})
var db2;

MongoClient.connect(mdbURL2, { native_parser: true }, (err, database) => {
    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    db2 = database.collection("conferences");
    conferencesAPIv11.register(app, db2, baseURL1, jwtCheck);

});

// Autentication with OAuth
var baseURL2 = "/secure";
var db4;
var secureAPIv1 = require("./api/v1/conferences.js");
MongoClient.connect(mdbURL2, { native_parser: true }, (err, database) => {
    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    db4 = database.collection("conferences");
    secureAPIv1.register(app, db4, baseURL2);
});
