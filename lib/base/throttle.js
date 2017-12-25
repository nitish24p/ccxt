"use strict";

import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Promise from 'babel-runtime/core-js/promise';
import _Object$assign from 'babel-runtime/core-js/object/assign';

var _this = this;

var _require = require('./functions'),
    sleep = _require.sleep;

var throttle = function throttle(cfg) {

    var lastTimestamp = Date.now(),
        numTokens = typeof cfg.numTokens != 'undefined' ? cfg.numTokens : cfg.capacity,
        queue = [],
        running = false,
        counter = 0;

    return _Object$assign(function (cost) {

        if (queue.length > cfg.maxCapacity) throw new Error('Backlog is over max capacity of ' + cfg.maxCapacity);

        return new _Promise(function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(resolve, reject) {
                var hasEnoughTokens, _queue$, _cost, _resolve, _reject, now, elapsed;

                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;


                                queue.push({ cost: cost, resolve: resolve, reject: reject });

                                if (running) {
                                    _context.next = 16;
                                    break;
                                }

                                running = true;

                            case 4:
                                if (!(queue.length > 0)) {
                                    _context.next = 15;
                                    break;
                                }

                                hasEnoughTokens = cfg.capacity ? numTokens > 0 : numTokens >= 0;

                                if (hasEnoughTokens) {
                                    if (queue.length > 0) {
                                        _queue$ = queue[0], _cost = _queue$.cost, _resolve = _queue$.resolve, _reject = _queue$.reject;

                                        _cost = _cost || cfg.defaultCost;
                                        if (numTokens >= Math.min(_cost, cfg.capacity)) {
                                            numTokens -= _cost;
                                            queue.shift();
                                            _resolve();
                                        }
                                    }
                                }
                                now = Date.now();
                                elapsed = now - lastTimestamp;

                                lastTimestamp = now;
                                numTokens = Math.min(cfg.capacity, numTokens + elapsed * cfg.refillRate);
                                _context.next = 13;
                                return sleep(cfg.delay);

                            case 13:
                                _context.next = 4;
                                break;

                            case 15:
                                running = false;

                            case 16:
                                _context.next = 21;
                                break;

                            case 18:
                                _context.prev = 18;
                                _context.t0 = _context['catch'](0);


                                reject(_context.t0);

                            case 21:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this, [[0, 18]]);
            }));

            return function (_x, _x2) {
                return _ref.apply(this, arguments);
            };
        }());
    }, cfg, {
        configure: function configure(newCfg) {
            return throttle(_Object$assign({}, cfg, newCfg));
        }
    });
};

module.exports = throttle;