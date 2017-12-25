"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError, InvalidNonce, AuthenticationError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class kucoin extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'kucoin',
            'name': 'Kucoin',
            'countries': 'HK', // Hong Kong
            'version': 'v1',
            'rateLimit': 2000,
            'hasCORS': false,
            'userAgent': this.userAgents['chrome'],
            // obsolete metainfo interface
            'hasFetchTickers': true,
            'hasFetchOHLCV': false, // see the method implementation below
            'hasFetchOrder': true,
            'hasFetchOrders': true,
            'hasFetchClosedOrders': true,
            'hasFetchOpenOrders': true,
            'hasFetchMyTrades': false,
            'hasFetchCurrencies': true,
            'hasWithdraw': true,
            // new metainfo interface
            'has': {
                'fetchTickers': true,
                'fetchOHLCV': true, // see the method implementation below
                'fetchOrder': true,
                'fetchOrders': true,
                'fetchClosedOrders': true,
                'fetchOpenOrders': true,
                'fetchMyTrades': false,
                'fetchCurrencies': true,
                'withdraw': true
            },
            'timeframes': {
                '1m': '1',
                '5m': '5',
                '15m': '15',
                '30m': '30',
                '1h': '60',
                '8h': '480',
                '1d': 'D',
                '1w': 'W'
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/33795655-b3c46e48-dcf6-11e7-8abe-dc4588ba7901.jpg',
                'api': 'https://api.kucoin.com',
                'www': 'https://kucoin.com',
                'doc': 'https://kucoinapidocs.docs.apiary.io',
                'fees': 'https://news.kucoin.com/en/fee'
            },
            'api': {
                'public': {
                    'get': ['open/chart/config', 'open/chart/history', 'open/chart/symbol', 'open/currencies', 'open/deal-orders', 'open/kline', 'open/lang-list', 'open/orders', 'open/orders-buy', 'open/orders-sell', 'open/tick', 'market/open/coin-info', 'market/open/coins', 'market/open/coins-trending', 'market/open/symbols']
                },
                'private': {
                    'get': ['account/balance', 'account/{coin}/wallet/address', 'account/{coin}/wallet/records', 'account/{coin}/balance', 'account/promotion/info', 'account/promotion/sum', 'deal-orders', 'order/active', 'order/active-map', 'order/dealt', 'referrer/descendant/count', 'user/info'],
                    'post': ['account/{coin}/withdraw/apply', 'account/{coin}/withdraw/cancel', 'cancel-order', 'order', 'user/change-lang']
                }
            },
            'fees': {
                'trading': {
                    'maker': 0.0010,
                    'taker': 0.0010
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let response = yield _this.publicGetMarketOpenSymbols();
            let markets = response['data'];
            let result = [];
            for (let i = 0; i < markets.length; i++) {
                let market = markets[i];
                let id = market['symbol'];
                let base = market['coinType'];
                let quote = market['coinTypePair'];
                base = _this.commonCurrencyCode(base);
                quote = _this.commonCurrencyCode(quote);
                let symbol = base + '/' + quote;
                let precision = {
                    'amount': 8,
                    'price': 8
                };
                let active = market['trading'];
                result.push(_this.extend(_this.fees['trading'], {
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'active': active,
                    'info': market,
                    'lot': Math.pow(10, -precision['amount']),
                    'precision': precision,
                    'limits': {
                        'amount': {
                            'min': Math.pow(10, -precision['amount']),
                            'max': undefined
                        },
                        'price': {
                            'min': undefined,
                            'max': undefined
                        }
                    }
                }));
            }
            return result;
        })();
    }

    fetchCurrencies(params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this2.publicGetMarketOpenCoins(params);
            let currencies = response['data'];
            let result = {};
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let id = currency['coin'];
                // todo: will need to rethink the fees
                // to add support for multiple withdrawal/deposit methods and
                // differentiated fees for each particular method
                let code = _this2.commonCurrencyCode(id);
                let precision = currency['tradePrecision'];
                let deposit = currency['enableDeposit'];
                let withdraw = currency['enableWithdraw'];
                let active = deposit && withdraw;
                result[code] = {
                    'id': id,
                    'code': code,
                    'info': currency,
                    'name': currency['name'],
                    'active': active,
                    'status': 'ok',
                    'fee': currency['withdrawFeeRate'], // todo: redesign
                    'precision': precision,
                    'limits': {
                        'amount': {
                            'min': Math.pow(10, -precision),
                            'max': Math.pow(10, precision)
                        },
                        'price': {
                            'min': Math.pow(10, -precision),
                            'max': Math.pow(10, precision)
                        },
                        'cost': {
                            'min': undefined,
                            'max': undefined
                        },
                        'withdraw': {
                            'min': currency['withdrawMinAmount'],
                            'max': Math.pow(10, precision)
                        }
                    }
                };
            }
            return result;
        })();
    }

    fetchBalance(params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let response = yield _this3.privateGetAccountBalance(_this3.extend({
                'limit': 20, // default 12, max 20
                'page': 1
            }, params));
            let balances = response['data'];
            let result = { 'info': balances };
            let indexed = _this3.indexBy(balances, 'coinType');
            let keys = _Object$keys(indexed);
            for (let i = 0; i < keys.length; i++) {
                let id = keys[i];
                let currency = _this3.commonCurrencyCode(id);
                let account = _this3.account();
                let balance = indexed[id];
                let total = parseFloat(balance['balance']);
                let used = parseFloat(balance['freezeBalance']);
                let free = total - used;
                account['free'] = free;
                account['used'] = used;
                account['total'] = total;
                result[currency] = account;
            }
            return _this3.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetOpenOrders(_this4.extend({
                'symbol': market['id']
            }, params));
            let orderbook = response['data'];
            return _this4.parseOrderBook(orderbook, undefined, 'BUY', 'SELL');
        })();
    }

    parseOrder(order, market = undefined) {
        let symbol = undefined;
        if (market) {
            symbol = market['symbol'];
        } else {
            symbol = order['coinType'] + '/' + order['coinTypePair'];
        }
        let timestamp = order['createdAt'];
        let price = this.safeFloat(order, 'price');
        let amount = this.safeFloat(order, 'amount');
        let filled = this.safeFloat(order, 'dealAmount');
        let remaining = this.safeFloat(order, 'pendingAmount');
        let side = order['type'].toLowerCase();
        let result = {
            'info': order,
            'id': this.safeString(order, 'oid'),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'type': 'limit',
            'side': side,
            'price': price,
            'amount': amount,
            'cost': price * filled,
            'filled': filled,
            'remaining': remaining,
            'status': undefined,
            'fee': this.safeFloat(order, 'fee')
        };
        return result;
    }

    fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            if (!symbol) throw new ExchangeError(_this5.id + ' fetchOpenOrders requires a symbol param');
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let request = {
                'symbol': market['id']
            };
            let response = yield _this5.privateGetOrderActiveMap(_this5.extend(request, params));
            let orders = _this5.arrayConcat(response['data']['SELL'], response['data']['BUY']);
            return _this5.parseOrders(orders, market, since, limit);
        })();
    }

    fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            let request = {};
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            if (symbol) {
                request['symbol'] = market['id'];
            }
            if (since) {
                request['since'] = since;
            }
            if (limit) {
                request['limit'] = limit;
            }
            let response = yield _this6.privateGetOrderDealt(_this6.extend(request, params));
            return _this6.parseOrders(response['data']['datas'], market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            if (type != 'limit') throw new ExchangeError(_this7.id + ' allows limit orders only');
            yield _this7.loadMarkets();
            let market = _this7.market(symbol);
            let order = {
                'symbol': market['id'],
                'type': side.toUpperCase(),
                'price': _this7.priceToPrecision(symbol, price),
                'amount': _this7.amountToPrecision(symbol, amount)
            };
            let response = yield _this7.privatePostOrder(_this7.extend(order, params));
            return {
                'info': response,
                'id': _this7.safeString(response['data'], 'orderOid')
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            if (!symbol) throw new ExchangeError(_this8.id + ' cancelOrder requires symbol argument');
            yield _this8.loadMarkets();
            let market = _this8.market(symbol);
            let request = {
                'symbol': market['id'],
                'orderOid': id
            };
            if ('type' in params) {
                request['type'] = params['type'].toUpperCase();
            } else {
                throw new ExchangeError(_this8.id + ' cancelOrder requires type (BUY or SELL) param');
            }
            let response = yield _this8.privatePostCancelOrder(_this8.extend(request, params));
            return response;
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = ticker['datetime'];
        let symbol = undefined;
        if (market) {
            symbol = market['symbol'];
        } else {
            symbol = ticker['coinType'] + '/' + ticker['coinTypePair'];
        }
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': this.safeFloat(ticker, 'high'),
            'low': this.safeFloat(ticker, 'low'),
            'bid': this.safeFloat(ticker, 'buy'),
            'ask': this.safeFloat(ticker, 'sell'),
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': this.safeFloat(ticker, 'lastDealPrice'),
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeFloat(ticker, 'vol'),
            'quoteVolume': this.safeFloat(ticker, 'volValue'),
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this9.publicGetMarketOpenSymbols(params);
            let tickers = response['data'];
            let result = {};
            for (let t = 0; t < tickers.length; t++) {
                let ticker = _this9.parseTicker(tickers[t]);
                let symbol = ticker['symbol'];
                result[symbol] = ticker;
            }
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this10 = this;

        return _asyncToGenerator(function* () {
            yield _this10.loadMarkets();
            let market = _this10.market(symbol);
            let response = yield _this10.publicGetOpenTick(_this10.extend({
                'symbol': market['id']
            }, params));
            let ticker = response['data'];
            return _this10.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestamp = trade[0];
        let side = undefined;
        if (trade[1] == 'BUY') {
            side = 'buy';
        } else if (trade[1] == 'SELL') {
            side = 'sell';
        }
        return {
            'id': undefined,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': 'limit',
            'side': side,
            'price': trade[2],
            'amount': trade[3]
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this11 = this;

        return _asyncToGenerator(function* () {
            yield _this11.loadMarkets();
            let market = _this11.market(symbol);
            let response = yield _this11.publicGetOpenDealOrders(_this11.extend({
                'symbol': market['id']
            }, params));
            return _this11.parseTrades(response['data'], market, since, limit);
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '1d', since = undefined, limit = undefined) {
        let timestamp = this.parse8601(ohlcv['T']);
        return [timestamp, ohlcv['O'], ohlcv['H'], ohlcv['L'], ohlcv['C'], ohlcv['V']];
    }

    fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        var _this12 = this;

        return _asyncToGenerator(function* () {
            yield _this12.loadMarkets();
            let market = _this12.market(symbol);
            let to = _this12.seconds();
            let request = {
                'symbol': market['id'],
                'type': _this12.timeframes[timeframe],
                'from': to - 86400,
                'to': to
            };
            if (since) {
                request['from'] = parseInt(since / 1000);
            }
            // limit is not documented in api call, and not respected
            if (limit) {
                request['limit'] = limit;
            }
            let response = yield _this12.publicGetOpenChartHistory(_this12.extend(request, params));
            // we need buildOHLCV
            return _this12.parseOHLCVs(response['data'], market, timeframe, since, limit);
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let endpoint = '/' + this.version + '/' + this.implodeParams(path, params);
        let url = this.urls['api'] + endpoint;
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if (_Object$keys(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            // their nonce is always a calibrated synched milliseconds-timestamp
            let nonce = this.milliseconds();
            let queryString = '';
            nonce = nonce.toString();
            if (_Object$keys(query).length) {
                queryString = this.rawencode(this.keysort(query));
                if (method == 'GET') {
                    url += '?' + queryString;
                } else {
                    body = queryString;
                }
            }
            let auth = endpoint + '/' + nonce + '/' + queryString;
            let payload = this.stringToBase64(this.encode(auth));
            // payload should be "encoded" as returned from stringToBase64
            let signature = this.hmac(payload, this.encode(this.secret), 'sha256');
            headers = {
                'KC-API-KEY': this.apiKey,
                'KC-API-NONCE': nonce,
                'KC-API-SIGNATURE': signature
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors(code, reason, url, method, headers, body) {
        if (code >= 400) {
            if (body && body[0] == "{") {
                let response = JSON.parse(body);
                if ('success' in response) {
                    if (!response['success']) {
                        if ('code' in response) {
                            if (response['code'] == 'UNAUTH') {
                                let message = this.safeString(response, 'msg');
                                if (message == 'Invalid nonce') {
                                    throw new InvalidNonce(this.id + ' ' + message);
                                }
                                throw new AuthenticationError(this.id + ' ' + this.json(response));
                            }
                        }
                        throw new ExchangeError(this.id + ' ' + this.json(response));
                    }
                }
            } else {
                throw new ExchangeError(this.id + ' ' + code.toString() + ' ' + reason);
            }
        }
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this13 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this13.fetch2(path, api, method, params, headers, body);
            return response;
        })();
    }
};