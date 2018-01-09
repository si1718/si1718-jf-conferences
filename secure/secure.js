var exports = module.exports = {};

//Register all the function used in this module
exports.register = function(app, db, baseURL) {

    app.get(baseURL + "/conferences", function(request, response) {
        console.log("INFO: New GET request to /conferences");
        db.find({}).toArray(function(err, conferences) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: Sending batch: " + JSON.stringify(conferences, 2, null));
                response.send(conferences);
            }

        });

    });

}