"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class btcbox extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'btcbox',
            'name': 'BtcBox',
            'countries': 'JP',
            'rateLimit': 1000,
            'version': 'v1',
            'hasCORS': false,
            'hasFetchOHLCV': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/31275803-4df755a8-aaa1-11e7-9abb-11ec2fad9f2d.jpg',
                'api': 'https://www.btcbox.co.jp/api',
                'www': 'https://www.btcbox.co.jp/',
                'doc': 'https://www.btcbox.co.jp/help/asm'
            },
            'api': {
                'public': {
                    'get': ['depth', 'orders', 'ticker', 'allticker']
                },
                'private': {
                    'post': ['balance', 'trade_add', 'trade_cancel', 'trade_list', 'trade_view', 'wallet']
                }
            },
            'markets': {
                'BTC/JPY': { 'id': 'BTC/JPY', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY' }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            yield _this.loadMarkets();
            let balances = yield _this.privatePostBalance();
            let result = { 'info': balances };
            let currencies = Object.keys(_this.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let lowercase = currency.toLowerCase();
                if (lowercase == 'dash') lowercase = 'drk';
                let account = _this.account();
                let free = lowercase + '_balance';
                let used = lowercase + '_lock';
                if (free in balances) account['free'] = parseFloat(balances[free]);
                if (used in balances) account['used'] = parseFloat(balances[used]);
                account['total'] = _this.sum(account['free'], account['used']);
                result[currency] = account;
            }
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let market = _this2.market(symbol);
            let request = {};
            let numSymbols = _this2.symbols.length;
            if (numSymbols > 1) request['coin'] = market['id'];
            let orderbook = yield _this2.publicGetDepth(_this2.extend(request, params));
            let result = _this2.parseOrderBook(orderbook);
            result['asks'] = _this2.sortBy(result['asks'], 0);
            return result;
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = this.milliseconds();
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': this.safeFloat(ticker, 'high'),
            'low': this.safeFloat(ticker, 'low'),
            'bid': this.safeFloat(ticker, 'buy'),
            'ask': this.safeFloat(ticker, 'sell'),
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': this.safeFloat(ticker, 'last'),
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeFloat(ticker, 'vol'),
            'quoteVolume': this.safeFloat(ticker, 'volume'),
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let tickers = yield _this3.publicGetAllticker(params);
            let ids = Object.keys(tickers);
            let result = {};
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let market = _this3.markets_by_id[id];
                let symbol = market['symbol'];
                let ticker = tickers[id];
                result[symbol] = _this3.parseTicker(ticker, market);
            }
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let request = {};
            let numSymbols = _this4.symbols.length;
            if (numSymbols > 1) request['coin'] = market['id'];
            let ticker = yield _this4.publicGetTicker(_this4.extend(request, params));
            return _this4.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market) {
        let timestamp = parseInt(trade['date']) * 1000;
        return {
            'info': trade,
            'id': trade['tid'],
            'order': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': trade['type'],
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let request = {};
            let numSymbols = _this5.symbols.length;
            if (numSymbols > 1) request['coin'] = market['id'];
            let response = yield _this5.publicGetOrders(_this5.extend(request, params));
            return _this5.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let request = {
                'amount': amount,
                'price': price,
                'type': side
            };
            let numSymbols = _this6.symbols.length;
            if (numSymbols > 1) request['coin'] = market['id'];
            let response = yield _this6.privatePostTradeAdd(_this6.extend(request, params));
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
            return yield _this7.privatePostTradeCancel(_this7.extend({
                'id': id
            }, params));
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.version + '/' + path;
        if (api == 'public') {
            if (Object.keys(params).length) url += '?' + this.urlencode(params);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            let query = this.extend({
                'key': this.apiKey,
                'nonce': nonce
            }, params);
            let request = this.urlencode(query);
            let secret = this.hash(this.encode(this.secret));
            query['signature'] = this.hmac(this.encode(request), this.encode(secret));
            body = this.urlencode(query);
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this8.fetch2(path, api, method, params, headers, body);
            if ('result' in response) if (!response['result']) throw new ExchangeError(_this8.id + ' ' + _this8.json(response));
            return response;
        })();
    }
};