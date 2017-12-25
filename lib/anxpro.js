"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class anxpro extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'anxpro',
            'name': 'ANXPro',
            'countries': ['JP', 'SG', 'HK', 'NZ'],
            'version': '2',
            'rateLimit': 1500,
            'hasCORS': false,
            'hasFetchTrades': false,
            'hasWithdraw': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27765983-fd8595da-5ec9-11e7-82e3-adb3ab8c2612.jpg',
                'api': 'https://anxpro.com/api',
                'www': 'https://anxpro.com',
                'doc': ['http://docs.anxv2.apiary.io', 'https://anxpro.com/pages/api']
            },
            'api': {
                'public': {
                    'get': ['{currency_pair}/money/ticker', '{currency_pair}/money/depth/full', '{currency_pair}/money/trade/fetch']
                },
                'private': {
                    'post': ['{currency_pair}/money/order/add', '{currency_pair}/money/order/cancel', '{currency_pair}/money/order/quote', '{currency_pair}/money/order/result', '{currency_pair}/money/orders', 'money/{currency}/address', 'money/{currency}/send_simple', 'money/info', 'money/trade/list', 'money/wallet/history']
                }
            },
            'markets': {
                'BTC/USD': { 'id': 'BTCUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'multiplier': 100000 },
                'BTC/HKD': { 'id': 'BTCHKD', 'symbol': 'BTC/HKD', 'base': 'BTC', 'quote': 'HKD', 'multiplier': 100000 },
                'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR', 'multiplier': 100000 },
                'BTC/CAD': { 'id': 'BTCCAD', 'symbol': 'BTC/CAD', 'base': 'BTC', 'quote': 'CAD', 'multiplier': 100000 },
                'BTC/AUD': { 'id': 'BTCAUD', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD', 'multiplier': 100000 },
                'BTC/SGD': { 'id': 'BTCSGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD', 'multiplier': 100000 },
                'BTC/JPY': { 'id': 'BTCJPY', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY', 'multiplier': 100000 },
                'BTC/GBP': { 'id': 'BTCGBP', 'symbol': 'BTC/GBP', 'base': 'BTC', 'quote': 'GBP', 'multiplier': 100000 },
                'BTC/NZD': { 'id': 'BTCNZD', 'symbol': 'BTC/NZD', 'base': 'BTC', 'quote': 'NZD', 'multiplier': 100000 },
                'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'multiplier': 100000 },
                'STR/BTC': { 'id': 'STRBTC', 'symbol': 'STR/BTC', 'base': 'STR', 'quote': 'BTC', 'multiplier': 100000000 },
                'XRP/BTC': { 'id': 'XRPBTC', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC', 'multiplier': 100000000 },
                'DOGE/BTC': { 'id': 'DOGEBTC', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC', 'multiplier': 100000000 }
            },
            'fees': {
                'trading': {
                    'maker': 0.3 / 100,
                    'taker': 0.6 / 100
                }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let response = yield _this.privatePostMoneyInfo();
            let balance = response['data'];
            let currencies = _Object$keys(balance['Wallets']);
            let result = { 'info': balance };
            for (let c = 0; c < currencies.length; c++) {
                let currency = currencies[c];
                let account = _this.account();
                if (currency in balance['Wallets']) {
                    let wallet = balance['Wallets'][currency];
                    account['free'] = parseFloat(wallet['Available_Balance']['value']);
                    account['total'] = parseFloat(wallet['Balance']['value']);
                    account['used'] = account['total'] - account['free'];
                }
                result[currency] = account;
            }
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this2.publicGetCurrencyPairMoneyDepthFull(_this2.extend({
                'currency_pair': _this2.marketId(symbol)
            }, params));
            let orderbook = response['data'];
            let t = parseInt(orderbook['dataUpdateTime']);
            let timestamp = parseInt(t / 1000);
            return _this2.parseOrderBook(orderbook, timestamp, 'bids', 'asks', 'price', 'amount');
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this3.publicGetCurrencyPairMoneyTicker(_this3.extend({
                'currency_pair': _this3.marketId(symbol)
            }, params));
            let ticker = response['data'];
            let t = parseInt(ticker['dataUpdateTime']);
            let timestamp = parseInt(t / 1000);
            let bid = _this3.safeFloat(ticker['buy'], 'value');
            let ask = _this3.safeFloat(ticker['sell'], 'value');;
            let vwap = parseFloat(ticker['vwap']['value']);
            let baseVolume = parseFloat(ticker['vol']['value']);
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': parseFloat(ticker['high']['value']),
                'low': parseFloat(ticker['low']['value']),
                'bid': bid,
                'ask': ask,
                'vwap': vwap,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']['value']),
                'change': undefined,
                'percentage': undefined,
                'average': parseFloat(ticker['avg']['value']),
                'baseVolume': baseVolume,
                'quoteVolume': baseVolume * vwap,
                'info': ticker
            };
        })();
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            throw new ExchangeError(_this4.id + ' switched off the trades endpoint, see their docs at http://docs.anxv2.apiary.io/reference/market-data/currencypairmoneytradefetch-disabled');
            return _this4.publicGetCurrencyPairMoneyTradeFetch(_this4.extend({
                'currency_pair': _this4.marketId(symbol)
            }, params));
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            let market = _this5.market(symbol);
            let order = {
                'currency_pair': market['id'],
                'amount_int': parseInt(amount * 100000000) // 10^8
            };
            if (type == 'limit') {
                order['price_int'] = parseInt(price * market['multiplier']); // 10^5 or 10^8
            }
            order['type'] = side == 'buy' ? 'bid' : 'ask';
            let result = yield _this5.privatePostCurrencyPairMoneyOrderAdd(_this5.extend(order, params));
            return {
                'info': result,
                'id': result['data']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            return yield _this6.privatePostCurrencyPairMoneyOrderCancel({ 'oid': id });
        })();
    }

    getAmountMultiplier(currency) {
        if (currency == 'BTC') {
            return 100000000;
        } else if (currency == 'LTC') {
            return 100000000;
        } else if (currency == 'STR') {
            return 100000000;
        } else if (currency == 'XRP') {
            return 100000000;
        } else if (currency == 'DOGE') {
            return 100000000;
        }
        return 100;
    }

    withdraw(currency, amount, address, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            let multiplier = _this7.getAmountMultiplier(currency);
            let response = yield _this7.privatePostMoneyCurrencySendSimple(_this7.extend({
                'currency': currency,
                'amount_int': parseInt(amount * multiplier),
                'address': address
            }, params));
            return {
                'info': response,
                'id': response['data']['transactionId']
            };
        })();
    }

    nonce() {
        return this.milliseconds();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let request = this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        let url = this.urls['api'] + '/' + this.version + '/' + request;
        if (api == 'public') {
            if (_Object$keys(query).length) url += '?' + this.urlencode(query);
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
                'Rest-Sign': this.decode(signature)
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this8.fetch2(path, api, method, params, headers, body);
            if ('result' in response) if (response['result'] == 'success') return response;
            throw new ExchangeError(_this8.id + ' ' + _this8.json(response));
        })();
    }
};