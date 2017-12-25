"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class coinfloor extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'coinfloor',
            'name': 'coinfloor',
            'rateLimit': 1000,
            'countries': 'UK',
            'hasCORS': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/28246081-623fc164-6a1c-11e7-913f-bac0d5576c90.jpg',
                'api': 'https://webapi.coinfloor.co.uk:8090/bist',
                'www': 'https://www.coinfloor.co.uk',
                'doc': ['https://github.com/coinfloor/api', 'https://www.coinfloor.co.uk/api']
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'uid': true
            },
            'api': {
                'public': {
                    'get': ['{id}/ticker/', '{id}/order_book/', '{id}/transactions/']
                },
                'private': {
                    'post': ['{id}/balance/', '{id}/user_transactions/', '{id}/open_orders/', '{id}/cancel_order/', '{id}/buy/', '{id}/sell/', '{id}/buy_market/', '{id}/sell_market/', '{id}/estimate_sell_market/', '{id}/estimate_buy_market/']
                }
            },
            'markets': {
                'BTC/GBP': { 'id': 'XBT/GBP', 'symbol': 'BTC/GBP', 'base': 'BTC', 'quote': 'GBP' },
                'BTC/EUR': { 'id': 'XBT/EUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
                'BTC/USD': { 'id': 'XBT/USD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
                'BTC/PLN': { 'id': 'XBT/PLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
                'BCH/GBP': { 'id': 'BCH/GBP', 'symbol': 'BCH/GBP', 'base': 'BCH', 'quote': 'GBP' }
            }
        });
    }

    fetchBalance(params = {}) {
        let symbol = undefined;
        if ('symbol' in params) symbol = params['symbol'];
        if ('id' in params) symbol = params['id'];
        if (!symbol) throw new ExchangeError(this.id + ' fetchBalance requires a symbol param');
        // todo parse balance
        return this.privatePostIdBalance({
            'id': this.marketId(symbol)
        });
    }

    fetchOrderBook(symbol, params = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let orderbook = yield _this.publicGetIdOrderBook(_this.extend({
                'id': _this.marketId(symbol)
            }, params));
            return _this.parseOrderBook(orderbook);
        })();
    }

    parseTicker(ticker, market = undefined) {
        // rewrite to get the timestamp from HTTP headers
        let timestamp = this.milliseconds();
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        let vwap = this.safeFloat(ticker, 'vwap');
        let baseVolume = parseFloat(ticker['volume']);
        let quoteVolume = undefined;
        if (typeof vwap != 'undefined') {
            quoteVolume = baseVolume * vwap;
        }
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
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
    }

    fetchTicker(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let market = _this2.market(symbol);
            let ticker = yield _this2.publicGetIdTicker(_this2.extend({
                'id': market['id']
            }, params));
            return _this2.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market) {
        let timestamp = trade['date'] * 1000;
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
        var _this3 = this;

        return _asyncToGenerator(function* () {
            let market = _this3.market(symbol);
            let response = yield _this3.publicGetIdTransactions(_this3.extend({
                'id': market['id']
            }, params));
            return _this3.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            let order = { 'id': _this4.marketId(symbol) };
            let method = 'privatePostId' + _this4.capitalize(side);
            if (type == 'market') {
                order['quantity'] = amount;
                method += 'Market';
            } else {
                order['price'] = price;
                order['amount'] = amount;
            }
            return _this4[method](_this4.extend(order, params));
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            return yield _this5.privatePostIdCancelOrder({ 'id': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        // curl -k -u '[User ID]/[API key]:[Passphrase]' https://webapi.coinfloor.co.uk:8090/bist/XBT/GBP/balance/
        let url = this.urls['api'] + '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if (Object.keys(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            body = this.urlencode(this.extend({ 'nonce': nonce }, query));
            let auth = this.uid + '/' + this.apiKey + ':' + this.password;
            let signature = this.stringToBase64(auth);
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + signature
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
};