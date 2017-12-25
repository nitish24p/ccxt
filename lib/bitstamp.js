"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError, AuthenticationError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class bitstamp extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bitstamp',
            'name': 'Bitstamp',
            'countries': 'GB',
            'rateLimit': 1000,
            'version': 'v2',
            'hasCORS': false,
            'hasFetchOrder': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27786377-8c8ab57e-5fe9-11e7-8ea4-2b05b6bcceec.jpg',
                'api': 'https://www.bitstamp.net/api',
                'www': 'https://www.bitstamp.net',
                'doc': 'https://www.bitstamp.net/api'
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'uid': true
            },
            'api': {
                'public': {
                    'get': ['order_book/{pair}/', 'ticker_hour/{pair}/', 'ticker/{pair}/', 'transactions/{pair}/', 'trading-pairs-info/']
                },
                'private': {
                    'post': ['balance/', 'balance/{pair}/', 'user_transactions/', 'user_transactions/{pair}/', 'open_orders/all/', 'open_orders/{pair}', 'order_status/', 'cancel_order/', 'buy/{pair}/', 'buy/market/{pair}/', 'sell/{pair}/', 'sell/market/{pair}/', 'ltc_withdrawal/', 'ltc_address/', 'eth_withdrawal/', 'eth_address/', 'transfer-to-main/', 'transfer-from-main/', 'xrp_withdrawal/', 'xrp_address/', 'withdrawal/open/', 'withdrawal/status/', 'withdrawal/cancel/', 'liquidation_address/new/', 'liquidation_address/info/']
                },
                'v1': {
                    'post': ['bitcoin_deposit_address/', 'unconfirmed_btc/', 'bitcoin_withdrawal/']
                }
            },
            'fees': {
                'trading': {
                    'tierBased': true,
                    'percentage': true,
                    'taker': 0.25 / 100,
                    'maker': 0.25 / 100,
                    'tiers': {
                        'taker': [[0, 0.25 / 100], [20000, 0.24 / 100], [100000, 0.22 / 100], [400000, 0.20 / 100], [600000, 0.15 / 100], [1000000, 0.14 / 100], [2000000, 0.13 / 100], [4000000, 0.12 / 100], [20000000, 0.11 / 100], [20000001, 0.10 / 100]],
                        'maker': [[0, 0.25 / 100], [20000, 0.24 / 100], [100000, 0.22 / 100], [400000, 0.20 / 100], [600000, 0.15 / 100], [1000000, 0.14 / 100], [2000000, 0.13 / 100], [4000000, 0.12 / 100], [20000000, 0.11 / 100], [20000001, 0.10 / 100]]
                    }
                },
                'funding': {
                    'tierBased': false,
                    'percentage': false,
                    'withdraw': {
                        'BTC': 0,
                        'LTC': 0,
                        'ETH': 0,
                        'XRP': 0,
                        'USD': 25,
                        'EUR': 0.90
                    },
                    'deposit': {
                        'BTC': 0,
                        'LTC': 0,
                        'ETH': 0,
                        'XRP': 0,
                        'USD': 25,
                        'EUR': 0
                    }
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.publicGetTradingPairsInfo();
            let result = [];
            for (let i = 0; i < markets.length; i++) {
                let market = markets[i];
                let symbol = market['name'];
                let [base, quote] = symbol.split('/');
                let id = market['url_symbol'];
                let precision = {
                    'amount': market['base_decimals'],
                    'price': market['counter_decimals']
                };
                let [cost, currency] = market['minimum_order'].split(' ');
                let active = market['trading'] == 'Enabled';
                let lot = Math.pow(10, -precision['amount']);
                result.push({
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'info': market,
                    'lot': lot,
                    'active': active,
                    'precision': precision,
                    'limits': {
                        'amount': {
                            'min': lot,
                            'max': undefined
                        },
                        'price': {
                            'min': Math.pow(10, -precision['price']),
                            'max': undefined
                        },
                        'cost': {
                            'min': parseFloat(cost),
                            'max': undefined
                        }
                    }
                });
            }
            return result;
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let orderbook = yield _this2.publicGetOrderBookPair(_this2.extend({
                'pair': _this2.marketId(symbol)
            }, params));
            let timestamp = parseInt(orderbook['timestamp']) * 1000;
            return _this2.parseOrderBook(orderbook, timestamp);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let ticker = yield _this3.publicGetTickerPair(_this3.extend({
                'pair': _this3.marketId(symbol)
            }, params));
            let timestamp = parseInt(ticker['timestamp']) * 1000;
            let vwap = parseFloat(ticker['vwap']);
            let baseVolume = parseFloat(ticker['volume']);
            let quoteVolume = baseVolume * vwap;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': vwap,
                'open': parseFloat(ticker['open']),
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
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestamp = undefined;
        if ('date' in trade) {
            timestamp = parseInt(trade['date']) * 1000;
        } else if ('datetime' in trade) {
            // timestamp = this.parse8601 (trade['datetime']);
            timestamp = parseInt(trade['datetime']) * 1000;
        }
        let side = trade['type'] == 0 ? 'buy' : 'sell';
        let order = undefined;
        if ('order_id' in trade) order = trade['order_id'].toString();
        if ('currency_pair' in trade) {
            if (trade['currency_pair'] in this.markets_by_id) market = this.markets_by_id[trade['currency_pair']];
        }
        return {
            'id': trade['tid'].toString(),
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'order': order,
            'type': undefined,
            'side': side,
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['amount'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetTransactionsPair(_this4.extend({
                'pair': market['id'],
                'time': 'minute'
            }, params));
            return _this4.parseTrades(response, market, since, limit);
        })();
    }

    fetchBalance(params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let balance = yield _this5.privatePostBalance();
            let result = { 'info': balance };
            let currencies = Object.keys(_this5.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let lowercase = currency.toLowerCase();
                let total = lowercase + '_balance';
                let free = lowercase + '_available';
                let used = lowercase + '_reserved';
                let account = _this5.account();
                if (free in balance) account['free'] = parseFloat(balance[free]);
                if (used in balance) account['used'] = parseFloat(balance[used]);
                if (total in balance) account['total'] = parseFloat(balance[total]);
                result[currency] = account;
            }
            return _this5.parseBalance(result);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let method = 'privatePost' + _this6.capitalize(side);
            let order = {
                'pair': _this6.marketId(symbol),
                'amount': amount
            };
            if (type == 'market') method += 'Market';else order['price'] = price;
            method += 'Pair';
            let response = yield _this6[method](_this6.extend(order, params));
            return {
                'info': response,
                'id': response['id']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            return yield _this7.privatePostCancelOrder({ 'id': id });
        })();
    }

    parseOrderStatus(order) {
        if (order['status'] == 'Queue' || order['status'] == 'Open') return 'open';
        if (order['status'] == 'Finished') return 'closed';
        return order['status'];
    }

    fetchOrderStatus(id, symbol = undefined) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            let response = yield _this8.privatePostOrderStatus({ 'id': id });
            return _this8.parseOrderStatus(response);
        })();
    }

    fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            yield _this9.loadMarkets();
            let market = undefined;
            if (symbol) market = _this9.market(symbol);
            let pair = market ? market['id'] : 'all';
            let request = _this9.extend({ 'pair': pair }, params);
            let response = yield _this9.privatePostOpenOrdersPair(request);
            return _this9.parseTrades(response, market, since, limit);
        })();
    }

    fetchOrder(id, symbol = undefined, params = {}) {
        var _this10 = this;

        return _asyncToGenerator(function* () {
            yield _this10.loadMarkets();
            return yield _this10.privatePostOrderStatus({ 'id': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/';
        if (api != 'v1') url += this.version + '/';
        url += this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if (Object.keys(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            let auth = nonce + this.uid + this.apiKey;
            let signature = this.encode(this.hmac(this.encode(auth), this.encode(this.secret)));
            query = this.extend({
                'key': this.apiKey,
                'signature': signature.toUpperCase(),
                'nonce': nonce
            }, query);
            body = this.urlencode(query);
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this11 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this11.fetch2(path, api, method, params, headers, body);
            if ('status' in response) if (response['status'] == 'error') throw new ExchangeError(_this11.id + ' ' + _this11.json(response));
            return response;
        })();
    }
};