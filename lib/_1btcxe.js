"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class _1btcxe extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': '_1btcxe',
            'name': '1BTCXE',
            'countries': 'PA', // Panama
            'comment': 'Crypto Capital API',
            'hasCORS': true,
            'hasFetchOHLCV': true,
            'hasWithdraw': true,
            'timeframes': {
                '1d': '1year'
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766049-2b294408-5ecc-11e7-85cc-adaff013dc1a.jpg',
                'api': 'https://1btcxe.com/api',
                'www': 'https://1btcxe.com',
                'doc': 'https://1btcxe.com/api-docs.php'
            },
            'api': {
                'public': {
                    'get': ['stats', 'historical-prices', 'order-book', 'transactions']
                },
                'private': {
                    'post': ['balances-and-info', 'open-orders', 'user-transactions', 'btc-deposit-address/get', 'btc-deposit-address/new', 'deposits/get', 'withdrawals/get', 'orders/new', 'orders/edit', 'orders/cancel', 'orders/status', 'withdrawals/new']
                }
            },
            'markets': {
                'BTC/USD': { 'id': 'USD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
                'BTC/EUR': { 'id': 'EUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
                'BTC/CNY': { 'id': 'CNY', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY' },
                'BTC/RUB': { 'id': 'RUB', 'symbol': 'BTC/RUB', 'base': 'BTC', 'quote': 'RUB' },
                'BTC/CHF': { 'id': 'CHF', 'symbol': 'BTC/CHF', 'base': 'BTC', 'quote': 'CHF' },
                'BTC/JPY': { 'id': 'JPY', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY' },
                'BTC/GBP': { 'id': 'GBP', 'symbol': 'BTC/GBP', 'base': 'BTC', 'quote': 'GBP' },
                'BTC/CAD': { 'id': 'CAD', 'symbol': 'BTC/CAD', 'base': 'BTC', 'quote': 'CAD' },
                'BTC/AUD': { 'id': 'AUD', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD' },
                'BTC/AED': { 'id': 'AED', 'symbol': 'BTC/AED', 'base': 'BTC', 'quote': 'AED' },
                'BTC/BGN': { 'id': 'BGN', 'symbol': 'BTC/BGN', 'base': 'BTC', 'quote': 'BGN' },
                'BTC/CZK': { 'id': 'CZK', 'symbol': 'BTC/CZK', 'base': 'BTC', 'quote': 'CZK' },
                'BTC/DKK': { 'id': 'DKK', 'symbol': 'BTC/DKK', 'base': 'BTC', 'quote': 'DKK' },
                'BTC/HKD': { 'id': 'HKD', 'symbol': 'BTC/HKD', 'base': 'BTC', 'quote': 'HKD' },
                'BTC/HRK': { 'id': 'HRK', 'symbol': 'BTC/HRK', 'base': 'BTC', 'quote': 'HRK' },
                'BTC/HUF': { 'id': 'HUF', 'symbol': 'BTC/HUF', 'base': 'BTC', 'quote': 'HUF' },
                'BTC/ILS': { 'id': 'ILS', 'symbol': 'BTC/ILS', 'base': 'BTC', 'quote': 'ILS' },
                'BTC/INR': { 'id': 'INR', 'symbol': 'BTC/INR', 'base': 'BTC', 'quote': 'INR' },
                'BTC/MUR': { 'id': 'MUR', 'symbol': 'BTC/MUR', 'base': 'BTC', 'quote': 'MUR' },
                'BTC/MXN': { 'id': 'MXN', 'symbol': 'BTC/MXN', 'base': 'BTC', 'quote': 'MXN' },
                'BTC/NOK': { 'id': 'NOK', 'symbol': 'BTC/NOK', 'base': 'BTC', 'quote': 'NOK' },
                'BTC/NZD': { 'id': 'NZD', 'symbol': 'BTC/NZD', 'base': 'BTC', 'quote': 'NZD' },
                'BTC/PLN': { 'id': 'PLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
                'BTC/RON': { 'id': 'RON', 'symbol': 'BTC/RON', 'base': 'BTC', 'quote': 'RON' },
                'BTC/SEK': { 'id': 'SEK', 'symbol': 'BTC/SEK', 'base': 'BTC', 'quote': 'SEK' },
                'BTC/SGD': { 'id': 'SGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' },
                'BTC/THB': { 'id': 'THB', 'symbol': 'BTC/THB', 'base': 'BTC', 'quote': 'THB' },
                'BTC/TRY': { 'id': 'TRY', 'symbol': 'BTC/TRY', 'base': 'BTC', 'quote': 'TRY' },
                'BTC/ZAR': { 'id': 'ZAR', 'symbol': 'BTC/ZAR', 'base': 'BTC', 'quote': 'ZAR' }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this.privatePostBalancesAndInfo();
            let balance = response['balances-and-info'];
            let result = { 'info': balance };
            let currencies = (0, _keys2.default)(_this.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let account = _this.account();
                account['free'] = _this.safeFloat(balance['available'], currency, 0.0);
                account['used'] = _this.safeFloat(balance['on_hold'], currency, 0.0);
                account['total'] = _this.sum(account['free'], account['used']);
                result[currency] = account;
            }
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this2.publicGetOrderBook(_this2.extend({
                'currency': _this2.marketId(symbol)
            }, params));
            return _this2.parseOrderBook(response['order-book'], undefined, 'bid', 'ask', 'price', 'order_amount');
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this3.publicGetStats(_this3.extend({
                'currency': _this3.marketId(symbol)
            }, params));
            let ticker = response['stats'];
            let timestamp = _this3.milliseconds();
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': parseFloat(ticker['max']),
                'low': parseFloat(ticker['min']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': parseFloat(ticker['open']),
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last_price']),
                'change': parseFloat(ticker['daily_change']),
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['total_btc_traded'])
            };
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '1d', since = undefined, limit = undefined) {
        return [this.parse8601(ohlcv['date'] + ' 00:00:00'), undefined, undefined, undefined, parseFloat(ohlcv['price']), undefined];
    }

    fetchOHLCV(symbol, timeframe = '1d', since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetHistoricalPrices(_this4.extend({
                'currency': market['id'],
                'timeframe': _this4.timeframes[timeframe]
            }, params));
            let ohlcvs = _this4.omit(response['historical-prices'], 'request_currency');
            return _this4.parseOHLCVs(ohlcvs, market, timeframe, since, limit);
        })();
    }

    parseTrade(trade, market) {
        let timestamp = parseInt(trade['timestamp']) * 1000;
        return {
            'id': trade['id'],
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'order': undefined,
            'type': undefined,
            'side': trade['maker_type'],
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['amount'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this5.market(symbol);
            let response = yield _this5.publicGetTransactions(_this5.extend({
                'currency': market['id']
            }, params));
            let trades = _this5.omit(response['transactions'], 'request_currency');
            return _this5.parseTrades(trades, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let order = {
                'side': side,
                'type': type,
                'currency': _this6.marketId(symbol),
                'amount': amount
            };
            if (type == 'limit') order['limit_price'] = price;
            let result = yield _this6.privatePostOrdersNew(_this6.extend(order, params));
            return {
                'info': result,
                'id': result
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return yield _this7.privatePostOrdersCancel({ 'id': id });
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this8.loadMarkets();
            let response = yield _this8.privatePostWithdrawalsNew(_this8.extend({
                'currency': currency,
                'amount': parseFloat(amount),
                'address': address
            }, params));
            return {
                'info': response,
                'id': response['result']['uuid']
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        if (this.id == 'cryptocapital') throw new ExchangeError(this.id + ' is an abstract base API for _1btcxe');
        let url = this.urls['api'] + '/' + path;
        if (api == 'public') {
            if ((0, _keys2.default)(params).length) url += '?' + this.urlencode(params);
        } else {
            this.checkRequiredCredentials();
            let query = this.extend({
                'api_key': this.apiKey,
                'nonce': this.nonce()
            }, params);
            let request = this.json(query);
            query['signature'] = this.hmac(this.encode(request), this.encode(this.secret));
            body = this.json(query);
            headers = { 'Content-Type': 'application/json' };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this9.fetch2(path, api, method, params, headers, body);
            if ('errors' in response) {
                let errors = [];
                for (let e = 0; e < response['errors'].length; e++) {
                    let error = response['errors'][e];
                    errors.push(error['code'] + ': ' + error['message']);
                }
                errors = errors.join(' ');
                throw new ExchangeError(_this9.id + ' ' + errors);
            }
            return response;
        })();
    }
};