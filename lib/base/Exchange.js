"use strict";

//-----------------------------------------------------------------------------

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isNode = typeof window === 'undefined',
    functions = require('./functions'),
    throttle = require('./throttle'),
    fetch = require('fetch-ponyfill')().fetch,
    Market = require('./Market');

var deepExtend = functions.deepExtend,
    extend = functions.extend,
    sleep = functions.sleep,
    timeout = functions.timeout,
    flatten = functions.flatten,
    indexBy = functions.indexBy,
    sortBy = functions.sortBy,
    groupBy = functions.groupBy,
    aggregate = functions.aggregate,
    uuid = functions.uuid,
    precisionFromString = functions.precisionFromString;

var _require = require('./errors'),
    ExchangeError = _require.ExchangeError,
    NotSupported = _require.NotSupported,
    AuthenticationError = _require.AuthenticationError,
    DDoSProtection = _require.DDoSProtection,
    RequestTimeout = _require.RequestTimeout,
    ExchangeNotAvailable = _require.ExchangeNotAvailable;

// stub until we get a better solution for Webpack and React
// const journal = isNode && require ('./journal')


var journal = undefined;

module.exports = function () {
    (0, _createClass3.default)(Exchange, [{
        key: 'getMarket',
        value: function getMarket(symbol) {

            if (!this.marketClasses) this.marketClasses = {};

            var marketClass = this.marketClasses[symbol];

            if (marketClass) return marketClass;

            marketClass = new Market(this, symbol);
            this.marketClasses[symbol] = marketClass; // only one Market instance per market
            return marketClass;
        }
    }, {
        key: 'describe',
        value: function describe() {
            return {};
        }
    }]);

    function Exchange() {
        var _this = this;

        var userConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, Exchange);


        (0, _assign2.default)(this, functions, { encode: function encode(string) {
                return string;
            }, decode: function decode(string) {
                return string;
            } });

        if (isNode) this.nodeVersion = process.version.match(/\d+\.\d+.\d+/)[0];

        // this.initRestRateLimiter ()

        // if (isNode) {
        //     this.userAgent = {
        //         'User-Agent': 'ccxt/' + Exchange.ccxtVersion +
        //             ' (+https://github.com/ccxt/ccxt)' +
        //             ' Node.js/' + this.nodeVersion + ' (JavaScript)'
        //     }
        // }

        this.userAgents = {
            'chrome': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
            'chrome39': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36'
        };

        this.headers = {};

        // prepended to URL, like https://proxy.com/https://exchange.com/api...
        this.proxy = '';

        this.iso8601 = function (timestamp) {
            return new Date(timestamp).toISOString();
        };
        this.parse8601 = function (x) {
            return Date.parse(x.indexOf('+') >= 0 || x.slice(-1) == 'Z' ? x : x + 'Z');
        };
        this.milliseconds = Date.now;
        this.microseconds = function () {
            return Math.floor(_this.milliseconds() * 1000);
        };
        this.seconds = function () {
            return Math.floor(_this.milliseconds() / 1000);
        };
        this.id = undefined;

        // rate limiter settings
        this.enableRateLimit = false;
        this.rateLimit = 2000; // milliseconds = seconds * 1000

        this.parseJsonResponse = true; // whether a reply is required to be in JSON or not
        this.substituteCommonCurrencyCodes = true; // reserved
        this.parseBalanceFromOpenOrders = false; // some exchanges return balance updates from order API endpoints

        this.timeout = 10000; // milliseconds
        this.verbose = false;
        this.debug = false;
        this.journal = 'debug.json';
        this.userAgent = undefined;
        this.twofa = false; // two-factor authentication (2FA)
        this.timeframes = undefined;
        this.hasPublicAPI = true;
        this.hasPrivateAPI = true;
        this.hasCORS = false;
        this.hasDeposit = false;
        this.hasFetchBalance = true;
        this.hasFetchClosedOrders = false;
        this.hasFetchCurrencies = false;
        this.hasFetchMyTrades = false;
        this.hasFetchOHLCV = false;
        this.hasFetchOpenOrders = false;
        this.hasFetchOrder = false;
        this.hasFetchOrderBook = true;
        this.hasFetchOrders = false;
        this.hasFetchTicker = true;
        this.hasFetchTickers = false;
        this.hasFetchTrades = true;
        this.hasWithdraw = false;
        this.hasCreateOrder = this.hasPrivateAPI;
        this.hasCancelOrder = this.hasPrivateAPI;

        this.requiredCredentials = {
            'apiKey': true,
            'secret': true,
            'uid': false,
            'login': false,
            'password': false
        };

        this.balance = {};
        this.orderbooks = {};
        this.tickers = {};
        this.fees = {};
        this.orders = {};
        this.trades = {};
        this.currencies = {};

        this.last_http_response = undefined;
        this.last_json_response = undefined;

        this.arrayConcat = function (a, b) {
            return a.concat(b);
        };

        // TODO: generate
        this.market_id = this.marketId;
        this.market_ids = this.marketIds;
        this.array_concat = this.arrayConcat;
        this.implode_params = this.implodeParams;
        this.extract_params = this.extractParams;
        this.fetch_balance = this.fetchBalance;
        this.fetch_free_balance = this.fetchFreeBalance;
        this.fetch_used_balance = this.fetchUsedBalance;
        this.fetch_total_balance = this.fetchTotalBalance;
        this.fetch_l2_order_book = this.fetchL2OrderBook;
        this.fetch_order_book = this.fetchOrderBook;
        this.fetch_tickers = this.fetchTickers;
        this.fetch_ticker = this.fetchTicker;
        this.fetch_trades = this.fetchTrades;
        this.fetch_order = this.fetchOrder;
        this.fetch_orders = this.fetchOrders;
        this.fetch_open_orders = this.fetchOpenOrders;
        this.fetch_closed_orders = this.fetchClosedOrders;
        this.fetch_order_status = this.fetchOrderStatus;
        this.fetch_markets = this.fetchMarkets;
        this.load_markets = this.loadMarkets;
        this.set_markets = this.setMarkets;
        this.parse_balance = this.parseBalance;
        this.parse_bid_ask = this.parseBidAsk;
        this.parse_bids_asks = this.parseBidsAsks;
        this.parse_order_book = this.parseOrderBook;
        this.parse_trades = this.parseTrades;
        this.parse_orders = this.parseOrders;
        this.parse_ohlcv = this.parseOHLCV;
        this.parse_ohlcvs = this.parseOHLCVs;
        this.edit_limit_buy_order = this.editLimitBuyOrder;
        this.edit_limit_sell_order = this.editLimitSellOrder;
        this.edit_limit_order = this.editLimitOrder;
        this.edit_order = this.editOrder;
        this.create_limit_buy_order = this.createLimitBuyOrder;
        this.create_limit_sell_order = this.createLimitSellOrder;
        this.create_market_buy_order = this.createMarketBuyOrder;
        this.create_market_sell_order = this.createMarketSellOrder;
        this.create_order = this.createOrder;
        this.calculate_fee = this.calculateFee;
        this.common_currency_code = this.commonCurrencyCode;
        this.price_to_precision = this.priceToPrecision;
        this.amount_to_precision = this.amountToPrecision;
        this.fee_to_precision = this.feeToPrecision;
        this.cost_to_precision = this.costToPrecision;
        this.precisionFromString = precisionFromString;
        this.precision_from_string = precisionFromString;
        this.truncate = functions.truncate;
        this.uuid = uuid;

        // API methods metainfo
        this.has = {
            'cancelOrder': this.hasPrivateAPI,
            'createDepositAddress': false,
            'createOrder': this.hasPrivateAPI,
            'deposit': false,
            'fetchBalance': this.hasPrivateAPI,
            'fetchClosedOrders': false,
            'fetchCurrencies': false,
            'fetchDepositAddress': false,
            'fetchMarkets': true,
            'fetchMyTrades': false,
            'fetchOHLCV': false,
            'fetchOpenOrders': false,
            'fetchOrder': false,
            'fetchOrderBook': true,
            'fetchOrders': false,
            'fetchTicker': true,
            'fetchTickers': false,
            'fetchTrades': true,
            'withdraw': false

            // merge configs
        };var config = deepExtend(this.describe(), userConfig);

        // merge to this
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)((0, _entries2.default)(config)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ref = _step.value;

                var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

                var property = _ref2[0];
                var value = _ref2[1];

                this[property] = deepExtend(this[property], value);
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

        if (this.api) this.defineRestApi(this.api, 'request');

        this.initRestRateLimiter();

        if (this.markets) this.setMarkets(this.markets);

        if (this.debug && journal) {
            journal(function () {
                return _this.journal;
            }, this, (0, _keys2.default)(this.has));
        }
    }

    (0, _createClass3.default)(Exchange, [{
        key: 'defaults',
        value: function defaults() {
            return {/* override me */};
        }
    }, {
        key: 'nonce',
        value: function nonce() {
            return this.seconds();
        }
    }, {
        key: 'encodeURIComponent',
        value: function (_encodeURIComponent) {
            function encodeURIComponent() {
                return _encodeURIComponent.apply(this, arguments);
            }

            encodeURIComponent.toString = function () {
                return _encodeURIComponent.toString();
            };

            return encodeURIComponent;
        }(function () {
            return encodeURIComponent.apply(undefined, arguments);
        })
    }, {
        key: 'checkRequiredCredentials',
        value: function checkRequiredCredentials() {
            var _this2 = this;

            (0, _keys2.default)(this.requiredCredentials).map(function (key) {
                if (_this2.requiredCredentials[key] && !_this2[key]) throw new AuthenticationError(_this2.id + ' requires `' + key + '`');
            });
        }
    }, {
        key: 'initRestRateLimiter',
        value: function initRestRateLimiter() {

            this.tokenBucket = this.extend({
                refillRate: 1 / this.rateLimit,
                delay: 1,
                capacity: 1,
                defaultCost: 1,
                maxCapacity: 1000
            }, this.tokenBucket);

            this.throttle = throttle(this.tokenBucket);

            this.executeRestRequest = function (url) {
                var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';

                var _this3 = this;

                var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var body = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;


                var promise = fetch(url, { 'method': method, 'headers': headers, 'body': body, 'agent': this.tunnelAgent || null, timeout: this.timeout }).catch(function (e) {
                    if (isNode) throw new ExchangeNotAvailable([_this3.id, method, url, e.type, e.message].join(' '));
                    throw e; // rethrow all unknown errors
                }).then(function (response) {
                    return _this3.handleRestErrors(response, url, method, headers, body);
                }).then(function (response) {
                    return _this3.handleRestResponse(response, url, method, headers, body);
                });

                return timeout(this.timeout, promise).catch(function (e) {
                    if (e instanceof RequestTimeout) throw new RequestTimeout(_this3.id + ' ' + method + ' ' + url + ' ' + e.message + ' (' + _this3.timeout + ' ms)');
                    throw e;
                });
            };
        }
    }, {
        key: 'defineRestApi',
        value: function defineRestApi(api, methodName) {
            var _this4 = this;

            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var _loop = function _loop(type) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = (0, _getIterator3.default)((0, _keys2.default)(api[type])), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var httpMethod = _step3.value;


                        var urls = api[type][httpMethod];

                        var _loop2 = function _loop2(i) {
                            var url = urls[i].trim();
                            var splitPath = url.split(/[^a-zA-Z0-9]/);

                            var uppercaseMethod = httpMethod.toUpperCase();
                            var lowercaseMethod = httpMethod.toLowerCase();
                            var camelcaseMethod = _this4.capitalize(lowercaseMethod);
                            var camelcaseSuffix = splitPath.map(_this4.capitalize).join('');
                            var underscoreSuffix = splitPath.map(function (x) {
                                return x.trim().toLowerCase();
                            }).filter(function (x) {
                                return x.length > 0;
                            }).join('_');

                            if (camelcaseSuffix.indexOf(camelcaseMethod) === 0) camelcaseSuffix = camelcaseSuffix.slice(camelcaseMethod.length);

                            if (underscoreSuffix.indexOf(lowercaseMethod) === 0) underscoreSuffix = underscoreSuffix.slice(lowercaseMethod.length);

                            var camelcase = type + camelcaseMethod + _this4.capitalize(camelcaseSuffix);
                            var underscore = type + '_' + lowercaseMethod + '_' + underscoreSuffix;

                            if ('suffixes' in options) {
                                if ('camelcase' in options['suffixes']) camelcase += options['suffixes']['camelcase'];
                                if ('underscore' in options.suffixes) underscore += options['suffixes']['underscore'];
                            }

                            if ('underscore_suffix' in options) underscore += options.underscoreSuffix;
                            if ('camelcase_suffix' in options) camelcase += options.camelcaseSuffix;

                            var partial = function () {
                                var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(params) {
                                    return _regenerator2.default.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    return _context.abrupt('return', _this4[methodName](url, type, uppercaseMethod, params || {}));

                                                case 1:
                                                case 'end':
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, _this4);
                                }));

                                return function partial(_x6) {
                                    return _ref3.apply(this, arguments);
                                };
                            }();

                            _this4[camelcase] = partial;
                            _this4[underscore] = partial;
                        };

                        for (var i = 0; i < urls.length; i++) {
                            _loop2(i);
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            };

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {

                for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(api)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var type = _step2.value;

                    _loop(type);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: 'fetch',
        value: function fetch(url) {
            var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';
            var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var body = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;


            if (isNode && this.userAgent) {
                if (typeof this.userAgent == 'string') headers = extend({ 'User-Agent': this.userAgent }, headers);else if ((0, _typeof3.default)(this.userAgent) == 'object' && 'User-Agent' in this.userAgent) headers = extend(this.userAgent, headers);
            }

            if (typeof this.proxy == 'function') {

                url = this.proxy(url);
                if (isNode) headers = extend({ 'Origin': '*' }, headers);
            } else if (typeof this.proxy == 'string') {

                if (this.proxy.length) if (isNode) headers = extend({ 'Origin': '*' }, headers);

                url = this.proxy + url;
            }

            headers = extend(this.headers, headers);

            if (this.verbose) console.log(this.id, method, url, "\nRequest:\n", headers, body);

            return this.executeRestRequest(url, method, headers, body);
        }
    }, {
        key: 'fetch2',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var request;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!this.enableRateLimit) {
                                    _context2.next = 3;
                                    break;
                                }

                                _context2.next = 3;
                                return this.throttle();

                            case 3:
                                request = this.sign(path, api, method, params, headers, body);
                                return _context2.abrupt('return', this.fetch(request.url, request.method, request.headers, request.body));

                            case 5:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetch2(_x15) {
                return _ref4.apply(this, arguments);
            }

            return fetch2;
        }()
    }, {
        key: 'request',
        value: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            return this.fetch2(path, api, method, params, headers, body);
        }
    }, {
        key: 'handleErrors',
        value: function handleErrors(statusCode, statusText, url, method, headers, body) {
            // override me
        }
    }, {
        key: 'defaultErrorHandler',
        value: function defaultErrorHandler(code, reason, url, method, headers, body) {
            if (this.verbose) console.log(this.id, method, url, code, reason, body ? "\nResponse:\n" + body : '');
            if (code >= 200 && code <= 300) return body;
            var error = undefined;
            this.last_http_response = body;
            var details = body;
            var match = body.match(/\<title\>([^<]+)/i);
            if (match) details = match[1].trim();
            if ([418, 429].includes(code)) {
                error = DDoSProtection;
            } else if ([404, 409, 422, 500, 501, 502, 520, 521, 522, 525].includes(code)) {
                error = ExchangeNotAvailable;
            } else if ([400, 403, 405, 503, 530].includes(code)) {
                var ddosProtection = body.match(/cloudflare|incapsula/i);
                if (ddosProtection) {
                    error = DDoSProtection;
                } else {
                    error = ExchangeNotAvailable;
                    details += ' (possible reasons: ' + ['invalid API keys', 'bad or old nonce', 'exchange is down or offline', 'on maintenance', 'DDoS protection', 'rate-limiting'].join(', ') + ')';
                }
            } else if ([408, 504].includes(code)) {
                error = RequestTimeout;
            } else if ([401, 511].includes(code)) {
                error = AuthenticationError;
            } else {
                error = ExchangeError;
            }
            throw new error([this.id, method, url, code, reason, details].join(' '));
        }
    }, {
        key: 'handleRestErrors',
        value: function handleRestErrors(response, url) {
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';

            var _this5 = this;

            var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var body = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;


            if (typeof response == 'string') return response;

            return response.text().then(function (text) {

                var args = [response.status, response.statusText, url, method, headers, text];

                _this5.handleErrors.apply(_this5, args);
                return _this5.defaultErrorHandler.apply(_this5, args);
            });
        }
    }, {
        key: 'handleRestResponse',
        value: function handleRestResponse(response, url) {
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var body = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;


            try {

                this.last_http_response = response;
                if (this.parseJsonResponse) {
                    this.last_json_response = typeof response == 'string' && response.length > 1 ? JSON.parse(response) : response;
                    return this.last_json_response;
                }

                return response;
            } catch (e) {

                var maintenance = response.match(/offline|busy|retry|wait|unavailable|maintain|maintenance|maintenancing/i);
                var ddosProtection = response.match(/cloudflare|incapsula|overload/i);

                if (e instanceof SyntaxError) {

                    var error = ExchangeNotAvailable;
                    var details = 'not accessible from this location at the moment';
                    if (maintenance) details = 'offline, on maintenance or unreachable from this location at the moment';
                    if (ddosProtection) error = DDoSProtection;
                    throw new error([this.id, method, url, details].join(' '));
                }

                if (this.verbose) console.log(this.id, method, url, 'error', e, "response body:\n'" + response + "'");

                throw e;
            }
        }
    }, {
        key: 'setMarkets',
        value: function setMarkets(markets) {
            var _this6 = this;

            var currencies = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var values = (0, _values2.default)(markets).map(function (market) {
                return deepExtend({
                    'limits': _this6.limits,
                    'precision': _this6.precision
                }, _this6.fees['trading'], market);
            });
            this.markets = deepExtend(this.markets, indexBy(values, 'symbol'));
            this.marketsById = indexBy(markets, 'id');
            this.markets_by_id = this.marketsById;
            this.symbols = (0, _keys2.default)(this.markets).sort();
            this.ids = (0, _keys2.default)(this.markets_by_id).sort();
            if (currencies) {
                this.currencies = deepExtend(currencies, this.currencies);
            } else {
                var baseCurrencies = values.filter(function (market) {
                    return 'base' in market;
                }).map(function (market) {
                    return {
                        id: market.baseId || market.base,
                        code: market.base,
                        precision: market.precision ? market.precision.base || market.precision.amount : 8
                    };
                });
                var quoteCurrencies = values.filter(function (market) {
                    return 'quote' in market;
                }).map(function (market) {
                    return {
                        id: market.quoteId || market.quote,
                        code: market.quote,
                        precision: market.precision ? market.precision.quote || market.precision.price : 8
                    };
                });
                var allCurrencies = baseCurrencies.concat(quoteCurrencies);
                var groupedCurrencies = groupBy(allCurrencies, 'code');
                var _currencies = (0, _keys2.default)(groupedCurrencies).map(function (code) {
                    return groupedCurrencies[code].reduce(function (previous, current) {
                        return previous.precision > current.precision ? previous : current;
                    }, groupedCurrencies[code][0]);
                });
                var sortedCurrencies = sortBy(flatten(_currencies), 'code');
                this.currencies = deepExtend(indexBy(sortedCurrencies, 'code'), this.currencies);
            }
            return this.markets;
        }
    }, {
        key: 'loadMarkets',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var reload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                var markets, currencies;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!(!reload && this.markets)) {
                                    _context3.next = 4;
                                    break;
                                }

                                if (this.marketsById) {
                                    _context3.next = 3;
                                    break;
                                }

                                return _context3.abrupt('return', this.setMarkets(this.markets));

                            case 3:
                                return _context3.abrupt('return', this.markets);

                            case 4:
                                _context3.next = 6;
                                return this.fetchMarkets();

                            case 6:
                                markets = _context3.sent;
                                currencies = undefined;

                                if (!this.has.fetchCurrencies) {
                                    _context3.next = 12;
                                    break;
                                }

                                _context3.next = 11;
                                return this.fetchCurrencies();

                            case 11:
                                currencies = _context3.sent;

                            case 12:
                                return _context3.abrupt('return', this.setMarkets(markets, currencies));

                            case 13:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function loadMarkets() {
                return _ref5.apply(this, arguments);
            }

            return loadMarkets;
        }()
    }, {
        key: 'fetchTickers',
        value: function fetchTickers() {
            var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            throw new NotSupported(this.id + ' fetchTickers not supported yet');
        }
    }, {
        key: 'fetchOrder',
        value: function fetchOrder(id) {
            var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            throw new NotSupported(this.id + ' fetchOrder not supported yet');
        }
    }, {
        key: 'fetchOrders',
        value: function fetchOrders() {
            var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
            var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            throw new NotSupported(this.id + ' fetchOrders not supported yet');
        }
    }, {
        key: 'fetchOpenOrders',
        value: function fetchOpenOrders() {
            var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
            var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            throw new NotSupported(this.id + ' fetchOpenOrders not supported yet');
        }
    }, {
        key: 'fetchClosedOrders',
        value: function fetchClosedOrders() {
            var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
            var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            throw new NotSupported(this.id + ' fetchClosedOrders not supported yet');
        }
    }, {
        key: 'fetchMyTrades',
        value: function fetchMyTrades() {
            var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
            var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            throw new NotSupported(this.id + ' fetchMyTrades not supported yet');
        }
    }, {
        key: 'fetchCurrencies',
        value: function fetchCurrencies() {
            throw new NotSupported(this.id + ' fetchCurrencies not supported yet');
        }
    }, {
        key: 'fetchMarkets',
        value: function fetchMarkets() {
            var _this7 = this;

            return new _promise2.default(function (resolve, reject) {
                return resolve(_this7.markets);
            });
        }
    }, {
        key: 'fetchOrderStatus',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(id) {
                var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var order;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.fetchOrder(id);

                            case 2:
                                order = _context4.sent;
                                return _context4.abrupt('return', order['status']);

                            case 4:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchOrderStatus(_x50) {
                return _ref6.apply(this, arguments);
            }

            return fetchOrderStatus;
        }()
    }, {
        key: 'account',
        value: function account() {
            return {
                'free': 0.0,
                'used': 0.0,
                'total': 0.0
            };
        }
    }, {
        key: 'commonCurrencyCode',
        value: function commonCurrencyCode(currency) {
            if (!this.substituteCommonCurrencyCodes) return currency;
            if (currency == 'XBT') return 'BTC';
            if (currency == 'BCC') return 'BCH';
            if (currency == 'DRK') return 'DASH';
            return currency;
        }
    }, {
        key: 'currency',
        value: function currency(code) {

            if (typeof this.currencies == 'undefined') return new ExchangeError(this.id + ' currencies not loaded');

            if (typeof code === 'string' && code in this.currencies) return this.currencies[code];

            throw new ExchangeError(this.id + ' does not have currency code ' + code);
        }
    }, {
        key: 'market',
        value: function market(symbol) {

            if (typeof this.markets == 'undefined') return new ExchangeError(this.id + ' markets not loaded');

            if (typeof symbol === 'string' && symbol in this.markets) return this.markets[symbol];

            throw new ExchangeError(this.id + ' does not have market symbol ' + symbol);
        }
    }, {
        key: 'marketId',
        value: function marketId(symbol) {
            return this.market(symbol).id || symbol;
        }
    }, {
        key: 'marketIds',
        value: function marketIds(symbols) {
            var _this8 = this;

            return symbols.map(function (symbol) {
                return _this8.marketId(symbol);
            });
        }
    }, {
        key: 'symbol',
        value: function symbol(_symbol) {
            return this.market(_symbol).symbol || _symbol;
        }
    }, {
        key: 'extractParams',
        value: function extractParams(string) {
            var re = /{([a-zA-Z0-9_]+?)}/g;
            var matches = [];
            var match = void 0;
            while (match = re.exec(string)) {
                matches.push(match[1]);
            }return matches;
        }
    }, {
        key: 'implodeParams',
        value: function implodeParams(string, params) {
            for (var property in params) {
                string = string.replace('{' + property + '}', params[property]);
            }return string;
        }
    }, {
        key: 'url',
        value: function url(path) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var result = this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if ((0, _keys2.default)(query).length) result += '?' + this.urlencode(query);
            return result;
        }
    }, {
        key: 'parseBidAsk',
        value: function parseBidAsk(bidask) {
            var priceKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var amountKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

            var price = parseFloat(bidask[priceKey]);
            var amount = parseFloat(bidask[amountKey]);
            return [price, amount];
        }
    }, {
        key: 'parseBidsAsks',
        value: function parseBidsAsks(bidasks) {
            var _this9 = this;

            var priceKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var amountKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

            return (0, _values2.default)(bidasks || []).map(function (bidask) {
                return _this9.parseBidAsk(bidask, priceKey, amountKey);
            });
        }
    }, {
        key: 'fetchL2OrderBook',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var orderbook;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.fetchOrderBook(symbol, params);

                            case 2:
                                orderbook = _context5.sent;
                                return _context5.abrupt('return', extend(orderbook, {
                                    'bids': sortBy(aggregate(orderbook.bids), 0, true),
                                    'asks': sortBy(aggregate(orderbook.asks), 0)
                                }));

                            case 4:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchL2OrderBook(_x57) {
                return _ref7.apply(this, arguments);
            }

            return fetchL2OrderBook;
        }()
    }, {
        key: 'parseOrderBook',
        value: function parseOrderBook(orderbook) {
            var timestamp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var bidsKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'bids';
            var asksKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'asks';
            var priceKey = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
            var amountKey = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;

            timestamp = timestamp || this.milliseconds();
            return {
                'bids': bidsKey in orderbook ? this.parseBidsAsks(orderbook[bidsKey], priceKey, amountKey) : [],
                'asks': asksKey in orderbook ? this.parseBidsAsks(orderbook[asksKey], priceKey, amountKey) : [],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp)
            };
        }
    }, {
        key: 'getCurrencyUsedOnOpenOrders',
        value: function getCurrencyUsedOnOpenOrders(currency) {
            var _this10 = this;

            return (0, _values2.default)(this.orders).filter(function (order) {
                return order['status'] == 'open';
            }).reduce(function (total, order) {
                var symbol = order['symbol'];
                var market = _this10.markets[symbol];
                var amount = order['remaining'];
                if (currency == market['base'] && order['side'] == 'sell') {
                    return total + amount;
                } else if (currency == market['quote'] && order['side'] == 'buy') {
                    return total + (order['cost'] || order['price'] * amount);
                } else {
                    return total;
                }
            }, 0);
        }
    }, {
        key: 'parseBalance',
        value: function parseBalance(balance) {
            var _this11 = this;

            var currencies = (0, _keys2.default)(this.omit(balance, 'info'));

            currencies.forEach(function (currency) {

                if (typeof balance[currency].used == 'undefined') {

                    if (_this11.parseBalanceFromOpenOrders && 'open_orders' in balance['info']) {
                        var exchangeOrdersCount = balance['info']['open_orders'];
                        var cachedOrdersCount = (0, _values2.default)(_this11.orders).filter(function (order) {
                            return order['status'] == 'open';
                        }).length;
                        if (cachedOrdersCount == exchangeOrdersCount) {
                            balance[currency].used = _this11.getCurrencyUsedOnOpenOrders(currency);
                            balance[currency].total = balance[currency].used + balance[currency].free;
                        }
                    } else {
                        balance[currency].used = _this11.getCurrencyUsedOnOpenOrders(currency);
                        balance[currency].total = balance[currency].used + balance[currency].free;
                    }
                }

                ['free', 'used', 'total'].forEach(function (account) {
                    balance[account] = balance[account] || {};
                    balance[account][currency] = balance[currency][account];
                });
            });
            return balance;
        }
    }, {
        key: 'fetchPartialBalance',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(part) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var balance;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.fetchBalance(params);

                            case 2:
                                balance = _context6.sent;
                                return _context6.abrupt('return', balance[part]);

                            case 4:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchPartialBalance(_x64) {
                return _ref8.apply(this, arguments);
            }

            return fetchPartialBalance;
        }()
    }, {
        key: 'fetchFreeBalance',
        value: function fetchFreeBalance() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return this.fetchPartialBalance('free', params);
        }
    }, {
        key: 'fetchUsedBalance',
        value: function fetchUsedBalance() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return this.fetchPartialBalance('used', params);
        }
    }, {
        key: 'fetchTotalBalance',
        value: function fetchTotalBalance() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return this.fetchPartialBalance('total', params);
        }
    }, {
        key: 'filterBySinceLimit',
        value: function filterBySinceLimit(array) {
            var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

            if (since) array = array.filter(function (entry) {
                return entry.timestamp > since;
            });
            if (limit) array = array.slice(0, limit);
            return array;
        }
    }, {
        key: 'parseTrades',
        value: function parseTrades(trades) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var _this12 = this;

            var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

            var result = (0, _values2.default)(trades).map(function (trade) {
                return _this12.parseTrade(trade, market);
            });
            result = sortBy(result, 'timestamp', true);
            return this.filterBySinceLimit(result, since, limit);
        }
    }, {
        key: 'parseOrders',
        value: function parseOrders(orders) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var _this13 = this;

            var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

            var result = (0, _values2.default)(orders).map(function (order) {
                return _this13.parseOrder(order, market);
            });
            return this.filterBySinceLimit(result, since, limit);
        }
    }, {
        key: 'filterOrdersBySymbol',
        value: function filterOrdersBySymbol(orders) {
            var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var grouped = this.groupBy(orders, 'symbol');
            if (symbol) {
                if (symbol in grouped) return grouped[symbol];
                return [];
            }
            return orders;
        }
    }, {
        key: 'parseOHLCV',
        value: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1m';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return ohlcv;
        }
    }, {
        key: 'parseOHLCVs',
        value: function parseOHLCVs(ohlcvs) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1m';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            ohlcvs = (0, _values2.default)(ohlcvs);
            var result = [];
            for (var i = 0; i < ohlcvs.length; i++) {
                if (limit && result.length >= limit) break;
                var ohlcv = this.parseOHLCV(ohlcvs[i], market, timeframe, since, limit);
                if (since && ohlcv[0] < since) continue;
                result.push(ohlcv);
            }
            return result;
        }
    }, {
        key: 'editLimitBuyOrder',
        value: function editLimitBuyOrder(id, symbol) {
            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                args[_key - 2] = arguments[_key];
            }

            return this.editLimitOrder.apply(this, [id, symbol, 'buy'].concat(args));
        }
    }, {
        key: 'editLimitSellOrder',
        value: function editLimitSellOrder(id, symbol) {
            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                args[_key2 - 2] = arguments[_key2];
            }

            return this.editLimitOrder.apply(this, [id, symbol, 'sell'].concat(args));
        }
    }, {
        key: 'editLimitOrder',
        value: function editLimitOrder(id, symbol) {
            for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                args[_key3 - 2] = arguments[_key3];
            }

            return this.editOrder.apply(this, [id, symbol, 'limit'].concat(args));
        }
    }, {
        key: 'editOrder',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(id, symbol) {
                for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                    args[_key4 - 2] = arguments[_key4];
                }

                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                if (this.enableRateLimit) {
                                    _context7.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' editOrder() requires enableRateLimit = true');

                            case 2:
                                _context7.next = 4;
                                return this.cancelOrder(id, symbol);

                            case 4:
                                return _context7.abrupt('return', this.createOrder.apply(this, [symbol].concat((0, _toConsumableArray3.default)(args))));

                            case 5:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function editOrder(_x85, _x86) {
                return _ref9.apply(this, arguments);
            }

            return editOrder;
        }()
    }, {
        key: 'createLimitBuyOrder',
        value: function createLimitBuyOrder(symbol) {
            for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                args[_key5 - 1] = arguments[_key5];
            }

            return this.createOrder.apply(this, [symbol, 'limit', 'buy'].concat(args));
        }
    }, {
        key: 'createLimitSellOrder',
        value: function createLimitSellOrder(symbol) {
            for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
                args[_key6 - 1] = arguments[_key6];
            }

            return this.createOrder.apply(this, [symbol, 'limit', 'sell'].concat(args));
        }
    }, {
        key: 'createMarketBuyOrder',
        value: function createMarketBuyOrder(symbol, amount) {
            var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return this.createOrder(symbol, 'market', 'buy', amount, undefined, params);
        }
    }, {
        key: 'createMarketSellOrder',
        value: function createMarketSellOrder(symbol, amount) {
            var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return this.createOrder(symbol, 'market', 'sell', amount, undefined, params);
        }
    }, {
        key: 'costToPrecision',
        value: function costToPrecision(symbol, cost) {
            return parseFloat(cost).toFixed(this.markets[symbol].precision.price);
        }
    }, {
        key: 'priceToPrecision',
        value: function priceToPrecision(symbol, price) {
            return parseFloat(price).toFixed(this.markets[symbol].precision.price);
        }
    }, {
        key: 'amountToPrecision',
        value: function amountToPrecision(symbol, amount) {
            return this.truncate(amount, this.markets[symbol].precision.amount);
        }
    }, {
        key: 'amountToLots',
        value: function amountToLots(symbol, amount) {
            return this.amountToPrecision(symbol, Math.floor(amount / this.markets[symbol].lot) * this.markets[symbol].lot);
        }
    }, {
        key: 'feeToPrecision',
        value: function feeToPrecision(symbol, fee) {
            return parseFloat(fee).toFixed(this.markets[symbol].precision.price);
        }
    }, {
        key: 'calculateFee',
        value: function calculateFee(symbol, type, side, amount, price) {
            var takerOrMaker = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'taker';
            var params = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

            var market = this.markets[symbol];
            var rate = market[takerOrMaker];
            var cost = parseFloat(this.costToPrecision(symbol, amount * price));
            return {
                'type': takerOrMaker,
                'currency': market['quote'],
                'rate': rate,
                'cost': parseFloat(this.feeToPrecision(symbol, rate * cost))
            };
        }
    }, {
        key: 'Ymd',
        value: function Ymd(timestamp) {
            var infix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';

            var date = new Date(timestamp);
            var Y = date.getUTCFullYear();
            var m = date.getUTCMonth() + 1;
            var d = date.getUTCDate();
            m = m < 10 ? '0' + m : m;
            d = d < 10 ? '0' + d : d;
            return Y + '-' + m + '-' + d;
        }
    }, {
        key: 'YmdHMS',
        value: function YmdHMS(timestamp) {
            var infix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';

            var date = new Date(timestamp);
            var Y = date.getUTCFullYear();
            var m = date.getUTCMonth() + 1;
            var d = date.getUTCDate();
            var H = date.getUTCHours();
            var M = date.getUTCMinutes();
            var S = date.getUTCSeconds();
            m = m < 10 ? '0' + m : m;
            d = d < 10 ? '0' + d : d;
            H = H < 10 ? '0' + H : H;
            M = M < 10 ? '0' + M : M;
            S = S < 10 ? '0' + S : S;
            return Y + '-' + m + '-' + d + infix + H + ':' + M + ':' + S;
        }
    }]);
    return Exchange;
}();