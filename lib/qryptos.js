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
    ExchangeError = _require.ExchangeError,
    OrderNotFound = _require.OrderNotFound,
    InvalidOrder = _require.InvalidOrder,
    InsufficientFunds = _require.InsufficientFunds;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(qryptos, _Exchange);

    function qryptos() {
        _classCallCheck(this, qryptos);

        return _possibleConstructorReturn(this, (qryptos.__proto__ || Object.getPrototypeOf(qryptos)).apply(this, arguments));
    }

    _createClass(qryptos, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(qryptos.prototype.__proto__ || Object.getPrototypeOf(qryptos.prototype), 'describe', this).call(this), {
                'id': 'qryptos',
                'name': 'QRYPTOS',
                'countries': ['CN', 'TW'],
                'version': '2',
                'rateLimit': 1000,
                'hasFetchTickers': true,
                'hasCORS': false,
                'has': {
                    'fetchOrder': true,
                    'fetchOrders': true,
                    'fetchOpenOrders': true,
                    'fetchClosedOrders': true
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/30953915-b1611dc0-a436-11e7-8947-c95bd5a42086.jpg',
                    'api': 'https://api.qryptos.com',
                    'www': 'https://www.qryptos.com',
                    'doc': 'https://developers.quoine.com'
                },
                'api': {
                    'public': {
                        'get': ['products', 'products/{id}', 'products/{id}/price_levels', 'executions', 'ir_ladders/{currency}']
                    },
                    'private': {
                        'get': ['accounts/balance', 'crypto_accounts', 'executions/me', 'fiat_accounts', 'loan_bids', 'loans', 'orders', 'orders/{id}', 'orders/{id}/trades', 'trades', 'trades/{id}/loans', 'trading_accounts', 'trading_accounts/{id}'],
                        'post': ['fiat_accounts', 'loan_bids', 'orders'],
                        'put': ['loan_bids/{id}/close', 'loans/{id}', 'orders/{id}', 'orders/{id}/cancel', 'trades/{id}', 'trades/{id}/close', 'trades/close_all', 'trading_accounts/{id}']
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var markets, result, p, market, id, base, quote, symbol, maker, taker, active;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetProducts();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (p = 0; p < markets.length; p++) {
                                    market = markets[p];
                                    id = market['id'];
                                    base = market['base_currency'];
                                    quote = market['quoted_currency'];
                                    symbol = base + '/' + quote;
                                    maker = this.safeFloat(market, 'maker_fee');
                                    taker = this.safeFloat(market, 'taker_fee');
                                    active = !market['disabled'];

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'maker': maker,
                                        'taker': taker,
                                        'active': active,
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
                var balances, result, b, balance, currency, total, account;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privateGetAccountsBalance();

                            case 4:
                                balances = _context2.sent;
                                result = { 'info': balances };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    currency = balance['currency'];
                                    total = parseFloat(balance['balance']);
                                    account = {
                                        'free': total,
                                        'used': 0.0,
                                        'total': total
                                    };

                                    result[currency] = account;
                                }
                                return _context2.abrupt('return', this.parseBalance(result));

                            case 8:
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
                                return this.publicGetProductsIdPriceLevels(this.extend({
                                    'id': this.marketId(symbol)
                                }, params));

                            case 4:
                                orderbook = _context3.sent;
                                return _context3.abrupt('return', this.parseOrderBook(orderbook, undefined, 'buy_price_levels', 'sell_price_levels'));

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
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.milliseconds();
            var last = undefined;
            if ('last_traded_price' in ticker) {
                if (ticker['last_traded_price']) {
                    var length = ticker['last_traded_price'].length;
                    if (length > 0) last = parseFloat(ticker['last_traded_price']);
                }
            }
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': this.safeFloat(ticker, 'high_market_ask'),
                'low': this.safeFloat(ticker, 'low_market_bid'),
                'bid': this.safeFloat(ticker, 'market_bid'),
                'ask': this.safeFloat(ticker, 'market_ask'),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': last,
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': this.safeFloat(ticker, 'volume_24h'),
                'quoteVolume': undefined,
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var tickers, result, t, ticker, base, quote, symbol, market;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.publicGetProducts(params);

                            case 4:
                                tickers = _context4.sent;
                                result = {};

                                for (t = 0; t < tickers.length; t++) {
                                    ticker = tickers[t];
                                    base = ticker['base_currency'];
                                    quote = ticker['quoted_currency'];
                                    symbol = base + '/' + quote;
                                    market = this.markets[symbol];

                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context4.abrupt('return', result);

                            case 8:
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
                var market, ticker;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.publicGetProductsId(this.extend({
                                    'id': market['id']
                                }, params));

                            case 5:
                                ticker = _context5.sent;
                                return _context5.abrupt('return', this.parseTicker(ticker, market));

                            case 7:
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
        key: 'parseTrade',
        value: function parseTrade(trade, market) {
            var timestamp = trade['created_at'] * 1000;
            return {
                'info': trade,
                'id': trade['id'].toString(),
                'order': undefined,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['taker_side'],
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['quantity'])
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, request, response;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = {
                                    'product_id': market['id']
                                };

                                if (limit) request['limit'] = limit;
                                _context6.next = 7;
                                return this.publicGetExecutions(this.extend(request, params));

                            case 7:
                                response = _context6.sent;
                                return _context6.abrupt('return', this.parseTrades(response['models'], market, since, limit));

                            case 9:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTrades(_x12) {
                return _ref6.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var order, response;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                order = {
                                    'order_type': type,
                                    'product_id': this.marketId(symbol),
                                    'side': side,
                                    'quantity': amount
                                };

                                if (type == 'limit') order['price'] = price;
                                _context7.next = 6;
                                return this.privatePostOrders(this.extend({
                                    'order': order
                                }, params));

                            case 6:
                                response = _context7.sent;
                                return _context7.abrupt('return', this.parseOrder(response));

                            case 8:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function createOrder(_x15, _x16, _x17, _x18) {
                return _ref7.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var result, order;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context8.next = 4;
                                return this.privatePutOrdersIdCancel(this.extend({
                                    'id': id
                                }, params));

                            case 4:
                                result = _context8.sent;
                                order = this.parseOrder(result);

                                if (!(order['status'] == 'closed')) {
                                    _context8.next = 8;
                                    break;
                                }

                                throw new OrderNotFound(this.id + ' ' + this.json(order));

                            case 8:
                                return _context8.abrupt('return', order);

                            case 9:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function cancelOrder(_x21) {
                return _ref8.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var timestamp = order['created_at'] * 1000;
            var marketId = order['product_id'];
            var market = this.marketsById[marketId];
            var status = undefined;
            if ('status' in order) {
                if (order['status'] == 'live') {
                    status = 'open';
                } else if (order['status'] == 'filled') {
                    status = 'closed';
                } else if (order['status'] == 'cancelled') {
                    // 'll' intended
                    status = 'canceled';
                }
            }
            var amount = parseFloat(order['quantity']);
            var filled = parseFloat(order['filled_quantity']);
            var symbol = undefined;
            if (market) {
                symbol = market['symbol'];
            }
            return {
                'id': order['id'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'type': order['order_type'],
                'status': status,
                'symbol': symbol,
                'side': order['side'],
                'price': order['price'],
                'amount': amount,
                'filled': filled,
                'remaining': amount - filled,
                'trades': undefined,
                'fee': {
                    'currency': undefined,
                    'cost': parseFloat(order['order_fee'])
                },
                'info': order
            };
        }
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var order;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context9.next = 4;
                                return this.privateGetOrdersId(this.extend({
                                    'id': id
                                }, params));

                            case 4:
                                order = _context9.sent;
                                return _context9.abrupt('return', this.parseOrder(order));

                            case 6:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function fetchOrder(_x24) {
                return _ref9.apply(this, arguments);
            }

            return fetchOrder;
        }()
    }, {
        key: 'fetchOrders',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, request, status, result, orders;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = undefined;
                                request = {};

                                if (symbol) {
                                    market = this.market(symbol);
                                    request['product_id'] = market['id'];
                                }
                                status = params['status'];

                                if (status == 'open') {
                                    request['status'] = 'live';
                                } else if (status == 'closed') {
                                    request['status'] = 'filled';
                                } else if (status == 'canceled') {
                                    request['status'] = 'cancelled';
                                }
                                _context10.next = 9;
                                return this.privateGetOrders(request);

                            case 9:
                                result = _context10.sent;
                                orders = result['models'];
                                return _context10.abrupt('return', this.parseOrders(orders, market, since, limit));

                            case 12:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function fetchOrders() {
                return _ref10.apply(this, arguments);
            }

            return fetchOrders;
        }()
    }, {
        key: 'fetchOpenOrders',
        value: function fetchOpenOrders() {
            var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
            var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            return this.fetchOrders(symbol, since, limit, this.extend({ 'status': 'open' }, params));
        }
    }, {
        key: 'fetchClosedOrders',
        value: function fetchClosedOrders() {
            var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
            var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            return this.fetchOrders(symbol, since, limit, this.extend({ 'status': 'closed' }, params));
        }
    }, {
        key: 'handleErrors',
        value: function handleErrors(code, reason, url, method, headers, body) {
            var response = undefined;
            if (code == 200 || code == 404 || code == 422) {
                if (body[0] == '{' || body[0] == '[') {
                    response = JSON.parse(body);
                } else {
                    // if not a JSON response
                    throw new ExchangeError(this.id + ' returned a non-JSON reply: ' + body);
                }
            }
            if (code == 404) {
                if ('message' in response) {
                    if (response['message'] == 'Order not found') {
                        throw new OrderNotFound(this.id + ' ' + body);
                    }
                }
            } else if (code == 422) {
                if ('errors' in response) {
                    var errors = response['errors'];
                    if ('user' in errors) {
                        var messages = errors['user'];
                        if (messages.indexOf('not_enough_free_balance') >= 0) {
                            throw new InsufficientFunds(this.id + ' ' + body);
                        }
                    } else if ('quantity' in errors) {
                        var _messages = errors['quantity'];
                        if (_messages.indexOf('less_than_order_size') >= 0) {
                            throw new InvalidOrder(this.id + ' ' + body);
                        }
                    }
                }
            }
        }
    }, {
        key: 'nonce',
        value: function nonce() {
            return this.milliseconds();
        }
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            headers = {
                'X-Quoine-API-Version': this.version,
                'Content-Type': 'application/json'
            };
            if (api == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                if (method == 'GET') {
                    if (Object.keys(query).length) url += '?' + this.urlencode(query);
                } else if (Object.keys(query).length) {
                    body = this.json(query);
                }
                var nonce = this.nonce();
                var request = {
                    'path': url,
                    'nonce': nonce,
                    'token_id': this.apiKey,
                    'iat': Math.floor(nonce / 1000) // issued at
                };
                headers['X-Quoine-Auth'] = this.jwt(request, this.secret);
            }
            url = this.urls['api'] + url;
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }]);

    return qryptos;
}(Exchange);