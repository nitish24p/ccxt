"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class luno extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'luno',
            'name': 'luno',
            'countries': ['GB', 'SG', 'ZA'],
            'rateLimit': 10000,
            'version': '1',
            'hasCORS': false,
            'hasFetchTickers': true,
            'hasFetchOrder': true,
            'has': {
                'fetchTickers': true,
                'fetchOrder': true
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766607-8c1a69d8-5ede-11e7-930c-540b5eb9be24.jpg',
                'api': 'https://api.mybitx.com/api',
                'www': 'https://www.luno.com',
                'doc': ['https://www.luno.com/en/api', 'https://npmjs.org/package/bitx', 'https://github.com/bausmeier/node-bitx']
            },
            'api': {
                'public': {
                    'get': ['orderbook', 'ticker', 'tickers', 'trades']
                },
                'private': {
                    'get': ['accounts/{id}/pending', 'accounts/{id}/transactions', 'balance', 'fee_info', 'funding_address', 'listorders', 'listtrades', 'orders/{id}', 'quotes/{id}', 'withdrawals', 'withdrawals/{id}'],
                    'post': ['accounts', 'postorder', 'marketorder', 'stoporder', 'funding_address', 'withdrawals', 'send', 'quotes', 'oauth2/grant'],
                    'put': ['quotes/{id}'],
                    'delete': ['quotes/{id}', 'withdrawals/{id}']
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.publicGetTickers();
            let result = [];
            for (let p = 0; p < markets['tickers'].length; p++) {
                let market = markets['tickers'][p];
                let id = market['pair'];
                let base = id.slice(0, 3);
                let quote = id.slice(3, 6);
                base = _this.commonCurrencyCode(base);
                quote = _this.commonCurrencyCode(quote);
                let symbol = base + '/' + quote;
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
            let response = yield _this2.privateGetBalance();
            let balances = response['balance'];
            let result = { 'info': response };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = _this2.commonCurrencyCode(balance['asset']);
                let reserved = parseFloat(balance['reserved']);
                let unconfirmed = parseFloat(balance['unconfirmed']);
                let account = {
                    'free': parseFloat(balance['balance']),
                    'used': _this2.sum(reserved, unconfirmed),
                    'total': 0.0
                };
                account['total'] = _this2.sum(account['free'], account['used']);
                result[currency] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let orderbook = yield _this3.publicGetOrderbook(_this3.extend({
                'pair': _this3.marketId(symbol)
            }, params));
            let timestamp = orderbook['timestamp'];
            return _this3.parseOrderBook(orderbook, timestamp, 'bids', 'asks', 'price', 'volume');
        })();
    }

    parseOrder(order, market = undefined) {
        let timestamp = order['creation_timestamp'];
        let status = order['state'] == 'PENDING' ? 'open' : 'closed';
        let side = order['type'] == 'ASK' ? 'sell' : 'buy';
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        let price = this.safeFloat(order, 'limit_price');
        let amount = this.safeFloat(order, 'limit_volume');
        let quoteFee = this.safeFloat(order, 'fee_counter');
        let baseFee = this.safeFloat(order, 'fee_base');
        let fee = { 'currency': undefined };
        if (quoteFee) {
            fee['side'] = 'quote';
            fee['cost'] = quoteFee;
        } else {
            fee['side'] = 'base';
            fee['cost'] = baseFee;
        }
        return {
            'id': order['order_id'],
            'datetime': this.iso8601(timestamp),
            'timestamp': timestamp,
            'status': status,
            'symbol': symbol,
            'type': undefined,
            'side': side,
            'price': price,
            'amount': amount,
            'filled': undefined,
            'remaining': undefined,
            'trades': undefined,
            'fee': fee,
            'info': order
        };
    }

    fetchOrder(id, symbol = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let response = yield _this4.privateGetOrders(_this4.extend({
                'id': id.toString()
            }, params));
            return _this4.parseOrder(response);
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = ticker['timestamp'];
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': undefined,
            'low': undefined,
            'bid': parseFloat(ticker['bid']),
            'ask': parseFloat(ticker['ask']),
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': parseFloat(ticker['last_trade']),
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': parseFloat(ticker['rolling_24_hour_volume']),
            'quoteVolume': undefined,
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let response = yield _this5.publicGetTickers(params);
            let tickers = _this5.indexBy(response['tickers'], 'pair');
            let ids = Object.keys(tickers);
            let result = {};
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let market = _this5.markets_by_id[id];
                let symbol = market['symbol'];
                let ticker = tickers[id];
                result[symbol] = _this5.parseTicker(ticker, market);
            }
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let ticker = yield _this6.publicGetTicker(_this6.extend({
                'pair': market['id']
            }, params));
            return _this6.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market) {
        let side = trade['is_buy'] ? 'buy' : 'sell';
        return {
            'info': trade,
            'id': undefined,
            'order': undefined,
            'timestamp': trade['timestamp'],
            'datetime': this.iso8601(trade['timestamp']),
            'symbol': market['symbol'],
            'type': undefined,
            'side': side,
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['volume'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            let market = _this7.market(symbol);
            let response = yield _this7.publicGetTrades(_this7.extend({
                'pair': market['id']
            }, params));
            return _this7.parseTrades(response['trades'], market, since, limit);
        })();
    }

    createOrder(market, type, side, amount, price = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            let method = 'privatePost';
            let order = { 'pair': _this8.marketId(market) };
            if (type == 'market') {
                method += 'Marketorder';
                order['type'] = side.toUpperCase();
                if (side == 'buy') order['counter_volume'] = amount;else order['base_volume'] = amount;
            } else {
                method += 'Order';
                order['volume'] = amount;
                order['price'] = price;
                if (side == 'buy') order['type'] = 'BID';else order['type'] = 'ASK';
            }
            let response = yield _this8[method](_this8.extend(order, params));
            return {
                'info': response,
                'id': response['order_id']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            yield _this9.loadMarkets();
            return yield _this9.privatePostStoporder({ 'order_id': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (Object.keys(query).length) url += '?' + this.urlencode(query);
        if (api == 'private') {
            this.checkRequiredCredentials();
            let auth = this.encode(this.apiKey + ':' + this.secret);
            auth = this.stringToBase64(auth);
            headers = { 'Authorization': 'Basic ' + this.decode(auth) };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this10 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this10.fetch2(path, api, method, params, headers, body);
            if ('error' in response) throw new ExchangeError(_this10.id + ' ' + _this10.json(response));
            return response;
        })();
    }
};