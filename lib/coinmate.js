"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Exchange = require('./base/Exchange');
const { ExchangeError, AuthenticationError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class coinmate extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'coinmate',
            'name': 'CoinMate',
            'countries': ['GB', 'CZ'], // UK, Czech Republic
            'rateLimit': 1000,
            'hasCORS': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27811229-c1efb510-606c-11e7-9a36-84ba2ce412d8.jpg',
                'api': 'https://coinmate.io/api',
                'www': 'https://coinmate.io',
                'doc': ['http://docs.coinmate.apiary.io', 'https://coinmate.io/developers']
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'uid': true
            },
            'api': {
                'public': {
                    'get': ['orderBook', 'ticker', 'transactions']
                },
                'private': {
                    'post': ['balances', 'bitcoinWithdrawal', 'bitcoinDepositAddresses', 'buyInstant', 'buyLimit', 'cancelOrder', 'cancelOrderWithInfo', 'createVoucher', 'openOrders', 'redeemVoucher', 'sellInstant', 'sellLimit', 'transactionHistory', 'unconfirmedBitcoinDeposits']
                }
            },
            'markets': {
                'BTC/EUR': { 'id': 'BTC_EUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR', 'precision': { 'amount': 4, 'price': 2 } },
                'BTC/CZK': { 'id': 'BTC_CZK', 'symbol': 'BTC/CZK', 'base': 'BTC', 'quote': 'CZK', 'precision': { 'amount': 4, 'price': 2 } },
                'LTC/BTC': { 'id': 'LTC_BTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'precision': { 'amount': 4, 'price': 5 } }
            },
            'fees': {
                'trading': {
                    'maker': 0.0005,
                    'taker': 0.0035
                }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this.privatePostBalances();
            let balances = response['data'];
            let result = { 'info': balances };
            let currencies = (0, _keys2.default)(_this.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let account = _this.account();
                if (currency in balances) {
                    account['free'] = balances[currency]['available'];
                    account['used'] = balances[currency]['reserved'];
                    account['total'] = balances[currency]['balance'];
                }
                result[currency] = account;
            }
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this2.publicGetOrderBook(_this2.extend({
                'currencyPair': _this2.marketId(symbol),
                'groupByPriceLimit': 'False'
            }, params));
            let orderbook = response['data'];
            let timestamp = orderbook['timestamp'] * 1000;
            return _this2.parseOrderBook(orderbook, timestamp, 'bids', 'asks', 'price', 'amount');
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this3.publicGetTicker(_this3.extend({
                'currencyPair': _this3.marketId(symbol)
            }, params));
            let ticker = response['data'];
            let timestamp = ticker['timestamp'] * 1000;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['amount']),
                'quoteVolume': undefined,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market = undefined) {
        if (!market) market = this.markets_by_id[trade['currencyPair']];
        return {
            'id': trade['transactionId'],
            'info': trade,
            'timestamp': trade['timestamp'],
            'datetime': this.iso8601(trade['timestamp']),
            'symbol': market['symbol'],
            'type': undefined,
            'side': undefined,
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetTransactions(_this4.extend({
                'currencyPair': market['id'],
                'minutesIntoHistory': 10
            }, params));
            return _this4.parseTrades(response['data'], market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let method = 'privatePost' + _this5.capitalize(side);
            let order = {
                'currencyPair': _this5.marketId(symbol)
            };
            if (type == 'market') {
                if (side == 'buy') order['total'] = amount; // amount in fiat
                else order['amount'] = amount; // amount in fiat
                method += 'Instant';
            } else {
                order['amount'] = amount; // amount in crypto
                order['price'] = price;
                method += _this5.capitalize(type);
            }
            let response = yield _this5[method](self.extend(order, params));
            return {
                'info': response,
                'id': response['data'].toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return yield _this6.privatePostCancelOrder({ 'orderId': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + path;
        if (api == 'public') {
            if ((0, _keys2.default)(params).length) url += '?' + this.urlencode(params);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            let auth = nonce + this.uid + this.apiKey;
            let signature = this.hmac(this.encode(auth), this.encode(this.secret));
            body = this.urlencode(this.extend({
                'clientId': this.uid,
                'nonce': nonce,
                'publicKey': this.apiKey,
                'signature': signature.toUpperCase()
            }, params));
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this7.fetch2(path, api, method, params, headers, body);
            if ('error' in response) if (response['error']) throw new ExchangeError(_this7.id + ' ' + _this7.json(response));
            return response;
        })();
    }
};