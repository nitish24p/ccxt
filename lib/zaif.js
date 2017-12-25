"use strict";

//  ---------------------------------------------------------------------------

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
    _inherits(zaif, _Exchange);

    function zaif() {
        _classCallCheck(this, zaif);

        return _possibleConstructorReturn(this, (zaif.__proto__ || Object.getPrototypeOf(zaif)).apply(this, arguments));
    }

    _createClass(zaif, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(zaif.prototype.__proto__ || Object.getPrototypeOf(zaif.prototype), 'describe', this).call(this), {
                'id': 'zaif',
                'name': 'Zaif',
                'countries': 'JP',
                'rateLimit': 2000,
                'version': '1',
                'hasCORS': false,
                'hasFetchOpenOrders': true,
                'hasFetchClosedOrders': true,
                'hasWithdraw': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766927-39ca2ada-5eeb-11e7-972f-1b4199518ca6.jpg',
                    'api': 'https://api.zaif.jp',
                    'www': 'https://zaif.jp',
                    'doc': ['http://techbureau-api-document.readthedocs.io/ja/latest/index.html', 'https://corp.zaif.jp/api-docs', 'https://corp.zaif.jp/api-docs/api_links', 'https://www.npmjs.com/package/zaif.jp', 'https://github.com/you21979/node-zaif']
                },
                'api': {
                    'public': {
                        'get': ['depth/{pair}', 'currencies/{pair}', 'currencies/all', 'currency_pairs/{pair}', 'currency_pairs/all', 'last_price/{pair}', 'ticker/{pair}', 'trades/{pair}']
                    },
                    'private': {
                        'post': ['active_orders', 'cancel_order', 'deposit_history', 'get_id_info', 'get_info', 'get_info2', 'get_personal_info', 'trade', 'trade_history', 'withdraw', 'withdraw_history']
                    },
                    'ecapi': {
                        'post': ['createInvoice', 'getInvoice', 'getInvoiceIdsByOrderNumber', 'cancelInvoice']
                    },
                    'tlapi': {
                        'post': ['get_positions', 'position_history', 'active_positions', 'create_position', 'change_position', 'cancel_position']
                    },
                    'fapi': {
                        'get': ['groups/{group_id}', 'last_price/{group_id}/{pair}', 'ticker/{group_id}/{pair}', 'trades/{group_id}/{pair}', 'depth/{group_id}/{pair}']
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var markets, result, p, market, id, symbol, _symbol$split, _symbol$split2, base, quote;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetCurrencyPairsAll();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (p = 0; p < markets.length; p++) {
                                    market = markets[p];
                                    id = market['currency_pair'];
                                    symbol = market['name'];
                                    _symbol$split = symbol.split('/'), _symbol$split2 = _slicedToArray(_symbol$split, 2), base = _symbol$split2[0], quote = _symbol$split2[1];

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': market
                                    });
                                }
                                return _context.abrupt('return', result);

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function fetchMarkets() {
                return _ref.apply(this, arguments);
            }

            return fetchMarkets;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, currencies, c, currency, balance, uppercase, account;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privatePostGetInfo();

                            case 4:
                                response = _context2.sent;
                                balances = response['return'];
                                result = { 'info': balances };
                                currencies = Object.keys(balances['funds']);

                                for (c = 0; c < currencies.length; c++) {
                                    currency = currencies[c];
                                    balance = balances['funds'][currency];
                                    uppercase = currency.toUpperCase();
                                    account = {
                                        'free': balance,
                                        'used': 0.0,
                                        'total': balance
                                    };

                                    if ('deposit' in balances) {
                                        if (currency in balances['deposit']) {
                                            account['total'] = balances['deposit'][currency];
                                            account['used'] = account['total'] - account['free'];
                                        }
                                    }
                                    result[uppercase] = account;
                                }
                                return _context2.abrupt('return', this.parseBalance(result));

                            case 10:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchBalance() {
                return _ref2.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var orderbook;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context3.next = 4;
                                return this.publicGetDepthPair(this.extend({
                                    'pair': this.marketId(symbol)
                                }, params));

                            case 4:
                                orderbook = _context3.sent;
                                return _context3.abrupt('return', this.parseOrderBook(orderbook));

                            case 6:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchOrderBook(_x3) {
                return _ref3.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var ticker, timestamp, vwap, baseVolume, quoteVolume;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.publicGetTickerPair(this.extend({
                                    'pair': this.marketId(symbol)
                                }, params));

                            case 4:
                                ticker = _context4.sent;
                                timestamp = this.milliseconds();
                                vwap = ticker['vwap'];
                                baseVolume = ticker['volume'];
                                quoteVolume = baseVolume * vwap;
                                return _context4.abrupt('return', {
                                    'symbol': symbol,
                                    'timestamp': timestamp,
                                    'datetime': this.iso8601(timestamp),
                                    'high': ticker['high'],
                                    'low': ticker['low'],
                                    'bid': ticker['bid'],
                                    'ask': ticker['ask'],
                                    'vwap': vwap,
                                    'open': undefined,
                                    'close': undefined,
                                    'first': undefined,
                                    'last': ticker['last'],
                                    'change': undefined,
                                    'percentage': undefined,
                                    'average': undefined,
                                    'baseVolume': baseVolume,
                                    'quoteVolume': quoteVolume,
                                    'info': ticker
                                });

                            case 10:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTicker(_x5) {
                return _ref4.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = trade['trade_type'] == 'bid' ? 'buy' : 'sell';
            var timestamp = trade['date'] * 1000;
            var id = this.safeString(trade, 'id');
            id = this.safeString(trade, 'tid', id);
            if (!market) market = this.markets_by_id[trade['currency_pair']];
            return {
                'id': id.toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': side,
                'price': trade['price'],
                'amount': trade['amount']
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.publicGetTradesPair(this.extend({
                                    'pair': market['id']
                                }, params));

                            case 5:
                                response = _context5.sent;
                                return _context5.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 7:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTrades(_x10) {
                return _ref5.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var response;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                if (!(type == 'market')) {
                                    _context6.next = 4;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' allows limit orders only');

                            case 4:
                                _context6.next = 6;
                                return this.privatePostTrade(this.extend({
                                    'currency_pair': this.marketId(symbol),
                                    'action': side == 'buy' ? 'bid' : 'ask',
                                    'amount': amount,
                                    'price': price
                                }, params));

                            case 6:
                                response = _context6.sent;
                                return _context6.abrupt('return', {
                                    'info': response,
                                    'id': response['return']['order_id'].toString()
                                });

                            case 8:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function createOrder(_x13, _x14, _x15, _x16) {
                return _ref6.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.privatePostCancelOrder(this.extend({
                                    'order_id': id
                                }, params));

                            case 2:
                                return _context7.abrupt('return', _context7.sent);

                            case 3:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function cancelOrder(_x19) {
                return _ref7.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = order['action'] == 'bid' ? 'buy' : 'sell';
            var timestamp = parseInt(order['timestamp']) * 1000;
            if (!market) market = this.markets_by_id[order['currency_pair']];
            var price = order['price'];
            var amount = order['amount'];
            return {
                'id': order['id'].toString(),
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'status': 'open',
                'symbol': market['symbol'],
                'type': 'limit',
                'side': side,
                'price': price,
                'cost': price * amount,
                'amount': amount,
                'filled': undefined,
                'remaining': undefined,
                'trades': undefined,
                'fee': undefined
            };
        }
    }, {
        key: 'parseOrders',
        value: function parseOrders(orders) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

            var ids = Object.keys(orders);
            var result = [];
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                var order = orders[id];
                var extended = this.extend(order, { 'id': id });
                result.push(this.parseOrder(extended, market));
            }
            return this.filterBySinceLimit(result, since, limit);
        }
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, request, response;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = undefined;
                                request = {
                                    // 'is_token': false,
                                    // 'is_token_both': false,
                                };

                                if (symbol) {
                                    market = this.market(symbol);
                                    request['currency_pair'] = market['id'];
                                }
                                _context8.next = 7;
                                return this.privatePostActiveOrders(this.extend(request, params));

                            case 7:
                                response = _context8.sent;
                                return _context8.abrupt('return', this.parseOrders(response['return'], market, since, limit));

                            case 9:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function fetchOpenOrders() {
                return _ref8.apply(this, arguments);
            }

            return fetchOpenOrders;
        }()
    }, {
        key: 'fetchClosedOrders',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, request, response;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = undefined;
                                request = {
                                    // 'from': 0,
                                    // 'count': 1000,
                                    // 'from_id': 0,
                                    // 'end_id': 1000,
                                    // 'order': 'DESC',
                                    // 'since': 1503821051,
                                    // 'end': 1503821051,
                                    // 'is_token': false,
                                };

                                if (symbol) {
                                    market = this.market(symbol);
                                    request['currency_pair'] = market['id'];
                                }
                                _context9.next = 7;
                                return this.privatePostTradeHistory(this.extend(request, params));

                            case 7:
                                response = _context9.sent;
                                return _context9.abrupt('return', this.parseOrders(response['return'], market, since, limit));

                            case 9:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function fetchClosedOrders() {
                return _ref9.apply(this, arguments);
            }

            return fetchClosedOrders;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var result;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.loadMarkets();

                            case 2:
                                if (!(currency == 'JPY')) {
                                    _context10.next = 4;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' does not allow ' + currency + ' withdrawals');

                            case 4:
                                _context10.next = 6;
                                return this.privatePostWithdraw(this.extend({
                                    'currency': currency,
                                    'amount': amount,
                                    'address': address
                                    // 'message': 'Hi!', // XEM only
                                    // 'opt_fee': 0.003, // BTC and MONA only
                                }, params));

                            case 6:
                                result = _context10.sent;
                                return _context10.abrupt('return', {
                                    'info': result,
                                    'id': result['return']['txid'],
                                    'fee': result['return']['fee']
                                });

                            case 8:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function withdraw(_x33, _x34, _x35) {
                return _ref10.apply(this, arguments);
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

            var url = this.urls['api'] + '/';
            if (api == 'public') {
                url += 'api/' + this.version + '/' + this.implodeParams(path, params);
            } else if (api == 'fapi') {
                url += 'fapi/' + this.version + '/' + this.implodeParams(path, params);
            } else {
                this.checkRequiredCredentials();
                if (api == 'ecapi') {
                    url += 'ecapi';
                } else if (api == 'tlapi') {
                    url += 'tlapi';
                } else {
                    url += 'tapi';
                }
                var nonce = this.nonce();
                body = this.urlencode(this.extend({
                    'method': path,
                    'nonce': nonce
                }, params));
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Key': this.apiKey,
                    'Sign': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
                };
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'api';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context11.sent;

                                if (!('error' in response)) {
                                    _context11.next = 5;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + response['error']);

                            case 5:
                                if (!('success' in response)) {
                                    _context11.next = 8;
                                    break;
                                }

                                if (response['success']) {
                                    _context11.next = 8;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 8:
                                return _context11.abrupt('return', response);

                            case 9:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function request(_x46) {
                return _ref11.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return zaif;
}(Exchange);