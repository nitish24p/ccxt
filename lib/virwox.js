"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class virwox extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'virwox',
            'name': 'VirWoX',
            'countries': ['AT', 'EU'],
            'rateLimit': 1000,
            'hasCORS': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766894-6da9d360-5eea-11e7-90aa-41f2711b7405.jpg',
                'api': {
                    'public': 'http://api.virwox.com/api/json.php',
                    'private': 'https://www.virwox.com/api/trading.php'
                },
                'www': 'https://www.virwox.com',
                'doc': 'https://www.virwox.com/developers.php'
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': false,
                'login': true,
                'password': true
            },
            'api': {
                'public': {
                    'get': ['getInstruments', 'getBestPrices', 'getMarketDepth', 'estimateMarketOrder', 'getTradedPriceVolume', 'getRawTradeData', 'getStatistics', 'getTerminalList', 'getGridList', 'getGridStatistics'],
                    'post': ['getInstruments', 'getBestPrices', 'getMarketDepth', 'estimateMarketOrder', 'getTradedPriceVolume', 'getRawTradeData', 'getStatistics', 'getTerminalList', 'getGridList', 'getGridStatistics']
                },
                'private': {
                    'get': ['cancelOrder', 'getBalances', 'getCommissionDiscount', 'getOrders', 'getTransactions', 'placeOrder'],
                    'post': ['cancelOrder', 'getBalances', 'getCommissionDiscount', 'getOrders', 'getTransactions', 'placeOrder']
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.publicGetInstruments();
            let keys = Object.keys(markets['result']);
            let result = [];
            for (let p = 0; p < keys.length; p++) {
                let market = markets['result'][keys[p]];
                let id = market['instrumentID'];
                let symbol = market['symbol'];
                let base = market['longCurrency'];
                let quote = market['shortCurrency'];
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
            let response = yield _this2.privatePostGetBalances();
            let balances = response['result']['accountList'];
            let result = { 'info': balances };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = balance['currency'];
                let total = balance['balance'];
                let account = {
                    'free': total,
                    'used': 0.0,
                    'total': total
                };
                result[currency] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchMarketPrice(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let response = yield _this3.publicPostGetBestPrices(_this3.extend({
                'symbols': [symbol]
            }, params));
            let result = response['result'];
            return {
                'bid': _this3.safeFloat(result[0], 'bestBuyPrice'),
                'ask': _this3.safeFloat(result[0], 'bestSellPrice')
            };
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let response = yield _this4.publicPostGetMarketDepth(_this4.extend({
                'symbols': [symbol],
                'buyDepth': 100,
                'sellDepth': 100
            }, params));
            let orderbook = response['result'][0];
            return _this4.parseOrderBook(orderbook, undefined, 'buy', 'sell', 'price', 'volume');
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let end = _this5.milliseconds();
            let start = end - 86400000;
            let response = yield _this5.publicGetTradedPriceVolume(_this5.extend({
                'instrument': symbol,
                'endDate': _this5.YmdHMS(end),
                'startDate': _this5.YmdHMS(start),
                'HLOC': 1
            }, params));
            let marketPrice = yield _this5.fetchMarketPrice(symbol, params);
            let tickers = response['result']['priceVolumeList'];
            let keys = Object.keys(tickers);
            let length = keys.length;
            let lastKey = keys[length - 1];
            let ticker = tickers[lastKey];
            let timestamp = _this5.milliseconds();
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this5.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': marketPrice['bid'],
                'ask': marketPrice['ask'],
                'vwap': undefined,
                'open': parseFloat(ticker['open']),
                'close': parseFloat(ticker['close']),
                'first': undefined,
                'last': undefined,
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['longVolume']),
                'quoteVolume': parseFloat(ticker['shortVolume']),
                'info': ticker
            };
        })();
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            return yield _this6.publicGetRawTradeData(_this6.extend({
                'instrument': market['id'],
                'timespan': 3600
            }, params));
        })();
    }

    createOrder(market, type, side, amount, price = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            let order = {
                'instrument': _this7.symbol(market),
                'orderType': side.toUpperCase(),
                'amount': amount
            };
            if (type == 'limit') order['price'] = price;
            let response = yield _this7.privatePostPlaceOrder(_this7.extend(order, params));
            return {
                'info': response,
                'id': response['orderID'].toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            return yield _this8.privatePostCancelOrder(_this8.extend({
                'orderID': id
            }, params));
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api];
        let auth = {};
        if (api == 'private') {
            this.checkRequiredCredentials();
            auth['key'] = this.apiKey;
            auth['user'] = this.login;
            auth['pass'] = this.password;
        }
        let nonce = this.nonce();
        if (method == 'GET') {
            url += '?' + this.urlencode(this.extend({
                'method': path,
                'id': nonce
            }, auth, params));
        } else {
            headers = { 'Content-Type': 'application/json' };
            body = this.json({
                'method': path,
                'params': this.extend(auth, params),
                'id': nonce
            });
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this9.fetch2(path, api, method, params, headers, body);
            if ('error' in response) if (response['error']) throw new ExchangeError(_this9.id + ' ' + _this9.json(response));
            return response;
        })();
    }
};