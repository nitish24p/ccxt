"use strict";

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { sleep } = require('./functions');

const throttle = cfg => {

    let lastTimestamp = Date.now(),
        numTokens = typeof cfg.numTokens != 'undefined' ? cfg.numTokens : cfg.capacity,
        queue = [],
        running = false,
        counter = 0;

    return (0, _assign2.default)(cost => {

        if (queue.length > cfg.maxCapacity) throw new Error('Backlog is over max capacity of ' + cfg.maxCapacity);

        return new _promise2.default((() => {
            var _ref = (0, _asyncToGenerator3.default)(function* (resolve, reject) {

                try {

                    queue.push({ cost, resolve, reject });

                    if (!running) {
                        running = true;
                        while (queue.length > 0) {
                            const hasEnoughTokens = cfg.capacity ? numTokens > 0 : numTokens >= 0;
                            if (hasEnoughTokens) {
                                if (queue.length > 0) {
                                    let { cost, resolve, reject } = queue[0];
                                    cost = cost || cfg.defaultCost;
                                    if (numTokens >= Math.min(cost, cfg.capacity)) {
                                        numTokens -= cost;
                                        queue.shift();
                                        resolve();
                                    }
                                }
                            }
                            let now = Date.now();
                            let elapsed = now - lastTimestamp;
                            lastTimestamp = now;
                            numTokens = Math.min(cfg.capacity, numTokens + elapsed * cfg.refillRate);
                            yield sleep(cfg.delay);
                        }
                        running = false;
                    }
                } catch (e) {

                    reject(e);
                }
            });

            return function (_x, _x2) {
                return _ref.apply(this, arguments);
            };
        })());
    }, cfg, {
        configure: newCfg => throttle((0, _assign2.default)({}, cfg, newCfg))
    });
};

module.exports = throttle;