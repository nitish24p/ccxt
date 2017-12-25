"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class gemini extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'gemini',
            'name': 'Gemini',
            'countries': 'US',
            'rateLimit': 1500, // 200 for private API
            'version': 'v1',
            'hasCORS': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27816857-ce7be644-6096-11e7-82d6-3c257263229c.jpg',
                'api': 'https://api.gemini.com',
                'www': 'https://gemini.com',
                'doc': 'https://docs.gemini.com/rest-api'
            },
            'api': {
                'public': {
                    'get': ['symbols', 'pubticker/{symbol}', 'book/{symbol}', 'trades/{symbol}', 'auction/{symbol}', 'auction/{symbol}/history']
                },
                'private': {
                    'post': ['order/new', 'order/cancel', 'order/cancel/session', 'order/cancel/all', 'order/status', 'orders', 'mytrades', 'tradevolume', 'balances', 'deposit/{currency}/newAddress', 'withdraw/{currency}', 'heartbeat']
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.publicGetSymbols();
            let result = [];
            for (let p = 0; p < markets.length; p++) {
                let id = markets[p];
                let market = id;
                let uppercase = market.toUpperCase();
                let base = uppercase.slice(0, 3);
                let quote = uppercase.slice(3, 6);
                let symbol = base + '/' + quote;
                result.push({
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'info': market,
                    'taker': 0.0025
                });
            }
            return result;
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let orderbook = yield _this2.publicGetBookSymbol(_this2.extend({
                'symbol': _this2.marketId(symbol)
            }, params));
            return _this2.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'price', 'amount');
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let ticker = yield _this3.publicGetPubtickerSymbol(_this3.extend({
                'symbol': market['id']
            }, params));
            let timestamp = ticker['volume']['timestamp'];
            let baseVolume = market['base'];
            let quoteVolume = market['quote'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
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
                'baseVolume': parseFloat(ticker['volume'][baseVolume]),
                'quoteVolume': parseFloat(ticker['volume'][quoteVolume]),
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = trade['timestampms'];
        return {
            'id': trade['tid'].toString(),
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': trade['type'],
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['amount'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetTradesSymbol(_this4.extend({
                'symbol': market['id']
            }, params));
            return _this4.parseTrades(response, market, since, limit);
        })();
    }

    fetchBalance(params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let balances = yield _this5.privatePostBalances();
            let result = { 'info': balances };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = balance['currency'];
                let account = {
                    'free': parseFloat(balance['available']),
                    'used': 0.0,
                    'total': parseFloat(balance['amount'])
                };
                account['used'] = account['total'] - account['free'];
                result[currency] = account;
            }
            return _this5.parseBalance(result);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            if (type == 'market') throw new ExchangeError(_this6.id + ' allows limit orders only');
            let nonce = _this6.nonce();
            let order = {
                'client_order_id': nonce.toString(),
                'symbol': _this6.marketId(symbol),
                'amount': amount.toString(),
                'price': price.toString(),
                'side': side,
                'type': 'exchange limit' // gemini allows limit orders only
            };
            let response = yield _this6.privatePostOrderNew(_this6.extend(order, params));
            return {
                'info': response,
                'id': response['order_id']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            return yield _this7.privatePostCancelOrder({ 'order_id': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = '/' + this.version + '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if (_Object$keys(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            let request = this.extend({
                'request': url,
                'nonce': nonce
            }, query);
            let payload = this.json(request);
            payload = this.stringToBase64(this.encode(payload));
            let signature = this.hmac(payload, this.encode(this.secret), 'sha384');
            headers = {
                'Content-Type': 'text/plain',
                'X-GEMINI-APIKEY': this.apiKey,
                'X-GEMINI-PAYLOAD': this.decode(payload),
                'X-GEMINI-SIGNATURE': signature
            };
        }
        url = this.urls['api'] + url;
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this8.fetch2(path, api, method, params, headers, body);
            if ('result' in response) if (response['result'] == 'error') throw new ExchangeError(_this8.id + ' ' + _this8.json(response));
            return response;
        })();
    }
};