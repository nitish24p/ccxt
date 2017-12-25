"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class bter extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bter',
            'name': 'Bter',
            'countries': ['VG', 'CN'], // British Virgin Islands, China
            'version': '2',
            'hasCORS': false,
            'hasFetchTickers': true,
            'hasWithdraw': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27980479-cfa3188c-6387-11e7-8191-93fc4184ba5c.jpg',
                'api': {
                    'public': 'https://data.bter.com/api',
                    'private': 'https://api.bter.com/api'
                },
                'www': 'https://bter.com',
                'doc': 'https://bter.com/api2'
            },
            'api': {
                'public': {
                    'get': ['pairs', 'marketinfo', 'marketlist', 'tickers', 'ticker/{id}', 'orderBook/{id}', 'trade/{id}', 'tradeHistory/{id}', 'tradeHistory/{id}/{tid}']
                },
                'private': {
                    'post': ['balances', 'depositAddress', 'newAddress', 'depositsWithdrawals', 'buy', 'sell', 'cancelOrder', 'cancelAllOrders', 'getOrder', 'openOrders', 'tradeHistory', 'withdraw']
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let response = yield _this.publicGetMarketinfo();
            let markets = _this.safeValue(response, 'pairs');
            if (!markets) throw new ExchangeError(_this.id + ' fetchMarkets got an unrecognized response');
            let result = [];
            for (let i = 0; i < markets.length; i++) {
                let market = markets[i];
                let keys = _Object$keys(market);
                let id = keys[0];
                let details = market[id];
                let [base, quote] = id.split('_');
                base = base.toUpperCase();
                quote = quote.toUpperCase();
                base = _this.commonCurrencyCode(base);
                quote = _this.commonCurrencyCode(quote);
                let symbol = base + '/' + quote;
                let precision = {
                    'amount': details['decimal_places'],
                    'price': details['decimal_places']
                };
                let amountLimits = {
                    'min': details['min_amount'],
                    'max': undefined
                };
                let priceLimits = {
                    'min': undefined,
                    'max': undefined
                };
                let limits = {
                    'amount': amountLimits,
                    'price': priceLimits
                };
                result.push({
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'info': market,
                    'maker': details['fee'] / 100,
                    'taker': details['fee'] / 100,
                    'precision': precision,
                    'limits': limits
                });
            }
            return result;
        })();
    }

    fetchBalance(params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let balance = yield _this2.privatePostBalances();
            let result = { 'info': balance };
            let currencies = _Object$keys(_this2.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let code = _this2.commonCurrencyCode(currency);
                let account = _this2.account();
                if ('available' in balance) {
                    if (currency in balance['available']) {
                        account['free'] = parseFloat(balance['available'][currency]);
                    }
                }
                if ('locked' in balance) {
                    if (currency in balance['locked']) {
                        account['used'] = parseFloat(balance['locked'][currency]);
                    }
                }
                account['total'] = _this2.sum(account['free'], account['used']);
                result[code] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let orderbook = yield _this3.publicGetOrderBookId(_this3.extend({
                'id': _this3.marketId(symbol)
            }, params));
            let result = _this3.parseOrderBook(orderbook);
            result['asks'] = _this3.sortBy(result['asks'], 0);
            return result;
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
            'high': parseFloat(ticker['high24hr']),
            'low': parseFloat(ticker['low24hr']),
            'bid': parseFloat(ticker['highestBid']),
            'ask': parseFloat(ticker['lowestAsk']),
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': parseFloat(ticker['last']),
            'change': parseFloat(ticker['percentChange']),
            'percentage': undefined,
            'average': undefined,
            'baseVolume': parseFloat(ticker['quoteVolume']),
            'quoteVolume': parseFloat(ticker['baseVolume']),
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let tickers = yield _this4.publicGetTickers(params);
            let result = {};
            let ids = _Object$keys(tickers);
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let [baseId, quoteId] = id.split('_');
                let base = baseId.toUpperCase();
                let quote = quoteId.toUpperCase();
                base = _this4.commonCurrencyCode(base);
                quote = _this4.commonCurrencyCode(quote);
                let symbol = base + '/' + quote;
                let ticker = tickers[id];
                let market = undefined;
                if (symbol in _this4.markets) market = _this4.markets[symbol];
                if (id in _this4.markets_by_id) market = _this4.markets_by_id[id];
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
            let ticker = yield _this5.publicGetTickerId(_this5.extend({
                'id': market['id']
            }, params));
            return _this5.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market) {
        let timestamp = this.parse8601(trade['date']);
        return {
            'id': trade['tradeID'],
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': trade['type'],
            'price': trade['rate'],
            'amount': this.safeFloat(trade, 'amount')
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let response = yield _this6.publicGetTradeHistoryId(_this6.extend({
                'id': market['id']
            }, params));
            return _this6.parseTrades(response['data'], market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            if (type == 'market') throw new ExchangeError(_this7.id + ' allows limit orders only');
            yield _this7.loadMarkets();
            let method = 'privatePost' + _this7.capitalize(side);
            let order = {
                'currencyPair': _this7.marketId(symbol),
                'rate': price,
                'amount': amount
            };
            let response = yield _this7[method](_this7.extend(order, params));
            return {
                'info': response,
                'id': response['orderNumber']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            return yield _this8.privatePostCancelOrder({ 'orderNumber': id });
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            yield _this9.loadMarkets();
            let response = yield _this9.privatePostWithdraw(_this9.extend({
                'currency': currency.toLowerCase(),
                'amount': amount,
                'address': address // Address must exist in you AddressBook in security settings
            }, params));
            return {
                'info': response,
                'id': undefined
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let prefix = api == 'private' ? api + '/' : '';
        let url = this.urls['api'][api] + this.version + '/1/' + prefix + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if (_Object$keys(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            let request = { 'nonce': nonce };
            body = this.urlencode(this.extend(request, query));
            let signature = this.hmac(this.encode(body), this.encode(this.secret), 'sha512');
            headers = {
                'Key': this.apiKey,
                'Sign': signature,
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this10 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this10.fetch2(path, api, method, params, headers, body);
            if ('result' in response) if (response['result'] != 'true') throw new ExchangeError(_this10.id + ' ' + _this10.json(response));
            return response;
        })();
    }
};