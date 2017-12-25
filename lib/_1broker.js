"use strict";

// ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError, AuthenticationError } = require('./base/errors');

// ---------------------------------------------------------------------------

module.exports = class _1broker extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': '_1broker',
            'name': '1Broker',
            'countries': 'US',
            'rateLimit': 1500,
            'version': 'v2',
            'hasPublicAPI': false,
            'hasCORS': true,
            'hasFetchTrades': false,
            'hasFetchOHLCV': true,
            'timeframes': {
                '1m': '60',
                '15m': '900',
                '1h': '3600',
                '1d': '86400'
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766021-420bd9fc-5ecb-11e7-8ed6-56d0081efed2.jpg',
                'api': 'https://1broker.com/api',
                'www': 'https://1broker.com',
                'doc': 'https://1broker.com/?c=en/content/api-documentation'
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': false
            },
            'api': {
                'private': {
                    'get': ['market/bars', 'market/categories', 'market/details', 'market/list', 'market/quotes', 'market/ticks', 'order/cancel', 'order/create', 'order/open', 'position/close', 'position/close_cancel', 'position/edit', 'position/history', 'position/open', 'position/shared/get', 'social/profile_statistics', 'social/profile_trades', 'user/bitcoin_deposit_address', 'user/details', 'user/overview', 'user/quota_status', 'user/transaction_log']
                }
            }
        });
    }

    fetchCategories() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let response = yield _this.privateGetMarketCategories();
            // they return an empty string among their categories, wtf?
            let categories = response['response'];
            let result = [];
            for (let i = 0; i < categories.length; i++) {
                if (categories[i]) result.push(categories[i]);
            }
            return result;
        })();
    }

    fetchMarkets() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let this_ = _this2; // workaround for Babel bug (not passing `this` to _recursive() call)
            let categories = yield _this2.fetchCategories();
            let result = [];
            for (let c = 0; c < categories.length; c++) {
                let category = categories[c];
                let markets = yield this_.privateGetMarketList({
                    'category': category.toLowerCase()
                });
                for (let p = 0; p < markets['response'].length; p++) {
                    let market = markets['response'][p];
                    let id = market['symbol'];
                    let symbol = undefined;
                    let base = undefined;
                    let quote = undefined;
                    if (category == 'FOREX' || category == 'CRYPTO') {
                        symbol = market['name'];
                        let parts = symbol.split('/');
                        base = parts[0];
                        quote = parts[1];
                    } else {
                        base = id;
                        quote = 'USD';
                        symbol = base + '/' + quote;
                    }
                    base = this_.commonCurrencyCode(base);
                    quote = this_.commonCurrencyCode(quote);
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
            }
            return result;
        })();
    }

    fetchBalance(params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let balance = yield _this3.privateGetUserOverview();
            let response = balance['response'];
            let result = {
                'info': response
            };
            let currencies = Object.keys(_this3.currencies);
            for (let c = 0; c < currencies.length; c++) {
                let currency = currencies[c];
                result[currency] = _this3.account();
            }
            let total = parseFloat(response['balance']);
            result['BTC']['free'] = total;
            result['BTC']['total'] = total;
            return _this3.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let response = yield _this4.privateGetMarketQuotes(_this4.extend({
                'symbols': _this4.marketId(symbol)
            }, params));
            let orderbook = response['response'][0];
            let timestamp = _this4.parse8601(orderbook['updated']);
            let bidPrice = parseFloat(orderbook['bid']);
            let askPrice = parseFloat(orderbook['ask']);
            let bid = [bidPrice, undefined];
            let ask = [askPrice, undefined];
            return {
                'timestamp': timestamp,
                'datetime': _this4.iso8601(timestamp),
                'bids': [bid],
                'asks': [ask]
            };
        })();
    }

    fetchTrades(symbol) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            throw new ExchangeError(_this5.id + ' fetchTrades () method not implemented yet');
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let result = yield _this6.privateGetMarketBars(_this6.extend({
                'symbol': _this6.marketId(symbol),
                'resolution': 60,
                'limit': 1
            }, params));
            let orderbook = yield _this6.fetchOrderBook(symbol);
            let ticker = result['response'][0];
            let timestamp = _this6.parse8601(ticker['date']);
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this6.iso8601(timestamp),
                'high': parseFloat(ticker['h']),
                'low': parseFloat(ticker['l']),
                'bid': orderbook['bids'][0][0],
                'ask': orderbook['asks'][0][0],
                'vwap': undefined,
                'open': parseFloat(ticker['o']),
                'close': parseFloat(ticker['c']),
                'first': undefined,
                'last': undefined,
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': undefined,
                'info': ticker
            };
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '1m', since = undefined, limit = undefined) {
        return [this.parse8601(ohlcv['date']), parseFloat(ohlcv['o']), parseFloat(ohlcv['h']), parseFloat(ohlcv['l']), parseFloat(ohlcv['c']), undefined];
    }

    fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            let market = _this7.market(symbol);
            let request = {
                'symbol': market['id'],
                'resolution': _this7.timeframes[timeframe]
            };
            if (since) request['date_start'] = _this7.iso8601(since); // they also support date_end
            if (limit) request['limit'] = limit;
            let result = yield _this7.privateGetMarketBars(_this7.extend(request, params));
            return _this7.parseOHLCVs(result['response'], market, timeframe, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            let order = {
                'symbol': _this8.marketId(symbol),
                'margin': amount,
                'direction': side == 'sell' ? 'short' : 'long',
                'leverage': 1,
                'type': side
            };
            if (type == 'limit') order['price'] = price;else order['type'] += '_market';
            let result = yield _this8.privateGetOrderCreate(_this8.extend(order, params));
            return {
                'info': result,
                'id': result['response']['order_id']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            yield _this9.loadMarkets();
            return yield _this9.privatePostOrderCancel({ 'order_id': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        this.checkRequiredCredentials();
        let url = this.urls['api'] + '/' + this.version + '/' + path + '.php';
        let query = this.extend({ 'token': this.apiKey }, params);
        url += '?' + this.urlencode(query);
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this10 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this10.fetch2(path, api, method, params, headers, body);
            if ('warning' in response) if (response['warning']) throw new ExchangeError(_this10.id + ' ' + _this10.json(response));
            if ('error' in response) if (response['error']) throw new ExchangeError(_this10.id + ' ' + _this10.json(response));
            return response;
        })();
    }
};