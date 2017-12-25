"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError, AuthenticationError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class quadrigacx extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'quadrigacx',
            'name': 'QuadrigaCX',
            'countries': 'CA',
            'rateLimit': 1000,
            'version': 'v2',
            'hasCORS': true,
            // obsolete metainfo interface
            'hasWithdraw': true,
            // new metainfo interface
            'has': {
                'withdraw': true
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766825-98a6d0de-5ee7-11e7-9fa4-38e11a2c6f52.jpg',
                'api': 'https://api.quadrigacx.com',
                'www': 'https://www.quadrigacx.com',
                'doc': 'https://www.quadrigacx.com/api_info'
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'uid': true
            },
            'api': {
                'public': {
                    'get': ['order_book', 'ticker', 'transactions']
                },
                'private': {
                    'post': ['balance', 'bitcoin_deposit_address', 'bitcoin_withdrawal', 'buy', 'cancel_order', 'ether_deposit_address', 'ether_withdrawal', 'lookup_order', 'open_orders', 'sell', 'user_transactions']
                }
            },
            'markets': {
                'BTC/CAD': { 'id': 'btc_cad', 'symbol': 'BTC/CAD', 'base': 'BTC', 'quote': 'CAD', 'maker': 0.005, 'taker': 0.005 },
                'BTC/USD': { 'id': 'btc_usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'maker': 0.005, 'taker': 0.005 },
                'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'maker': 0.002, 'taker': 0.002 },
                'ETH/CAD': { 'id': 'eth_cad', 'symbol': 'ETH/CAD', 'base': 'ETH', 'quote': 'CAD', 'maker': 0.005, 'taker': 0.005 },
                'LTC/CAD': { 'id': 'ltc_cad', 'symbol': 'LTC/CAD', 'base': 'LTC', 'quote': 'CAD', 'maker': 0.005, 'taker': 0.005 },
                'BCH/CAD': { 'id': 'btc_cad', 'symbol': 'BCH/CAD', 'base': 'BCH', 'quote': 'CAD', 'maker': 0.005, 'taker': 0.005 },
                'BTG/CAD': { 'id': 'btg_cad', 'symbol': 'BTG/CAD', 'base': 'BTG', 'quote': 'CAD', 'maker': 0.005, 'taker': 0.005 }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let balances = yield _this.privatePostBalance();
            let result = { 'info': balances };
            let currencies = _Object$keys(_this.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let lowercase = currency.toLowerCase();
                let account = {
                    'free': parseFloat(balances[lowercase + '_available']),
                    'used': parseFloat(balances[lowercase + '_reserved']),
                    'total': parseFloat(balances[lowercase + '_balance'])
                };
                result[currency] = account;
            }
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let orderbook = yield _this2.publicGetOrderBook(_this2.extend({
                'book': _this2.marketId(symbol)
            }, params));
            let timestamp = parseInt(orderbook['timestamp']) * 1000;
            return _this2.parseOrderBook(orderbook, timestamp);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            let ticker = yield _this3.publicGetTicker(_this3.extend({
                'book': _this3.marketId(symbol)
            }, params));
            let timestamp = parseInt(ticker['timestamp']) * 1000;
            let vwap = parseFloat(ticker['vwap']);
            let baseVolume = parseFloat(ticker['volume']);
            let quoteVolume = baseVolume * vwap;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': vwap,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': baseVolume,
                'quoteVolume': quoteVolume,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = parseInt(trade['date']) * 1000;
        return {
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'id': trade['tid'].toString(),
            'order': undefined,
            'type': undefined,
            'side': trade['side'],
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['amount'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetTransactions(_this4.extend({
                'book': market['id']
            }, params));
            return _this4.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            let method = 'privatePost' + _this5.capitalize(side);
            let order = {
                'amount': amount,
                'book': _this5.marketId(symbol)
            };
            if (type == 'limit') order['price'] = price;
            let response = yield _this5[method](_this5.extend(order, params));
            return {
                'info': response,
                'id': response['id'].toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            return yield _this6.privatePostCancelOrder(_this6.extend({
                'id': id
            }, params));
        })();
    }

    fetchDepositAddress(currency, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            let method = 'privatePost' + _this7.getCurrencyName(currency) + 'DepositAddress';
            let response = yield _this7[method](params);
            let address = undefined;
            let status = undefined;
            // [E|e]rror
            if (response.indexOf('rror') >= 0) {
                status = 'error';
            } else {
                address = response;
                status = 'ok';
            }
            return {
                'currency': currency,
                'address': address,
                'status': status,
                'info': _this7.last_http_response
            };
        })();
    }

    getCurrencyName(currency) {
        if (currency == 'ETH') return 'Ether';
        if (currency == 'BTC') return 'Bitcoin';
    }

    withdraw(currency, amount, address, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            let request = {
                'amount': amount,
                'address': address
            };
            let method = 'privatePost' + _this8.getCurrencyName(currency) + 'Withdrawal';
            let response = yield _this8[method](_this8.extend(request, params));
            return {
                'info': response,
                'id': undefined
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.version + '/' + path;
        if (api == 'public') {
            url += '?' + this.urlencode(params);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            let request = [nonce.toString(), this.uid, this.apiKey].join('');
            let signature = this.hmac(this.encode(request), this.encode(this.secret));
            let query = this.extend({
                'key': this.apiKey,
                'nonce': nonce,
                'signature': signature
            }, params);
            body = this.json(query);
            headers = {
                'Content-Type': 'application/json'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this9.fetch2(path, api, method, params, headers, body);
            if (typeof response == 'string') return response;
            if ('error' in response) throw new ExchangeError(_this9.id + ' ' + _this9.json(response));
            return response;
        })();
    }
};