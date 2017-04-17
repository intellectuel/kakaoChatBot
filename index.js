var express = require('express');
var app = express();
var fs = require("fs");

var server = app.listen(3100, function(){
 console.log("Express server has started on port 3000")
});

var router = require('./router/main')(app, fs);


