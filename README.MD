#express-notin
This is a middleware to extend the app(express Instance) and router(express.Router instance).Add an function app.notin() or app.notIn() to the express instance.

The app.notIn(rules,fn) check if the path match the rules .If match skip the fn,else excuse the fn.
##Install
    npm install --save express-notin

#How
~~~js
var express = require('express');
var notIn = require('express-notin');
var app = express();
notIn(app);
~~~
##Use example
~~~js
var express = require('express');
var notIn = require('express-notin');//#########
var app = express();

notIn(app);//###########

var func = function (path) {
    if (path.indexOf('func') > -1) {
        return true;
    } else {
        return false;
    }
};
//###########
app.notIn(['/a', func, /REG/], function (req, res, next) {
    res.end('check');//I use this function do login check together.
});
app.use(function (req, res) {
    res.end("pass");
});
app.listen(400);
~~~