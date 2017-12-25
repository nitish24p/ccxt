"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class fybse extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'fybse',
            'name': 'FYB-SE',
            'countries': 'SE', // Sweden
            'hasCORS': false,
            'rateLimit': 1500,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766512-31019772-5edb-11e7-8241-2e675e6797f1.jpg',
                'api': 'https://www.fybse.se/api/SEK',
                'www': 'https://www.fybse.se',
                'doc': 'http://docs.fyb.apiary.io'
            },
            'api': {
                'public': {
                    'get': ['ticker', 'tickerdetailed', 'orderbook', 'trades']
                },
                'private': {
                    'post': ['test', 'getaccinfo', 'getpendingorders', 'getorderhistory', 'cancelpendingorder', 'placeorder', 'withdraw']
                }
            },
            'markets': {
                'BTC/SEK': { 'id': 'SEK', 'symbol': 'BTC/SEK', 'base': 'BTC', 'quote': 'SEK' }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let balance = yield _this.privatePostGetaccinfo();
            let btc = parseFloat(balance['btcBal']);
            let symbol = _this.symbols[0];
            let quote = _this.markets[symbol]['quote'];
            let lowercase = quote.toLowerCase() + 'Bal';
            let fiat = parseFloat(balance[lowercase]);
            let crypto = {
                'free': btc,
                'used': 0.0,
                'total': btc
            };
            let result = { 'BTC': crypto };
            result[quote] = {
                'free': fiat,
                'used': 0.0,
                'total': fiat
            };
            result['info'] = balance;
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let orderbook = yield _this2.publicGetOrderbook(params);
            return _this2.parseOrderBook(orderbook);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            let ticker = yield _this3.publicGetTickerdetailed(params);
            let timestamp = _this3.milliseconds();
            let last = undefined;
            let volume = undefined;
            if ('last' in ticker) last = parseFloat(ticker['last']);
            if ('vol' in ticker) volume = parseFloat(ticker['vol']);
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': last,
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': volume,
                'quoteVolume': undefined,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = parseInt(trade['date']) * 1000;
        return {
            'info': trade,
            'id': trade['tid'].toString(),
            'order': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': undefined,
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['amount'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetTrades(params);
            return _this4.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this5.privatePostPlaceorder(_this5.extend({
                'qty': amount,
                'price': price,
                'type': side[0].toUpperCase()
            }, params));
            return {
                'info': response,
                'id': response['pending_oid']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            return yield _this6.privatePostCancelpendingorder({ 'orderNo': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + path;
        if (api == 'public') {
            url += '.json';
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            body = this.urlencode(this.extend({ 'timestamp': nonce }, params));
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'key': this.apiKey,
                'sig': this.hmac(this.encode(body), this.encode(this.secret), 'sha1')
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this7.fetch2(path, api, method, params, headers, body);
            if (api == 'private') if ('error' in response) if (response['error']) throw new ExchangeError(_this7.id + ' ' + _this7.json(response));
            return response;
        })();
    }
};