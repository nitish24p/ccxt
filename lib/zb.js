"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class zb extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'zb',
            'name': 'ZB',
            'countries': 'CN',
            'rateLimit': 1000,
            'version': 'v1',
            'hasCORS': false,
            'hasFetchOrder': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/32859187-cd5214f0-ca5e-11e7-967d-96568e2e2bd1.jpg',
                'api': {
                    'public': 'http://api.zb.com/data', // no https for public API
                    'private': 'https://trade.zb.com/api'
                },
                'www': 'https://trade.zb.com/api',
                'doc': 'https://www.zb.com/i/developer'
            },
            'api': {
                'public': {
                    'get': ['markets', 'ticker', 'depth', 'trades', 'kline']
                },
                'private': {
                    'post': ['order', 'cancelOrder', 'getOrder', 'getOrders', 'getOrdersNew', 'getOrdersIgnoreTradeType', 'getUnfinishedOrdersIgnoreTradeType', 'getAccountInfo', 'getUserAddress', 'getWithdrawAddress', 'getWithdrawRecord', 'getChargeRecord', 'getCnyWithdrawRecord', 'getCnyChargeRecord', 'withdraw']
                }
            }
        });
    }

    getTradingFeeFromBaseQuote(base, quote) {
        // base: quote
        let fees = {
            'BTC': { 'USDT': 0.0 },
            'BCH': { 'BTC': 0.001, 'USDT': 0.001 },
            'LTC': { 'BTC': 0.001, 'USDT': 0.0 },
            'ETH': { 'BTC': 0.001, 'USDT': 0.0 },
            'ETC': { 'BTC': 0.001, 'USDT': 0.0 },
            'BTS': { 'BTC': 0.001, 'USDT': 0.001 },
            'EOS': { 'BTC': 0.001, 'USDT': 0.001 },
            'HSR': { 'BTC': 0.001, 'USDT': 0.001 },
            'QTUM': { 'BTC': 0.001, 'USDT': 0.001 },
            'USDT': { 'BTC': 0.0 }
        };
        if (base in fees) {
            let quoteFees = fees[base];
            if (quote in quoteFees) return quoteFees[quote];
        }
        return undefined;
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.publicGetMarkets();
            let keys = Object.keys(markets);
            let result = [];
            for (let i = 0; i < keys.length; i++) {
                let id = keys[i];
                let market = markets[id];
                let [baseId, quoteId] = id.split('_');
                let base = _this.commonCurrencyCode(baseId.toUpperCase());
                let quote = _this.commonCurrencyCode(quoteId.toUpperCase());
                let symbol = base + '/' + quote;
                let fee = _this.getTradingFeeFromBaseQuote(base, quote);
                let precision = {
                    'amount': market['amountScale'],
                    'price': market['priceScale']
                };
                let lot = Math.pow(10, -precision['amount']);
                result.push({
                    'id': id,
                    'symbol': symbol,
                    'baseId': baseId,
                    'quoteId': quoteId,
                    'base': base,
                    'quote': quote,
                    'info': market,
                    'maker': fee,
                    'taker': fee,
                    'lot': lot,
                    'active': true,
                    'precision': precision,
                    'limits': {
                        'amount': {
                            'min': lot,
                            'max': undefined
                        },
                        'price': {
                            'min': Math.pow(10, -precision['price']),
                            'max': undefined
                        },
                        'cost': {
                            'min': 0,
                            'max': undefined
                        }
                    }
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
            let balances = response['result'];
            let result = { 'info': balances };
            let currencies = Object.keys(_this2.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let account = _this2.account();
                if (currency in balances['balance']) account['free'] = parseFloat(balances['balance'][currency]['amount']);
                if (currency in balances['frozen']) account['used'] = parseFloat(balances['frozen'][currency]['amount']);
                account['total'] = _this2.sum(account['free'], account['used']);
                result[currency] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    getMarketFieldName() {
        return 'market';
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let marketFieldName = _this3.getMarketFieldName();
            let request = {};
            request[marketFieldName] = market['id'];
            let orderbook = yield _this3.publicGetDepth(_this3.extend(request, params));
            let timestamp = _this3.milliseconds();
            let bids = undefined;
            let asks = undefined;
            if ('bids' in orderbook) bids = orderbook['bids'];
            if ('asks' in orderbook) asks = orderbook['asks'];
            let result = {
                'bids': bids,
                'asks': asks,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp)
            };
            if (result['bids']) result['bids'] = _this3.sortBy(result['bids'], 0, true);
            if (result['asks']) result['asks'] = _this3.sortBy(result['asks'], 0);
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let marketFieldName = _this4.getMarketFieldName();
            let request = {};
            request[marketFieldName] = market['id'];
            let response = yield _this4.publicGetTicker(_this4.extend(request, params));
            let ticker = response['ticker'];
            let timestamp = _this4.milliseconds();
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this4.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy']),
                'ask': parseFloat(ticker['sell']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['vol']),
                'quoteVolume': undefined,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestamp = trade['date'] * 1000;
        let side = trade['trade_type'] == 'bid' ? 'buy' : 'sell';
        return {
            'info': trade,
            'id': trade['tid'].toString(),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': side,
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['amount'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let marketFieldName = _this5.getMarketFieldName();
            let request = {};
            request[marketFieldName] = market['id'];
            let response = yield _this5.publicGetTrades(_this5.extend(request, params));
            return _this5.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let paramString = '&price=' + price.toString();
            paramString += '&amount=' + amount.toString();
            let tradeType = side == 'buy' ? '1' : '0';
            paramString += '&tradeType=' + tradeType;
            paramString += '&currency=' + _this6.marketId(symbol);
            let response = yield _this6.privatePostOrder(paramString);
            return {
                'info': response,
                'id': response['id']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            let paramString = '&id=' + id.toString();
            if ('currency' in params) paramString += '&currency=' + params['currency'];
            return yield _this7.privatePostCancelOrder(paramString);
        })();
    }

    fetchOrder(id, symbol = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            let paramString = '&id=' + id.toString();
            if ('currency' in params) paramString += '&currency=' + params['currency'];
            return yield _this8.privatePostGetOrder(paramString);
        })();
    }

    nonce() {
        return this.milliseconds();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api];
        if (api == 'public') {
            url += '/' + this.version + '/' + path;
            if (Object.keys(params).length) url += '?' + this.urlencode(params);
        } else {
            this.checkRequiredCredentials();
            let paramsLength = params.length; // params should be a string here
            let nonce = this.nonce();
            let auth = 'method=' + path;
            auth += '&accesskey=' + this.apiKey;
            auth += paramsLength ? params : '';
            let secret = this.hash(this.encode(this.secret), 'sha1');
            let signature = this.hmac(this.encode(auth), this.encode(secret), 'md5');
            let suffix = 'sign=' + signature + '&reqTime=' + nonce.toString();
            url += '/' + path + '?' + auth + '&' + suffix;
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this9.fetch2(path, api, method, params, headers, body);
            if (api == 'private') if ('code' in response) throw new ExchangeError(_this9.id + ' ' + _this9.json(response));
            return response;
        })();
    }
};