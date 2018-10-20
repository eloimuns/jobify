'use strict';

var bodyParser = require('body-parser');
var path = require("path");
var express = require('express');
var app = express();
var keys = require("./key")

var Client = require('node-rest-client').Client; 
var client = new Client();

app.use('/', express.static(path.join(__dirname, 'public')));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// application/json
app.use(bodyParser.json());

// Start the server
var configPort = process.env.PORT;
var port = (configPort !== undefined ? configPort : 8888);
var server = app.listen(port, function () {
    console.log('Listening on port ' + server.address().port);
});

app.get('/test', function(req, res){
    var args = {
        headers : { "Authorization" : "Basic N2I5ZjMwMGNiZjUxNGNhOGJjOGIxMDI3NTk5OWE2ZGQ6eHFKVzBKbEJvcjJrUlVBbG5Pd050Z1U2RlNlT3dGUmtkQXJjVEpyUWI0UXg4ZkJCSTg=,Bearer 1569c4ec-9d83-412d-aa28-14edcb693bd6"}
    };

    client.get("https://api.infojobs.net/api/1/curriculum/419133b7-8d17-480d-91a8-f0b9cb6a609b/cvtext", args, function (data, response) {
        // parsed response body as js object
        console.log(data);
    });

    res.send('...');
});