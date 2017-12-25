"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class paymium extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'paymium',
            'name': 'Paymium',
            'countries': ['FR', 'EU'],
            'rateLimit': 2000,
            'version': 'v1',
            'hasCORS': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27790564-a945a9d4-5ff9-11e7-9d2d-b635763f2f24.jpg',
                'api': 'https://paymium.com/api',
                'www': 'https://www.paymium.com',
                'doc': ['https://github.com/Paymium/api-documentation', 'https://www.paymium.com/page/developers']
            },
            'api': {
                'public': {
                    'get': ['countries', 'data/{id}/ticker', 'data/{id}/trades', 'data/{id}/depth', 'bitcoin_charts/{id}/trades', 'bitcoin_charts/{id}/depth']
                },
                'private': {
                    'get': ['merchant/get_payment/{UUID}', 'user', 'user/addresses', 'user/addresses/{btc_address}', 'user/orders', 'user/orders/{UUID}', 'user/price_alerts'],
                    'post': ['user/orders', 'user/addresses', 'user/payment_requests', 'user/price_alerts', 'merchant/create_payment'],
                    'delete': ['user/orders/{UUID}/cancel', 'user/price_alerts/{id}']
                }
            },
            'markets': {
                'BTC/EUR': { 'id': 'eur', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' }
            },
            'fees': {
                'trading': {
                    'maker': 0.0059,
                    'taker': 0.0059
                }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let balances = yield _this.privateGetUser();
            let result = { 'info': balances };
            let currencies = _Object$keys(_this.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let lowercase = currency.toLowerCase();
                let account = _this.account();
                let balance = 'balance_' + lowercase;
                let locked = 'locked_' + lowercase;
                if (balance in balances) account['free'] = balances[balance];
                if (locked in balances) account['used'] = balances[locked];
                account['total'] = _this.sum(account['free'], account['used']);
                result[currency] = account;
            }
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let orderbook = yield _this2.publicGetDataIdDepth(_this2.extend({
                'id': _this2.marketId(symbol)
            }, params));
            let result = _this2.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'price', 'amount');
            result['bids'] = _this2.sortBy(result['bids'], 0, true);
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            let ticker = yield _this3.publicGetDataIdTicker(_this3.extend({
                'id': _this3.marketId(symbol)
            }, params));
            let timestamp = ticker['at'] * 1000;
            let vwap = parseFloat(ticker['vwap']);
            let baseVolume = parseFloat(ticker['volume']);
            let quoteVolume = baseVolume * vwap;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': _this3.safeFloat(ticker, 'high'),
                'low': _this3.safeFloat(ticker, 'low'),
                'bid': _this3.safeFloat(ticker, 'bid'),
                'ask': _this3.safeFloat(ticker, 'ask'),
                'vwap': vwap,
                'open': _this3.safeFloat(ticker, 'open'),
                'close': undefined,
                'first': undefined,
                'last': _this3.safeFloat(ticker, 'price'),
                'change': undefined,
                'percentage': _this3.safeFloat(ticker, 'variation'),
                'average': undefined,
                'baseVolume': baseVolume,
                'quoteVolume': quoteVolume,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = parseInt(trade['created_at_int']) * 1000;
        let volume = 'traded_' + market['base'].toLowerCase();
        return {
            'info': trade,
            'id': trade['uuid'],
            'order': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': trade['side'],
            'price': trade['price'],
            'amount': trade[volume]
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetDataIdTrades(_this4.extend({
                'id': market['id']
            }, params));
            return _this4.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(market, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            let order = {
                'type': _this5.capitalize(type) + 'Order',
                'currency': _this5.marketId(market),
                'direction': side,
                'amount': amount
            };
            if (type == 'market') order['price'] = price;
            let response = yield _this5.privatePostUserOrders(_this5.extend(order, params));
            return {
                'info': response,
                'id': response['uuid']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            return yield _this6.privatePostCancelOrder(_this6.extend({
                'orderNumber': id
            }, params));
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if (_Object$keys(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            body = this.json(params);
            let nonce = this.nonce().toString();
            let auth = nonce + url + body;
            headers = {
                'Api-Key': this.apiKey,
                'Api-Signature': this.hmac(this.encode(auth), this.secret),
                'Api-Nonce': nonce,
                'Content-Type': 'application/json'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this7.fetch2(path, api, method, params, headers, body);
            if ('errors' in response) throw new ExchangeError(_this7.id + ' ' + _this7.json(response));
            return response;
        })();
    }
};