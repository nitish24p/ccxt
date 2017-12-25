"use strict";

import _JSON$stringify from 'babel-runtime/core-js/json/stringify';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Object$getOwnPropertyNames from 'babel-runtime/core-js/object/get-own-property-names';
const fs = require('fs');

module.exports = (logFileName, object, methodNames) => {

    for (const name of _Object$getOwnPropertyNames(object.constructor.prototype)) {

        if (methodNames.includes(name)) {

            const impl = object[name].bind(object);

            // generates a wrapper around CCXT method
            object[name] = (() => {
                var _ref = _asyncToGenerator(function* (...args) {

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
                    const line = _JSON$stringify(log) + '\n';

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