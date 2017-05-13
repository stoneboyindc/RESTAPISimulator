/***********************************************************************************************************************
 * utility/echoParams
 *
 **********************************************************************************************************************/
const express = require('express');
const path = require("path");
const jsonfile = require("jsonfile");
const faker = require("faker");
var forEach = require('object-loops/for-each')


var router = express.Router();

router.get('/echoParams', function (req, res) {
	var data;
	var header;
	var first = true;
	forEach(req.query, function (val, key, obj) {
		if (header) {
			header += "," + key;
			data += "," + val;
		} else {
			header = key;
			data = val;
		}
	});
	res.contentType("application/csv");
    res.send(header + '\n' + data);
	
});

module.exports = {router: router, basepath: '/utility'};
