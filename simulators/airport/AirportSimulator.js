const express = require('express');
const path = require("path");
const jsonfile = require("jsonfile");
const faker = require("faker");
const chance = require('chance').Chance();

var router = express.Router();


router.get('/airlines', function (req, res) {
    jsonfile.readFile(__dirname + '/../../data/airport/airlines.json', function(err, airlines) {
        //inject some flight counts
        for (var i = 0; i < airlines.length; i++) {
            airlines[i].FlightCount = faker.random.number({min:5, max:400});
        }
        res.json(airlines);
    })
});

var flightcodes = [];
router.get('/flights/:airline', function (req, res) {
    var airline = req.params.airline;
    if (airline != undefined) {
        if (flightcodes[airline] == undefined) {
            var flights = faker.random.number({min:1, max:40});
            var codes = [];
            for (var i = 0; i < flights; i++) {
                var flight = {};
                flight.code = airline + '-' + faker.random.number({min:1000, max:9999}).toString();
                flight.destination = faker.address.city();
                flight.origin = faker.address.city();
                flight.departure = faker.date.recent(1);
                flight.status = chance.weighted(['Canceled', 'Early', 'Delayed', 'On Time'], [1, 2, 2, 8]);
                codes.push(flight);
            }
            flightcodes[airline] = codes;
        }
        res.json(flightcodes[airline]);

    } else {
        res.json([]);
    }
});

var manifests = [];
router.get('/flight/manifest/:code', function (req, res) {
    var code = req.params.code;
    if (code != undefined) {
        if (manifests[code] == undefined) {
            var passengers = faker.random.number({min:1, max:80});
            var manifest = [];
            for (var i = 0; i < passengers; i++) {
                var customer = {
                    name: faker.name.findName(),
                    email: faker.internet.email(),
                    address: faker.address.streetAddress(),
                    image: faker.image.avatar()
                };
                manifest.push(customer);
            }
            manifests[code] = manifest;
        }
        res.json(manifests[code]);

    } else {
        res.json([]);
    }
});

module.exports = {router: router, basepath: '/airport'};