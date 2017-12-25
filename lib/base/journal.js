"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');

module.exports = (logFileName, object, methodNames) => {

    for (const name of Object.getOwnPropertyNames(object.constructor.prototype)) {

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
                    const line = JSON.stringify(log) + '\n';

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