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

module.exports = class mixcoins extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'mixcoins',
            'name': 'MixCoins',
            'countries': ['GB', 'HK'],
            'rateLimit': 1500,
            'version': 'v1',
            'hasCORS': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/30237212-ed29303c-9535-11e7-8af8-fcd381cfa20c.jpg',
                'api': 'https://mixcoins.com/api',
                'www': 'https://mixcoins.com',
                'doc': 'https://mixcoins.com/help/api/'
            },
            'api': {
                'public': {
                    'get': ['ticker', 'trades', 'depth']
                },
                'private': {
                    'post': ['cancel', 'info', 'orders', 'order', 'transactions', 'trade']
                }
            },
            'markets': {
                'BTC/USD': { 'id': 'btc_usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'maker': 0.0015, 'taker': 0.0025 },
                'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'maker': 0.001, 'taker': 0.0015 },
                'BCH/BTC': { 'id': 'bcc_btc', 'symbol': 'BCH/BTC', 'base': 'BCH', 'quote': 'BTC', 'maker': 0.001, 'taker': 0.0015 },
                'LSK/BTC': { 'id': 'lsk_btc', 'symbol': 'LSK/BTC', 'base': 'LSK', 'quote': 'BTC', 'maker': 0.0015, 'taker': 0.0025 },
                'BCH/USD': { 'id': 'bcc_usd', 'symbol': 'BCH/USD', 'base': 'BCH', 'quote': 'USD', 'maker': 0.001, 'taker': 0.0015 },
                'ETH/USD': { 'id': 'eth_usd', 'symbol': 'ETH/USD', 'base': 'ETH', 'quote': 'USD', 'maker': 0.001, 'taker': 0.0015 }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this.privatePostInfo();
            let balance = response['result']['wallet'];
            let result = { 'info': balance };
            let currencies = (0, _keys2.default)(_this.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let lowercase = currency.toLowerCase();
                let account = _this.account();
                if (lowercase in balance) {
                    account['free'] = parseFloat(balance[lowercase]['avail']);
                    account['used'] = parseFloat(balance[lowercase]['lock']);
                    account['total'] = _this.sum(account['free'], account['used']);
                }
                result[currency] = account;
            }
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this2.publicGetDepth(_this2.extend({
                'market': _this2.marketId(symbol)
            }, params));
            return _this2.parseOrderBook(response['result']);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this3.publicGetTicker(_this3.extend({
                'market': _this3.marketId(symbol)
            }, params));
            let ticker = response['result'];
            let timestamp = _this3.milliseconds();
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy']),
                'ask': parseFloat(ticker['sell']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['vol']),
                'quoteVolume': undefined,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = parseInt(trade['date']) * 1000;
        return {
            'id': trade['id'].toString(),
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': undefined,
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['amount'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetTrades(_this4.extend({
                'market': market['id']
            }, params));
            return _this4.parseTrades(response['result'], market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let order = {
                'market': _this5.marketId(symbol),
                'op': side,
                'amount': amount
            };
            if (type == 'market') {
                order['order_type'] = 1;
                order['price'] = price;
            } else {
                order['order_type'] = 0;
            }
            let response = yield _this5.privatePostTrade(_this5.extend(order, params));
            return {
                'info': response,
                'id': response['result']['id'].toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return yield _this6.privatePostCancel({ 'id': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.version + '/' + path;
        if (api == 'public') {
            if ((0, _keys2.default)(params).length) url += '?' + this.urlencode(params);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            body = this.urlencode(this.extend({
                'nonce': nonce
            }, params));
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Key': this.apiKey,
                'Sign': this.hmac(this.encode(body), this.secret, 'sha512')
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this7.fetch2(path, api, method, params, headers, body);
            if ('status' in response) if (response['status'] == 200) return response;
            throw new ExchangeError(_this7.id + ' ' + _this7.json(response));
        })();
    }
};