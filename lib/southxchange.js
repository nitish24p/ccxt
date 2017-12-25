"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');

//  ---------------------------------------------------------------------------

module.exports = class southxchange extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'southxchange',
            'name': 'SouthXchange',
            'countries': 'AR', // Argentina
            'rateLimit': 1000,
            'hasFetchTickers': true,
            'hasCORS': false,
            'hasWithdraw': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27838912-4f94ec8a-60f6-11e7-9e5d-bbf9bd50a559.jpg',
                'api': 'https://www.southxchange.com/api',
                'www': 'https://www.southxchange.com',
                'doc': 'https://www.southxchange.com/Home/Api'
            },
            'api': {
                'public': {
                    'get': ['markets', 'price/{symbol}', 'prices', 'book/{symbol}', 'trades/{symbol}']
                },
                'private': {
                    'post': ['cancelMarketOrders', 'cancelOrder', 'generatenewaddress', 'listOrders', 'listBalances', 'placeOrder', 'withdraw']
                }
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'maker': 0.2 / 100,
                    'taker': 0.2 / 100
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.publicGetMarkets();
            let result = [];
            for (let p = 0; p < markets.length; p++) {
                let market = markets[p];
                let base = market[0];
                let quote = market[1];
                let symbol = base + '/' + quote;
                let id = symbol;
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

    fetchBalance(params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let balances = yield _this2.privatePostListBalances();
            if (!balances) throw new ExchangeError(_this2.id + ' fetchBalance got an unrecognized response');
            let result = { 'info': balances };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = balance['Currency'];
                let uppercase = currency.toUpperCase();
                let free = parseFloat(balance['Available']);
                let used = parseFloat(balance['Unconfirmed']);
                let total = _this2.sum(free, used);
                let account = {
                    'free': free,
                    'used': used,
                    'total': total
                };
                result[uppercase] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let orderbook = yield _this3.publicGetBookSymbol(_this3.extend({
                'symbol': _this3.marketId(symbol)
            }, params));
            return _this3.parseOrderBook(orderbook, undefined, 'BuyOrders', 'SellOrders', 'Price', 'Amount');
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
            'bid': this.safeFloat(ticker, 'Bid'),
            'ask': this.safeFloat(ticker, 'Ask'),
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': this.safeFloat(ticker, 'Last'),
            'change': this.safeFloat(ticker, 'Variation24Hr'),
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeFloat(ticker, 'Volume24Hr'),
            'quoteVolume': undefined,
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let response = yield _this4.publicGetPrices(params);
            let tickers = _this4.indexBy(response, 'Market');
            let ids = _Object$keys(tickers);
            let result = {};
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let symbol = id;
                let market = undefined;
                if (id in _this4.markets_by_id) {
                    market = _this4.markets_by_id[id];
                    symbol = market['symbol'];
                }
                let ticker = tickers[id];
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
            let ticker = yield _this5.publicGetPriceSymbol(_this5.extend({
                'symbol': market['id']
            }, params));
            return _this5.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market) {
        let timestamp = trade['At'] * 1000;
        return {
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'id': undefined,
            'order': undefined,
            'type': undefined,
            'side': trade['Type'],
            'price': trade['Price'],
            'amount': trade['Amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let response = yield _this6.publicGetTradesSymbol(_this6.extend({
                'symbol': market['id']
            }, params));
            return _this6.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            let market = _this7.market(symbol);
            let order = {
                'listingCurrency': market['base'],
                'referenceCurrency': market['quote'],
                'type': side,
                'amount': amount
            };
            if (type == 'limit') order['limitPrice'] = price;
            let response = yield _this7.privatePostPlaceOrder(_this7.extend(order, params));
            return {
                'info': response,
                'id': response.toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            return yield _this8.privatePostCancelOrder(_this8.extend({
                'orderCode': id
            }, params));
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this9.privatePostWithdraw(_this9.extend({
                'currency': currency,
                'address': address,
                'amount': amount
            }, params));
            return {
                'info': response,
                'id': undefined
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'private') {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            query = this.extend({
                'key': this.apiKey,
                'nonce': nonce
            }, query);
            body = this.json(query);
            headers = {
                'Content-Type': 'application/json',
                'Hash': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this10 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this10.fetch2(path, api, method, params, headers, body);
            return response;
        })();
    }
};