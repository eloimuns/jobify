'use strict';

var bodyParser = require('body-parser');
var path = require("path");
var express = require('express');
var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// application/json
app.use(bodyParser.json());

// Start the server
var configPort = process.env.PORT;
var port = (configPort !== undefined ? configPort : 8888);
var server = app.listen(port, function () {
    console.log('Listening on port ' + server.address().port);
});


// API
app.get('/test', function(req, res){
    res.send('TEST');
});