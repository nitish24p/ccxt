"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = require('fs');

module.exports = function (logFileName, object, methodNames) {
    var _loop = function _loop(name) {

        if (methodNames.includes(name)) {

            var impl = object[name].bind(object);

            // generates a wrapper around CCXT method
            object[name] = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var start, response, exception, error, end, log, fileName, line;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                start = new Date();
                                response = undefined;
                                exception = undefined;
                                error = undefined;
                                _context.prev = 4;
                                _context.next = 7;
                                return impl.apply(undefined, _toConsumableArray(args));

                            case 7:
                                response = _context.sent;
                                _context.next = 14;
                                break;

                            case 10:
                                _context.prev = 10;
                                _context.t0 = _context['catch'](4);


                                error = _context.t0;
                                exception = {
                                    type: _context.t0.constructor.prototype,
                                    message: _context.t0.message
                                };

                            case 14:
                                end = new Date();
                                log = {
                                    start: start,
                                    startDatetime: start.toISOString(),
                                    end: end,
                                    endDatetime: end.toISOString(),
                                    id: object.id,
                                    method: name,
                                    args: args,
                                    response: response,
                                    exception: exception
                                };
                                fileName = typeof logFileName == 'string' ? logFileName : logFileName();
                                line = JSON.stringify(log) + '\n';


                                fs.appendFileSync(fileName, line);

                                if (!response) {
                                    _context.next = 21;
                                    break;
                                }

                                return _context.abrupt('return', response);

                            case 21:
                                throw error;

                            case 22:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, undefined, [[4, 10]]);
            }));
        }
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {

        for (var _iterator = Object.getOwnPropertyNames(object.constructor.prototype)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var name = _step.value;

            _loop(name);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};