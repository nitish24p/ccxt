import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _Promise from 'babel-runtime/core-js/promise';
import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';

var _this = this;

/*  ------------------------------------------------------------------------ */

var ccxt = require('../../ccxt.js'),
    assert = require('assert'),
    log = require('ololog'),
    ansi = require('ansicolor').nice;

/*  ------------------------------------------------------------------------ */

var chai = require('chai').use(require('chai-as-promised')).should();

/*  ------------------------------------------------------------------------ */

describe('ccxt base code', function () {

    it('safeFloat is robust', _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:

                        assert.strictEqual(ccxt.safeFloat({ 'float': '1.0' }, 'float'), 1.0);
                        assert.strictEqual(ccxt.safeFloat({ 'float': '-1.0' }, 'float'), -1.0);
                        assert.strictEqual(ccxt.safeFloat({ 'float': 1.0 }, 'float'), 1.0);
                        assert.strictEqual(ccxt.safeFloat({ 'float': 0 }, 'float'), 0);
                        assert.strictEqual(ccxt.safeFloat({ 'float': undefined }, 'float'), undefined);
                        assert.strictEqual(ccxt.safeFloat({ 'float': "" }, 'float'), undefined);
                        assert.strictEqual(ccxt.safeFloat({ 'float': "" }, 'float', 0), 0);
                        assert.strictEqual(ccxt.safeFloat({}, 'float'), undefined);
                        assert.strictEqual(ccxt.safeFloat({}, 'float', 0), 0);

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, _this);
    })));

    it.skip('setTimeout_safe is working', function (done) {

        var start = Date.now();
        var calls = [];

        var brokenSetTimeout = function brokenSetTimeout(done, ms) {
            calls.push({ when: Date.now() - start, ms_asked: ms });
            return setTimeout(done, 100); // simulates a defect setTimeout implementation that sleeps wrong time (100ms always in this test)
        };

        var approxEquals = function approxEquals(a, b) {
            return Math.abs(a - b) <= 10;
        };

        // ask to sleep 250ms
        ccxt.setTimeout_safe(function () {
            assert(approxEquals(calls[0].ms_asked, 250));
            assert(approxEquals(calls[1].ms_asked, 150));
            assert(approxEquals(calls[2].ms_asked, 50));
            done();
        }, 250, brokenSetTimeout);
    });

    it('setTimeout_safe canceling is working', function (done) {

        var brokenSetTimeout = function brokenSetTimeout(done, ms) {
            return setTimeout(done, 100);
        }; // simulates a defect setTimeout implementation that sleeps wrong time (100ms always in this test)

        var clear = ccxt.setTimeout_safe(function () {
            throw new Error('shouldnt happen!');
        }, 250, brokenSetTimeout);

        setTimeout(function () {
            clear();
        }, 200);
        setTimeout(function () {
            done();
        }, 400);
    });

    it('timeout() is working', _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.t0 = assert;
                        _context2.next = 3;
                        return ccxt.timeout(200, new _Promise(function (resolve) {
                            return setTimeout(function () {
                                return resolve('foo');
                            }, 100);
                        }));

                    case 3:
                        _context2.t1 = _context2.sent;
                        (0, _context2.t0)('foo', _context2.t1);
                        _context2.next = 7;
                        return ccxt.timeout(100, _Promise.reject('foo')).should.be.rejectedWith('foo');

                    case 7:
                        _context2.next = 9;
                        return ccxt.timeout(100, new _Promise(function (resolve, reject) {
                            return setTimeout(function () {
                                return reject('foo');
                            }, 200);
                        })).should.be.rejectedWith('request timed out');

                    case 9:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    })));

    it('calculateFee() works', function () {

        var price = 100.00;
        var amount = 10.00;
        var taker = 0.0025;
        var maker = 0.0010;
        var fees = { taker: taker, maker: maker };
        var market = {
            'id': 'foobar',
            'symbol': 'FOO/BAR',
            'base': 'FOO',
            'quote': 'BAR',
            'taker': taker,
            'maker': maker,
            'precision': {
                'amount': 8,
                'price': 8
            }
        };

        var exchange = new ccxt.Exchange({
            'id': 'mock',
            'markets': {
                'FOO/BAR': market
            }
        });

        _Object$keys(fees).forEach(function (takerOrMaker) {

            var result = exchange.calculateFee(market['symbol'], 'limit', 'sell', amount, price, takerOrMaker, {});

            assert.deepEqual(result, {
                'type': takerOrMaker,
                'currency': 'BAR',
                'rate': fees[takerOrMaker],
                'cost': fees[takerOrMaker] * amount * price
            });
        });
    });

    it('amountToLots works', function () {

        var exchange = new ccxt.Exchange({
            id: 'mock',
            markets: {
                'ETH/BTC': { id: 'ETH/BTC', symbol: 'ETH/BTC', base: 'ETH', quote: 'BTC', lot: 0.001, precision: { amount: 4 } },
                'BTC/USD': { id: 'BTC/USD', symbol: 'BTC/USD', base: 'BTC', quote: 'USD', lot: 0.005, precision: { amount: 3 } },
                'ETH/USD': { id: 'ETH/USD', symbol: 'ETH/USD', base: 'ETH', quote: 'USD', lot: 0.01, precision: { amount: 1 } }
            }
        });

        assert.equal(exchange.amountToLots('ETH/BTC', 0.0011), '0.001');
        assert.equal(exchange.amountToLots('ETH/BTC', 0.0009), '0');
        assert.equal(exchange.amountToLots('ETH/BTC', 0.12345), '0.123');

        assert.equal(exchange.amountToLots('BTC/USD', 1.234), '1.230');
        assert.equal(exchange.amountToLots('ETH/USD', 0.01), '0');
        assert.equal(exchange.amountToLots('ETH/USD', 1.11), '1.1');
        assert.equal(exchange.amountToLots('ETH/USD', 1.123), '1.1');
    });

    it.skip('rate limiting works', _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
        var calls, rateLimit, capacity, numTokens, defaultCost, delay, exchange;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        calls = [];
                        rateLimit = 100;
                        capacity = 0;
                        numTokens = 0;
                        defaultCost = 1;
                        delay = 0;
                        exchange = new ccxt.Exchange({

                            id: 'mock',
                            rateLimit: rateLimit,
                            enableRateLimit: true,
                            tokenBucket: { capacity: capacity, numTokens: numTokens, defaultCost: defaultCost, delay: delay },

                            ping: function () {
                                var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
                                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                                        args[_key] = arguments[_key];
                                    }

                                    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                                        while (1) {
                                            switch (_context3.prev = _context3.next) {
                                                case 0:
                                                    return _context3.abrupt('return', this.throttle().then(function () {
                                                        return exchange.pong.apply(exchange, _toConsumableArray(args));
                                                    }));

                                                case 1:
                                                case 'end':
                                                    return _context3.stop();
                                            }
                                        }
                                    }, _callee3, this);
                                }));

                                function ping() {
                                    return _ref4.apply(this, arguments);
                                }

                                return ping;
                            }(),
                            pong: function () {
                                var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
                                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                                        args[_key2] = arguments[_key2];
                                    }

                                    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                                        while (1) {
                                            switch (_context4.prev = _context4.next) {
                                                case 0:
                                                    calls.push({ when: Date.now(), path: args[0], args: args });
                                                case 1:
                                                case 'end':
                                                    return _context4.stop();
                                            }
                                        }
                                    }, _callee4, this);
                                }));

                                function pong() {
                                    return _ref5.apply(this, arguments);
                                }

                                return pong;
                            }()
                        });
                        _context5.next = 9;
                        return exchange.ping('foo');

                    case 9:
                        _context5.next = 11;
                        return exchange.ping('bar');

                    case 11:
                        _context5.next = 13;
                        return exchange.ping('baz');

                    case 13:
                        _context5.next = 15;
                        return _Promise.all([exchange.ping('qux'), exchange.ping('zap'), exchange.ping('lol')]);

                    case 15:

                        assert.deepEqual(calls.map(function (x) {
                            return x.path;
                        }), ['foo', 'bar', 'baz', 'qux', 'zap', 'lol']);

                        log(calls);
                        calls.reduce(function (prevTime, call) {
                            log('delta T:', call.when - prevTime);
                            assert(call.when - prevTime >= rateLimit - 1);
                            return call.when;
                        }, 0);

                    case 18:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, _this);
    })));

    it('getCurrencyUsedOnOpenOrders() works', function () {

        var calls = [];
        var rateLimit = 100;
        var exchange = new ccxt.Exchange({
            'orders': [{ status: 'open', symbol: 'ETH/BTC', side: 'sell', price: 200.0, amount: 21.0, remaining: 20.0 }, { status: 'open', symbol: 'ETH/BTC', side: 'buy', price: 200.0, amount: 22.0, remaining: 20.0 }, { status: 'open', symbol: 'ETH/BTC', side: 'sell', price: 200.0, amount: 23.0, remaining: 20.0 }, { status: 'closed', symbol: 'BTC/USD', side: 'sell', price: 10.0, amount: 11.0, remaining: 10.0 }, { status: 'open', symbol: 'BTC/USD', side: 'buy', price: 10.0, amount: 12.0, remaining: 10.0 }, { status: 'open', symbol: 'BTC/USD', side: 'sell', price: 10.0, amount: 13.0, remaining: 10.0 }],
            'markets': {
                'ETH/BTC': { id: 'ETH/BTC', symbol: 'ETH/BTC', base: 'ETH', quote: 'BTC' },
                'BTC/USD': { id: 'BTC/USD', symbol: 'BTC/USD', base: 'BTC', quote: 'USD' }
            }
        });

        assert.equal(exchange.getCurrencyUsedOnOpenOrders('LTC'), 0);
        assert.equal(exchange.getCurrencyUsedOnOpenOrders('ETH'), 40);
        assert.equal(exchange.getCurrencyUsedOnOpenOrders('USD'), 100);
        assert.equal(exchange.getCurrencyUsedOnOpenOrders('BTC'), 4010);
    });

    it.skip('exchange config extension works', function () {

        cost = { min: 0.001, max: 1000 };
        precision = { amount: 3 };
        var exchange = new ccxt.binance({
            'markets': {
                'ETH/BTC': { limits: { cost: cost }, precision: precision }
            }
        });

        assert.deepEqual(exchange.markets['ETH/BTC'].limits.cost, cost);
        assert.deepEqual(exchange.markets['ETH/BTC'].precision, { price: 6, amount: 3 });
        assert.deepEqual(exchange.markets['ETH/BTC'].symbol, 'ETH/BTC');
    });

    it('aggregate() works', function () {

        var bids = [[789.1, 123.0], [789.100, 123.0], [123.0, 456.0], [789.0, 123.0], [789.10, 123.0]];

        var asks = [[123.0, 456.0], [789.0, 123.0], [789.10, 123.0]];

        assert.deepEqual(ccxt.aggregate(bids.sort()), [[123.0, 456.0], [789.0, 123.0], [789.1, 369.0]]);

        assert.deepEqual(ccxt.aggregate(asks.sort()), [[123.0, 456.0], [789.0, 123.0], [789.10, 123.0]]);

        assert.deepEqual(ccxt.aggregate([]), []);
    });

    it('deepExtend() works', function () {

        var count = 0;

        var values = [{
            a: 1,
            b: 2,
            d: {
                a: 1,
                b: [],
                c: { test1: 123, test2: 321 } },
            f: 5,
            g: 123,
            i: 321,
            j: [1, 2]
        }, {
            b: 3,
            c: 5,
            d: {
                b: { first: 'one', second: 'two' },
                c: { test2: 222 } },
            e: { one: 1, two: 2 },
            f: [{ 'foo': 'bar' }],
            g: void 0,
            h: /abc/g,
            i: null,
            j: [3, 4]
        }];

        var extended = ccxt.deepExtend.apply(ccxt, values);
        assert.deepEqual({
            a: 1,
            b: 3,
            d: {
                a: 1,
                b: { first: 'one', second: 'two' },
                c: { test1: 123, test2: 222 }
            },
            f: [{ 'foo': 'bar' }],
            g: undefined,
            c: 5,
            e: { one: 1, two: 2 },
            h: /abc/g,
            i: null,
            j: [3, 4]
        }, extended);

        assert.deepEqual(ccxt.deepExtend(undefined, undefined, { 'foo': 'bar' }), { 'foo': 'bar' });
    });

    it('groupBy() works', function () {

        var array = [{ 'foo': 'a' }, { 'foo': 'b' }, { 'foo': 'c' }, { 'foo': 'b' }, { 'foo': 'c' }, { 'foo': 'c' }];

        assert.deepEqual(ccxt.groupBy(array, 'foo'), {
            'a': [{ 'foo': 'a' }],
            'b': [{ 'foo': 'b' }, { 'foo': 'b' }],
            'c': [{ 'foo': 'c' }, { 'foo': 'c' }, { 'foo': 'c' }]
        });
    });

    it('filterBy() works', function () {

        var array = [{ 'foo': 'a' }, { 'foo': undefined }, { 'foo': 'b' }, {}, { 'foo': 'a', 'bar': 'b' }, { 'foo': 'c' }, { 'foo': 'd' }, { 'foo': 'b' }, { 'foo': 'c' }, { 'foo': 'c' }];

        assert.deepEqual(ccxt.filterBy(array, 'foo', 'a'), [{ 'foo': 'a' }, { 'foo': 'a', 'bar': 'b' }]);
    });

    it('truncate() works', function () {

        assert.equal(ccxt.truncate(0, 0), 0);
        assert.equal(ccxt.truncate(-17.56, 2), -17.56);
        assert.equal(ccxt.truncate(17.56, 2), 17.56);
        assert.equal(ccxt.truncate(-17.569, 2), -17.56);
        assert.equal(ccxt.truncate(17.569, 2), 17.56);
        assert.equal(ccxt.truncate(49.9999, 4), 49.9999);
        assert.equal(ccxt.truncate(49.99999, 4), 49.9999);
        assert.equal(ccxt.truncate(1.670006528897705e-10, 4), 0);
    });

    it('parseBalance() works', function () {

        var exchange = new ccxt.Exchange({
            'markets': {
                'ETH/BTC': { 'id': 'ETH/BTC', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' }
            }
        });

        var input = {
            'ETH': { 'free': 10, 'used': 10, 'total': 20 },
            'ZEC': { 'free': 0, 'used': 0, 'total': 0 }
        };

        var expected = {
            'ETH': { 'free': 10, 'used': 10, 'total': 20 },
            'ZEC': { 'free': 0, 'used': 0, 'total': 0 },
            'free': {
                'ETH': 10,
                'ZEC': 0
            },
            'used': {
                'ETH': 10,
                'ZEC': 0
            },
            'total': {
                'ETH': 20,
                'ZEC': 0
            }
        };

        var actual = exchange.parseBalance(input);

        assert.deepEqual(actual, expected);
    });
});

/*  ------------------------------------------------------------------------ */