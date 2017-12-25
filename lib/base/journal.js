"use strict";

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fs = require('fs');

module.exports = (logFileName, object, methodNames) => {

    for (const name of (0, _getOwnPropertyNames2.default)(object.constructor.prototype)) {

        if (methodNames.includes(name)) {

            const impl = object[name].bind(object);

            // generates a wrapper around CCXT method
            object[name] = (() => {
                var _ref = (0, _asyncToGenerator3.default)(function* (...args) {

                    const start = new Date();

                    let response = undefined;
                    let exception = undefined;
                    let error = undefined;

                    try {

                        response = yield impl(...args);
                    } catch (e) {

                        error = e;
                        exception = {
                            type: e.constructor.prototype,
                            message: e.message
                        };
                    }

                    const end = new Date();
                    const log = {
                        start,
                        startDatetime: start.toISOString(),
                        end,
                        endDatetime: end.toISOString(),
                        id: object.id,
                        method: name,
                        args,
                        response,
                        exception
                    };

                    const fileName = typeof logFileName == 'string' ? logFileName : logFileName();
                    const line = (0, _stringify2.default)(log) + '\n';

                    fs.appendFileSync(fileName, line);

                    if (response) return response;

                    throw error;
                });

                return function () {
                    return _ref.apply(this, arguments);
                };
            })();
        }
    }
};