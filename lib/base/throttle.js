"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { sleep } = require('./functions');

const throttle = cfg => {

    let lastTimestamp = Date.now(),
        numTokens = typeof cfg.numTokens != 'undefined' ? cfg.numTokens : cfg.capacity,
        queue = [],
        running = false,
        counter = 0;

    return Object.assign(cost => {

        if (queue.length > cfg.maxCapacity) throw new Error('Backlog is over max capacity of ' + cfg.maxCapacity);

        return new Promise((() => {
            var _ref = _asyncToGenerator(function* (resolve, reject) {

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
        configure: newCfg => throttle(Object.assign({}, cfg, newCfg))
    });
};

module.exports = throttle;