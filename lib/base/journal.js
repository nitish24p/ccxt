"use strict";

import _Object$getOwnPropertyNames from 'babel-runtime/core-js/object/get-own-property-names';
import _getIterator from 'babel-runtime/core-js/get-iterator';
import _regeneratorRuntime from 'babel-runtime/regenerator';
import _JSON$stringify from 'babel-runtime/core-js/json/stringify';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';

var _this = this;

var fs = require('fs');

module.exports = function (logFileName, object, methodNames) {
    var _loop = function _loop(name) {

        if (methodNames.includes(name)) {

            var impl = object[name].bind(object);

            // generates a wrapper around CCXT method
            object[name] = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var start, response, exception, error, end, log, fileName, line;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
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
                                line = _JSON$stringify(log) + '\n';


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
                }, _callee, _this, [[4, 10]]);
            }));
        }
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {

        for (var _iterator = _getIterator(_Object$getOwnPropertyNames(object.constructor.prototype)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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