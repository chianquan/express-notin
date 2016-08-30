var express = require('express');
var notIn = require('../index.js');
var assert = require('assert');
var request = require('supertest');
describe("notIn()", function () {
    it("should throw Error when notIn was defined,", function () {
        var app = express();
        app.notIn = function () {
        };
        assert.throws(function () {
            notIn(app);
        }, /not empty/);
    });
});
describe("app.notIn()", function () {
    it("should throw Error when argument number not equal 2", function () {
        var app = express();
        notIn(app);
        assert.throws(function () {
            app.notIn('/aa');
        }, /Wrong/);
        assert.throws(function () {
            app.notIn('/aa', function () {

            }, 'bbbb');
        }, /Wrong/);
    });
    describe("bind to application 's response", function () {

        var app = express();
        notIn(app);
        var func = function (path) {
            if (path.indexOf('func') > -1) {
                return true;
            } else {
                return false;
            }
        };
        app.notIn(['/a', func, /REG/], function (req, res, next) {
            res.end('check');
        });
        app.use(function (req, res) {
            res.end("pass");
        });
        it("should return body=`check` when it's not in the list", function (done) {
            request(app).get('/aa').expect(200, 'check', done);
        });
        it("should return body=`pass` when `/a` equal the string rule '/a'", function (done) {
            request(app).get('/a').expect(200, 'pass', done);
        });
        it("should return body=`pass` when `/aafunc` match the func that need include `func`", function (done) {
            request(app).get('/aafunc').expect(200, 'pass', done);
        });
        it("should return body=`pass` when `/aa/REG` match the regex", function (done) {
            request(app).get('/aa/REG').expect(200, 'pass', done);
        });
        it("should return body=`pass` when the path match more than one rule", function (done) {
            request(app).get('/aa/REG/func').expect(200, 'pass', done);
        });
    });
    describe("bind to router 's response", function () {

        var app = express();
        var router=express.Router();
        notIn(router);
        var func = function (path) {
            if (path.indexOf('func') > -1) {
                return true;
            } else {
                return false;
            }
        };
        app.use('/a',router);
        router.notIn(['/a', func, /REG/], function (req, res, next) {
            res.end('check');
        });
        router.use(function (req, res) {
            res.end("pass");
        });
        it("should return body=`check` when it's not in the list", function (done) {
            request(app).get('/a/aa').expect(200, 'check', done);
        });
        it("should return body=`pass` when `/a` equal the string rule '/a'", function (done) {
            request(app).get('/a/a').expect(200, 'pass', done);
        });
        it("should return body=`pass` when `/aafunc` match the func that need include `func`", function (done) {
            request(app).get('/a/aafunc').expect(200, 'pass', done);
        });
        it("should return body=`pass` when `/aa/REG` match the regex", function (done) {
            request(app).get('/a/REG').expect(200, 'pass', done);
        });
        it("should return body=`pass` when the path match more than one rule", function (done) {
            request(app).get('/a/REG/func').expect(200, 'pass', done);
        });
    });
});