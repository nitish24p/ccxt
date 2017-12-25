"use strict";

// ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');

// ---------------------------------------------------------------------------

module.exports = class vaultoro extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'vaultoro',
            'name': 'Vaultoro',
            'countries': 'CH',
            'rateLimit': 1000,
            'version': '1',
            'hasCORS': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766880-f205e870-5ee9-11e7-8fe2-0d5b15880752.jpg',
                'api': 'https://api.vaultoro.com',
                'www': 'https://www.vaultoro.com',
                'doc': 'https://api.vaultoro.com'
            },
            'api': {
                'public': {
                    'get': ['bidandask', 'buyorders', 'latest', 'latesttrades', 'markets', 'orderbook', 'sellorders', 'transactions/day', 'transactions/hour', 'transactions/month']
                },
                'private': {
                    'get': ['balance', 'mytrades', 'orders'],
                    'post': ['buy/{symbol}/{type}', 'cancel/{id}', 'sell/{symbol}/{type}', 'withdraw']
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let result = [];
            let markets = yield _this.publicGetMarkets();
            let market = markets['data'];
            let base = market['BaseCurrency'];
            let quote = market['MarketCurrency'];
            let symbol = base + '/' + quote;
            let baseId = base;
            let quoteId = quote;
            let id = market['MarketName'];
            result.push({
                'id': id,
                'symbol': symbol,
                'base': base,
                'quote': quote,
                'baseId': baseId,
                'quoteId': quoteId,
                'info': market
            });
            return result;
        })();
    }

    fetchBalance(params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let response = yield _this2.privateGetBalance();
            let balances = response['data'];
            let result = { 'info': balances };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = balance['currency_code'];
                let uppercase = currency.toUpperCase();
                let free = balance['cash'];
                let used = balance['reserved'];
                let total = _this2.sum(free, used);
                let account = {
                    'free': free,
                    'used': used,
                    'total': total
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
            let response = yield _this3.publicGetOrderbook(params);
            let orderbook = {
                'bids': response['data'][0]['b'],
                'asks': response['data'][1]['s']
            };
            let result = _this3.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'Gold_Price', 'Gold_Amount');
            result['bids'] = _this3.sortBy(result['bids'], 0, true);
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let quote = yield _this4.publicGetBidandask(params);
            let bidsLength = quote['bids'].length;
            let bid = quote['bids'][bidsLength - 1];
            let ask = quote['asks'][0];
            let response = yield _this4.publicGetMarkets(params);
            let ticker = response['data'];
            let timestamp = _this4.milliseconds();
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this4.iso8601(timestamp),
                'high': parseFloat(ticker['24hHigh']),
                'low': parseFloat(ticker['24hLow']),
                'bid': bid[0],
                'ask': ask[0],
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['LastPrice']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['24hVolume']),
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = this.parse8601(trade['Time']);
        return {
            'id': undefined,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'order': undefined,
            'type': undefined,
            'side': undefined,
            'price': trade['Gold_Price'],
            'amount': trade['Gold_Amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let response = yield _this5.publicGetTransactionsDay(params);
            return _this5.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let method = 'privatePost' + _this6.capitalize(side) + 'SymbolType';
            let response = yield _this6[method](_this6.extend({
                'symbol': market['quoteId'].toLowerCase(),
                'type': type,
                'gld': amount,
                'price': price || 1
            }, params));
            return {
                'info': response,
                'id': response['data']['Order_ID']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            return yield _this7.privatePostCancelId(_this7.extend({
                'id': id
            }, params));
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/';
        if (api == 'public') {
            url += path;
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            url += this.version + '/' + this.implodeParams(path, params);
            let query = this.extend({
                'nonce': nonce,
                'apikey': this.apiKey
            }, this.omit(params, this.extractParams(path)));
            url += '?' + this.urlencode(query);
            headers = {
                'Content-Type': 'application/json',
                'X-Signature': this.hmac(this.encode(url), this.encode(this.secret))
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
};