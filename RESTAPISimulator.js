"use strict";

const express = require("express");
const cors = require("cors");
const faker = require("faker");

var AirportSimulator = require("./simulators/airport/AirportSimulator");
var echoParams = require("./simulators/utility/echoParams");
var buildingData = require("./simulators/assets/buildingData");

var allSimulators = [AirportSimulator,echoParams,buildingData];

var app = express();
app.set('port', process.env.PORT || 3500);

app.use(cors());

allSimulators.forEach(function (simulator) {
    app.use(simulator.basepath, simulator.router);
});

app.get('/route_registry', function (req, resp) {
    var routes = [];
    allSimulators.forEach(function (simulator) {
        simulator.router.stack.forEach(function (r) {
            if (r.route && r.route.path) {
                routes.push(simulator.basepath + r.route.path)
            }
        });
    });

    //add the application level routes
    app._router.stack.forEach(function (r) {
        if (r.route && r.route.path) {
            routes.push(r.route.path)
        }
    });

    resp.json(routes);
});

var server = app.listen(app.get('port'), function () {
    console.log('Server up: http://localhost:' + app.get('port'));
});
