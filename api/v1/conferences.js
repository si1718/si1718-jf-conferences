var exports = module.exports = {};

//Register all the function used in this module
exports.register = function(app, db, baseURL) {


    // GET a collection
    app.get(baseURL + '/conferences', function(req, res) {
        var search = req.query.search;
        var query = {};

        if (search) {
             query = { $or:[ 
                        {'idConference':{ $regex: '.*' + search + '.*', $options: 'i' }}, 
                        {'conference':{ $regex: '.*' + search + '.*', $options: 'i' }}, 
                        {'acronym':{ $regex: '.*' + search + '.*', $options: 'i' }},
                        {'edition':{ $regex: '.*' + search + '.*', $options: 'i' }}, 
                        {'city':{ $regex: '.*' + search + '.*', $options: 'i' }}, 
                        {'country':{ $regex: '.*' + search + '.*', $options: 'i' }} 
                    ]};
            
        }
        console.log("INFO: New GET req to /conferences");
        db.find(query).toArray(function(err, conferences) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                res.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: Sending conferences: " + JSON.stringify(conferences, 2, null));
                res.send(conferences);
            }
        });
    });

    // GET a collection over a single resource
    app.get(baseURL + '/conferences/:idConference', function(req, res) {
        var idConference = req.params.idConference;
        //var query = insertSearchFields(req, { "idConference": idConference });
        if (!idConference) {
            console.log("WARNING: New GET req to /conferences/:idConference without idConference, sending 400...");
            res.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET req to /conferences/" + idConference);
            db.findOne({ "idConference": idConference }, (err, filteredConferences) => {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    res.sendStatus(500); // internal server error
                }
                else {

                    if (filteredConferences) {
                        console.log("INFO: Sending conferences: " + JSON.stringify(filteredConferences, 2, null));
                        res.send(filteredConferences);
                    }
                    else {
                        console.log("WARNING: There are not any conference with idConference " + idConference);
                        res.sendStatus(404); // not found
                    }
                }
            });
            // }
        }
    });

    // Create a collection
    app.post(baseURL + '/conferences', function(req, res) {
        var newConference = req.body;
        if (!newConference) {
            console.log("WARNING: New POST req to /conferences/ without conference, sending 400...");
            res.sendStatus(400); // bad req
        }
        else {
            console.log("INFO: New POST req to /conferences with body: " + JSON.stringify(newConference, 2, null));
            if (!newConference.conference || !newConference.acronym || !newConference.edition || !newConference.city || !newConference.country) {
                console.log("WARNING: The conference " + JSON.stringify(newConference, 2, null) + " is not well-formed, sending 422...");
                res.sendStatus(422); // unprocessable entity
            }
            else {
                var idConference = newConference.acronym.concat("-".concat(newConference.edition));
                newConference.idConference = idConference.toLowerCase();
                db.findOne({ "idConference": newConference.idConference }, function(err, conferences) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        res.sendStatus(500); // internal server error
                    }
                    else {
                        if (conferences) {
                            console.log("WARNING: The conference " + JSON.stringify(newConference, 2, null) + " already exits, sending 409...");
                            res.sendStatus(409); // conflict
                        }
                        else {
                            db.insertOne(req.body, (err, result) => {
                                if (err) {
                                    console.error('WARNING: Error getting data from DB');
                                    res.sendStatus(500); // internal server error
                                }
                                else {
                                    console.log("INFO: Adding conference " + JSON.stringify(newConference, 2, null));
                                    res.sendStatus(201); // created
                                }
                            });

                        }
                    }
                });
            }
        }
    });

    // Create a resource
    app.post(baseURL + '/conferences/:idConference', function(req, res) {
        var idConference = req.params.idConference;
        console.log("WARNING: New POST request to /conferences/" + idConference + ", sending 405...");
        res.sendStatus(405);
    });

    // Update a collection
    app.put(baseURL + '/conferences', function(req, res) {
        console.log("WARNING: New PUT request to /conferences, sending 405...");
        res.sendStatus(405);
    });

    // Update a resource
    app.put(baseURL + '/conferences/:idConference', function(req, res) {
        var updatedConference = req.body;
        var idConference = req.params.idConference;
        if (!updatedConference /*|| idConference != updatedConference.idConference*/ ) {
            if (!updatedConference) {
                console.log("WARNING: New PUT request to /conferences/ without idConference, sending 400...");
            }
            else {
                console.log("WARNING: New PUT request to /conferences/ with other URL, sending 400...");
            }
            res.sendStatus(400);
        }
        else {
            console.log("INFO: New PUT request to /conferences/" + idConference + " with data " + JSON.stringify(updatedConference, 2, null));
            if (!updatedConference.conference || !updatedConference.acronym || !updatedConference.edition || !updatedConference.city || !updatedConference.country) {
                console.log("WARNING: The conference " + JSON.stringify(updatedConference, 2, null) + " is not well-formed, sending 422...");
                res.sendStatus(422); // unprocessable entity
            }
            else {
                db.findOne({ "idConference": idConference }, (err, conferences) => {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        res.sendStatus(500); // internal server error
                    }
                    else {
                        if (conferences) {
                            updatedConference.conference = conferences.conference;
                            db.update({ "idConference": idConference }, updatedConference);
                            console.log("INFO: Modifying conference with idConference " + idConference + " with data " + JSON.stringify(updatedConference, 2, null));
                            res.send(updatedConference);
                        }
                        else {
                            console.log("WARNING: There are not any conference with idConference " + idConference);
                            res.sendStatus(404); // not found
                        }
                    }
                });
            }
        }
    });

    // Delete a collection
    app.delete(baseURL + '/conferences', function(req, res) {
        console.log("INFO: New DELETE request to /conferences");
        db.remove({}, { justOne: false }, function(err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                res.sendStatus(500); // internal server error
            }
            else {
                if (numRemoved.result.n > 0) {
                    console.log("INFO: All the conferences (" + numRemoved.result.n + ") have been succesfully deleted, sending 204...");
                    res.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no conferences to delete");
                    res.sendStatus(404); // not found
                }
            }
        });
    });

    // Delete a resource
    app.delete(baseURL + '/conferences/:idConference', function(req, res) {
        var idConference = req.params.idConference;
        if (!idConference) {
            console.log("WARNING: New DELETE request to /conferences/:idConference without idConference, sending 400...");
            res.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New DELETE request to /conferences/" + idConference);
            db.remove({ "idConference": idConference }, {}, function(err, numRemoved) {
                if (err) {
                    console.error('WARNING: Error removing data from DB');
                    res.sendStatus(500); // internal server error
                }
                else {
                    console.log("INFO: Conferences removed: " + numRemoved.result.n);
                    if (numRemoved.result.n === 1) {
                        console.log("INFO: The conference with idConference " + idConference + " has been succesfully deleted, sending 200...");
                        res.sendStatus(200);
                    }
                    else {
                        console.log("WARNING: There are no conferences to delete");
                        res.sendStatus(404); // not found
                    }
                }
            });
        }
    });
}
