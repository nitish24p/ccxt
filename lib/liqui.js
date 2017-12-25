"use strict";

// ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Exchange = require('./base/Exchange');
const { ExchangeError, InsufficientFunds, OrderNotFound, DDoSProtection } = require('./base/errors');

// ---------------------------------------------------------------------------

module.exports = class liqui extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'liqui',
            'name': 'Liqui',
            'countries': 'UA',
            'rateLimit': 2500,
            'version': '3',
            'hasCORS': false,
            // obsolete metainfo interface
            'hasFetchOrder': true,
            'hasFetchOrders': true,
            'hasFetchOpenOrders': true,
            'hasFetchClosedOrders': true,
            'hasFetchTickers': true,
            'hasFetchMyTrades': true,
            'hasWithdraw': true,
            // new metainfo interface
            'has': {
                'fetchOrder': true,
                'fetchOrders': 'emulated',
                'fetchOpenOrders': true,
                'fetchClosedOrders': 'emulated',
                'fetchTickers': true,
                'fetchMyTrades': true,
                'withdraw': true
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27982022-75aea828-63a0-11e7-9511-ca584a8edd74.jpg',
                'api': {
                    'public': 'https://api.liqui.io/api',
                    'private': 'https://api.liqui.io/tapi'
                },
                'www': 'https://liqui.io',
                'doc': 'https://liqui.io/api',
                'fees': 'https://liqui.io/fee'
            },
            'api': {
                'public': {
                    'get': ['info', 'ticker/{pair}', 'depth/{pair}', 'trades/{pair}']
                },
                'private': {
                    'post': ['getInfo', 'Trade', 'ActiveOrders', 'OrderInfo', 'CancelOrder', 'TradeHistory', 'TransHistory', 'CoinDepositAddress', 'WithdrawCoin', 'CreateCoupon', 'RedeemCoupon']
                }
            },
            'fees': {
                'trading': {
                    'maker': 0.001,
                    'taker': 0.0025
                },
                'funding': 0.0
            }
        });
    }

    calculateFee(symbol, type, side, amount, price, takerOrMaker = 'taker', params = {}) {
        let market = this.markets[symbol];
        let key = 'quote';
        let rate = market[takerOrMaker];
        let cost = parseFloat(this.costToPrecision(symbol, amount * rate));
        if (side == 'sell') {
            cost *= price;
        } else {
            key = 'base';
        }
        return {
            'type': takerOrMaker,
            'currency': market[key],
            'rate': rate,
            'cost': cost
        };
    }

    commonCurrencyCode(currency) {
        if (!this.substituteCommonCurrencyCodes) return currency;
        if (currency == 'XBT') return 'BTC';
        if (currency == 'BCC') return 'BCH';
        if (currency == 'DRK') return 'DASH';
        // they misspell DASH as dsh :/
        if (currency == 'DSH') return 'DASH';
        return currency;
    }

    getBaseQuoteFromMarketId(id) {
        let uppercase = id.toUpperCase();
        let [base, quote] = uppercase.split('_');
        base = this.commonCurrencyCode(base);
        quote = this.commonCurrencyCode(quote);
        return [base, quote];
    }

    fetchMarkets() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this.publicGetInfo();
            let markets = response['pairs'];
            let keys = (0, _keys2.default)(markets);
            let result = [];
            for (let p = 0; p < keys.length; p++) {
                let id = keys[p];
                let market = markets[id];
                let [base, quote] = _this.getBaseQuoteFromMarketId(id);
                let symbol = base + '/' + quote;
                let precision = {
                    'amount': _this.safeInteger(market, 'decimal_places'),
                    'price': _this.safeInteger(market, 'decimal_places')
                };
                let amountLimits = {
                    'min': _this.safeFloat(market, 'min_amount'),
                    'max': _this.safeFloat(market, 'max_amount')
                };
                let priceLimits = {
                    'min': _this.safeFloat(market, 'min_price'),
                    'max': _this.safeFloat(market, 'max_price')
                };
                let costLimits = {
                    'min': _this.safeFloat(market, 'min_total')
                };
                let limits = {
                    'amount': amountLimits,
                    'price': priceLimits,
                    'cost': costLimits
                };
                let active = market['hidden'] == 0;
                result.push(_this.extend(_this.fees['trading'], {
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'active': active,
                    'taker': market['fee'] / 100,
                    'lot': amountLimits['min'],
                    'precision': precision,
                    'limits': limits,
                    'info': market
                }));
            }
            return result;
        })();
    }

    fetchBalance(params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this2.loadMarkets();
            let response = yield _this2.privatePostGetInfo();
            let balances = response['return'];
            let result = { 'info': balances };
            let funds = balances['funds'];
            let currencies = (0, _keys2.default)(funds);
            for (let c = 0; c < currencies.length; c++) {
                let currency = currencies[c];
                let uppercase = currency.toUpperCase();
                uppercase = _this2.commonCurrencyCode(uppercase);
                let total = undefined;
                let used = undefined;
                if (balances['open_orders'] == 0) {
                    total = funds[currency];
                    used = 0.0;
                }
                let account = {
                    'free': funds[currency],
                    'used': used,
                    'total': total
                };
                result[uppercase] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let response = yield _this3.publicGetDepthPair(_this3.extend({
                'pair': market['id']
            }, params));
            let market_id_in_reponse = market['id'] in response;
            if (!market_id_in_reponse) throw new ExchangeError(_this3.id + ' ' + market['symbol'] + ' order book is empty or not available');
            let orderbook = response[market['id']];
            let result = _this3.parseOrderBook(orderbook);
            result['bids'] = _this3.sortBy(result['bids'], 0, true);
            result['asks'] = _this3.sortBy(result['asks'], 0);
            return result;
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = ticker['updated'] * 1000;
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': this.safeFloat(ticker, 'high'),
            'low': this.safeFloat(ticker, 'low'),
            'bid': this.safeFloat(ticker, 'buy'),
            'ask': this.safeFloat(ticker, 'sell'),
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': this.safeFloat(ticker, 'last'),
            'change': undefined,
            'percentage': undefined,
            'average': this.safeFloat(ticker, 'avg'),
            'baseVolume': this.safeFloat(ticker, 'vol_cur'),
            'quoteVolume': this.safeFloat(ticker, 'vol'),
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this4.loadMarkets();
            let ids = undefined;
            if (!symbols) {
                // let numIds = this.ids.length;
                // if (numIds > 256)
                //     throw new ExchangeError (this.id + ' fetchTickers() requires symbols argument');
                ids = _this4.ids;
            } else {
                ids = _this4.marketIds(symbols);
            }
            let tickers = yield _this4.publicGetTickerPair(_this4.extend({
                'pair': ids.join('-')
            }, params));
            let result = {};
            let keys = (0, _keys2.default)(tickers);
            for (let k = 0; k < keys.length; k++) {
                let id = keys[k];
                let ticker = tickers[id];
                let market = _this4.markets_by_id[id];
                let symbol = market['symbol'];
                result[symbol] = _this4.parseTicker(ticker, market);
            }
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let tickers = yield _this5.fetchTickers([symbol], params);
            return tickers[symbol];
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestamp = trade['timestamp'] * 1000;
        let side = trade['type'];
        if (side == 'ask') side = 'sell';
        if (side == 'bid') side = 'buy';
        let price = this.safeFloat(trade, 'price');
        if ('rate' in trade) price = this.safeFloat(trade, 'rate');
        let id = this.safeString(trade, 'tid');
        if ('trade_id' in trade) id = this.safeString(trade, 'trade_id');
        let order = this.safeString(trade, this.getOrderIdKey());
        if ('pair' in trade) {
            let marketId = trade['pair'];
            market = this.markets_by_id[marketId];
        }
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        let amount = trade['amount'];
        let type = 'limit'; // all trades are still limit trades
        let fee = undefined;
        // this is filled by fetchMyTrades() only
        // is_your_order is always false :\
        // let isYourOrder = this.safeValue (trade, 'is_your_order');
        // let takerOrMaker = 'taker';
        // if (isYourOrder)
        //     takerOrMaker = 'maker';
        // let fee = this.calculateFee (symbol, type, side, amount, price, takerOrMaker);
        return {
            'id': id,
            'order': order,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'type': type,
            'side': side,
            'price': price,
            'amount': amount,
            'fee': fee,
            'info': trade
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let request = {
                'pair': market['id']
            };
            if (limit) request['limit'] = limit;
            let response = yield _this6.publicGetTradesPair(_this6.extend(request, params));
            return _this6.parseTrades(response[market['id']], market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (type == 'market') throw new ExchangeError(_this7.id + ' allows limit orders only');
            yield _this7.loadMarkets();
            let market = _this7.market(symbol);
            let request = {
                'pair': market['id'],
                'type': side,
                'amount': _this7.amountToPrecision(symbol, amount),
                'rate': _this7.priceToPrecision(symbol, price)
            };
            let response = yield _this7.privatePostTrade(_this7.extend(request, params));
            let id = _this7.safeString(response['return'], _this7.getOrderIdKey());
            if (!id) id = _this7.safeString(response['return'], 'init_order_id');
            let timestamp = _this7.milliseconds();
            price = parseFloat(price);
            amount = parseFloat(amount);
            let order = {
                'id': id,
                'timestamp': timestamp,
                'datetime': _this7.iso8601(timestamp),
                'status': 'open',
                'symbol': symbol,
                'type': type,
                'side': side,
                'price': price,
                'cost': price * amount,
                'amount': amount,
                'remaining': amount,
                'filled': 0.0,
                'fee': undefined
                // 'trades': this.parseTrades (order['trades'], market),
            };
            _this7.orders[id] = order;
            return _this7.extend({ 'info': response }, order);
        })();
    }

    getOrderIdKey() {
        return 'order_id';
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this8.loadMarkets();
            let response = undefined;
            try {
                let request = {};
                let idKey = _this8.getOrderIdKey();
                request[idKey] = id;
                response = yield _this8.privatePostCancelOrder(_this8.extend(request, params));
                if (id in _this8.orders) _this8.orders[id]['status'] = 'canceled';
            } catch (e) {
                if (_this8.last_json_response) {
                    let message = _this8.safeString(_this8.last_json_response, 'error');
                    if (message) {
                        if (message.indexOf('not found') >= 0) throw new OrderNotFound(_this8.id + ' cancelOrder() error: ' + _this8.last_http_response);
                    }
                }
                throw e;
            }
            return response;
        })();
    }

    parseOrder(order, market = undefined) {
        let id = order['id'].toString();
        let status = order['status'];
        if (status == 0) {
            status = 'open';
        } else if (status == 1) {
            status = 'closed';
        } else if (status == 2 || status == 3) {
            status = 'canceled';
        }
        let timestamp = parseInt(order['timestamp_created']) * 1000;
        let symbol = undefined;
        if (!market) market = this.markets_by_id[order['pair']];
        if (market) symbol = market['symbol'];
        let remaining = this.safeFloat(order, 'amount');
        let amount = this.safeFloat(order, 'start_amount', remaining);
        if (typeof amount == 'undefined') {
            if (id in this.orders) {
                amount = this.safeFloat(this.orders[id], 'amount');
            }
        }
        let price = this.safeFloat(order, 'rate');
        let filled = undefined;
        let cost = undefined;
        if (typeof amount != 'undefined') {
            if (typeof remaining != 'undefined') {
                filled = amount - remaining;
                cost = price * filled;
            }
        }
        let fee = undefined;
        let result = {
            'info': order,
            'id': id,
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'type': 'limit',
            'side': order['type'],
            'price': price,
            'cost': cost,
            'amount': amount,
            'remaining': remaining,
            'filled': filled,
            'status': status,
            'fee': fee
        };
        return result;
    }

    parseOrders(orders, market = undefined, since = undefined, limit = undefined) {
        let ids = (0, _keys2.default)(orders);
        let result = [];
        for (let i = 0; i < ids.length; i++) {
            let id = ids[i];
            let order = orders[id];
            let extended = this.extend(order, { 'id': id });
            result.push(this.parseOrder(extended, market));
        }
        return this.filterBySinceLimit(result, since, limit);
    }

    fetchOrder(id, symbol = undefined, params = {}) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this9.loadMarkets();
            let response = yield _this9.privatePostOrderInfo(_this9.extend({
                'order_id': parseInt(id)
            }, params));
            id = id.toString();
            let newOrder = _this9.parseOrder(_this9.extend({ 'id': id }, response['return'][id]));
            let oldOrder = id in _this9.orders ? _this9.orders[id] : {};
            _this9.orders[id] = _this9.extend(oldOrder, newOrder);
            return _this9.orders[id];
        })();
    }

    fetchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this10 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!symbol) throw new ExchangeError(_this10.id + ' fetchOrders requires a symbol');
            yield _this10.loadMarkets();
            let market = _this10.market(symbol);
            let request = { 'pair': market['id'] };
            let response = yield _this10.privatePostActiveOrders(_this10.extend(request, params));
            let openOrders = [];
            if ('return' in response) openOrders = _this10.parseOrders(response['return'], market);
            for (let j = 0; j < openOrders.length; j++) {
                _this10.orders[openOrders[j]['id']] = openOrders[j];
            }
            let openOrdersIndexedById = _this10.indexBy(openOrders, 'id');
            let cachedOrderIds = (0, _keys2.default)(_this10.orders);
            let result = [];
            for (let k = 0; k < cachedOrderIds.length; k++) {
                let id = cachedOrderIds[k];
                if (id in openOrdersIndexedById) {
                    _this10.orders[id] = _this10.extend(_this10.orders[id], openOrdersIndexedById[id]);
                } else {
                    let order = _this10.orders[id];
                    if (order['status'] == 'open') {
                        _this10.orders[id] = _this10.extend(order, {
                            'status': 'closed',
                            'cost': order['amount'] * order['price'],
                            'filled': order['amount'],
                            'remaining': 0.0
                        });
                    }
                }
                let order = _this10.orders[id];
                if (order['symbol'] == symbol) result.push(order);
            }
            return _this10.filterBySinceLimit(result, since, limit);
        })();
    }

    fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this11 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let orders = yield _this11.fetchOrders(symbol, since, limit, params);
            let result = [];
            for (let i = 0; i < orders.length; i++) {
                if (orders[i]['status'] == 'open') result.push(orders[i]);
            }
            return result;
        })();
    }

    fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this12 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let orders = yield _this12.fetchOrders(symbol, since, limit, params);
            let result = [];
            for (let i = 0; i < orders.length; i++) {
                if (orders[i]['status'] == 'closed') result.push(orders[i]);
            }
            return result;
        })();
    }

    fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this13 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this13.loadMarkets();
            let market = undefined;
            let request = {
                // 'from': 123456789, // trade ID, from which the display starts numerical 0
                // 'count': 1000, // the number of trades for display numerical, default = 1000
                // 'from_id': trade ID, from which the display starts numerical 0
                // 'end_id': trade ID on which the display ends numerical ∞
                // 'order': 'ASC', // sorting, default = DESC
                // 'since': 1234567890, // UTC start time, default = 0
                // 'end': 1234567890, // UTC end time, default = ∞
                // 'pair': 'eth_btc', // default = all markets
            };
            if (symbol) {
                market = _this13.market(symbol);
                request['pair'] = market['id'];
            }
            if (limit) request['count'] = parseInt(limit);
            if (since) request['since'] = parseInt(since / 1000);
            let response = yield _this13.privatePostTradeHistory(_this13.extend(request, params));
            let trades = [];
            if ('return' in response) trades = response['return'];
            return _this13.parseTrades(trades, market, since, limit);
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this14 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this14.loadMarkets();
            let response = yield _this14.privatePostWithdrawCoin(_this14.extend({
                'coinName': currency,
                'amount': parseFloat(amount),
                'address': address
            }, params));
            return {
                'info': response,
                'id': response['return']['tId']
            };
        })();
    }

    signBodyWithSecret(body) {
        return this.hmac(this.encode(body), this.encode(this.secret), 'sha512');
    }

    getVersionString() {
        return '/' + this.version;
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api];
        let query = this.omit(params, this.extractParams(path));
        if (api == 'private') {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            body = this.urlencode(this.extend({
                'nonce': nonce,
                'method': path
            }, query));
            let signature = this.signBodyWithSecret(body);
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Key': this.apiKey,
                'Sign': signature
            };
        } else {
            url += this.getVersionString() + '/' + this.implodeParams(path, params);
            if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this15 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this15.fetch2(path, api, method, params, headers, body);
            if ('success' in response) {
                if (!response['success']) {
                    if (response['error'].indexOf('Not enougth') >= 0) {
                        // not enougTh is a typo inside Liqui's own API...
                        throw new InsufficientFunds(_this15.id + ' ' + _this15.json(response));
                    } else if (response['error'] == 'Requests too often') {
                        throw new DDoSProtection(_this15.id + ' ' + _this15.json(response));
                    } else if (response['error'] == 'not available' || response['error'] == 'external service unavailable') {
                        throw new DDoSProtection(_this15.id + ' ' + _this15.json(response));
                    } else {
                        throw new ExchangeError(_this15.id + ' ' + _this15.json(response));
                    }
                }
            }
            return response;
        })();
    }
};