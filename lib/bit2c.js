"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');

//  ---------------------------------------------------------------------------

module.exports = class bit2c extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bit2c',
            'name': 'Bit2C',
            'countries': 'IL', // Israel
            'rateLimit': 3000,
            'hasCORS': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766119-3593220e-5ece-11e7-8b3a-5a041f6bcc3f.jpg',
                'api': 'https://www.bit2c.co.il',
                'www': 'https://www.bit2c.co.il',
                'doc': ['https://www.bit2c.co.il/home/api', 'https://github.com/OferE/bit2c']
            },
            'api': {
                'public': {
                    'get': ['Exchanges/{pair}/Ticker', 'Exchanges/{pair}/orderbook', 'Exchanges/{pair}/trades']
                },
                'private': {
                    'post': ['Account/Balance', 'Account/Balance/v2', 'Merchant/CreateCheckout', 'Order/AccountHistory', 'Order/AddCoinFundsRequest', 'Order/AddFund', 'Order/AddOrder', 'Order/AddOrderMarketPriceBuy', 'Order/AddOrderMarketPriceSell', 'Order/CancelOrder', 'Order/MyOrders', 'Payment/GetMyId', 'Payment/Send']
                }
            },
            'markets': {
                'BTC/NIS': { 'id': 'BtcNis', 'symbol': 'BTC/NIS', 'base': 'BTC', 'quote': 'NIS' },
                'BCH/NIS': { 'id': 'BchNis', 'symbol': 'BCH/NIS', 'base': 'BCH', 'quote': 'NIS' },
                'LTC/NIS': { 'id': 'LtcNis', 'symbol': 'LTC/NIS', 'base': 'LTC', 'quote': 'NIS' },
                'BTG/NIS': { 'id': 'BtgNis', 'symbol': 'BTG/NIS', 'base': 'BTG', 'quote': 'NIS' }
            },
            'fees': {
                'trading': {
                    'maker': 0.5 / 100,
                    'taker': 0.5 / 100
                }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let balance = yield _this.privatePostAccountBalanceV2();
            let result = { 'info': balance };
            let currencies = _Object$keys(_this.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let account = _this.account();
                if (currency in balance) {
                    let available = 'AVAILABLE_' + currency;
                    account['free'] = balance[available];
                    account['total'] = balance[currency];
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
            let orderbook = yield _this2.publicGetExchangesPairOrderbook(_this2.extend({
                'pair': _this2.marketId(symbol)
            }, params));
            return _this2.parseOrderBook(orderbook);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            let ticker = yield _this3.publicGetExchangesPairTicker(_this3.extend({
                'pair': _this3.marketId(symbol)
            }, params));
            let timestamp = _this3.milliseconds();
            let averagePrice = parseFloat(ticker['av']);
            let baseVolume = parseFloat(ticker['a']);
            let quoteVolume = baseVolume * averagePrice;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': parseFloat(ticker['h']),
                'ask': parseFloat(ticker['l']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['ll']),
                'change': undefined,
                'percentage': undefined,
                'average': averagePrice,
                'baseVolume': baseVolume,
                'quoteVolume': quoteVolume,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestamp = parseInt(trade['date']) * 1000;
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'id': trade['tid'].toString(),
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'order': undefined,
            'type': undefined,
            'side': undefined,
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetExchangesPairTrades(_this4.extend({
                'pair': market['id']
            }, params));
            return _this4.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            let method = 'privatePostOrderAddOrder';
            let order = {
                'Amount': amount,
                'Pair': _this5.marketId(symbol)
            };
            if (type == 'market') {
                method += 'MarketPrice' + _this5.capitalize(side);
            } else {
                order['Price'] = price;
                order['Total'] = amount * price;
                order['IsBid'] = side == 'buy';
            }
            let result = yield _this5[method](_this5.extend(order, params));
            return {
                'info': result,
                'id': result['NewOrder']['id']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            return yield _this6.privatePostOrderCancelOrder({ 'id': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.implodeParams(path, params);
        if (api == 'public') {
            url += '.json';
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            let query = this.extend({ 'nonce': nonce }, params);
            body = this.urlencode(query);
            let signature = this.hmac(this.encode(body), this.encode(this.secret), 'sha512', 'base64');
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'key': this.apiKey,
                'sign': this.decode(signature)
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
};