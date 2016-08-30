const STRING = 0;
const FUNCTION = 1;
const REGEXP = 2;
module.exports = function (app) {
    if (app.notIn !== undefined||app.notin!==undefined) {
        throw new Error('The app.notin or app.notIn is not empty,bind function Error!');
    }
    app.notIn=app.notin = notIn.bind(app);
};
function notIn(arr, fn) {
    if(arguments.length!==2){
        throw new Error("Wrong argument length ,it must be 2.");
    }
    if (!Array.isArray(arr)) {
        arr = [arr];
    }
    this.use(execute({
        rules: arr,
        check: fn
    }));
}
function execute(options) {
    var checkFunc = options.check;
    if (typeof checkFunc !== 'function') {
        throw "Options.check is need and must be an function.";
    }
    var rules = options.rules;
    if (!Array.isArray(rules)) {
        throw new Error("The express-path-filter rules must be an array.");
    }
    //store the type judge result.so that we do not need do this every req.
    var _rules = [[], [], []];//because object don't have a `some` function.
    var isOk = rules.every(function (rule) {
        if (typeof rule === 'string') {
            _rules[STRING].push(rule);
            return true;
        }
        if (typeof rule === 'function') {
            _rules[FUNCTION].push(rule);
            return true;
        }
        if (RegExp.prototype.isPrototypeOf(rule)) {
            _rules[REGEXP].push(rule);
            return true;
        }
        return false;
    });
    if (!isOk) {
        throw new Error("The express-path-filter rule must be `string`,`function` or RegExp.");
    }
    return function (req, res, next) {
        var needCheck = !_rules.some(function (rules, type) {
            switch (type) {
                case STRING:
                    return rules.some(function (str) {

                        return req.path===str;
                    });
                    break;
                case FUNCTION:
                    return rules.some(function (func) {
                        return func.call(null, req.path);
                    });
                    break;
                case REGEXP:
                    return rules.some(function (reg) {
                        return reg.test(req.path);
                    });
            }
        });
        if (needCheck) {
            return checkFunc.call(global, req, res, next);
        } else {
            next();
        }
    };
};