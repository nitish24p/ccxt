"use strict";

// ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError, NotSupported, AuthenticationError } = require('./base/errors');

// ---------------------------------------------------------------------------

module.exports = class xbtce extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'xbtce',
            'name': 'xBTCe',
            'countries': 'RU',
            'rateLimit': 2000, // responses are cached every 2 seconds
            'version': 'v1',
            'hasPublicAPI': false,
            'hasCORS': false,
            'hasFetchTickers': true,
            'hasFetchOHLCV': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/28059414-e235970c-662c-11e7-8c3a-08e31f78684b.jpg',
                'api': 'https://cryptottlivewebapi.xbtce.net:8443/api',
                'www': 'https://www.xbtce.com',
                'doc': ['https://www.xbtce.com/tradeapi', 'https://support.xbtce.info/Knowledgebase/Article/View/52/25/xbtce-exchange-api']
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'uid': true
            },
            'api': {
                'public': {
                    'get': ['currency', 'currency/{filter}', 'level2', 'level2/{filter}', 'quotehistory/{symbol}/{periodicity}/bars/ask', 'quotehistory/{symbol}/{periodicity}/bars/bid', 'quotehistory/{symbol}/level2', 'quotehistory/{symbol}/ticks', 'symbol', 'symbol/{filter}', 'tick', 'tick/{filter}', 'ticker', 'ticker/{filter}', 'tradesession']
                },
                'private': {
                    'get': ['tradeserverinfo', 'tradesession', 'currency', 'currency/{filter}', 'level2', 'level2/{filter}', 'symbol', 'symbol/{filter}', 'tick', 'tick/{filter}', 'account', 'asset', 'asset/{id}', 'position', 'position/{id}', 'trade', 'trade/{id}', 'quotehistory/{symbol}/{periodicity}/bars/ask', 'quotehistory/{symbol}/{periodicity}/bars/ask/info', 'quotehistory/{symbol}/{periodicity}/bars/bid', 'quotehistory/{symbol}/{periodicity}/bars/bid/info', 'quotehistory/{symbol}/level2', 'quotehistory/{symbol}/level2/info', 'quotehistory/{symbol}/periodicities', 'quotehistory/{symbol}/ticks', 'quotehistory/{symbol}/ticks/info', 'quotehistory/cache/{symbol}/{periodicity}/bars/ask', 'quotehistory/cache/{symbol}/{periodicity}/bars/bid', 'quotehistory/cache/{symbol}/level2', 'quotehistory/cache/{symbol}/ticks', 'quotehistory/symbols', 'quotehistory/version'],
                    'post': ['trade', 'tradehistory'],
                    'put': ['trade'],
                    'delete': ['trade']
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.privateGetSymbol();
            let result = [];
            for (let p = 0; p < markets.length; p++) {
                let market = markets[p];
                let id = market['Symbol'];
                let base = market['MarginCurrency'];
                let quote = market['ProfitCurrency'];
                if (base == 'DSH') base = 'DASH';
                let symbol = base + '/' + quote;
                symbol = market['IsTradeAllowed'] ? symbol : id;
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
            let balances = yield _this2.privateGetAsset();
            let result = { 'info': balances };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = balance['Currency'];
                let uppercase = currency.toUpperCase();
                // xbtce names DASH incorrectly as DSH
                if (uppercase == 'DSH') uppercase = 'DASH';
                let account = {
                    'free': balance['FreeAmount'],
                    'used': balance['LockedAmount'],
                    'total': balance['Amount']
                };
                result[uppercase] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let orderbook = yield _this3.privateGetLevel2Filter(_this3.extend({
                'filter': market['id']
            }, params));
            orderbook = orderbook[0];
            let timestamp = orderbook['Timestamp'];
            return _this3.parseOrderBook(orderbook, timestamp, 'Bids', 'Asks', 'Price', 'Volume');
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = 0;
        let last = undefined;
        if ('LastBuyTimestamp' in ticker) if (timestamp < ticker['LastBuyTimestamp']) {
            timestamp = ticker['LastBuyTimestamp'];
            last = ticker['LastBuyPrice'];
        }
        if ('LastSellTimestamp' in ticker) if (timestamp < ticker['LastSellTimestamp']) {
            timestamp = ticker['LastSellTimestamp'];
            last = ticker['LastSellPrice'];
        }
        if (!timestamp) timestamp = this.milliseconds();
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': ticker['DailyBestBuyPrice'],
            'low': ticker['DailyBestSellPrice'],
            'bid': ticker['BestBid'],
            'ask': ticker['BestAsk'],
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': last,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': ticker['DailyTradedTotalVolume'],
            'quoteVolume': undefined,
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let tickers = yield _this4.publicGetTicker(params);
            tickers = _this4.indexBy(tickers, 'Symbol');
            let ids = _Object$keys(tickers);
            let result = {};
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let market = undefined;
                let symbol = undefined;
                if (id in _this4.markets_by_id) {
                    market = _this4.markets_by_id[id];
                    symbol = market['symbol'];
                } else {
                    let base = id.slice(0, 3);
                    let quote = id.slice(3, 6);
                    if (base == 'DSH') base = 'DASH';
                    if (quote == 'DSH') quote = 'DASH';
                    symbol = base + '/' + quote;
                }
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
            let tickers = yield _this5.publicGetTickerFilter(_this5.extend({
                'filter': market['id']
            }, params));
            let length = tickers.length;
            if (length < 1) throw new ExchangeError(_this5.id + ' fetchTicker returned empty response, xBTCe public API error');
            tickers = _this5.indexBy(tickers, 'Symbol');
            let ticker = tickers[market['id']];
            return _this5.parseTicker(ticker, market);
        })();
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            // no method for trades?
            return yield _this6.privateGetTrade(params);
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '1m', since = undefined, limit = undefined) {
        return [ohlcv['Timestamp'], ohlcv['Open'], ohlcv['High'], ohlcv['Low'], ohlcv['Close'], ohlcv['Volume']];
    }

    fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            throw new NotSupported(_this7.id + ' fetchOHLCV is disabled by the exchange');
            let minutes = parseInt(timeframe / 60); // 1 minute by default
            let periodicity = minutes.toString();
            yield _this7.loadMarkets();
            let market = _this7.market(symbol);
            if (!since) since = _this7.seconds() - 86400 * 7; // last day by defulat
            if (!limit) limit = 1000; // default
            let response = yield _this7.privateGetQuotehistorySymbolPeriodicityBarsBid(_this7.extend({
                'symbol': market['id'],
                'periodicity': periodicity,
                'timestamp': since,
                'count': limit
            }, params));
            return _this7.parseOHLCVs(response['Bars'], market, timeframe, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            if (type == 'market') throw new ExchangeError(_this8.id + ' allows limit orders only');
            let response = yield _this8.tapiPostTrade(_this8.extend({
                'pair': _this8.marketId(symbol),
                'type': side,
                'amount': amount,
                'rate': price
            }, params));
            return {
                'info': response,
                'id': response['Id'].toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            return yield _this9.privateDeleteTrade(_this9.extend({
                'Type': 'Cancel',
                'Id': id
            }, params));
        })();
    }

    nonce() {
        return this.milliseconds();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        if (!this.apiKey) throw new AuthenticationError(this.id + ' requires apiKey for all requests, their public API is always busy');
        if (!this.uid) throw new AuthenticationError(this.id + ' requires uid property for authentication and trading, their public API is always busy');
        let url = this.urls['api'] + '/' + this.version;
        if (api == 'public') url += '/' + api;
        url += '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if (_Object$keys(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            headers = { 'Accept-Encoding': 'gzip, deflate' };
            let nonce = this.nonce().toString();
            if (method == 'POST') {
                if (_Object$keys(query).length) {
                    headers['Content-Type'] = 'application/json';
                    body = this.json(query);
                } else {
                    url += '?' + this.urlencode(query);
                }
            }
            let auth = nonce + this.uid + this.apiKey + method + url;
            if (body) auth += body;
            let signature = this.hmac(this.encode(auth), this.encode(this.secret), 'sha256', 'base64');
            let credentials = this.uid + ':' + this.apiKey + ':' + nonce + ':' + this.binaryToString(signature);
            headers['Authorization'] = 'HMAC ' + credentials;
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
};