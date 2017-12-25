"use strict";

// ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Exchange = require('./base/Exchange');

// ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(bl3p, _Exchange);

    function bl3p() {
        _classCallCheck(this, bl3p);

        return _possibleConstructorReturn(this, (bl3p.__proto__ || Object.getPrototypeOf(bl3p)).apply(this, arguments));
    }

    _createClass(bl3p, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(bl3p.prototype.__proto__ || Object.getPrototypeOf(bl3p.prototype), 'describe', this).call(this), {
                'id': 'bl3p',
                'name': 'BL3P',
                'countries': ['NL', 'EU'], // Netherlands, EU
                'rateLimit': 1000,
                'version': '1',
                'comment': 'An exchange market by BitonicNL',
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/28501752-60c21b82-6feb-11e7-818b-055ee6d0e754.jpg',
                    'api': 'https://api.bl3p.eu',
                    'www': ['https://bl3p.eu', 'https://bitonic.nl'],
                    'doc': ['https://github.com/BitonicNL/bl3p-api/tree/master/docs', 'https://bl3p.eu/api', 'https://bitonic.nl/en/api']
                },
                'api': {
                    'public': {
                        'get': ['{market}/ticker', '{market}/orderbook', '{market}/trades']
                    },
                    'private': {
                        'post': ['{market}/money/depth/full', '{market}/money/order/add', '{market}/money/order/cancel', '{market}/money/order/result', '{market}/money/orders', '{market}/money/orders/history', '{market}/money/trades/fetch', 'GENMKT/money/info', 'GENMKT/money/deposit_address', 'GENMKT/money/new_deposit_address', 'GENMKT/money/wallet/history', 'GENMKT/money/withdraw']
                    }
                },
                'markets': {
                    'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR', 'maker': 0.0025, 'taker': 0.0025 }
                    // 'LTC/EUR': { 'id': 'LTCEUR', 'symbol': 'LTC/EUR', 'base': 'LTC', 'quote': 'EUR' },
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, data, balance, result, currencies, i, currency, account;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privatePostGENMKTMoneyInfo();

                            case 2:
                                response = _context.sent;
                                data = response['data'];
                                balance = data['wallets'];
                                result = { 'info': data };
                                currencies = Object.keys(this.currencies);

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    account = this.account();

                                    if (currency in balance) {
                                        if ('available' in balance[currency]) {
                                            account['free'] = parseFloat(balance[currency]['available']['value']);
                                        }
                                    }
                                    if (currency in balance) {
                                        if ('balance' in balance[currency]) {
                                            account['total'] = parseFloat(balance[currency]['balance']['value']);
                                        }
                                    }
                                    if (account['total']) {
                                        if (account['free']) {
                                            account['used'] = account['total'] - account['free'];
                                        }
                                    }
                                    result[currency] = account;
                                }
                                return _context.abrupt('return', this.parseBalance(result));

                            case 9:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function fetchBalance() {
                return _ref.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'parseBidAsk',
        value: function parseBidAsk(bidask) {
            var priceKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var amountKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            return [bidask['price_int'] / 100000.0, bidask['amount_int'] / 100000000.0];
        }
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, response, orderbook;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                market = this.market(symbol);
                                _context2.next = 3;
                                return this.publicGetMarketOrderbook(this.extend({
                                    'market': market['id']
                                }, params));

                            case 3:
                                response = _context2.sent;
                                orderbook = response['data'];
                                return _context2.abrupt('return', this.parseOrderBook(orderbook));

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchOrderBook(_x5) {
                return _ref2.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var ticker, timestamp;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.publicGetMarketTicker(this.extend({
                                    'market': this.marketId(symbol)
                                }, params));

                            case 2:
                                ticker = _context3.sent;
                                timestamp = ticker['timestamp'] * 1000;
                                return _context3.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': parseFloat(ticker['high']),
                                    'low': parseFloat(ticker['low']),
                                    'bid': parseFloat(ticker['bid']),
                                    'ask': parseFloat(ticker['ask']),
                                    'vwap': undefined,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': parseFloat(ticker['last']),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': parseFloat(ticker['volume']['24h']),
                                    'quoteVolume': undefined,
                                    'info': ticker
                                });

                            case 5:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchTicker(_x7) {
                return _ref3.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            return {
                'id': trade['trade_id'],
                'info': trade,
                'timestamp': trade['date'],
                'datetime': this.iso8601(trade['date']),
                'symbol': market['symbol'],
                'type': undefined,
                'side': undefined,
                'price': trade['price_int'] / 100000.0,
                'amount': trade['amount_int'] / 100000000.0
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response, result;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                market = this.market(symbol);
                                _context4.next = 3;
                                return this.publicGetMarketTrades(this.extend({
                                    'market': market['id']
                                }, params));

                            case 3:
                                response = _context4.sent;
                                result = this.parseTrades(response['data']['trades'], market, since, limit);
                                return _context4.abrupt('return', result);

                            case 6:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTrades(_x11) {
                return _ref4.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, order, response;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                market = this.market(symbol);
                                order = {
                                    'market': market['id'],
                                    'amount_int': amount,
                                    'fee_currency': market['quote'],
                                    'type': side == 'buy' ? 'bid' : 'ask'
                                };

                                if (type == 'limit') order['price_int'] = price;
                                _context5.next = 5;
                                return this.privatePostMarketMoneyOrderAdd(this.extend(order, params));

                            case 5:
                                response = _context5.sent;
                                return _context5.abrupt('return', {
                                    'info': response,
                                    'id': response['order_id'].toString()
                                });

                            case 7:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function createOrder(_x14, _x15, _x16, _x17) {
                return _ref5.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.privatePostMarketMoneyOrderCancel({ 'order_id': id });

                            case 2:
                                return _context6.abrupt('return', _context6.sent);

                            case 3:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function cancelOrder(_x20) {
                return _ref6.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var request = this.implodeParams(path, params);
            var url = this.urls['api'] + '/' + this.version + '/' + request;
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                body = this.urlencode(this.extend({ 'nonce': nonce }, query));
                var secret = this.base64ToBinary(this.secret);
                var auth = request + "\0" + body;
                var signature = this.hmac(this.encode(auth), secret, 'sha512', 'base64');
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Rest-Key': this.apiKey,
                    'Rest-Sign': signature
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }]);

    return bl3p;
}(Exchange);