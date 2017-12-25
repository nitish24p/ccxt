"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class foxbit extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'foxbit',
            'name': 'FoxBit',
            'countries': 'BR',
            'hasCORS': false,
            'rateLimit': 1000,
            'version': 'v1',
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27991413-11b40d42-647f-11e7-91ee-78ced874dd09.jpg',
                'api': {
                    'public': 'https://api.blinktrade.com/api',
                    'private': 'https://api.blinktrade.com/tapi'
                },
                'www': 'https://foxbit.exchange',
                'doc': 'https://blinktrade.com/docs'
            },
            'comment': 'Blinktrade API',
            'api': {
                'public': {
                    'get': ['{currency}/ticker', // ?crypto_currency=BTC
                    '{currency}/orderbook', // ?crypto_currency=BTC
                    '{currency}/trades']
                },
                'private': {
                    'post': ['D', // order
                    'F', // cancel order
                    'U2', // balance
                    'U4', // my orders
                    'U6', // withdraw
                    'U18', // deposit
                    'U24', // confirm withdrawal
                    'U26', // list withdrawals
                    'U30', // list deposits
                    'U34', // ledger
                    'U70']
                }
            },
            'markets': {
                'BTC/VEF': { 'id': 'BTCVEF', 'symbol': 'BTC/VEF', 'base': 'BTC', 'quote': 'VEF', 'brokerId': 1, 'broker': 'SurBitcoin' },
                'BTC/VND': { 'id': 'BTCVND', 'symbol': 'BTC/VND', 'base': 'BTC', 'quote': 'VND', 'brokerId': 3, 'broker': 'VBTC' },
                'BTC/BRL': { 'id': 'BTCBRL', 'symbol': 'BTC/BRL', 'base': 'BTC', 'quote': 'BRL', 'brokerId': 4, 'broker': 'FoxBit' },
                'BTC/PKR': { 'id': 'BTCPKR', 'symbol': 'BTC/PKR', 'base': 'BTC', 'quote': 'PKR', 'brokerId': 8, 'broker': 'UrduBit' },
                'BTC/CLP': { 'id': 'BTCCLP', 'symbol': 'BTC/CLP', 'base': 'BTC', 'quote': 'CLP', 'brokerId': 9, 'broker': 'ChileBit' }
            }
        });
    }

    fetchBalance(params = {}) {
        // todo parse balance
        return this.privatePostU2({
            'BalanceReqID': this.nonce()
        });
    }

    fetchOrderBook(symbol, params = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let market = _this.market(symbol);
            let orderbook = yield _this.publicGetCurrencyOrderbook(_this.extend({
                'currency': market['quote'],
                'crypto_currency': market['base']
            }, params));
            return _this.parseOrderBook(orderbook);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let market = _this2.market(symbol);
            let ticker = yield _this2.publicGetCurrencyTicker(_this2.extend({
                'currency': market['quote'],
                'crypto_currency': market['base']
            }, params));
            let timestamp = _this2.milliseconds();
            let lowercaseQuote = market['quote'].toLowerCase();
            let quoteVolume = 'vol_' + lowercaseQuote;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this2.iso8601(timestamp),
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
                'quoteVolume': parseFloat(ticker[quoteVolume]),
                'info': ticker
            };
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
            'side': trade['side'],
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            let market = _this3.market(symbol);
            let response = yield _this3.publicGetCurrencyTrades(_this3.extend({
                'currency': market['quote'],
                'crypto_currency': market['base']
            }, params));
            return _this3.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            if (type == 'market') throw new ExchangeError(_this4.id + ' allows limit orders only');
            let market = _this4.market(symbol);
            let orderSide = side == 'buy' ? '1' : '2';
            let order = {
                'ClOrdID': _this4.nonce(),
                'Symbol': market['id'],
                'Side': orderSide,
                'OrdType': '2',
                'Price': price,
                'OrderQty': amount,
                'BrokerID': market['brokerId']
            };
            let response = yield _this4.privatePostD(_this4.extend(order, params));
            let indexed = _this4.indexBy(response['Responses'], 'MsgType');
            let execution = indexed['8'];
            return {
                'info': response,
                'id': execution['OrderID']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            return yield _this5.privatePostF(_this5.extend({
                'ClOrdID': id
            }, params));
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api] + '/' + this.version + '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if (_Object$keys(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            let request = this.extend({ 'MsgType': path }, query);
            body = this.json(request);
            headers = {
                'APIKey': this.apiKey,
                'Nonce': nonce,
                'Signature': this.hmac(this.encode(nonce), this.encode(this.secret)),
                'Content-Type': 'application/json'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this6.fetch2(path, api, method, params, headers, body);
            if ('Status' in response) if (response['Status'] != 200) throw new ExchangeError(_this6.id + ' ' + _this6.json(response));
            return response;
        })();
    }
};