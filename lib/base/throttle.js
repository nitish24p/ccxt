"use strict";

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('./functions'),
    sleep = _require.sleep;

var throttle = function throttle(cfg) {

    var lastTimestamp = Date.now(),
        numTokens = typeof cfg.numTokens != 'undefined' ? cfg.numTokens : cfg.capacity,
        queue = [],
        running = false,
        counter = 0;

    return (0, _assign2.default)(function (cost) {

        if (queue.length > cfg.maxCapacity) throw new Error('Backlog is over max capacity of ' + cfg.maxCapacity);

        return new _promise2.default(function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(resolve, reject) {
                var hasEnoughTokens, _queue$, _cost, _resolve, _reject, now, elapsed;

                return _regenerator2.default.wrap(function _callee$(_context) {
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
                }, _callee, undefined, [[0, 18]]);
            }));

            return function (_x, _x2) {
                return _ref.apply(this, arguments);
            };
        }());
    }, cfg, {
        configure: function configure(newCfg) {
            return throttle((0, _assign2.default)({}, cfg, newCfg));
        }
    });
};

module.exports = throttle;