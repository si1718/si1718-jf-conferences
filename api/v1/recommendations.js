var exports = module.exports = {};

//Register all the function used in this module
exports.register = function(app, db4, baseURL) {

    app.get(baseURL + "/recommendations", function(request, response) {
        console.log("INFO: New GET request to /recommendations");
        db4.find({}).toArray(function(err, recommendations) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: Sending batch: " + JSON.stringify(recommendations, 2, null));
                response.send(recommendations);
            }

        });

    });
    
    app.get(baseURL + '/recommendations/:idConference', function(req, res) {
        var idConference = req.params.idConference;
        //var query = insertSearchFields(req, { "idConference": idConference });
        if (!idConference) {
            console.log("WARNING: New GET req to /recommendations/:idConference without idConference, sending 400...");
            res.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET req to /recommendations/" + idConference);
            db4.findOne({ "idConference": idConference }, (err, filteredRecommendations) => {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    res.sendStatus(500); // internal server error
                }
                else {

                    if (filteredRecommendations) {
                        console.log("INFO: Sending recommendations: " + JSON.stringify(filteredRecommendations, 2, null));
                        res.send(filteredRecommendations);
                    }
                    else {
                        console.log("WARNING: There are not any recommendation with idConference " + idConference);
                        res.sendStatus(404); // not found
                    }
                }
            });

        }
    });

}