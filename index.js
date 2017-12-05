var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require("path");
var cors = require("cors");
//var jwt = require('express-jwt');

var app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(helmet());



//app.use(jwt.init('secret'));
// app.use(jwt({
//   secret: 'secret',
//   credentialsRequired: false,
//   getToken: function fromHeaderOrQuerystring (req) {
//     if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//         return req.headers.authorization.split(' ')[1];
//     } else if (req.query && req.query.token) {
//       return req.query.token;
//     }
//     return null;
//   }
// }));

// app.get('/protected', jwt({secret: 'secret'}),
//                         function(req, res) {
//                             if (!req.user.admin) return res.sendStatus(401);
//                                 res.sendStatus(200);
// });

var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://jihaneF:jihaneF@ds151355.mlab.com:51355/si1718-jf-conferences";

var port = (process.env.PORT || 10000);
var baseURL = "/api/v1";
var baseURL1 = "/api/v1.1";

var db;

var conferencesAPIv1 = require("./api/v1/conferences.js");
//var conferencesAPIv11 = require("./api/v1.1/conferences.js");

// var authController = require('./auth/authController');
// app.use(baseURL1+'/auth', authController);
// module.exports = app;

MongoClient.connect(mdbURL, { native_parser: true }, function(err, database) {

    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    db = database.collection("conferences");
    conferencesAPIv1.register(app, db, baseURL);
    //authController.register(app,db, baseURL1);

    app.listen(port, () => {
        console.log("Web server is listening on port " + port);
    });

});
