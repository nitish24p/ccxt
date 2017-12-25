"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError, NotSupported, AuthenticationError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class bitstamp1 extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bitstamp1',
            'name': 'Bitstamp v1',
            'countries': 'GB',
            'rateLimit': 1000,
            'version': 'v1',
            'hasCORS': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27786377-8c8ab57e-5fe9-11e7-8ea4-2b05b6bcceec.jpg',
                'api': 'https://www.bitstamp.net/api',
                'www': 'https://www.bitstamp.net',
                'doc': 'https://www.bitstamp.net/api'
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'uid': true
            },
            'api': {
                'public': {
                    'get': ['ticker', 'ticker_hour', 'order_book', 'transactions', 'eur_usd']
                },
                'private': {
                    'post': ['balance', 'user_transactions', 'open_orders', 'order_status', 'cancel_order', 'cancel_all_orders', 'buy', 'sell', 'bitcoin_deposit_address', 'unconfirmed_btc', 'ripple_withdrawal', 'ripple_address', 'withdrawal_requests', 'bitcoin_withdrawal']
                }
            },
            'markets': {
                'BTC/USD': { 'id': 'btcusd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'maker': 0.0025, 'taker': 0.0025 },
                'BTC/EUR': { 'id': 'btceur', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR', 'maker': 0.0025, 'taker': 0.0025 },
                'EUR/USD': { 'id': 'eurusd', 'symbol': 'EUR/USD', 'base': 'EUR', 'quote': 'USD', 'maker': 0.0025, 'taker': 0.0025 },
                'XRP/USD': { 'id': 'xrpusd', 'symbol': 'XRP/USD', 'base': 'XRP', 'quote': 'USD', 'maker': 0.0025, 'taker': 0.0025 },
                'XRP/EUR': { 'id': 'xrpeur', 'symbol': 'XRP/EUR', 'base': 'XRP', 'quote': 'EUR', 'maker': 0.0025, 'taker': 0.0025 },
                'XRP/BTC': { 'id': 'xrpbtc', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC', 'maker': 0.0025, 'taker': 0.0025 },
                'LTC/USD': { 'id': 'ltcusd', 'symbol': 'LTC/USD', 'base': 'LTC', 'quote': 'USD', 'maker': 0.0025, 'taker': 0.0025 },
                'LTC/EUR': { 'id': 'ltceur', 'symbol': 'LTC/EUR', 'base': 'LTC', 'quote': 'EUR', 'maker': 0.0025, 'taker': 0.0025 },
                'LTC/BTC': { 'id': 'ltcbtc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'maker': 0.0025, 'taker': 0.0025 },
                'ETH/USD': { 'id': 'ethusd', 'symbol': 'ETH/USD', 'base': 'ETH', 'quote': 'USD', 'maker': 0.0025, 'taker': 0.0025 },
                'ETH/EUR': { 'id': 'etheur', 'symbol': 'ETH/EUR', 'base': 'ETH', 'quote': 'EUR', 'maker': 0.0025, 'taker': 0.0025 },
                'ETH/BTC': { 'id': 'ethbtc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'maker': 0.0025, 'taker': 0.0025 }
            }
        });
    }

    fetchOrderBook(symbol, params = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (symbol != 'BTC/USD') throw new ExchangeError(_this.id + ' ' + _this.version + " fetchOrderBook doesn't support " + symbol + ', use it for BTC/USD only');
            let orderbook = yield _this.publicGetOrderBook(params);
            let timestamp = parseInt(orderbook['timestamp']) * 1000;
            return _this.parseOrderBook(orderbook, timestamp);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            if (symbol != 'BTC/USD') throw new ExchangeError(_this2.id + ' ' + _this2.version + " fetchTicker doesn't support " + symbol + ', use it for BTC/USD only');
            let ticker = yield _this2.publicGetTicker(params);
            let timestamp = parseInt(ticker['timestamp']) * 1000;
            let vwap = parseFloat(ticker['vwap']);
            let baseVolume = parseFloat(ticker['volume']);
            let quoteVolume = baseVolume * vwap;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this2.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': vwap,
                'open': parseFloat(ticker['open']),
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': baseVolume,
                'quoteVolume': quoteVolume,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestamp = undefined;
        if ('date' in trade) {
            timestamp = parseInt(trade['date']) * 1000;
        } else if ('datetime' in trade) {
            // timestamp = this.parse8601 (trade['datetime']);
            timestamp = parseInt(trade['datetime']) * 1000;
        }
        let side = trade['type'] == 0 ? 'buy' : 'sell';
        let order = undefined;
        if ('order_id' in trade) order = trade['order_id'].toString();
        if ('currency_pair' in trade) {
            if (trade['currency_pair'] in this.markets_by_id) market = this.markets_by_id[trade['currency_pair']];
        }
        return {
            'id': trade['tid'].toString(),
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'order': order,
            'type': undefined,
            'side': side,
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['amount'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            if (symbol != 'BTC/USD') throw new ExchangeError(_this3.id + ' ' + _this3.version + " fetchTrades doesn't support " + symbol + ', use it for BTC/USD only');
            let market = _this3.market(symbol);
            let response = yield _this3.publicGetTransactions(_this3.extend({
                'time': 'minute'
            }, params));
            return _this3.parseTrades(response, market, since, limit);
        })();
    }

    fetchBalance(params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            let balance = yield _this4.privatePostBalance();
            let result = { 'info': balance };
            let currencies = _Object$keys(_this4.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let lowercase = currency.toLowerCase();
                let total = lowercase + '_balance';
                let free = lowercase + '_available';
                let used = lowercase + '_reserved';
                let account = _this4.account();
                account['free'] = _this4.safeFloat(balance, free, 0.0);
                account['used'] = _this4.safeFloat(balance, used, 0.0);
                account['total'] = _this4.safeFloat(balance, total, 0.0);
                result[currency] = account;
            }
            return _this4.parseBalance(result);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            if (type != 'limit') throw new ExchangeError(_this5.id + ' ' + _this5.version + ' accepts limit orders only');
            if (symbol != 'BTC/USD') throw new ExchangeError(_this5.id + ' v1 supports BTC/USD orders only');
            let method = 'privatePost' + _this5.capitalize(side);
            let order = {
                'amount': amount,
                'price': price
            };
            let response = yield _this5[method](_this5.extend(order, params));
            return {
                'info': response,
                'id': response['id']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            return yield _this6.privatePostCancelOrder({ 'id': id });
        })();
    }

    parseOrderStatus(order) {
        if (order['status'] == 'Queue' || order['status'] == 'Open') return 'open';
        if (order['status'] == 'Finished') return 'closed';
        return order['status'];
    }

    fetchOrderStatus(id, symbol = undefined) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            let response = yield _this7.privatePostOrderStatus({ 'id': id });
            return _this7.parseOrderStatus(response);
        })();
    }

    fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            let market = undefined;
            if (symbol) market = _this8.market(symbol);
            let pair = market ? market['id'] : 'all';
            let request = _this8.extend({ 'id': pair }, params);
            let response = yield _this8.privatePostOpenOrdersId(request);
            return _this8.parseTrades(response, market, since, limit);
        })();
    }

    fetchOrder(id, symbol = undefined, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            throw new NotSupported(_this9.id + ' fetchOrder is not implemented yet');
            yield _this9.loadMarkets();
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if (_Object$keys(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            let auth = nonce + this.uid + this.apiKey;
            let signature = this.encode(this.hmac(this.encode(auth), this.encode(this.secret)));
            query = this.extend({
                'key': this.apiKey,
                'signature': signature.toUpperCase(),
                'nonce': nonce
            }, query);
            body = this.urlencode(query);
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this10 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this10.fetch2(path, api, method, params, headers, body);
            if ('status' in response) if (response['status'] == 'error') throw new ExchangeError(_this10.id + ' ' + _this10.json(response));
            return response;
        })();
    }
};