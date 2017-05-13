// usage: node ForDoug.js [numRecords]
const express = require('express');
var faker = require('faker');
var moment = require('moment');
// faker API docs: https://github.com/Marak/faker.js/wiki/Method-documentation
// install latest version of faker with 'npm install faker'

var router = express.Router();
module.exports = { router: router, basepath: '/assets'};

var statusCodes = [ {"statusNum" : 0, "statusCode" : "OK"},
					{"statusNum" : 1, "statusCode" : "WARNING"},
					{"statusNum" : 2, "statusCode" : "MINOR"},
					{"statusNum" : 3, "statusCode" : "MAJOR"},
					{"statusNum" : 4, "statusCode" : "CRITICAL"},
					{"statusNum" : 5, "statusCode" : "FAILURE"} ];

var services = [ {"serviceId" : 0, "serviceName" : "OnlineBanking"},
				 {"serviceId" : 1, "serviceName" : "Branch"},
				 {"serviceId" : 2, "serviceName" : "ATM"},
				 {"serviceId" : 3, "serviceName" : "Savings"},
				 {"serviceId" : 4, "serviceName" : "WireTransfer"},
				 {"serviceId" : 5, "serviceName" : "Investments"} ];

var assetTypes = ["OCI", "NIC", "Server", "WebServer", "DBServer"];

var assets = ['Virginia', 'Maryland', 'North Carolina', 'Florida', 'Texas', 'New York', 'Michigan', 'Perth' ];


router.get('/statusCodes', function(req, res) {
    res.json(statusCodes);

});

router.get('/serviceCodes', function(req, res) {
    res.json(services);
});

router.get('/assetTypes', function(req, res) {
    res.json(assetTypes);
});

router.get('/kpiData', function(req, res) {
    var rows = [];
    var numRecords = 10;
           var interval = 30;
    if ( req.query.records > 0 ) {
        numRecords = req.query.records;
    }
    if ( req.query.interval > 0 ) {
        interval = req.query.interval;
    }

    rows.push("\"RECID*NUMBER*PK\", \"SNAPSHOT_TIME_UTC*STRING\", \"SNAPSHOT_TIME*STRING\", \"Asset*STRING*PK\", \"KPI_VALUE*INT\"");
    var recDate = moment(new Date());
    for (var i = 0; i < numRecords; i++) {
        assets.forEach ( function(value) {
            // RECID*NUMBER*PK
            var output = quoted(i) + ", ";
            // SNAPSHOT_TIME_UTC*DATE
            output += quoted(recDate) + ", ";
            // SNAPSHOT_TIME*DATE
            output += quoted(recDate.format('YYYY-MM-DD hh:mm:ss')) + ", ";
            // Asset*STRING
            output += quoted(value) + ", ";
            // KPI_VALUE*INT
            output += randomInt(0,100);
            rows.push(output);
        });
        //console.log("#Adjusting RecDate: " + recDate + ", interval: " + interval+ ", subtracted: ");
        recDate.subtract(interval,'seconds');
        //console.log("# RecDate: " + recDate);
    };
    res.contentType("application/csv");
    
	var secondsToSleep = req.query.delay;
	if ( secondsToSleep > 0 ) {
		setTimeout(function() {
		  res.send(rows.join('\n'));
		}, (secondsToSleep * 1000));
	} else {
		res.send(rows.join('\n'));
	}
});

router.get('/buildingData', function(req, res) {
	var rows = [];
	var numRecords = 10;
	if ( req.query.records > 0 ) {
		numRecords = req.query.records;
	}
	
	rows.push("\"ID*NUMBER*PK\", \"CASE_ID_*STRING\", \"ARRIVAL_TIME*STRING\", \"MODIFIED_TIME*STRING\", " +
				"\"STATUS*INT\", \"STATUSCODE*STRING\", \"REGION*STRING\", \"ASSIGNED_TO_GROUP_*INT\", " + 
				"\"DESCRIPTION*STRING\", \"SCSource*STRING\", \"City*STRING\", \"Building*STRING\", \"AssetId*STRING\", \"AssetType*STRING\"");
	
	var quoted = function(obj) {
		return "\"" + obj + "\"";
	};
				
	for (var i = 0; i < numRecords; i++) {
		// ID*NUMBER*PK
		var output = quoted(i) + ", ";
		// CASE_ID_*STRING
		output += quoted(faker.random.uuid()) + ", ";
		// ARRIVAL_TIME*DATE
		var dateObjWrapper = moment(faker.date.between('2015-01-01', '2015-12-01'));
		output += quoted(dateObjWrapper.format("YYYY-M-DD HH:mm:ss SSS")) + ", ";
		dateObjWrapper = moment(faker.date.between('2015-12-02', '2015-12-09'));
		output += quoted(dateObjWrapper.format("YYYY-M-DD HH:mm:ss SSS")) + ", ";
		//output += quoted(faker.date.between('2015-01-01', '2015-12-01')) + ", ";
		// MODIFIED_TIME*DATE
		//output += quoted(faker.date.between('2015-12-02', '2015-12-09')) + ", ";
		// STATUS*INT
		var statusObj = faker.random.arrayElement(statusCodes);
		output += quoted(statusObj["statusNum"]) + ", ";
		// STATUSCODE*STRING
		output += quoted(statusObj["statusCode"]) + ", ";
		// REGION*STRING,	
		output += quoted(faker.address.country()) + ", ";
		// ASSIGNED_TO_GROUP_*INT
		output += quoted(faker.random.number(12)) + ", ";
		// DESCRIPTION*STRING
		output += quoted(faker.company.bs()) + ", ";
		// SCSource*STRING
		output += quoted(faker.hacker.noun()) + ", ";
		// City*STRING
		if (faker.random.boolean()) {
			// 1 = {{address.cityPrefix}} {{name.firstName}}
			output += quoted(faker.address.city(1)) + ", ";
		} else {
			// 3 = {{name.lastName}} {{address.citySuffix}}
			var city = faker.address.city(3).replace(/\s/g, "");
			output += quoted(city) + ", ";
		}
		// Building*STRING
		output += quoted("BUILDING #" + faker.random.number(100)) + ", ";
		// AssetId*STRING
		output += quoted(faker.random.uuid()) + ", ";
		// AssetType*STRING
		output += quoted(faker.random.arrayElement(assetTypes));
		//var serviceObj = faker.random.arrayElement(services);
		rows.push(output);
	};
	res.contentType("application/csv");
    res.send(rows.join('\n'));
});

var quoted = function(obj) {
    return "\"" + obj + "\"";
};

var randomInt = function(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

// This function generates random integer between two numbers
// low (inclusive) and high (inclusive) ([low, high])
var randomIntIncl = function(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

// This function generates a random floating point number
// that falls between the low and high values provided.
var randomNum = function(low, high) {
    return Math.random() * (high - low) + low;
}

// This function could be used with randomIntInc(1,10) to
// generate the following set:
// [ '007', '006', '009', '010', '002', '005', '003',
//   '006', '004', '009' ]
var leftPad = function(str, length) {
    str = str == null ? '' : String(str);
    length = ~~length;
    pad = '';
    padLength = length - str.length;
    
    while(padLength--) {
        pad += '0';
    }
    
    return pad + str;
}

// This function could be used with randomIntInc(1,10) to
// generate the following set:
// [ '700', '600', '900', '100', '200', '500', '300',
//   '600', '400', '900' ]
var rightPad = function(str, length) {
    str = str == null ? '' : String(str);
    length = ~~length;
    pad = '';
    padLength = length - str.length;
    
    while(padLength--) {
        pad += '0';
    }
    
    return str + pad;
}
