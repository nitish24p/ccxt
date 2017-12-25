"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class nova extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'nova',
            'name': 'Novaexchange',
            'countries': 'TZ', // Tanzania
            'rateLimit': 2000,
            'version': 'v2',
            'hasCORS': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/30518571-78ca0bca-9b8a-11e7-8840-64b83a4a94b2.jpg',
                'api': 'https://novaexchange.com/remote',
                'www': 'https://novaexchange.com',
                'doc': 'https://novaexchange.com/remote/faq'
            },
            'api': {
                'public': {
                    'get': ['markets/', 'markets/{basecurrency}/', 'market/info/{pair}/', 'market/orderhistory/{pair}/', 'market/openorders/{pair}/buy/', 'market/openorders/{pair}/sell/', 'market/openorders/{pair}/both/', 'market/openorders/{pair}/{ordertype}/']
                },
                'private': {
                    'post': ['getbalances/', 'getbalance/{currency}/', 'getdeposits/', 'getwithdrawals/', 'getnewdepositaddress/{currency}/', 'getdepositaddress/{currency}/', 'myopenorders/', 'myopenorders_market/{pair}/', 'cancelorder/{orderid}/', 'withdraw/{currency}/', 'trade/{pair}/', 'tradehistory/', 'getdeposithistory/', 'getwithdrawalhistory/', 'walletstatus/', 'walletstatus/{currency}/']
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let response = yield _this.publicGetMarkets();
            let markets = response['markets'];
            let result = [];
            for (let i = 0; i < markets.length; i++) {
                let market = markets[i];
                if (!market['disabled']) {
                    let id = market['marketname'];
                    let [quote, base] = id.split('_');
                    let symbol = base + '/' + quote;
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
            }
            return result;
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let orderbook = yield _this2.publicGetMarketOpenordersPairBoth(_this2.extend({
                'pair': _this2.marketId(symbol)
            }, params));
            return _this2.parseOrderBook(orderbook, undefined, 'buyorders', 'sellorders', 'price', 'amount');
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let response = yield _this3.publicGetMarketInfoPair(_this3.extend({
                'pair': _this3.marketId(symbol)
            }, params));
            let ticker = response['markets'][0];
            let timestamp = _this3.milliseconds();
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': parseFloat(ticker['high24h']),
                'low': parseFloat(ticker['low24h']),
                'bid': _this3.safeFloat(ticker, 'bid'),
                'ask': _this3.safeFloat(ticker, 'ask'),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last_price']),
                'change': parseFloat(ticker['change24h']),
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume24h']),
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = trade['unix_t_datestamp'] * 1000;
        return {
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'id': undefined,
            'order': undefined,
            'type': undefined,
            'side': trade['tradetype'].toLowerCase(),
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['amount'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetMarketOrderhistoryPair(_this4.extend({
                'pair': market['id']
            }, params));
            return _this4.parseTrades(response['items'], market, since, limit);
        })();
    }

    fetchBalance(params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let response = yield _this5.privatePostGetbalances();
            let balances = response['balances'];
            let result = { 'info': response };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = balance['currency'];
                let lockbox = parseFloat(balance['amount_lockbox']);
                let trades = parseFloat(balance['amount_trades']);
                let account = {
                    'free': parseFloat(balance['amount']),
                    'used': _this5.sum(lockbox, trades),
                    'total': parseFloat(balance['amount_total'])
                };
                result[currency] = account;
            }
            return _this5.parseBalance(result);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            if (type == 'market') throw new ExchangeError(_this6.id + ' allows limit orders only');
            yield _this6.loadMarkets();
            amount = amount.toString();
            price = price.toString();
            let market = _this6.market(symbol);
            let order = {
                'tradetype': side.toUpperCase(),
                'tradeamount': amount,
                'tradeprice': price,
                'tradebase': 1,
                'pair': market['id']
            };
            let response = yield _this6.privatePostTradePair(_this6.extend(order, params));
            return {
                'info': response,
                'id': undefined
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            return yield _this7.privatePostCancelorder(_this7.extend({
                'orderid': id
            }, params));
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.version + '/';
        if (api == 'private') url += api + '/';
        url += this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if (Object.keys(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            url += '?' + this.urlencode({ 'nonce': nonce });
            let signature = this.hmac(this.encode(url), this.encode(this.secret), 'sha512', 'base64');
            body = this.urlencode(this.extend({
                'apikey': this.apiKey,
                'signature': signature
            }, query));
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
            if ('status' in response) if (response['status'] != 'success') throw new ExchangeError(_this8.id + ' ' + _this8.json(response));
            return response;
        })();
    }
};