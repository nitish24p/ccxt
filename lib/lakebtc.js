"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class lakebtc extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'lakebtc',
            'name': 'LakeBTC',
            'countries': 'US',
            'version': 'api_v2',
            'hasCORS': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/28074120-72b7c38a-6660-11e7-92d9-d9027502281d.jpg',
                'api': 'https://api.lakebtc.com',
                'www': 'https://www.lakebtc.com',
                'doc': ['https://www.lakebtc.com/s/api_v2', 'https://www.lakebtc.com/s/api']
            },
            'api': {
                'public': {
                    'get': ['bcorderbook', 'bctrades', 'ticker']
                },
                'private': {
                    'post': ['buyOrder', 'cancelOrders', 'getAccountInfo', 'getExternalAccounts', 'getOrders', 'getTrades', 'openOrders', 'sellOrder']
                }
            },
            'fees': {
                'trading': {
                    'maker': 0.15 / 100,
                    'taker': 0.2 / 100
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.publicGetTicker();
            let result = [];
            let keys = Object.keys(markets);
            for (let k = 0; k < keys.length; k++) {
                let id = keys[k];
                let market = markets[id];
                let base = id.slice(0, 3);
                let quote = id.slice(3, 6);
                base = base.toUpperCase();
                quote = quote.toUpperCase();
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
            let balances = response['balance'];
            let result = { 'info': response };
            let currencies = Object.keys(balances);
            for (let c = 0; c < currencies.length; c++) {
                let currency = currencies[c];
                let balance = parseFloat(balances[currency]);
                let account = {
                    'free': balance,
                    'used': 0.0,
                    'total': balance
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
            let orderbook = yield _this3.publicGetBcorderbook(_this3.extend({
                'symbol': _this3.marketId(symbol)
            }, params));
            return _this3.parseOrderBook(orderbook);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let tickers = yield _this4.publicGetTicker(_this4.extend({
                'symbol': market['id']
            }, params));
            let ticker = tickers[market['id']];
            let timestamp = _this4.milliseconds();
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this4.iso8601(timestamp),
                'high': _this4.safeFloat(ticker, 'high'),
                'low': _this4.safeFloat(ticker, 'low'),
                'bid': _this4.safeFloat(ticker, 'bid'),
                'ask': _this4.safeFloat(ticker, 'ask'),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': _this4.safeFloat(ticker, 'last'),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': _this4.safeFloat(ticker, 'volume'),
                'quoteVolume': undefined,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = trade['date'] * 1000;
        return {
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'id': trade['tid'].toString(),
            'order': undefined,
            'type': undefined,
            'side': undefined,
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['amount'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let response = yield _this5.publicGetBctrades(_this5.extend({
                'symbol': market['id']
            }, params));
            return _this5.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(market, type, side, amount, price = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            if (type == 'market') throw new ExchangeError(_this6.id + ' allows limit orders only');
            let method = 'privatePost' + _this6.capitalize(side) + 'Order';
            let marketId = _this6.marketId(market);
            let order = {
                'params': [price, amount, marketId]
            };
            let response = yield _this6[method](_this6.extend(order, params));
            return {
                'info': response,
                'id': response['id'].toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            return yield _this7.privatePostCancelOrder({ 'params': id });
        })();
    }

    nonce() {
        return this.microseconds();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.version;
        if (api == 'public') {
            url += '/' + path;
            if (Object.keys(params).length) url += '?' + this.urlencode(params);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            if (Object.keys(params).length) params = params.join(',');else params = '';
            let query = this.urlencode({
                'tonce': nonce,
                'accesskey': this.apiKey,
                'requestmethod': method.toLowerCase(),
                'id': nonce,
                'method': path,
                'params': params
            });
            body = this.json({
                'method': path,
                'params': params,
                'id': nonce
            });
            let signature = this.hmac(this.encode(query), this.encode(this.secret), 'sha1');
            let auth = this.encode(this.apiKey + ':' + signature);
            headers = {
                'Json-Rpc-Tonce': nonce,
                'Authorization': "Basic " + this.decode(this.stringToBase64(auth)),
                'Content-Type': 'application/json'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this8.fetch2(path, api, method, params, headers, body);
            if ('error' in response) throw new ExchangeError(_this8.id + ' ' + _this8.json(response));
            return response;
        })();
    }
};