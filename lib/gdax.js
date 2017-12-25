"use strict";

// ----------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _Math$log from 'babel-runtime/core-js/math/log10';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError, InvalidOrder, AuthenticationError, NotSupported } = require('./base/errors');

// ----------------------------------------------------------------------------

module.exports = class gdax extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'gdax',
            'name': 'GDAX',
            'countries': 'US',
            'rateLimit': 1000,
            'userAgent': this.userAgents['chrome'],
            'hasCORS': true,
            'hasFetchOHLCV': true,
            'hasDeposit': true,
            'hasWithdraw': true,
            'hasFetchOrder': true,
            'hasFetchOrders': true,
            'hasFetchOpenOrders': true,
            'hasFetchClosedOrders': true,
            'timeframes': {
                '1m': 60,
                '5m': 300,
                '15m': 900,
                '30m': 1800,
                '1h': 3600,
                '2h': 7200,
                '4h': 14400,
                '12h': 43200,
                '1d': 86400,
                '1w': 604800,
                '1M': 2592000,
                '1y': 31536000
            },
            'urls': {
                'test': 'https://api-public.sandbox.gdax.com',
                'logo': 'https://user-images.githubusercontent.com/1294454/27766527-b1be41c6-5edb-11e7-95f6-5b496c469e2c.jpg',
                'api': 'https://api.gdax.com',
                'www': 'https://www.gdax.com',
                'doc': 'https://docs.gdax.com'
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
                'password': true
            },
            'api': {
                'public': {
                    'get': ['currencies', 'products', 'products/{id}/book', 'products/{id}/candles', 'products/{id}/stats', 'products/{id}/ticker', 'products/{id}/trades', 'time']
                },
                'private': {
                    'get': ['accounts', 'accounts/{id}', 'accounts/{id}/holds', 'accounts/{id}/ledger', 'coinbase-accounts', 'fills', 'funding', 'orders', 'orders/{id}', 'payment-methods', 'position', 'reports/{id}', 'users/self/trailing-volume'],
                    'post': ['deposits/coinbase-account', 'deposits/payment-method', 'funding/repay', 'orders', 'position/close', 'profiles/margin-transfer', 'reports', 'withdrawals/coinbase', 'withdrawals/crypto', 'withdrawals/payment-method'],
                    'delete': ['orders', 'orders/{id}']
                }
            },
            'fees': {
                'trading': {
                    'tierBased': true, // complicated tier system per coin
                    'percentage': true,
                    'maker': 0.0,
                    'taker': 0.30 / 100 // worst-case scenario: https://www.gdax.com/fees/BTC-USD
                },
                'funding': {
                    'tierBased': false,
                    'percentage': false,
                    'withdraw': {
                        'BCH': 0,
                        'BTC': 0,
                        'LTC': 0,
                        'ETH': 0,
                        'EUR': 0.15,
                        'USD': 25
                    },
                    'deposit': {
                        'BCH': 0,
                        'BTC': 0,
                        'LTC': 0,
                        'ETH': 0,
                        'EUR': 0.15,
                        'USD': 10
                    }
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.publicGetProducts();
            let result = [];
            for (let p = 0; p < markets.length; p++) {
                let market = markets[p];
                let id = market['id'];
                let base = market['base_currency'];
                let quote = market['quote_currency'];
                let symbol = base + '/' + quote;
                let amountLimits = {
                    'min': market['base_min_size'],
                    'max': market['base_max_size']
                };
                let priceLimits = {
                    'min': market['quote_increment'],
                    'max': undefined
                };
                let costLimits = {
                    'min': priceLimits['min'],
                    'max': undefined
                };
                let limits = {
                    'amount': amountLimits,
                    'price': priceLimits,
                    'cost': costLimits
                };
                let precision = {
                    'amount': -_Math$log(parseFloat(amountLimits['min'])),
                    'price': -_Math$log(parseFloat(priceLimits['min']))
                };
                let taker = _this.fees['trading']['taker'];
                if (base == 'ETH' || base == 'LTC') {
                    taker = 0.003;
                }
                result.push(_this.extend(_this.fees['trading'], {
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'info': market,
                    'precision': precision,
                    'limits': limits,
                    'taker': taker
                }));
            }
            return result;
        })();
    }

    fetchBalance(params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let balances = yield _this2.privateGetAccounts();
            let result = { 'info': balances };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = balance['currency'];
                let account = {
                    'free': parseFloat(balance['available']),
                    'used': parseFloat(balance['hold']),
                    'total': parseFloat(balance['balance'])
                };
                result[currency] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let orderbook = yield _this3.publicGetProductsIdBook(_this3.extend({
                'id': _this3.marketId(symbol),
                'level': 2 // 1 best bidask, 2 aggregated, 3 full
            }, params));
            return _this3.parseOrderBook(orderbook);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let request = _this4.extend({
                'id': market['id']
            }, params);
            let ticker = yield _this4.publicGetProductsIdTicker(request);
            let timestamp = _this4.parse8601(ticker['time']);
            let bid = undefined;
            let ask = undefined;
            if ('bid' in ticker) bid = parseFloat(ticker['bid']);
            if ('ask' in ticker) ask = parseFloat(ticker['ask']);
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this4.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': bid,
                'ask': ask,
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': _this4.safeFloat(ticker, 'price'),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['volume']),
                'quoteVolume': undefined,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestamp = this.parse8601(trade['time']);
        let side = trade['side'] == 'buy' ? 'sell' : 'buy';
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        let fee = undefined;
        if ('fill_fees' in trade) {
            fee = {
                'cost': parseFloat(trade['fill_fees']),
                'currency': market['quote']
            };
        }
        return {
            'id': trade['trade_id'].toString(),
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'type': undefined,
            'side': side,
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['size']),
            'fee': fee
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let response = yield _this5.publicGetProductsIdTrades(_this5.extend({
                'id': market['id'] // fixes issue #2
            }, params));
            return _this5.parseTrades(response, market, since, limit);
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '1m', since = undefined, limit = undefined) {
        return [ohlcv[0] * 1000, ohlcv[3], ohlcv[2], ohlcv[1], ohlcv[4], ohlcv[5]];
    }

    fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let granularity = _this6.timeframes[timeframe];
            let request = {
                'id': market['id'],
                'granularity': granularity
            };
            if (since) {
                request['start'] = _this6.iso8601(since);
                if (!limit) limit = 200; // max = 200
                request['end'] = _this6.iso8601(limit * granularity * 1000 + since);
            }
            let response = yield _this6.publicGetProductsIdCandles(_this6.extend(request, params));
            return _this6.parseOHLCVs(response, market, timeframe, since, limit);
        })();
    }

    fetchTime() {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            let response = _this7.publicGetTime();
            return _this7.parse8601(response['iso']);
        })();
    }

    parseOrderStatus(status) {
        let statuses = {
            'pending': 'open',
            'active': 'open',
            'open': 'open',
            'done': 'closed',
            'canceled': 'canceled'
        };
        return this.safeString(statuses, status, status);
    }

    parseOrder(order, market = undefined) {
        let timestamp = this.parse8601(order['created_at']);
        let symbol = undefined;
        if (!market) {
            if (order['product_id'] in this.markets_by_id) market = this.markets_by_id[order['product_id']];
        }
        let status = this.parseOrderStatus(order['status']);
        let price = this.safeFloat(order, 'price');
        let amount = this.safeFloat(order, 'size');
        let filled = this.safeFloat(order, 'filled_size');
        let remaining = amount - filled;
        let cost = this.safeFloat(order, 'executed_value');
        if (market) symbol = market['symbol'];
        return {
            'id': order['id'],
            'info': order,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'status': status,
            'symbol': symbol,
            'type': order['type'],
            'side': order['side'],
            'price': price,
            'cost': cost,
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'fee': undefined
        };
    }

    fetchOrder(id, symbol = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            let response = yield _this8.privateGetOrdersId(_this8.extend({
                'id': id
            }, params));
            return _this8.parseOrder(response);
        })();
    }

    fetchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            yield _this9.loadMarkets();
            let request = {
                'status': 'all'
            };
            let market = undefined;
            if (symbol) {
                market = _this9.market(symbol);
                request['product_id'] = market['id'];
            }
            let response = yield _this9.privateGetOrders(_this9.extend(request, params));
            return _this9.parseOrders(response, market, since, limit);
        })();
    }

    fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this10 = this;

        return _asyncToGenerator(function* () {
            yield _this10.loadMarkets();
            let request = {};
            let market = undefined;
            if (symbol) {
                market = _this10.market(symbol);
                request['product_id'] = market['id'];
            }
            let response = yield _this10.privateGetOrders(_this10.extend(request, params));
            return _this10.parseOrders(response, market, since, limit);
        })();
    }

    fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this11 = this;

        return _asyncToGenerator(function* () {
            yield _this11.loadMarkets();
            let request = {
                'status': 'done'
            };
            let market = undefined;
            if (symbol) {
                market = _this11.market(symbol);
                request['product_id'] = market['id'];
            }
            let response = yield _this11.privateGetOrders(_this11.extend(request, params));
            return _this11.parseOrders(response, market, since, limit);
        })();
    }

    createOrder(market, type, side, amount, price = undefined, params = {}) {
        var _this12 = this;

        return _asyncToGenerator(function* () {
            yield _this12.loadMarkets();
            // let oid = this.nonce ().toString ();
            let order = {
                'product_id': _this12.marketId(market),
                'side': side,
                'size': amount,
                'type': type
            };
            if (type == 'limit') order['price'] = price;
            let response = yield _this12.privatePostOrders(_this12.extend(order, params));
            return {
                'info': response,
                'id': response['id']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this13 = this;

        return _asyncToGenerator(function* () {
            yield _this13.loadMarkets();
            return yield _this13.privateDeleteOrdersId({ 'id': id });
        })();
    }

    getPaymentMethods() {
        var _this14 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this14.privateGetPaymentMethods();
            return response;
        })();
    }

    deposit(currency, amount, address, params = {}) {
        var _this15 = this;

        return _asyncToGenerator(function* () {
            yield _this15.loadMarkets();
            let request = {
                'currency': currency,
                'amount': amount
            };
            let method = 'privatePostDeposits';
            if ('payment_method_id' in params) {
                // deposit from a payment_method, like a bank account
                method += 'PaymentMethod';
            } else if ('coinbase_account_id' in params) {
                // deposit into GDAX account from a Coinbase account
                method += 'CoinbaseAccount';
            } else {
                // deposit methodotherwise we did not receive a supported deposit location
                // relevant docs link for the Googlers
                // https://docs.gdax.com/#deposits
                throw new NotSupported(_this15.id + ' deposit() requires one of `coinbase_account_id` or `payment_method_id` extra params');
            }
            let response = yield _this15[method](_this15.extend(request, params));
            if (!response) throw new ExchangeError(_this15.id + ' deposit() error: ' + _this15.json(response));
            return {
                'info': response,
                'id': response['id']
            };
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this16 = this;

        return _asyncToGenerator(function* () {
            yield _this16.loadMarkets();
            let request = {
                'currency': currency,
                'amount': amount
            };
            let method = 'privatePostWithdrawals';
            if ('payment_method_id' in params) {
                method += 'PaymentMethod';
            } else if ('coinbase_account_id' in params) {
                method += 'CoinbaseAccount';
            } else {
                method += 'Crypto';
                request['crypto_address'] = address;
            }
            let response = yield _this16[method](_this16.extend(request, params));
            if (!response) throw new ExchangeError(_this16.id + ' withdraw() error: ' + _this16.json(response));
            return {
                'info': response,
                'id': response['id']
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let request = '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (method == 'GET') {
            if (_Object$keys(query).length) request += '?' + this.urlencode(query);
        }
        let url = this.urls['api'] + request;
        if (api == 'private') {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            let payload = '';
            if (method != 'GET') {
                if (_Object$keys(query).length) {
                    body = this.json(query);
                    payload = body;
                }
            }
            // let payload = (body) ? body : '';
            let what = nonce + method + request + payload;
            let secret = this.base64ToBinary(this.secret);
            let signature = this.hmac(this.encode(what), secret, 'sha256', 'base64');
            headers = {
                'CB-ACCESS-KEY': this.apiKey,
                'CB-ACCESS-SIGN': this.decode(signature),
                'CB-ACCESS-TIMESTAMP': nonce,
                'CB-ACCESS-PASSPHRASE': this.password,
                'Content-Type': 'application/json'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors(code, reason, url, method, headers, body) {
        if (code == 400) {
            if (body[0] == "{") {
                let response = JSON.parse(body);
                let message = response['message'];
                if (message.indexOf('price too small') >= 0) {
                    throw new InvalidOrder(this.id + ' ' + message);
                } else if (message.indexOf('price too precise') >= 0) {
                    throw new InvalidOrder(this.id + ' ' + message);
                } else if (message == 'Invalid API Key') {
                    throw new AuthenticationError(this.id + ' ' + message);
                }
                throw new ExchangeError(this.id + ' ' + this.json(response));
            }
            throw new ExchangeError(this.id + ' ' + body);
        }
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this17 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this17.fetch2(path, api, method, params, headers, body);
            if ('message' in response) {
                throw new ExchangeError(_this17.id + ' ' + _this17.json(response));
            }
            return response;
        })();
    }
};