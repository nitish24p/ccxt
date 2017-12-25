"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class btcturk extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'btcturk',
            'name': 'BTCTurk',
            'countries': 'TR', // Turkey
            'rateLimit': 1000,
            'hasCORS': true,
            'hasFetchTickers': true,
            'hasFetchOHLCV': true,
            'timeframes': {
                '1d': '1d'
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27992709-18e15646-64a3-11e7-9fa2-b0950ec7712f.jpg',
                'api': 'https://www.btcturk.com/api',
                'www': 'https://www.btcturk.com',
                'doc': 'https://github.com/BTCTrader/broker-api-docs'
            },
            'api': {
                'public': {
                    'get': ['ohlcdata', // ?last=COUNT
                    'orderbook', 'ticker', 'trades']
                },
                'private': {
                    'get': ['balance', 'openOrders', 'userTransactions'],
                    'post': ['buy', 'cancelOrder', 'sell']
                }
            },
            'markets': {
                'BTC/TRY': { 'id': 'BTCTRY', 'symbol': 'BTC/TRY', 'base': 'BTC', 'quote': 'TRY', 'maker': 0.002 * 1.18, 'taker': 0.0035 * 1.18 },
                'ETH/TRY': { 'id': 'ETHTRY', 'symbol': 'ETH/TRY', 'base': 'ETH', 'quote': 'TRY', 'maker': 0.002 * 1.18, 'taker': 0.0035 * 1.18 },
                'ETH/BTC': { 'id': 'ETHBTC', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'maker': 0.002 * 1.18, 'taker': 0.0035 * 1.18 }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let response = yield _this.privateGetBalance();
            let result = { 'info': response };
            let base = {
                'free': response['bitcoin_available'],
                'used': response['bitcoin_reserved'],
                'total': response['bitcoin_balance']
            };
            let quote = {
                'free': response['money_available'],
                'used': response['money_reserved'],
                'total': response['money_balance']
            };
            let symbol = _this.symbols[0];
            let market = _this.markets[symbol];
            result[market['base']] = base;
            result[market['quote']] = quote;
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let market = _this2.market(symbol);
            let orderbook = yield _this2.publicGetOrderbook(_this2.extend({
                'pairSymbol': market['id']
            }, params));
            let timestamp = parseInt(orderbook['timestamp'] * 1000);
            return _this2.parseOrderBook(orderbook, timestamp);
        })();
    }

    parseTicker(ticker, market = undefined) {
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        let timestamp = parseInt(ticker['timestamp']) * 1000;
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
            'close': undefined,
            'first': undefined,
            'last': parseFloat(ticker['last']),
            'change': undefined,
            'percentage': undefined,
            'average': parseFloat(ticker['average']),
            'baseVolume': parseFloat(ticker['volume']),
            'quoteVolume': undefined,
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let tickers = yield _this3.publicGetTicker(params);
            let result = {};
            for (let i = 0; i < tickers.length; i++) {
                let ticker = tickers[i];
                let symbol = ticker['pair'];
                let market = undefined;
                if (symbol in _this3.markets_by_id) {
                    market = _this3.markets_by_id[symbol];
                    symbol = market['symbol'];
                }
                result[symbol] = _this3.parseTicker(ticker, market);
            }
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let tickers = yield _this4.fetchTickers();
            let result = undefined;
            if (symbol in tickers) result = tickers[symbol];
            return result;
        })();
    }

    parseTrade(trade, market) {
        let timestamp = trade['date'] * 1000;
        return {
            'id': trade['tid'],
            'info': trade,
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
        var _this5 = this;

        return _asyncToGenerator(function* () {
            let market = _this5.market(symbol);
            // let maxCount = 50;
            let response = yield _this5.publicGetTrades(_this5.extend({
                'pairSymbol': market['id']
            }, params));
            return _this5.parseTrades(response, market, since, limit);
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '1d', since = undefined, limit = undefined) {
        let timestamp = this.parse8601(ohlcv['Time']);
        return [timestamp, ohlcv['Open'], ohlcv['High'], ohlcv['Low'], ohlcv['Close'], ohlcv['Volume']];
    }

    fetchOHLCV(symbol, timeframe = '1d', since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let request = {};
            if (limit) request['last'] = limit;
            let response = yield _this6.publicGetOhlcdata(_this6.extend(request, params));
            return _this6.parseOHLCVs(response, market, timeframe, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            let method = 'privatePost' + _this7.capitalize(side);
            let order = {
                'Type': side == 'buy' ? 'BuyBtc' : 'SelBtc',
                'IsMarketOrder': type == 'market' ? 1 : 0
            };
            if (type == 'market') {
                if (side == 'buy') order['Total'] = amount;else order['Amount'] = amount;
            } else {
                order['Price'] = price;
                order['Amount'] = amount;
            }
            let response = yield _this7[method](_this7.extend(order, params));
            return {
                'info': response,
                'id': response['id']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            return yield _this8.privatePostCancelOrder({ 'id': id });
        })();
    }

    nonce() {
        return this.milliseconds();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        if (this.id == 'btctrader') throw new ExchangeError(this.id + ' is an abstract base API for BTCExchange, BTCTurk');
        let url = this.urls['api'] + '/' + path;
        if (api == 'public') {
            if (_Object$keys(params).length) url += '?' + this.urlencode(params);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            body = this.urlencode(params);
            let secret = this.base64ToBinary(this.secret);
            let auth = this.apiKey + nonce;
            headers = {
                'X-PCK': this.apiKey,
                'X-Stamp': nonce,
                'X-Signature': this.stringToBase64(this.hmac(this.encode(auth), secret, 'sha256', 'binary')),
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
};