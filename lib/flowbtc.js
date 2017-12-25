"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError, AuthenticationError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class flowbtc extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'flowbtc',
            'name': 'flowBTC',
            'countries': 'BR', // Brazil
            'version': 'v1',
            'rateLimit': 1000,
            'hasCORS': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/28162465-cd815d4c-67cf-11e7-8e57-438bea0523a2.jpg',
                'api': 'https://api.flowbtc.com:8400/ajax',
                'www': 'https://trader.flowbtc.com',
                'doc': 'http://www.flowbtc.com.br/api/'
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'uid': true
            },
            'api': {
                'public': {
                    'post': ['GetTicker', 'GetTrades', 'GetTradesByDate', 'GetOrderBook', 'GetProductPairs', 'GetProducts']
                },
                'private': {
                    'post': ['CreateAccount', 'GetUserInfo', 'SetUserInfo', 'GetAccountInfo', 'GetAccountTrades', 'GetDepositAddresses', 'Withdraw', 'CreateOrder', 'ModifyOrder', 'CancelOrder', 'CancelAllOrders', 'GetAccountOpenOrders', 'GetOrderFee']
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let response = yield _this.publicPostGetProductPairs();
            let markets = response['productPairs'];
            let result = [];
            for (let p = 0; p < markets.length; p++) {
                let market = markets[p];
                let id = market['name'];
                let base = market['product1Label'];
                let quote = market['product2Label'];
                let symbol = base + '/' + quote;
                result.push({
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'info': market
                });
            }
            return result;
        })();
    }

    fetchBalance(params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let response = yield _this2.privatePostGetAccountInfo();
            let balances = response['currencies'];
            let result = { 'info': response };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = balance['name'];
                let account = {
                    'free': balance['balance'],
                    'used': balance['hold'],
                    'total': 0.0
                };
                account['total'] = _this2.sum(account['free'], account['used']);
                result[currency] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let orderbook = yield _this3.publicPostGetOrderBook(_this3.extend({
                'productPair': market['id']
            }, params));
            return _this3.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'px', 'qty');
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let ticker = yield _this4.publicPostGetTicker(_this4.extend({
                'productPair': market['id']
            }, params));
            let timestamp = _this4.milliseconds();
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this4.iso8601(timestamp),
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
                'baseVolume': parseFloat(ticker['volume24hr']),
                'quoteVolume': parseFloat(ticker['volume24hrProduct2']),
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = trade['unixtime'] * 1000;
        let side = trade['incomingOrderSide'] == 0 ? 'buy' : 'sell';
        return {
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'id': trade['tid'].toString(),
            'order': undefined,
            'type': undefined,
            'side': side,
            'price': trade['px'],
            'amount': trade['qty']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let response = yield _this5.publicPostGetTrades(_this5.extend({
                'ins': market['id'],
                'startIndex': -1
            }, params));
            return _this5.parseTrades(response['trades'], market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let orderType = type == 'market' ? 1 : 0;
            let order = {
                'ins': _this6.marketId(symbol),
                'side': side,
                'orderType': orderType,
                'qty': amount,
                'px': price
            };
            let response = yield _this6.privatePostCreateOrder(_this6.extend(order, params));
            return {
                'info': response,
                'id': response['serverOrderId']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            if ('ins' in params) {
                return yield _this7.privatePostCancelOrder(_this7.extend({
                    'serverOrderId': id
                }, params));
            }
            throw new ExchangeError(_this7.id + ' requires `ins` symbol parameter for cancelling an order');
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.version + '/' + path;
        if (api == 'public') {
            if (_Object$keys(params).length) {
                body = this.json(params);
            }
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            let auth = nonce.toString() + this.uid + this.apiKey;
            let signature = this.hmac(this.encode(auth), this.encode(this.secret));
            body = this.json(this.extend({
                'apiKey': this.apiKey,
                'apiNonce': nonce,
                'apiSig': signature.toUpperCase()
            }, params));
            headers = {
                'Content-Type': 'application/json'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this8.fetch2(path, api, method, params, headers, body);
            if ('isAccepted' in response) if (response['isAccepted']) return response;
            throw new ExchangeError(_this8.id + ' ' + _this8.json(response));
        })();
    }
};