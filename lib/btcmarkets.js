"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class btcmarkets extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'btcmarkets',
            'name': 'BTC Markets',
            'countries': 'AU', // Australia
            'rateLimit': 1000, // market data cached for 1 second (trades cached for 2 seconds)
            'hasCORS': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/29142911-0e1acfc2-7d5c-11e7-98c4-07d9532b29d7.jpg',
                'api': 'https://api.btcmarkets.net',
                'www': 'https://btcmarkets.net/',
                'doc': 'https://github.com/BTCMarkets/API'
            },
            'api': {
                'public': {
                    'get': ['market/{id}/tick', 'market/{id}/orderbook', 'market/{id}/trades']
                },
                'private': {
                    'get': ['account/balance', 'account/{id}/tradingfee'],
                    'post': ['fundtransfer/withdrawCrypto', 'fundtransfer/withdrawEFT', 'order/create', 'order/cancel', 'order/history', 'order/open', 'order/trade/history', 'order/createBatch', // they promise it's coming soon...
                    'order/detail']
                }
            },
            'markets': {
                'BTC/AUD': { 'id': 'BTC/AUD', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD', 'maker': 0.0085, 'taker': 0.0085 },
                'LTC/AUD': { 'id': 'LTC/AUD', 'symbol': 'LTC/AUD', 'base': 'LTC', 'quote': 'AUD', 'maker': 0.0085, 'taker': 0.0085 },
                'ETH/AUD': { 'id': 'ETH/AUD', 'symbol': 'ETH/AUD', 'base': 'ETH', 'quote': 'AUD', 'maker': 0.0085, 'taker': 0.0085 },
                'ETC/AUD': { 'id': 'ETC/AUD', 'symbol': 'ETC/AUD', 'base': 'ETC', 'quote': 'AUD', 'maker': 0.0085, 'taker': 0.0085 },
                'XRP/AUD': { 'id': 'XRP/AUD', 'symbol': 'XRP/AUD', 'base': 'XRP', 'quote': 'AUD', 'maker': 0.0085, 'taker': 0.0085 },
                'BCH/AUD': { 'id': 'BCH/AUD', 'symbol': 'BCH/AUD', 'base': 'BCH', 'quote': 'AUD', 'maker': 0.0085, 'taker': 0.0085 },
                'LTC/BTC': { 'id': 'LTC/BTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'maker': 0.0022, 'taker': 0.0022 },
                'ETH/BTC': { 'id': 'ETH/BTC', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'maker': 0.0022, 'taker': 0.0022 },
                'ETC/BTC': { 'id': 'ETC/BTC', 'symbol': 'ETC/BTC', 'base': 'ETC', 'quote': 'BTC', 'maker': 0.0022, 'taker': 0.0022 },
                'XRP/BTC': { 'id': 'XRP/BTC', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC', 'maker': 0.0022, 'taker': 0.0022 },
                'BCH/BTC': { 'id': 'BCH/BTC', 'symbol': 'BCH/BTC', 'base': 'BCH', 'quote': 'BTC', 'maker': 0.0022, 'taker': 0.0022 }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this.loadMarkets();
            let balances = yield _this.privateGetAccountBalance();
            let result = { 'info': balances };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = balance['currency'];
                let multiplier = 100000000;
                let total = parseFloat(balance['balance'] / multiplier);
                let used = parseFloat(balance['pendingFunds'] / multiplier);
                let free = total - used;
                let account = {
                    'free': free,
                    'used': used,
                    'total': total
                };
                result[currency] = account;
            }
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this2.loadMarkets();
            let market = _this2.market(symbol);
            let orderbook = yield _this2.publicGetMarketIdOrderbook(_this2.extend({
                'id': market['id']
            }, params));
            let timestamp = orderbook['timestamp'] * 1000;
            return _this2.parseOrderBook(orderbook, timestamp);
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = ticker['timestamp'] * 1000;
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': undefined,
            'low': undefined,
            'bid': parseFloat(ticker['bestBid']),
            'ask': parseFloat(ticker['bestAsk']),
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': parseFloat(ticker['lastPrice']),
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': parseFloat(ticker['volume24h']),
            'quoteVolume': undefined,
            'info': ticker
        };
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let ticker = yield _this3.publicGetMarketIdTick(_this3.extend({
                'id': market['id']
            }, params));
            return _this3.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market) {
        let timestamp = trade['date'] * 1000;
        return {
            'info': trade,
            'id': trade['tid'].toString(),
            'order': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': undefined,
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetMarketIdTrades(_this4.extend({
                // 'since': 59868345231,
                'id': market['id']
            }, params));
            return _this4.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let multiplier = 100000000; // for price and volume
            // does BTC Markets support market orders at all?
            let orderSide = side == 'buy' ? 'Bid' : 'Ask';
            let order = _this5.ordered({
                'currency': market['quote'],
                'instrument': market['base'],
                'price': price * multiplier,
                'volume': amount * multiplier,
                'orderSide': orderSide,
                'ordertype': _this5.capitalize(type),
                'clientRequestId': _this5.nonce().toString()
            });
            let response = yield _this5.privatePostOrderCreate(_this5.extend(order, params));
            return {
                'info': response,
                'id': response['id'].toString()
            };
        })();
    }

    cancelOrders(ids) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this6.loadMarkets();
            return yield _this6.privatePostOrderCancel({ 'order_ids': ids });
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this7.loadMarkets();
            return yield _this7.cancelOrders([id]);
        })();
    }

    nonce() {
        return this.milliseconds();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let uri = '/' + this.implodeParams(path, params);
        let url = this.urls['api'] + uri;
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if ((0, _keys2.default)(params).length) url += '?' + this.urlencode(params);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            let auth = uri + "\n" + nonce + "\n";
            headers = {
                'Content-Type': 'application/json',
                'apikey': this.apiKey,
                'timestamp': nonce
            };
            if (method == 'POST') {
                body = this.urlencode(query);
                auth += body;
            }
            let secret = this.base64ToBinary(this.secret);
            let signature = this.hmac(this.encode(auth), secret, 'sha512', 'base64');
            headers['signature'] = this.decode(signature);
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this8.fetch2(path, api, method, params, headers, body);
            if (api == 'private') {
                if ('success' in response) if (!response['success']) throw new ExchangeError(_this8.id + ' ' + _this8.json(response));
                return response;
            }
            return response;
        })();
    }
};