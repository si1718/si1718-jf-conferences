// var mongCl = require('mongodb').MongoClient;
// var mdbURL = "mongodb://admin:password@ds129906.mlab.com:29906/users";
// mongCl.connect(mdbURL, { native_parser: true }, function(err, database) {

//     if (err) {
//         console.log("CAN NOT CONNECT TO DB: " + err);
//         process.exit(1);
//     }

//     db = database.collection("conferences");
//     conferencesAPIv1.register(app, db, baseURL);
//     authController.register(app,db, baseURL1);

//     app.listen(port, () => {
//         console.log("Web server is listening on port " + port);
//     });

// });
// var UserSchema = new mongCl.Schema({
//     name: String,
//     email: String,
//     password: String
// });
// mongCl.model('User', UserSchema);

// module.exports = mongCl.model('User');