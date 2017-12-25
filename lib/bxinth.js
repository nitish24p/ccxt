"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class bxinth extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bxinth',
            'name': 'BX.in.th',
            'countries': 'TH', // Thailand
            'rateLimit': 1500,
            'hasCORS': false,
            'hasFetchTickers': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766412-567b1eb4-5ed7-11e7-94a8-ff6a3884f6c5.jpg',
                'api': 'https://bx.in.th/api',
                'www': 'https://bx.in.th',
                'doc': 'https://bx.in.th/info/api'
            },
            'api': {
                'public': {
                    'get': ['', // ticker
                    'options', 'optionbook', 'orderbook', 'pairing', 'trade', 'tradehistory']
                },
                'private': {
                    'post': ['balance', 'biller', 'billgroup', 'billpay', 'cancel', 'deposit', 'getorders', 'history', 'option-issue', 'option-bid', 'option-sell', 'option-myissue', 'option-mybid', 'option-myoptions', 'option-exercise', 'option-cancel', 'option-history', 'order', 'withdrawal', 'withdrawal-history']
                }
            },
            'fees': {
                'trading': {
                    'taker': 0.25 / 100,
                    'maker': 0.25 / 100
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.publicGetPairing();
            let keys = _Object$keys(markets);
            let result = [];
            for (let p = 0; p < keys.length; p++) {
                let market = markets[keys[p]];
                let id = market['pairing_id'].toString();
                let base = market['secondary_currency'];
                let quote = market['primary_currency'];
                base = _this.commonCurrencyCode(base);
                quote = _this.commonCurrencyCode(quote);
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

    commonCurrencyCode(currency) {
        // why would they use three letters instead of four for currency codes
        if (currency == 'DAS') return 'DASH';
        if (currency == 'DOG') return 'DOGE';
        return currency;
    }

    fetchBalance(params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let response = yield _this2.privatePostBalance();
            let balance = response['balance'];
            let result = { 'info': balance };
            let currencies = _Object$keys(balance);
            for (let c = 0; c < currencies.length; c++) {
                let currency = currencies[c];
                let code = _this2.commonCurrencyCode(currency);
                let account = {
                    'free': parseFloat(balance[currency]['available']),
                    'used': 0.0,
                    'total': parseFloat(balance[currency]['total'])
                };
                account['used'] = account['total'] - account['free'];
                result[code] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let orderbook = yield _this3.publicGetOrderbook(_this3.extend({
                'pairing': _this3.marketId(symbol)
            }, params));
            return _this3.parseOrderBook(orderbook);
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
            'high': undefined,
            'low': undefined,
            'bid': parseFloat(ticker['orderbook']['bids']['highbid']),
            'ask': parseFloat(ticker['orderbook']['asks']['highbid']),
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': parseFloat(ticker['last_price']),
            'change': parseFloat(ticker['change']),
            'percentage': undefined,
            'average': undefined,
            'baseVolume': parseFloat(ticker['volume_24hours']),
            'quoteVolume': undefined,
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let tickers = yield _this4.publicGet(params);
            let result = {};
            let ids = _Object$keys(tickers);
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let ticker = tickers[id];
                let market = _this4.markets_by_id[id];
                let symbol = market['symbol'];
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
            let tickers = yield _this5.publicGet(_this5.extend({
                'pairing': market['id']
            }, params));
            let id = market['id'].toString();
            let ticker = tickers[id];
            return _this5.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market) {
        let timestamp = this.parse8601(trade['trade_date']);
        return {
            'id': trade['trade_id'],
            'info': trade,
            'order': trade['order_id'],
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': trade['trade_type'],
            'price': parseFloat(trade['rate']),
            'amount': parseFloat(trade['amount'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let response = yield _this6.publicGetTrade(_this6.extend({
                'pairing': market['id']
            }, params));
            return _this6.parseTrades(response['trades'], market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            let response = yield _this7.privatePostOrder(_this7.extend({
                'pairing': _this7.marketId(symbol),
                'type': side,
                'amount': amount,
                'rate': price
            }, params));
            return {
                'info': response,
                'id': response['order_id'].toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            let pairing = undefined; // TODO fixme
            return yield _this8.privatePostCancel({
                'order_id': id,
                'pairing': pairing
            });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/';
        if (path) url += path + '/';
        if (_Object$keys(params).length) url += '?' + this.urlencode(params);
        if (api == 'private') {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            let auth = this.apiKey + nonce.toString() + this.secret;
            let signature = this.hash(this.encode(auth), 'sha256');
            body = this.urlencode(this.extend({
                'key': this.apiKey,
                'nonce': nonce,
                'signature': signature
                // twofa: this.twofa,
            }, params));
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this9.fetch2(path, api, method, params, headers, body);
            if (api == 'public') return response;
            if ('success' in response) if (response['success']) return response;
            throw new ExchangeError(_this9.id + ' ' + _this9.json(response));
        })();
    }
};