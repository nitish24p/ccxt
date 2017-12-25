"use strict";

//  ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(coinmarketcap, _Exchange);

    function coinmarketcap() {
        _classCallCheck(this, coinmarketcap);

        return _possibleConstructorReturn(this, (coinmarketcap.__proto__ || Object.getPrototypeOf(coinmarketcap)).apply(this, arguments));
    }

    _createClass(coinmarketcap, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(coinmarketcap.prototype.__proto__ || Object.getPrototypeOf(coinmarketcap.prototype), 'describe', this).call(this), {
                'id': 'coinmarketcap',
                'name': 'CoinMarketCap',
                'rateLimit': 10000,
                'version': 'v1',
                'countries': 'US',
                'hasCORS': true,
                'hasPrivateAPI': false,
                'hasCreateOrder': false,
                'hasCancelOrder': false,
                'hasFetchBalance': false,
                'hasFetchOrderBook': false,
                'hasFetchTrades': false,
                'hasFetchTickers': true,
                'hasFetchCurrencies': true,
                'has': {
                    'fetchCurrencies': true
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/28244244-9be6312a-69ed-11e7-99c1-7c1797275265.jpg',
                    'api': 'https://api.coinmarketcap.com',
                    'www': 'https://coinmarketcap.com',
                    'doc': 'https://coinmarketcap.com/api'
                },
                'requiredCredentials': {
                    'apiKey': false,
                    'secret': false
                },
                'api': {
                    'public': {
                        'get': ['ticker/', 'ticker/{id}/', 'global/']
                    }
                },
                'currencyCodes': ['AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'HKD', 'IDR', 'INR', 'JPY', 'KRW', 'MXN', 'RUB', 'USD']
            });
        }
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                throw new ExchangeError('Fetching order books is not supported by the API of ' + this.id);

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function fetchOrderBook(_x2) {
                return _ref.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var markets, result, p, market, currencies, i, quote, quoteId, base, baseId, symbol, id;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetTicker({
                                    'limit': 0
                                });

                            case 2:
                                markets = _context2.sent;
                                result = [];

                                for (p = 0; p < markets.length; p++) {
                                    market = markets[p];
                                    currencies = this.currencyCodes;

                                    for (i = 0; i < currencies.length; i++) {
                                        quote = currencies[i];
                                        quoteId = quote.toLowerCase();
                                        base = market['symbol'];
                                        baseId = market['id'];
                                        symbol = base + '/' + quote;
                                        id = baseId + '/' + quote;

                                        result.push({
                                            'id': id,
                                            'symbol': symbol,
                                            'base': base,
                                            'quote': quote,
                                            'baseId': baseId,
                                            'quoteId': quoteId,
                                            'info': market
                                        });
                                    }
                                }
                                return _context2.abrupt('return', result);

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchMarkets() {
                return _ref2.apply(this, arguments);
            }

            return fetchMarkets;
        }()
    }, {
        key: 'fetchGlobal',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var currency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'USD';
                var request;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {};

                                if (currency) request['convert'] = currency;
                                _context3.next = 6;
                                return this.publicGetGlobal(request);

                            case 6:
                                return _context3.abrupt('return', _context3.sent);

                            case 7:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchGlobal() {
                return _ref3.apply(this, arguments);
            }

            return fetchGlobal;
        }()
    }, {
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.milliseconds();
            if ('last_updated' in ticker) if (ticker['last_updated']) timestamp = parseInt(ticker['last_updated']) * 1000;
            var change = undefined;
            if ('percent_change_24h' in ticker) if (ticker['percent_change_24h']) change = this.safeFloat(ticker, 'percent_change_24h');
            var last = undefined;
            var symbol = undefined;
            var volume = undefined;
            if (market) {
                var priceKey = 'price_' + market['quoteId'];
                if (priceKey in ticker) if (ticker[priceKey]) last = this.safeFloat(ticker, priceKey);
                symbol = market['symbol'];
                var volumeKey = '24h_volume_' + market['quoteId'];
                if (volumeKey in ticker) if (ticker[volumeKey]) volume = this.safeFloat(ticker, volumeKey);
            }
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': undefined,
                'ask': undefined,
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': last,
                'change': change,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': volume,
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var currency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'USD';
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var request, response, tickers, t, ticker, id, symbol, market;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {
                                    'limit': 10000
                                };

                                if (currency) request['convert'] = currency;
                                _context4.next = 6;
                                return this.publicGetTicker(this.extend(request, params));

                            case 6:
                                response = _context4.sent;
                                tickers = {};

                                for (t = 0; t < response.length; t++) {
                                    ticker = response[t];
                                    id = ticker['id'] + '/' + currency;
                                    symbol = id;
                                    market = undefined;

                                    if (id in this.markets_by_id) {
                                        market = this.markets_by_id[id];
                                        symbol = market['symbol'];
                                    }
                                    tickers[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context4.abrupt('return', tickers);

                            case 10:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTickers() {
                return _ref4.apply(this, arguments);
            }

            return fetchTickers;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, request, response, ticker;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = this.extend({
                                    'convert': market['quote'],
                                    'id': market['baseId']
                                }, params);
                                _context5.next = 6;
                                return this.publicGetTickerId(request);

                            case 6:
                                response = _context5.sent;
                                ticker = response[0];
                                return _context5.abrupt('return', this.parseTicker(ticker, market));

                            case 9:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTicker(_x8) {
                return _ref5.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'fetchCurrencies',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var currencies, result, i, currency, id, precision, code;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.publicGetTicker(this.extend({
                                    'limit': 0
                                }, params));

                            case 2:
                                currencies = _context6.sent;
                                result = {};

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    id = currency['symbol'];
                                    // todo: will need to rethink the fees
                                    // to add support for multiple withdrawal/deposit methods and
                                    // differentiated fees for each particular method

                                    precision = 8; // default precision, todo: fix "magic constants"

                                    code = this.commonCurrencyCode(id);

                                    result[code] = {
                                        'id': id,
                                        'code': code,
                                        'info': currency,
                                        'name': currency['name'],
                                        'active': true,
                                        'status': 'ok',
                                        'fee': undefined, // todo: redesign
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': Math.pow(10, -precision),
                                                'max': Math.pow(10, precision)
                                            },
                                            'price': {
                                                'min': Math.pow(10, -precision),
                                                'max': Math.pow(10, precision)
                                            },
                                            'cost': {
                                                'min': undefined,
                                                'max': undefined
                                            },
                                            'withdraw': {
                                                'min': undefined,
                                                'max': undefined
                                            }
                                        }
                                    };
                                }
                                return _context6.abrupt('return', result);

                            case 6:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchCurrencies() {
                return _ref6.apply(this, arguments);
            }

            return fetchCurrencies;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (Object.keys(query).length) url += '?' + this.urlencode(query);
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context7.sent;

                                if (!('error' in response)) {
                                    _context7.next = 6;
                                    break;
                                }

                                if (!response['error']) {
                                    _context7.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 6:
                                return _context7.abrupt('return', response);

                            case 7:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function request(_x20) {
                return _ref7.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return coinmarketcap;
}(Exchange);