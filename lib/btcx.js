"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class btcx extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'btcx',
            'name': 'BTCX',
            'countries': ['IS', 'US', 'EU'],
            'rateLimit': 1500, // support in english is very poor, unable to tell rate limits
            'version': 'v1',
            'hasCORS': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766385-9fdcc98c-5ed6-11e7-8f14-66d5e5cd47e6.jpg',
                'api': 'https://btc-x.is/api',
                'www': 'https://btc-x.is',
                'doc': 'https://btc-x.is/custom/api-document.html'
            },
            'api': {
                'public': {
                    'get': ['depth/{id}/{limit}', 'ticker/{id}', 'trade/{id}/{limit}']
                },
                'private': {
                    'post': ['balance', 'cancel', 'history', 'order', 'redeem', 'trade', 'withdraw']
                }
            },
            'markets': {
                'BTC/USD': { 'id': 'btc/usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
                'BTC/EUR': { 'id': 'btc/eur', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let balances = yield _this.privatePostBalance();
            let result = { 'info': balances };
            let currencies = _Object$keys(balances);
            for (let c = 0; c < currencies.length; c++) {
                let currency = currencies[c];
                let uppercase = currency.toUpperCase();
                let account = {
                    'free': balances[currency],
                    'used': 0.0,
                    'total': balances[currency]
                };
                result[uppercase] = account;
            }
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let orderbook = yield _this2.publicGetDepthIdLimit(_this2.extend({
                'id': _this2.marketId(symbol),
                'limit': 1000
            }, params));
            return _this2.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'price', 'amount');
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            let ticker = yield _this3.publicGetTickerId(_this3.extend({
                'id': _this3.marketId(symbol)
            }, params));
            let timestamp = ticker['time'] * 1000;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['sell']),
                'ask': parseFloat(ticker['buy']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = parseInt(trade['date']) * 1000;
        let side = trade['type'] == 'ask' ? 'sell' : 'buy';
        return {
            'id': trade['id'],
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

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetTradeIdLimit(_this4.extend({
                'id': market['id'],
                'limit': 1000
            }, params));
            return _this4.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this5.privatePostTrade(_this5.extend({
                'type': side.toUpperCase(),
                'market': _this5.marketId(symbol),
                'amount': amount,
                'price': price
            }, params));
            return {
                'info': response,
                'id': response['order']['id']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            return yield _this6.privatePostCancel({ 'order': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.version + '/';
        if (api == 'public') {
            url += this.implodeParams(path, params);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            url += api;
            body = this.urlencode(this.extend({
                'Method': path.toUpperCase(),
                'Nonce': nonce
            }, params));
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Key': this.apiKey,
                'Signature': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this7.fetch2(path, api, method, params, headers, body);
            if ('error' in response) throw new ExchangeError(_this7.id + ' ' + _this7.json(response));
            return response;
        })();
    }
};