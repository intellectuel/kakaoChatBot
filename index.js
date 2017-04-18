var express = require('express');
var app = express();
var fs = require("fs");

var server = app.listen(process.env.PORT || 5000, function(){
 console.log("Express server has started on port 5000");
});

var router = require('./router/main')(app, fs);


