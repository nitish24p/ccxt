"use strict";

//  ---------------------------------------------------------------------------

import _regeneratorRuntime from 'babel-runtime/regenerator';
import _Object$keys from 'babel-runtime/core-js/object/keys';
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
    _inherits(bitbay, _Exchange);

    function bitbay() {
        _classCallCheck(this, bitbay);

        return _possibleConstructorReturn(this, (bitbay.__proto__ || _Object$getPrototypeOf(bitbay)).apply(this, arguments));
    }

    _createClass(bitbay, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(bitbay.prototype.__proto__ || _Object$getPrototypeOf(bitbay.prototype), 'describe', this).call(this), {
                'id': 'bitbay',
                'name': 'BitBay',
                'countries': ['PL', 'EU'], // Poland
                'rateLimit': 1000,
                'hasCORS': true,
                'hasWithdraw': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766132-978a7bd8-5ece-11e7-9540-bc96d1e9bbb8.jpg',
                    'www': 'https://bitbay.net',
                    'api': {
                        'public': 'https://bitbay.net/API/Public',
                        'private': 'https://bitbay.net/API/Trading/tradingApi.php'
                    },
                    'doc': ['https://bitbay.net/public-api', 'https://bitbay.net/account/tab-api', 'https://github.com/BitBayNet/API']
                },
                'api': {
                    'public': {
                        'get': ['{id}/all', '{id}/market', '{id}/orderbook', '{id}/ticker', '{id}/trades']
                    },
                    'private': {
                        'post': ['info', 'trade', 'cancel', 'orderbook', 'orders', 'transfer', 'withdraw', 'history', 'transactions']
                    }
                },
                'markets': {
                    'BTC/USD': { 'id': 'BTCUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'baseId': 'BTC', 'quoteId': 'USD' },
                    'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR', 'baseId': 'BTC', 'quoteId': 'EUR' },
                    'BTC/PLN': { 'id': 'BTCPLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN', 'baseId': 'BTC', 'quoteId': 'PLN' },
                    'LTC/USD': { 'id': 'LTCUSD', 'symbol': 'LTC/USD', 'base': 'LTC', 'quote': 'USD', 'baseId': 'LTC', 'quoteId': 'USD' },
                    'LTC/EUR': { 'id': 'LTCEUR', 'symbol': 'LTC/EUR', 'base': 'LTC', 'quote': 'EUR', 'baseId': 'LTC', 'quoteId': 'EUR' },
                    'LTC/PLN': { 'id': 'LTCPLN', 'symbol': 'LTC/PLN', 'base': 'LTC', 'quote': 'PLN', 'baseId': 'LTC', 'quoteId': 'PLN' },
                    'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'baseId': 'LTC', 'quoteId': 'BTC' },
                    'ETH/USD': { 'id': 'ETHUSD', 'symbol': 'ETH/USD', 'base': 'ETH', 'quote': 'USD', 'baseId': 'ETH', 'quoteId': 'USD' },
                    'ETH/EUR': { 'id': 'ETHEUR', 'symbol': 'ETH/EUR', 'base': 'ETH', 'quote': 'EUR', 'baseId': 'ETH', 'quoteId': 'EUR' },
                    'ETH/PLN': { 'id': 'ETHPLN', 'symbol': 'ETH/PLN', 'base': 'ETH', 'quote': 'PLN', 'baseId': 'ETH', 'quoteId': 'PLN' },
                    'ETH/BTC': { 'id': 'ETHBTC', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'baseId': 'ETH', 'quoteId': 'BTC' },
                    'LSK/USD': { 'id': 'LSKUSD', 'symbol': 'LSK/USD', 'base': 'LSK', 'quote': 'USD', 'baseId': 'LSK', 'quoteId': 'USD' },
                    'LSK/EUR': { 'id': 'LSKEUR', 'symbol': 'LSK/EUR', 'base': 'LSK', 'quote': 'EUR', 'baseId': 'LSK', 'quoteId': 'EUR' },
                    'LSK/PLN': { 'id': 'LSKPLN', 'symbol': 'LSK/PLN', 'base': 'LSK', 'quote': 'PLN', 'baseId': 'LSK', 'quoteId': 'PLN' },
                    'LSK/BTC': { 'id': 'LSKBTC', 'symbol': 'LSK/BTC', 'base': 'LSK', 'quote': 'BTC', 'baseId': 'LSK', 'quoteId': 'BTC' },
                    'BCH/USD': { 'id': 'BCCUSD', 'symbol': 'BCH/USD', 'base': 'BCH', 'quote': 'USD', 'baseId': 'BCC', 'quoteId': 'USD' },
                    'BCH/EUR': { 'id': 'BCCEUR', 'symbol': 'BCH/EUR', 'base': 'BCH', 'quote': 'EUR', 'baseId': 'BCC', 'quoteId': 'EUR' },
                    'BCH/PLN': { 'id': 'BCCPLN', 'symbol': 'BCH/PLN', 'base': 'BCH', 'quote': 'PLN', 'baseId': 'BCC', 'quoteId': 'PLN' },
                    'BCH/BTC': { 'id': 'BCCBTC', 'symbol': 'BCH/BTC', 'base': 'BCH', 'quote': 'BTC', 'baseId': 'BCC', 'quoteId': 'BTC' },
                    'BTG/USD': { 'id': 'BTGUSD', 'symbol': 'BTG/USD', 'base': 'BTG', 'quote': 'USD', 'baseId': 'BTG', 'quoteId': 'USD' },
                    'BTG/EUR': { 'id': 'BTGEUR', 'symbol': 'BTG/EUR', 'base': 'BTG', 'quote': 'EUR', 'baseId': 'BTG', 'quoteId': 'EUR' },
                    'BTG/PLN': { 'id': 'BTGPLN', 'symbol': 'BTG/PLN', 'base': 'BTG', 'quote': 'PLN', 'baseId': 'BTG', 'quoteId': 'PLN' },
                    'BTG/BTC': { 'id': 'BTGBTC', 'symbol': 'BTG/BTC', 'base': 'BTG', 'quote': 'BTC', 'baseId': 'BTG', 'quoteId': 'BTC' },
                    'DASH/USD': { 'id': 'DASHUSD', 'symbol': 'DASH/USD', 'base': 'DASH', 'quote': 'USD', 'baseId': 'DASH', 'quoteId': 'USD' },
                    'DASH/EUR': { 'id': 'DASHEUR', 'symbol': 'DASH/EUR', 'base': 'DASH', 'quote': 'EUR', 'baseId': 'DASH', 'quoteId': 'EUR' },
                    'DASH/PLN': { 'id': 'DASHPLN', 'symbol': 'DASH/PLN', 'base': 'DASH', 'quote': 'PLN', 'baseId': 'DASH', 'quoteId': 'PLN' },
                    'DASH/BTC': { 'id': 'DASHBTC', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC', 'baseId': 'DASH', 'quoteId': 'BTC' },
                    'GAME/USD': { 'id': 'GAMEUSD', 'symbol': 'GAME/USD', 'base': 'GAME', 'quote': 'USD', 'baseId': 'GAME', 'quoteId': 'USD' },
                    'GAME/EUR': { 'id': 'GAMEEUR', 'symbol': 'GAME/EUR', 'base': 'GAME', 'quote': 'EUR', 'baseId': 'GAME', 'quoteId': 'EUR' },
                    'GAME/PLN': { 'id': 'GAMEPLN', 'symbol': 'GAME/PLN', 'base': 'GAME', 'quote': 'PLN', 'baseId': 'GAME', 'quoteId': 'PLN' },
                    'GAME/BTC': { 'id': 'GAMEBTC', 'symbol': 'GAME/BTC', 'base': 'GAME', 'quote': 'BTC', 'baseId': 'GAME', 'quoteId': 'BTC' }
                },
                'fees': {
                    'trading': {
                        'maker': 0.3 / 100,
                        'taker': 0.0043
                    }
                }
            });
        }
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balance, result, codes, i, code, currency, id, account;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.privatePostInfo();

                            case 2:
                                response = _context.sent;

                                if (!('balances' in response)) {
                                    _context.next = 9;
                                    break;
                                }

                                balance = response['balances'];
                                result = { 'info': balance };
                                codes = _Object$keys(this.currencies);

                                for (i = 0; i < codes.length; i++) {
                                    code = codes[i];
                                    currency = this.currencies[code];
                                    id = currency['id'];
                                    account = this.account();

                                    if (id in balance) {
                                        account['free'] = parseFloat(balance[id]['available']);
                                        account['used'] = parseFloat(balance[id]['locked']);
                                        account['total'] = this.sum(account['free'], account['used']);
                                    }
                                    result[code] = account;
                                }
                                return _context.abrupt('return', this.parseBalance(result));

                            case 9:
                                throw new ExchangeError(this.id + ' empty balance response ' + this.json(response));

                            case 10:
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
        key: 'fetchOrderBook',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var orderbook;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetIdOrderbook(this.extend({
                                    'id': this.marketId(symbol)
                                }, params));

                            case 2:
                                orderbook = _context2.sent;
                                return _context2.abrupt('return', this.parseOrderBook(orderbook));

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchOrderBook(_x3) {
                return _ref2.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var ticker, timestamp, baseVolume, vwap, quoteVolume;
                return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.publicGetIdTicker(this.extend({
                                    'id': this.marketId(symbol)
                                }, params));

                            case 2:
                                ticker = _context3.sent;
                                timestamp = this.milliseconds();
                                baseVolume = this.safeFloat(ticker, 'volume');
                                vwap = this.safeFloat(ticker, 'vwap');
                                quoteVolume = baseVolume * vwap;
                                return _context3.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': this.safeFloat(ticker, 'max'),
                                    'low': this.safeFloat(ticker, 'min'),
                                    'bid': this.safeFloat(ticker, 'bid'),
                                    'ask': this.safeFloat(ticker, 'ask'),
                                    'vwap': vwap,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': this.safeFloat(ticker, 'last'),
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': this.safeFloat(ticker, 'average'),
                                    'baseVolume': baseVolume,
                                    'quoteVolume': quoteVolume,
                                    'info': ticker
                                });

                            case 8:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchTicker(_x5) {
                return _ref3.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = trade['date'] * 1000;
            return {
                'id': trade['tid'],
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['type'],
                'price': trade['price'],
                'amount': trade['amount']
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                market = this.market(symbol);
                                _context4.next = 3;
                                return this.publicGetIdTrades(this.extend({
                                    'id': market['id']
                                }, params));

                            case 3:
                                response = _context4.sent;
                                return _context4.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 5:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTrades(_x9) {
                return _ref4.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market;
                return _regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                market = this.market(symbol);
                                return _context5.abrupt('return', this.privatePostTrade(this.extend({
                                    'type': side,
                                    'currency': market['baseId'],
                                    'amount': amount,
                                    'payment_currency': market['quoteId'],
                                    'rate': price
                                }, params)));

                            case 2:
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
                return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.privatePostCancel({ 'id': id });

                            case 2:
                                return _context6.abrupt('return', _context6.sent);

                            case 3:
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
        key: 'isFiat',
        value: function isFiat(currency) {
            var fiatCurrencies = {
                'USD': true,
                'EUR': true,
                'PLN': true
            };
            if (currency in fiatCurrencies) return true;
            return false;
        }
    }, {
        key: 'withdraw',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(code, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var method, currency, request, response;
                return _regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                method = undefined;
                                currency = this.currency(code);
                                request = {
                                    'currency': currency['id'],
                                    'quantity': amount
                                };

                                if (this.isFiat(code)) {
                                    method = 'privatePostWithdraw';
                                    // request['account'] = params['account']; // they demand an account number
                                    // request['express'] = params['express']; // whatever it means, they don't explain
                                    // request['bic'] = '';
                                } else {
                                    method = 'privatePostTransfer';
                                    request['address'] = address;
                                }
                                _context7.next = 8;
                                return this[method](this.extend(request, params));

                            case 8:
                                response = _context7.sent;
                                return _context7.abrupt('return', {
                                    'info': response,
                                    'id': undefined
                                });

                            case 10:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function withdraw(_x20, _x21, _x22) {
                return _ref7.apply(this, arguments);
            }

            return withdraw;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api];
            if (api == 'public') {
                url += '/' + this.implodeParams(path, params) + '.json';
            } else {
                this.checkRequiredCredentials();
                body = this.urlencode(this.extend({
                    'method': path,
                    'moment': this.nonce()
                }, params));
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'API-Key': this.apiKey,
                    'API-Hash': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }]);

    return bitbay;
}(Exchange);