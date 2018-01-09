var exports = module.exports = {};

//Register all the function used in this module
exports.register = function(app, db2, baseURL1, jwtCheck) {


    app.get(baseURL1 + '/authorized', jwtCheck, function(req, res) {
        res.send('Secured Resource');
    });

    // GET a collection
    app.get(baseURL1 + '/conferences', jwtCheck, function(req, res) {
        var search = req.query.search;
        var query = {};
        var hasParam = true;

        if (search) {
            query = {
                $or: [
                    { 'idConference': { $regex: '.*' + search + '.*', $options: 'i' } },
                    { 'conference': { $regex: '.*' + search + '.*', $options: 'i' } },
                    { 'acronym': { $regex: '.*' + search + '.*', $options: 'i' } },
                    { 'edition': { $regex: '.*' + search + '.*', $options: 'i' } },
                    { 'city': { $regex: '.*' + search + '.*', $options: 'i' } },
                    { 'country': { $regex: '.*' + search + '.*', $options: 'i' } }
                ]
            };

        }

        if (!hasParam) {
            console.log("WARNING: New GET request to /conferences/:idConference without idConference, sending 400...");
            res.sendStatus(400); // bad request
        }
        else {
            var skipQuantity = req.query.skip;
            var limitQuantity = req.query.limit;
            if (!skipQuantity) {
                skipQuantity = 0;
            }
            else {
                skipQuantity = parseInt(skipQuantity);
                if (isNaN(skipQuantity)) {
                    skipQuantity = 0;
                }
            }
            if (!limitQuantity) {
                limitQuantity = 10;
            }
            else {
                limitQuantity = parseInt(limitQuantity);
                if (isNaN(limitQuantity)) {
                    limitQuantity = 10;
                }

            }
        }
        console.log("INFO: New GET req to /conferences");
        db2.find(query, { skip: skipQuantity, limit: limitQuantity }).toArray(function(err, conferences) {
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
    
     app.get(baseURL1 + '/resultsCount', jwtCheck, function(req, res) {
        var search = req.query.search;
        var query = {};
       
        if (search) {
            query = {
                $or: [
                    { 'idConference': { $regex: '.*' + search + '.*', $options: 'i' } },
                    { 'conference': { $regex: '.*' + search + '.*', $options: 'i' } },
                    { 'acronym': { $regex: '.*' + search + '.*', $options: 'i' } },
                    { 'edition': { $regex: '.*' + search + '.*', $options: 'i' } },
                    { 'city': { $regex: '.*' + search + '.*', $options: 'i' } },
                    { 'country': { $regex: '.*' + search + '.*', $options: 'i' } }
                ]
            };

        }
       
        console.log("INFO: New GET req to /conferences");
        db2.find(query).count(function(err, result) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                res.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: Sending conferences: " + JSON.stringify(result, 2, null));
                res.send({"res": result});
              
            }
        });
    });

    // Create a collection
    app.post(baseURL1 + '/conferences', jwtCheck, function(req, res) {
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
                db2.findOne({ "idConference": newConference.idConference }, function(err, conferences) {
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
                            db2.insertOne(req.body, (err, result) => {
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
    app.post(baseURL1 + '/conferences/:idConference', jwtCheck, function(req, res) {
        var idConference = req.params.idConference;
        console.log("WARNING: New POST request to /conferences/" + idConference + ", sending 405...");
        res.sendStatus(405);
    });

    // Update a collection
    app.put(baseURL1 + '/conferences', jwtCheck, function(req, res) {
        console.log("WARNING: New PUT request to /conferences, sending 405...");
        res.sendStatus(405);
    });

    // Update a resource
    app.put(baseURL1 + '/conferences/:idConference', jwtCheck, function(req, res) {
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
                db2.findOne({ "idConference": idConference }, (err, conferences) => {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        res.sendStatus(500); // internal server error
                    }
                    else {
                        if (conferences) {
                            updatedConference.conference = conferences.conference;
                            db2.update({ "idConference": idConference }, updatedConference);
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
    app.delete(baseURL1 + '/conferences', jwtCheck, function(req, res) {
        console.log("INFO: New DELETE request to /conferences");
        db2.remove({}, { justOne: false }, function(err, numRemoved) {
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
    app.delete(baseURL1 + '/conferences/:idConference', jwtCheck, function(req, res) {
        var idConference = req.params.idConference;
        if (!idConference) {
            console.log("WARNING: New DELETE request to /conferences/:idConference without idConference, sending 400...");
            res.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New DELETE request to /conferences/" + idConference);
            db2.remove({ "idConference": idConference }, {}, function(err, numRemoved) {
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
