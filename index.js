var express = require("express");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://jihfahri:20ayoub2@ds151355.mlab.com:51355/si1718-jf-conferences";

var port = (process.env.PORT || 10000);
var baseURL = "/api/v1";

var db;

MongoClient.connect(mdbURL, { native_parser: true }, function(err, database) {

    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    db = database.collection("conferences");


    app.listen(port, () => {
        console.log("Web server is listening on port " + port);
    });

});

app.get(baseURL + "/conferences/loadInitialData", function(request, response) {
    console.log("INFO: New GET request to /conferences/loadInitialData");
    db.find({}).toArray(function(err, conferences) {
        if (err) {
            console.error('WARNING: Error while getting initial data from DB');
            response.sendStatus(500);
        }
        console.log("INFO: " + conferences);

        if (conferences.length === 0) {
            var conferencesApi = [{
                conference: "Conference on Advanced Information Systems Engineering",
                acronym: "CAISE",
                edition: 2017,
                city: "Essen",
                country: "Germany",
                conferenceID: "CAISE-2017"
            }, {
                conference: "International Conference on Software Engineering",
                acronym: "ICSE",
                edition: 2017,
                city: "Buenos Aires",
                country: "Argentina",
                conferenceID: "ICSE-2017"
            }, {
                conference: "Working IEEE/IFIP Conference on Software Architecture",
                acronym: "WICSA",
                edition: 2016,
                city: "Venice",
                country: "Italy",
                conferenceID: "WICSA-2016"
            }, {
                conference: "Jornadas en Ingeniería del Software y Bases de Datos",
                acronym: "JISBD",
                edition: 2016,
                city: "Salamanca",
                country: "Spain",
                conferenceID: "JISBD-2016"
            }, {
                conference: "Conference on Advanced Information Systems Engineering",
                acronym: "CAISE",
                edition: 2016,
                city: "Ljubljana",
                country: "Slovenia",
                conferenceID: "CAISE-2016"
            }];

            console.log("INFO: Initial data created succesfully!");

            db.insert(conferencesApi);
            response.sendStatus(201); //created

        }
        else {
            console.log('INFO: DB has ' + conferences.length + 'conferencesApi');
            response.sendStatus(409); //conflict
        }
    });

});

app.get(baseURL + '/conferences', function(req, res) {
    console.log("INFO: New GET req to /conferences");
    db.find({}).toArray(function(err, conferences) {
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

app.get(baseURL + '/conferences/:conferenceID', function(req, res) {
    var conferenceID = req.params.conferenceID;
    if (!conferenceID) {
        console.log("WARNING: New GET req to /conferences/:conferenceID without conferenceID, sending 400...");
        res.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET req to /conferences/" + conferenceID);
        // if (!isNaN(conferenceID)) {
        db.findOne({ "conferenceID": conferenceID }, (err, filteredConferences) => {
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
                    console.log("WARNING: There are not any conference with conferenceID " + conferenceID);
                    res.sendStatus(404); // not found
                }
            }
        });
        // }
    }
});

app.post(baseURL + '/conferences', function(req, res) {
    var newConference = req.body;
    if (!newConference) {
        console.log("WARNING: New POST req to /conferences/ without conference, sending 400...");
        res.sendStatus(400); // bad req
    }
    else {
        console.log("INFO: New POST req to /conferences with body: " + JSON.stringify(newConference, 2, null));
        if (!newConference.conference || !newConference.acronym || !newConference.edition || !newConference.city || !newConference.country || !newConference.conferenceID) {
            console.log("WARNING: The conference " + JSON.stringify(newConference, 2, null) + " is not well-formed, sending 422...");
            res.sendStatus(422); // unprocessable entity
        }
        else {
            var conferenceID;
            newConference.conferenceID = conferenceID;
            db.findOne({ "conferenceID": conferenceID }, function(err, conferences) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    res.sendStatus(500); // internal server error
                }
                else {
                    // var conferencesBeforeInsertion = conferences.filter((conference) => {
                    //     return (conference.conferenceID.localeCompare(newConference.conferenceID, "en", { 'sensitivity': 'base' }) === 0);
                    // });
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
app.post(baseURL + '/conferences/:conferenceID', function(req, res) {
    var conferenceID = req.params.conferenceID;
    console.log("WARNING: New POST request to /conferences/" + conferenceID + ", sending 405...");
    res.sendStatus(405);
});

app.put(baseURL + '/conferences', function(req, res) {
    console.log("WARNING: New PUT request to /conferences, sending 405...");
    res.sendStatus(405);
});

app.put(baseURL + '/conferences/:conferenceID', function(req, res) {
    var updatedConference = req.body;
    var conferenceID = req.params.conferenceID;
    if (!updatedConference) {
        console.log("WARNING: New PUT request to /conferences/ without conferenceID, sending 400...");
        res.sendStatus(400);
    }
    else {
        console.log("INFO: New PUT request to /conferences/" + conferenceID + " with data " + JSON.stringify(updatedConference, 2, null));
        if (!updatedConference.conference || !updatedConference.acronym || !updatedConference.edition || !updatedConference.city || !updatedConference.country || !updatedConference.conferenceID) {
            console.log("WARNING: The conference " + JSON.stringify(updatedConference, 2, null) + " is not well-formed, sending 422...");
            res.sendStatus(422); // unprocessable entity
        }
        else {
            db.findOne({ "conferenceID": conferenceID }, (err, conferences) => {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    res.sendStatus(500); // internal server error
                }
                else {
                    if (conferences) {
                        updatedConference.conference = conferences.conference;
                        db.update({ "conferenceID": conferenceID }, updatedConference);
                        console.log("INFO: Modifying conference with conferenceID " + conferenceID + " with data " + JSON.stringify(updatedConference, 2, null));
                        res.send(updatedConference);
                    }
                    else {
                        console.log("WARNING: There are not any conference with conferenceID " + conferenceID);
                        res.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});

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

app.delete(baseURL + '/conferences/:conferenceID', function(req, res) {
    var conferenceID = req.params.conferenceID;
    if (!conferenceID) {
        console.log("WARNING: New DELETE request to /conferences/:conferenceID without conferenceID, sending 400...");
        res.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New DELETE request to /conferences/" + conferenceID);
        db.remove({ "conferenceID": conferenceID }, {}, function(err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                res.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: Conferences removed: " + numRemoved.result.n);
                if (numRemoved.result.n === 1) {
                    console.log("INFO: The conference with conferenceID " + conferenceID + " has been succesfully deleted, sending 200...");
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
