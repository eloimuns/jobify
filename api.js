'use strict';
var token = "37add139-dc30-429e-90ed-a754facc143f";
var bodyParser = require('body-parser');
var path = require("path");
var express = require('express');
var app = express();
var keys = require("./key")
var request = require('request');

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

var args = {
    headers : { "Authorization" : "Basic N2I5ZjMwMGNiZjUxNGNhOGJjOGIxMDI3NTk5OWE2ZGQ6eHFKVzBKbEJvcjJrUlVBbG5Pd050Z1U2RlNlT3dGUmtkQXJjVEpyUWI0UXg4ZkJCSTg=, Bearer " + token,
  "Content-Type" : "application/json"}
};

var getCandidate = function(callback){
  client.get("https://api.infojobs.net/api/2/candidate", args, function(data,response) {
    callback(data);
  });
}
var getCvs = function(callback){
    client.get("https://api.infojobs.net/api/2/curriculum", args, function (data, response) {
        callback(data);
    });
}

var getCV = function(callback, cvCode){
    client.get("https://api.infojobs.net/api/1/curriculum/" + cvCode + "/cvtext", args, function (data, response) {
        callback(data);
    });
}

var setCV = function(callback, cvCodem, msg){
    args.data = {};
    args.data.cvtext = msg;
    client.put("https://api.infojobs.net/api/1/curriculum/" + cvCode + "/cvtext", args, function (data, response) {
        callback(data);
    });
}

var getEducations = function(callback, cvCode){
    client.get("https://api.infojobs.net/api/1/curriculum/" + cvCode + "/education", args, function (data, response) {
        callback(data);
    });
}

var getEducation = function(callback, cvCode, education){
    client.get("https://api.infojobs.net/api/1/curriculum/" + cvCode + "/education/" + education, args, function (data, response) {
        callback(data);
    });
}

var setEducation = function(cvCode, education){
    args.data = education;
    client.put("https://api.infojobs.net/api/2/curriculum/" + cvCode + "/education", args, function (data, response) {
        console.log(data)
    });
}
var getExperiencies = function(callback, cvCode){
    client.get("https://api.infojobs.net/api/1/curriculum/" + cvCode + "/experience", args, function (data, response) {
        callback(data);
    });
}

var getExperience = function(callback, cvCode, experience){
    client.get("https://api.infojobs.net/api/1/curriculum/" + cvCode + "/experience/" + experience, args, function (data, response) {
        callback(data);
    });
}

var setExperience = function(cvCode, experience){
    args.data = experience;
    console.log(experience)
    client.put("https://api.infojobs.net/api/4/curriculum/" + cvCode + "/experience", args, function (data, response) {
        console.log(data)
    });
}

var getFutureJob = function(callback, cvCode){
    client.get("https://api.infojobs.net/api/4/curriculum/" + cvCode + "/futurejob", args, function (data, response) {
        callback(data);
    });
}
var setFutureJob = function(cvCode, futurejob){
    args.data = futurejob;
    console.log(cvCode)
    console.log(futurejob)
    client.put("https://api.infojobs.net/api/4/curriculum/" + cvCode + "/futurejob", args, function (data, response) {
        console.log(data)
    });
}
var getPersonalData = function(callback, cvCode){
    client.get("https://api.infojobs.net/api/2/curriculum/" + cvCode + "/personaldata", args, function (data, response) {
        callback(data);
    });
}

var getSkills = function(callback, cvCode){
    client.get("https://api.infojobs.net/api/2/curriculum/" + cvCode + "/skill", args, function (data, response) {
        callback(data);
    });
}

var setSkills = function(cvCode, skill){
    args.data = skill;
    client.put("https://api.infojobs.net/api/2/curriculum/" + cvCode + "/skill", args, function (data, response) {
        console.log(data)
    });
}
var getOffers = function(callback, word){
    client.get("https://api.infojobs.net/api/7/offer?q=" + word + "&maxResults=10", args, function (data, response) {
        callback(data);
    });
}

var getApplication = function(callback, app){
  client.get("https://api.infojobs.net/api/5/application" + app, args, function (data, response) {
      callback(data);
  });
}

var getApplications = function(callback){
  client.get("https://api.infojobs.net/api/5/application", args, function (data, response) {
      callback(data);
  });
}

var postApplication = function(offer, apply_data, callback){
  args.data = apply_data;
  console.log(args.data);
  client.post("https://api.infojobs.net/api/4/offer/" + offer + "/application", args, function (data, response) {
      console.log(data);
      callback(data);
  });
}

var getQuestions = function(callback, offer){
  client.get("https://api.infojobs.net/api/1/offer/" + offer + "/question", args, function (data, response) {
      callback(data);
  });
}

var getDictonary = function(callback, dictionary){
    client.get("https://api.infojobs.net/api/1/dictionary/" + dictionary, args, function (data, response) {
        callback(data);
    });
}


module.exports.getCandidate = getCandidate;
module.exports.getCvs = getCvs;
module.exports.getCV = getCV;
module.exports.setCV = setCV;
module.exports.getEducations = getEducations;
module.exports.getEducation = getEducation;
module.exports.setEducation = setEducation;
module.exports.getExperiencies = getExperiencies;
module.exports.getExperience = getExperience;
module.exports.getFutureJob = getFutureJob;
module.exports.setFutureJob = setFutureJob;
module.exports.getPersonalData = getPersonalData;
module.exports.setExperience = setExperience;
module.exports.getSkills = getSkills;
module.exports.setSkills = setSkills;
module.exports.getOffers = getOffers;
module.exports.getQuestions = getQuestions;
module.exports.getApplications = getApplications;
module.exports.getApplication = getApplication;
module.exports.postApplication = postApplication;
module.exports.getDictonary = getDictonary;
