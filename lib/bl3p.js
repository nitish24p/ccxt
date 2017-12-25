"use strict";

// ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');

// ---------------------------------------------------------------------------

module.exports = class bl3p extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bl3p',
            'name': 'BL3P',
            'countries': ['NL', 'EU'], // Netherlands, EU
            'rateLimit': 1000,
            'version': '1',
            'comment': 'An exchange market by BitonicNL',
            'hasCORS': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/28501752-60c21b82-6feb-11e7-818b-055ee6d0e754.jpg',
                'api': 'https://api.bl3p.eu',
                'www': ['https://bl3p.eu', 'https://bitonic.nl'],
                'doc': ['https://github.com/BitonicNL/bl3p-api/tree/master/docs', 'https://bl3p.eu/api', 'https://bitonic.nl/en/api']
            },
            'api': {
                'public': {
                    'get': ['{market}/ticker', '{market}/orderbook', '{market}/trades']
                },
                'private': {
                    'post': ['{market}/money/depth/full', '{market}/money/order/add', '{market}/money/order/cancel', '{market}/money/order/result', '{market}/money/orders', '{market}/money/orders/history', '{market}/money/trades/fetch', 'GENMKT/money/info', 'GENMKT/money/deposit_address', 'GENMKT/money/new_deposit_address', 'GENMKT/money/wallet/history', 'GENMKT/money/withdraw']
                }
            },
            'markets': {
                'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR', 'maker': 0.0025, 'taker': 0.0025 }
                // 'LTC/EUR': { 'id': 'LTCEUR', 'symbol': 'LTC/EUR', 'base': 'LTC', 'quote': 'EUR' },
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let response = yield _this.privatePostGENMKTMoneyInfo();
            let data = response['data'];
            let balance = data['wallets'];
            let result = { 'info': data };
            let currencies = Object.keys(_this.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let account = _this.account();
                if (currency in balance) {
                    if ('available' in balance[currency]) {
                        account['free'] = parseFloat(balance[currency]['available']['value']);
                    }
                }
                if (currency in balance) {
                    if ('balance' in balance[currency]) {
                        account['total'] = parseFloat(balance[currency]['balance']['value']);
                    }
                }
                if (account['total']) {
                    if (account['free']) {
                        account['used'] = account['total'] - account['free'];
                    }
                }
                result[currency] = account;
            }
            return _this.parseBalance(result);
        })();
    }

    parseBidAsk(bidask, priceKey = 0, amountKey = 0) {
        return [bidask['price_int'] / 100000.0, bidask['amount_int'] / 100000000.0];
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let market = _this2.market(symbol);
            let response = yield _this2.publicGetMarketOrderbook(_this2.extend({
                'market': market['id']
            }, params));
            let orderbook = response['data'];
            return _this2.parseOrderBook(orderbook);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            let ticker = yield _this3.publicGetMarketTicker(_this3.extend({
                'market': _this3.marketId(symbol)
            }, params));
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
                'baseVolume': parseFloat(ticker['volume']['24h']),
                'quoteVolume': undefined,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        return {
            'id': trade['trade_id'],
            'info': trade,
            'timestamp': trade['date'],
            'datetime': this.iso8601(trade['date']),
            'symbol': market['symbol'],
            'type': undefined,
            'side': undefined,
            'price': trade['price_int'] / 100000.0,
            'amount': trade['amount_int'] / 100000000.0
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetMarketTrades(_this4.extend({
                'market': market['id']
            }, params));
            let result = _this4.parseTrades(response['data']['trades'], market, since, limit);
            return result;
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            let market = _this5.market(symbol);
            let order = {
                'market': market['id'],
                'amount_int': amount,
                'fee_currency': market['quote'],
                'type': side == 'buy' ? 'bid' : 'ask'
            };
            if (type == 'limit') order['price_int'] = price;
            let response = yield _this5.privatePostMarketMoneyOrderAdd(_this5.extend(order, params));
            return {
                'info': response,
                'id': response['order_id'].toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            return yield _this6.privatePostMarketMoneyOrderCancel({ 'order_id': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let request = this.implodeParams(path, params);
        let url = this.urls['api'] + '/' + this.version + '/' + request;
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if (Object.keys(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            body = this.urlencode(this.extend({ 'nonce': nonce }, query));
            let secret = this.base64ToBinary(this.secret);
            let auth = request + "\0" + body;
            let signature = this.hmac(this.encode(auth), secret, 'sha512', 'base64');
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Rest-Key': this.apiKey,
                'Rest-Sign': signature
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
};