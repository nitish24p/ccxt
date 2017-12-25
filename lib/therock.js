"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class therock extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'therock',
            'name': 'TheRockTrading',
            'countries': 'MT',
            'rateLimit': 1000,
            'version': 'v1',
            'hasCORS': false,
            'hasFetchTickers': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766869-75057fa2-5ee9-11e7-9a6f-13e641fa4707.jpg',
                'api': 'https://api.therocktrading.com',
                'www': 'https://therocktrading.com',
                'doc': ['https://api.therocktrading.com/doc/v1/index.html', 'https://api.therocktrading.com/doc/']
            },
            'api': {
                'public': {
                    'get': ['funds/{id}/orderbook', 'funds/{id}/ticker', 'funds/{id}/trades', 'funds/tickers']
                },
                'private': {
                    'get': ['balances', 'balances/{id}', 'discounts', 'discounts/{id}', 'funds', 'funds/{id}', 'funds/{id}/trades', 'funds/{fund_id}/orders', 'funds/{fund_id}/orders/{id}', 'funds/{fund_id}/position_balances', 'funds/{fund_id}/positions', 'funds/{fund_id}/positions/{id}', 'transactions', 'transactions/{id}', 'withdraw_limits/{id}', 'withdraw_limits'],
                    'post': ['atms/withdraw', 'funds/{fund_id}/orders'],
                    'delete': ['funds/{fund_id}/orders/{id}', 'funds/{fund_id}/orders/remove_all']
                }
            },
            'fees': {
                'trading': {
                    'maker': 0.02 / 100,
                    'taker': 0.2 / 100
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.publicGetFundsTickers();
            let result = [];
            for (let p = 0; p < markets['tickers'].length; p++) {
                let market = markets['tickers'][p];
                let id = market['fund_id'];
                let base = id.slice(0, 3);
                let quote = id.slice(3, 6);
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
            let response = yield _this2.privateGetBalances();
            let balances = response['balances'];
            let result = { 'info': response };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = balance['currency'];
                let free = balance['trading_balance'];
                let total = balance['balance'];
                let used = total - free;
                let account = {
                    'free': free,
                    'used': used,
                    'total': total
                };
                result[currency] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let orderbook = yield _this3.publicGetFundsIdOrderbook(_this3.extend({
                'id': _this3.marketId(symbol)
            }, params));
            let timestamp = _this3.parse8601(orderbook['date']);
            return _this3.parseOrderBook(orderbook, timestamp, 'bids', 'asks', 'price', 'amount');
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = this.parse8601(ticker['date']);
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': parseFloat(ticker['high']),
            'low': parseFloat(ticker['low']),
            'bid': parseFloat(ticker['bid']),
            'ask': parseFloat(ticker['ask']),
            'vwap': undefined,
            'open': parseFloat(ticker['open']),
            'close': parseFloat(ticker['close']),
            'first': undefined,
            'last': parseFloat(ticker['last']),
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': parseFloat(ticker['volume_traded']),
            'quoteVolume': parseFloat(ticker['volume']),
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let response = yield _this4.publicGetFundsTickers(params);
            let tickers = _this4.indexBy(response['tickers'], 'fund_id');
            let ids = _Object$keys(tickers);
            let result = {};
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let market = _this4.markets_by_id[id];
                let symbol = market['symbol'];
                let ticker = tickers[id];
                result[symbol] = _this4.parseTicker(ticker, market);
            }
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let ticker = yield _this5.publicGetFundsIdTicker(_this5.extend({
                'id': market['id']
            }, params));
            return _this5.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market = undefined) {
        if (!market) market = this.markets_by_id[trade['fund_id']];
        let timestamp = this.parse8601(trade['date']);
        return {
            'info': trade,
            'id': trade['id'].toString(),
            'order': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': trade['side'],
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let response = yield _this6.publicGetFundsIdTrades(_this6.extend({
                'id': market['id']
            }, params));
            return _this6.parseTrades(response['trades'], market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            if (type == 'market') throw new ExchangeError(_this7.id + ' allows limit orders only');
            let response = yield _this7.privatePostFundsFundIdOrders(_this7.extend({
                'fund_id': _this7.marketId(symbol),
                'side': side,
                'amount': amount,
                'price': price
            }, params));
            return {
                'info': response,
                'id': response['id'].toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            return yield _this8.privateDeleteFundsFundIdOrdersId(_this8.extend({
                'id': id
            }, params));
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'private') {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            let auth = nonce + url;
            headers = {
                'X-TRT-KEY': this.apiKey,
                'X-TRT-NONCE': nonce,
                'X-TRT-SIGN': this.hmac(this.encode(auth), this.encode(this.secret), 'sha512')
            };
            if (_Object$keys(query).length) {
                body = this.json(query);
                headers['Content-Type'] = 'application/json';
            }
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this9.fetch2(path, api, method, params, headers, body);
            if ('errors' in response) throw new ExchangeError(_this9.id + ' ' + _this9.json(response));
            return response;
        })();
    }
};