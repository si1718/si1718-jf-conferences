var exports = module.exports = {};

//Register all the function used in this module
exports.register = function(app, db3, baseURL) {

    app.get(baseURL + "/batch", function(request, response) {
        console.log("INFO: New GET request to /batch");
        db3.find({}).toArray(function(err, batch) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: Sending batch: " + JSON.stringify(batch, 2, null));
                response.send(batch);
            }

        });

    });

}