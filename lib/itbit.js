"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(itbit, _Exchange);

    function itbit() {
        _classCallCheck(this, itbit);

        return _possibleConstructorReturn(this, (itbit.__proto__ || _Object$getPrototypeOf(itbit)).apply(this, arguments));
    }

    _createClass(itbit, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(itbit.prototype.__proto__ || _Object$getPrototypeOf(itbit.prototype), 'describe', this).call(this), {
                'id': 'itbit',
                'name': 'itBit',
                'countries': 'US',
                'rateLimit': 2000,
                'version': 'v1',
                'hasCORS': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27822159-66153620-60ad-11e7-89e7-005f6d7f3de0.jpg',
                    'api': 'https://api.itbit.com',
                    'www': 'https://www.itbit.com',
                    'doc': ['https://api.itbit.com/docs', 'https://www.itbit.com/api']
                },
                'api': {
                    'public': {
                        'get': ['markets/{symbol}/ticker', 'markets/{symbol}/order_book', 'markets/{symbol}/trades']
                    },
                    'private': {
                        'get': ['wallets', 'wallets/{walletId}', 'wallets/{walletId}/balances/{currencyCode}', 'wallets/{walletId}/funding_history', 'wallets/{walletId}/trades', 'wallets/{walletId}/orders/{id}'],
                        'post': ['wallet_transfers', 'wallets', 'wallets/{walletId}/cryptocurrency_deposits', 'wallets/{walletId}/cryptocurrency_withdrawals', 'wallets/{walletId}/orders', 'wire_withdrawal'],
                        'delete': ['wallets/{walletId}/orders/{id}']
                    }
                },
                'markets': {
                    'BTC/USD': { 'id': 'XBTUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
                    'BTC/SGD': { 'id': 'XBTSGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' },
                    'BTC/EUR': { 'id': 'XBTEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' }
                },
                'fees': {
                    'trading': {
                        'maker': 0,
                        'taker': 0.2 / 100
                    }
                }
            });
        }
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var orderbook;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetMarketsSymbolOrderBook(this.extend({
                                    'symbol': this.marketId(symbol)
                                }, params));

                            case 2:
                                orderbook = _context.sent;
                                return _context.abrupt('return', this.parseOrderBook(orderbook));

                            case 4:
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
        key: 'fetchTicker',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var ticker, serverTimeUTC, timestamp, vwap, baseVolume, quoteVolume;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetMarketsSymbolTicker(this.extend({
                                    'symbol': this.marketId(symbol)
                                }, params));

                            case 2:
                                ticker = _context2.sent;
                                serverTimeUTC = 'serverTimeUTC' in ticker;

                                if (serverTimeUTC) {
                                    _context2.next = 6;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' fetchTicker returned a bad response: ' + this.json(ticker));

                            case 6:
                                timestamp = this.parse8601(ticker['serverTimeUTC']);
                                vwap = parseFloat(ticker['vwap24h']);
                                baseVolume = parseFloat(ticker['volume24h']);
                                quoteVolume = baseVolume * vwap;
                                return _context2.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': parseFloat(ticker['high24h']),
                                    'low': parseFloat(ticker['low24h']),
                                    'bid': this.safeFloat(ticker, 'bid'),
                                    'ask': this.safeFloat(ticker, 'ask'),
                                    'vwap': vwap,
                                    'open': parseFloat(ticker['openToday']),
                                    'close': undefined,
                                    'first': undefined,
                                    'last': parseFloat(ticker['lastPrice']),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': baseVolume,
                                    'quoteVolume': quoteVolume,
                                    'info': ticker
                                });

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchTicker(_x4) {
                return _ref2.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = this.parse8601(trade['timestamp']);
            var id = trade['matchNumber'].toString();
            return {
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'id': id,
                'order': id,
                'type': undefined,
                'side': undefined,
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['amount'])
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                market = this.market(symbol);
                                _context3.next = 3;
                                return this.publicGetMarketsSymbolTrades(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 3:
                                response = _context3.sent;
                                return _context3.abrupt('return', this.parseTrades(response['recentTrades'], market, since, limit));

                            case 5:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchTrades(_x8) {
                return _ref3.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, b, balance, currency, account;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.privateGetBalances();

                            case 2:
                                response = _context4.sent;
                                balances = response['balances'];
                                result = { 'info': response };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    currency = balance['currency'];
                                    account = {
                                        'free': parseFloat(balance['availableBalance']),
                                        'used': 0.0,
                                        'total': parseFloat(balance['totalBalance'])
                                    };

                                    account['used'] = account['total'] - account['free'];
                                    result[currency] = account;
                                }
                                return _context4.abrupt('return', this.parseBalance(result));

                            case 7:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchBalance() {
                return _ref4.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'fetchWallets',
        value: function fetchWallets() {
            return this.privateGetWallets();
        }
    }, {
        key: 'nonce',
        value: function nonce() {
            return this.milliseconds();
        }
    }, {
        key: 'createOrder',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var walletIdInParams, market, order, response;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!(type == 'market')) {
                                    _context5.next = 2;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' allows limit orders only');

                            case 2:
                                walletIdInParams = 'walletId' in params;

                                if (walletIdInParams) {
                                    _context5.next = 5;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' createOrder requires a walletId parameter');

                            case 5:
                                amount = amount.toString();
                                price = price.toString();
                                market = this.market(symbol);
                                order = {
                                    'side': side,
                                    'type': type,
                                    'currency': market['base'],
                                    'amount': amount,
                                    'display': amount,
                                    'price': price,
                                    'instrument': market['id']
                                };
                                _context5.next = 11;
                                return this.privatePostTradeAdd(this.extend(order, params));

                            case 11:
                                response = _context5.sent;
                                return _context5.abrupt('return', {
                                    'info': response,
                                    'id': response['id']
                                });

                            case 13:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function createOrder(_x12, _x13, _x14, _x15) {
                return _ref5.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var walletIdInParams;
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                walletIdInParams = 'walletId' in params;

                                if (walletIdInParams) {
                                    _context6.next = 3;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' cancelOrder requires a walletId parameter');

                            case 3:
                                _context6.next = 5;
                                return this.privateDeleteWalletsWalletIdOrdersId(this.extend({
                                    'id': id
                                }, params));

                            case 5:
                                return _context6.abrupt('return', _context6.sent);

                            case 6:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function cancelOrder(_x18) {
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

            var url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if (_Object$keys(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                if (_Object$keys(query).length) body = this.json(query);else body = '';
                var nonce = this.nonce().toString();
                var timestamp = nonce;
                var auth = [method, url, body, nonce, timestamp];
                var message = nonce + this.json(auth);
                var hash = this.hash(this.encode(message), 'sha256', 'binary');
                var binhash = this.binaryConcat(url, hash);
                var signature = this.hmac(binhash, this.encode(this.secret), 'sha512', 'base64');
                headers = {
                    'Authorization': self.apiKey + ':' + signature,
                    'Content-Type': 'application/json',
                    'X-Auth-Timestamp': timestamp,
                    'X-Auth-Nonce': nonce
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context7.sent;

                                if (!('code' in response)) {
                                    _context7.next = 5;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 5:
                                return _context7.abrupt('return', response);

                            case 6:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function request(_x29) {
                return _ref7.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return itbit;
}(Exchange);