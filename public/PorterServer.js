"use strict";
exports.__esModule = true;
var PorterService_1 = require("./PorterService");
require('dotenv').config();
var express = require('express');
var cors = require('cors');
var server = express();
server.use(cors());
server.get('/ports', function (req, res, next) {
    var timestamp = new Date().toISOString();
    var start = Number(req.query.start || 3000);
    var end = Number(req.query.end || 10000);
    PorterService_1.getPorts(function (result, error) {
        if (error) {
            console.warn(["{timestamp}"], error);
            res.status(500).send(error);
        }
        else if (!result) {
            console.log("[" + timestamp + "] no results");
            res.sendStatus(204);
        }
        else {
            console.log("[" + timestamp + "] found " + result.length + " processes");
            res.status(200).send(result);
        }
    }, start, end);
});
module.exports = server;
