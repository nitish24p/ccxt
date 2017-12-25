"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError, OrderNotFound } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class acx extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'acx',
            'name': 'ACX',
            'countries': 'AU',
            'rateLimit': 1000,
            'version': 'v2',
            'hasCORS': true,
            'hasFetchTickers': true,
            'hasFetchOHLCV': true,
            'hasWithdraw': true,
            'timeframes': {
                '1m': '1',
                '5m': '5',
                '15m': '15',
                '30m': '30',
                '1h': '60',
                '2h': '120',
                '4h': '240',
                '12h': '720',
                '1d': '1440',
                '3d': '4320',
                '1w': '10080'
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/30247614-1fe61c74-9621-11e7-9e8c-f1a627afa279.jpg',
                'extension': '.json',
                'api': 'https://acx.io/api',
                'www': 'https://acx.io',
                'doc': 'https://acx.io/documents/api_v2'
            },
            'api': {
                'public': {
                    'get': ['markets', // Get all available markets
                    'tickers', // Get ticker of all markets
                    'tickers/{market}', // Get ticker of specific market
                    'trades', // Get recent trades on market, each trade is included only once Trades are sorted in reverse creation order.
                    'order_book', // Get the order book of specified market
                    'depth', // Get depth or specified market Both asks and bids are sorted from highest price to lowest.
                    'k', // Get OHLC(k line) of specific market
                    'k_with_pending_trades', // Get K data with pending trades, which are the trades not included in K data yet, because there's delay between trade generated and processed by K data generator
                    'timestamp']
                },
                'private': {
                    'get': ['members/me', // Get your profile and accounts info
                    'deposits', // Get your deposits history
                    'deposit', // Get details of specific deposit
                    'deposit_address', // Where to deposit The address field could be empty when a new address is generating (e.g. for bitcoin), you should try again later in that case.
                    'orders', // Get your orders, results is paginated
                    'order', // Get information of specified order
                    'trades/my', // Get your executed trades Trades are sorted in reverse creation order.
                    'withdraws', // Get your cryptocurrency withdraws
                    'withdraw'],
                    'post': ['orders', // Create a Sell/Buy order
                    'orders/multi', // Create multiple sell/buy orders
                    'orders/clear', // Cancel all my orders
                    'order/delete', // Cancel an order
                    'withdraw']
                }
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'maker': 0.0,
                    'taker': 0.0
                },
                'funding': {
                    'tierBased': false,
                    'percentage': true,
                    'withdraw': 0.0 // There is only 1% fee on withdrawals to your bank account.
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
                let id = market['id'];
                let symbol = market['name'];
                let [base, quote] = symbol.split('/');
                base = _this.commonCurrencyCode(base);
                quote = _this.commonCurrencyCode(quote);
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
            let response = yield _this2.privateGetMembersMe();
            let balances = response['accounts'];
            let result = { 'info': balances };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = balance['currency'];
                let uppercase = currency.toUpperCase();
                let account = {
                    'free': parseFloat(balance['balance']),
                    'used': parseFloat(balance['locked']),
                    'total': 0.0
                };
                account['total'] = _this2.sum(account['free'], account['used']);
                result[uppercase] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let orderbook = yield _this3.publicGetDepth(_this3.extend({
                'market': market['id'],
                'limit': 300
            }, params));
            let timestamp = orderbook['timestamp'] * 1000;
            let result = _this3.parseOrderBook(orderbook, timestamp);
            result['bids'] = _this3.sortBy(result['bids'], 0, true);
            result['asks'] = _this3.sortBy(result['asks'], 0);
            return result;
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = ticker['at'] * 1000;
        ticker = ticker['ticker'];
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': this.safeFloat(ticker, 'high', undefined),
            'low': this.safeFloat(ticker, 'low', undefined),
            'bid': this.safeFloat(ticker, 'buy', undefined),
            'ask': this.safeFloat(ticker, 'sell', undefined),
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': this.safeFloat(ticker, 'last', undefined),
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeFloat(ticker, 'vol', undefined),
            'quoteVolume': undefined,
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let tickers = yield _this4.publicGetTickers(params);
            let ids = Object.keys(tickers);
            let result = {};
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let market = undefined;
                let symbol = id;
                if (id in _this4.markets_by_id) {
                    market = _this4.markets_by_id[id];
                    symbol = market['symbol'];
                } else {
                    let base = id.slice(0, 3);
                    let quote = id.slice(3, 6);
                    base = base.toUpperCase();
                    quote = quote.toUpperCase();
                    base = _this4.commonCurrencyCode(base);
                    quote = _this4.commonCurrencyCode(quote);
                    let symbol = base + '/' + quote;
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
            let response = yield _this5.publicGetTickersMarket(_this5.extend({
                'market': market['id']
            }, params));
            return _this5.parseTicker(response, market);
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestamp = trade['timestamp'] * 1000;
        let side = trade['type'] == 'bid' ? 'buy' : 'sell';
        return {
            'info': trade,
            'id': trade['tid'].toString(),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': side,
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let response = yield _this6.publicGetTrades(_this6.extend({
                'market': market['id']
            }, params));
            // looks like they switched this endpoint off
            // it returns 503 Service Temporarily Unavailable always
            // return this.parseTrades (response, market, since, limit);
            return response;
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '1m', since = undefined, limit = undefined) {
        return [ohlcv[0] * 1000, ohlcv[1], ohlcv[2], ohlcv[3], ohlcv[4], ohlcv[5]];
    }

    fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            let market = _this7.market(symbol);
            if (!limit) limit = 500; // default is 30
            let request = {
                'market': market['id'],
                'period': _this7.timeframes[timeframe],
                'limit': limit
            };
            if (since) request['timestamp'] = since;
            let response = yield _this7.publicGetK(_this7.extend(request, params));
            return _this7.parseOHLCVs(response, market, timeframe, since, limit);
        })();
    }

    parseOrder(order, market = undefined) {
        let symbol = undefined;
        if (market) {
            symbol = market['symbol'];
        } else {
            let marketId = order['market'];
            symbol = this.marketsById[marketId]['symbol'];
        }
        let timestamp = this.parse8601(order['created_at']);
        let state = order['state'];
        let status = undefined;
        if (state == 'done') {
            status = 'closed';
        } else if (state == 'wait') {
            status = 'open';
        } else if (state == 'cancel') {
            status = 'canceled';
        }
        return {
            'id': order['id'],
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'status': status,
            'symbol': symbol,
            'type': order['ord_type'],
            'side': order['side'],
            'price': parseFloat(order['price']),
            'amount': parseFloat(order['volume']),
            'filled': parseFloat(order['executed_volume']),
            'remaining': parseFloat(order['remaining_volume']),
            'trades': undefined,
            'fee': undefined,
            'info': order
        };
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            let order = {
                'market': _this8.marketId(symbol),
                'side': side,
                'volume': amount.toString(),
                'ord_type': type
            };
            if (type == 'limit') {
                order['price'] = price.toString();
            }
            let response = yield _this8.privatePostOrders(_this8.extend(order, params));
            let market = _this8.marketsById[response['market']];
            return _this8.parseOrder(response, market);
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            yield _this9.loadMarkets();
            let result = yield _this9.privatePostOrderDelete({ 'id': id });
            let order = _this9.parseOrder(result);
            if (order['status'] == 'closed') {
                throw new OrderNotFound(_this9.id + ' ' + result);
            }
            return order;
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this10 = this;

        return _asyncToGenerator(function* () {
            yield _this10.loadMarkets();
            let result = yield _this10.privatePostWithdraw(_this10.extend({
                'currency': currency.toLowerCase(),
                'sum': amount,
                'address': address
            }, params));
            return {
                'info': result,
                'id': undefined
            };
        })();
    }

    nonce() {
        return this.milliseconds();
    }

    encodeParams(params) {
        if ('orders' in params) {
            let orders = params['orders'];
            let query = this.urlencode(this.keysort(this.omit(params, 'orders')));
            for (let i = 0; i < orders.length; i++) {
                let order = orders[i];
                let keys = Object.keys(order);
                for (let k = 0; k < keys.length; k++) {
                    let key = keys[k];
                    let value = order[key];
                    query += '&orders%5B%5D%5B' + key + '%5D=' + value.toString();
                }
            }
            return query;
        }
        return this.urlencode(this.keysort(params));
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let request = '/api' + '/' + this.version + '/' + this.implodeParams(path, params);
        if ('extension' in this.urls) request += this.urls['extension'];
        let query = this.omit(params, this.extractParams(path));
        let url = this.urls['api'] + request;
        if (api == 'public') {
            if (Object.keys(query).length) {
                url += '?' + this.urlencode(query);
            }
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            let query = this.encodeParams(this.extend({
                'access_key': this.apiKey,
                'tonce': nonce
            }, params));
            let auth = method + '|' + request + '|' + query;
            let signature = this.hmac(this.encode(auth), this.encode(this.secret));
            let suffix = query + '&signature=' + signature;
            if (method == 'GET') {
                url += '?' + suffix;
            } else {
                body = suffix;
                headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            }
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this11 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this11.fetch2(path, api, method, params, headers, body);
            if ('error' in response) throw new ExchangeError(_this11.id + ' ' + _this11.json(response));
            return response;
        })();
    }
};