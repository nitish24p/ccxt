"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class exmo extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'exmo',
            'name': 'EXMO',
            'countries': ['ES', 'RU'], // Spain, Russia
            'rateLimit': 1000, // once every 350 ms ≈ 180 requests per minute ≈ 3 requests per second
            'version': 'v1',
            'hasCORS': false,
            'hasFetchTickers': true,
            'hasWithdraw': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766491-1b0ea956-5eda-11e7-9225-40d67b481b8d.jpg',
                'api': 'https://api.exmo.com',
                'www': 'https://exmo.me',
                'doc': ['https://exmo.me/en/api_doc', 'https://github.com/exmo-dev/exmo_api_lib/tree/master/nodejs']
            },
            'api': {
                'public': {
                    'get': ['currency', 'order_book', 'pair_settings', 'ticker', 'trades']
                },
                'private': {
                    'post': ['user_info', 'order_create', 'order_cancel', 'user_open_orders', 'user_trades', 'user_cancelled_orders', 'order_trades', 'required_amount', 'deposit_address', 'withdraw_crypt', 'withdraw_get_txid', 'excode_create', 'excode_load', 'wallet_history']
                }
            },
            'fees': {
                'trading': {
                    'maker': 0.2 / 100,
                    'taker': 0.2 / 100
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.publicGetPairSettings();
            let keys = Object.keys(markets);
            let result = [];
            for (let p = 0; p < keys.length; p++) {
                let id = keys[p];
                let market = markets[id];
                let symbol = id.replace('_', '/');
                let [base, quote] = symbol.split('/');
                result.push({
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'limits': {
                        'amount': {
                            'min': market['min_quantity'],
                            'max': market['max_quantity']
                        },
                        'price': {
                            'min': market['min_price'],
                            'max': market['max_price']
                        },
                        'cost': {
                            'min': market['min_amount'],
                            'max': market['max_amount']
                        }
                    },
                    'precision': {
                        'amount': 8,
                        'price': 8
                    },
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
            let response = yield _this2.privatePostUserInfo();
            let result = { 'info': response };
            let currencies = Object.keys(_this2.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let account = _this2.account();
                if (currency in response['balances']) account['free'] = parseFloat(response['balances'][currency]);
                if (currency in response['reserved']) account['used'] = parseFloat(response['reserved'][currency]);
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
            let market = _this3.market(symbol);
            let response = yield _this3.publicGetOrderBook(_this3.extend({
                'pair': market['id']
            }, params));
            let orderbook = response[market['id']];
            return _this3.parseOrderBook(orderbook, undefined, 'bid', 'ask');
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = ticker['updated'] * 1000;
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': parseFloat(ticker['high']),
            'low': parseFloat(ticker['low']),
            'bid': parseFloat(ticker['buy_price']),
            'ask': parseFloat(ticker['sell_price']),
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': parseFloat(ticker['last_trade']),
            'change': undefined,
            'percentage': undefined,
            'average': parseFloat(ticker['avg']),
            'baseVolume': parseFloat(ticker['vol']),
            'quoteVolume': parseFloat(ticker['vol_curr']),
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let response = yield _this4.publicGetTicker(params);
            let result = {};
            let ids = Object.keys(response);
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let market = _this4.markets_by_id[id];
                let symbol = market['symbol'];
                let ticker = response[id];
                result[symbol] = _this4.parseTicker(ticker, market);
            }
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let response = yield _this5.publicGetTicker(params);
            let market = _this5.market(symbol);
            return _this5.parseTicker(response[market['id']], market);
        })();
    }

    parseTrade(trade, market) {
        let timestamp = trade['date'] * 1000;
        return {
            'id': trade['trade_id'].toString(),
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'order': undefined,
            'type': undefined,
            'side': trade['type'],
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['quantity'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let response = yield _this6.publicGetTrades(_this6.extend({
                'pair': market['id']
            }, params));
            return _this6.parseTrades(response[market['id']], market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            let prefix = '';
            if (type == 'market') prefix = 'market_';
            if (typeof price == 'undefined') price = 0;
            let order = {
                'pair': _this7.marketId(symbol),
                'quantity': amount,
                'price': price,
                'type': prefix + side
            };
            let response = yield _this7.privatePostOrderCreate(_this7.extend(order, params));
            return {
                'info': response,
                'id': response['order_id'].toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            return yield _this8.privatePostOrderCancel({ 'order_id': id });
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            yield _this9.loadMarkets();
            let result = yield _this9.privatePostWithdrawCrypt(_this9.extend({
                'amount': amount,
                'currency': currency,
                'address': address
            }, params));
            return {
                'info': result,
                'id': result['task_id']
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.version + '/' + path;
        if (api == 'public') {
            if (Object.keys(params).length) url += '?' + this.urlencode(params);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            body = this.urlencode(this.extend({ 'nonce': nonce }, params));
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Key': this.apiKey,
                'Sign': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this10 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this10.fetch2(path, api, method, params, headers, body);
            if ('result' in response) {
                if (response['result']) return response;
                throw new ExchangeError(_this10.id + ' ' + _this10.json(response));
            }
            return response;
        })();
    }
};