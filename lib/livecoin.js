"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Exchange = require('./base/Exchange');
const { ExchangeError, AuthenticationError, NotSupported, InvalidOrder, OrderNotFound } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class livecoin extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'livecoin',
            'name': 'LiveCoin',
            'countries': ['US', 'UK', 'RU'],
            'rateLimit': 1000,
            'hasCORS': false,
            // obsolete metainfo interface
            'hasFetchTickers': true,
            'hasFetchCurrencies': true,
            // new metainfo interface
            'has': {
                'fetchTickers': true,
                'fetchCurrencies': true
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27980768-f22fc424-638a-11e7-89c9-6010a54ff9be.jpg',
                'api': 'https://api.livecoin.net',
                'www': 'https://www.livecoin.net',
                'doc': 'https://www.livecoin.net/api?lang=en'
            },
            'api': {
                'public': {
                    'get': ['exchange/all/order_book', 'exchange/last_trades', 'exchange/maxbid_minask', 'exchange/order_book', 'exchange/restrictions', 'exchange/ticker', // omit params to get all tickers at once
                    'info/coinInfo']
                },
                'private': {
                    'get': ['exchange/client_orders', 'exchange/order', 'exchange/trades', 'exchange/commission', 'exchange/commissionCommonInfo', 'payment/balances', 'payment/balance', 'payment/get/address', 'payment/history/size', 'payment/history/transactions'],
                    'post': ['exchange/buylimit', 'exchange/buymarket', 'exchange/cancellimit', 'exchange/selllimit', 'exchange/sellmarket', 'payment/out/capitalist', 'payment/out/card', 'payment/out/coin', 'payment/out/okpay', 'payment/out/payeer', 'payment/out/perfectmoney', 'payment/voucher/amount', 'payment/voucher/make', 'payment/voucher/redeem']
                }
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'maker': 0.18 / 100,
                    'taker': 0.18 / 100
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let markets = yield _this.publicGetExchangeTicker();
            let restrictions = yield _this.publicGetExchangeRestrictions();
            let restrictionsById = _this.indexBy(restrictions['restrictions'], 'currencyPair');
            let result = [];
            for (let p = 0; p < markets.length; p++) {
                let market = markets[p];
                let id = market['symbol'];
                let symbol = id;
                let [base, quote] = symbol.split('/');
                let coinRestrictions = _this.safeValue(restrictionsById, symbol);
                let precision = {
                    'price': 5,
                    'amount': 8,
                    'cost': 8
                };
                let limits = {
                    'amount': {
                        'min': Math.pow(10, -precision['amount']),
                        'max': Math.pow(10, precision['amount'])
                    }
                };
                if (coinRestrictions) {
                    precision['price'] = _this.safeInteger(coinRestrictions, 'priceScale', 5);
                    limits['amount']['min'] = _this.safeFloat(coinRestrictions, 'minLimitQuantity', limits['amount']['min']);
                }
                limits['price'] = {
                    'min': Math.pow(10, -precision['price']),
                    'max': Math.pow(10, precision['price'])
                };
                result.push(_this.extend(_this.fees['trading'], {
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'precision': precision,
                    'limits': limits,
                    'info': market
                }));
            }
            return result;
        })();
    }

    fetchCurrencies(params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this2.publicGetInfoCoinInfo(params);
            let currencies = response['info'];
            let result = {};
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let id = currency['symbol'];
                // todo: will need to rethink the fees
                // to add support for multiple withdrawal/deposit methods and
                // differentiated fees for each particular method
                let code = _this2.commonCurrencyCode(id);
                let precision = 8; // default precision, todo: fix "magic constants"
                let active = currency['walletStatus'] == 'normal';
                result[code] = {
                    'id': id,
                    'code': code,
                    'info': currency,
                    'name': currency['name'],
                    'active': active,
                    'status': 'ok',
                    'fee': currency['withdrawFee'], // todo: redesign
                    'precision': precision,
                    'limits': {
                        'amount': {
                            'min': currency['minOrderAmount'],
                            'max': Math.pow(10, precision)
                        },
                        'price': {
                            'min': Math.pow(10, -precision),
                            'max': Math.pow(10, precision)
                        },
                        'cost': {
                            'min': currency['minOrderAmount'],
                            'max': undefined
                        },
                        'withdraw': {
                            'min': currency['minWithdrawAmount'],
                            'max': Math.pow(10, precision)
                        },
                        'deposit': {
                            'min': currency['minDepositAmount'],
                            'max': undefined
                        }
                    }
                };
            }
            return result;
        })();
    }

    fetchBalance(params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this3.loadMarkets();
            let balances = yield _this3.privateGetPaymentBalances();
            let result = { 'info': balances };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = balance['currency'];
                let account = undefined;
                if (currency in result) account = result[currency];else account = _this3.account();
                if (balance['type'] == 'total') account['total'] = parseFloat(balance['value']);
                if (balance['type'] == 'available') account['free'] = parseFloat(balance['value']);
                if (balance['type'] == 'trade') account['used'] = parseFloat(balance['value']);
                result[currency] = account;
            }
            return _this3.parseBalance(result);
        })();
    }

    fetchFees(params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this4.loadMarkets();
            let commissionInfo = yield _this4.privateGetExchangeCommissionCommonInfo();
            let commission = _this4.safeFloat(commissionInfo, 'commission');
            return {
                'info': commissionInfo,
                'maker': commission,
                'taker': commission,
                'withdraw': 0.0
            };
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this5.loadMarkets();
            let orderbook = yield _this5.publicGetExchangeOrderBook(_this5.extend({
                'currencyPair': _this5.marketId(symbol),
                'groupByPrice': 'false',
                'depth': 100
            }, params));
            let timestamp = orderbook['timestamp'];
            return _this5.parseOrderBook(orderbook, timestamp);
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = this.milliseconds();
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        let vwap = parseFloat(ticker['vwap']);
        let baseVolume = parseFloat(ticker['volume']);
        let quoteVolume = baseVolume * vwap;
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': parseFloat(ticker['high']),
            'low': parseFloat(ticker['low']),
            'bid': parseFloat(ticker['best_bid']),
            'ask': parseFloat(ticker['best_ask']),
            'vwap': parseFloat(ticker['vwap']),
            'open': undefined,
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
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this6.loadMarkets();
            let response = yield _this6.publicGetExchangeTicker(params);
            let tickers = _this6.indexBy(response, 'symbol');
            let ids = (0, _keys2.default)(tickers);
            let result = {};
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let market = _this6.markets_by_id[id];
                let symbol = market['symbol'];
                let ticker = tickers[id];
                result[symbol] = _this6.parseTicker(ticker, market);
            }
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this7.loadMarkets();
            let market = _this7.market(symbol);
            let ticker = yield _this7.publicGetExchangeTicker(_this7.extend({
                'currencyPair': market['id']
            }, params));
            return _this7.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market) {
        let timestamp = trade['time'] * 1000;
        return {
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'id': trade['id'].toString(),
            'order': undefined,
            'type': undefined,
            'side': trade['type'].toLowerCase(),
            'price': trade['price'],
            'amount': trade['quantity']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this8.loadMarkets();
            let market = _this8.market(symbol);
            let response = yield _this8.publicGetExchangeLastTrades(_this8.extend({
                'currencyPair': market['id']
            }, params));
            return _this8.parseTrades(response, market, since, limit);
        })();
    }

    parseOrder(order, market = undefined) {
        let timestamp = this.safeInteger(order, 'lastModificationTime');
        if (!timestamp) timestamp = this.parse8601(order['lastModificationTime']);
        let trades = undefined;
        if ('trades' in order)
            // TODO currently not supported by livecoin
            // trades = this.parseTrades (order['trades'], market, since, limit);
            trades = undefined;
        let status = undefined;
        if (order['orderStatus'] == 'OPEN' || order['orderStatus'] == 'PARTIALLY_FILLED') {
            status = 'open';
        } else if (order['orderStatus'] == 'EXECUTED' || order['orderStatus'] == 'PARTIALLY_FILLED_AND_CANCELLED') {
            status = 'closed';
        } else {
            status = 'canceled';
        }
        let symbol = order['currencyPair'];
        let [base, quote] = symbol.split('/');
        let type = undefined;
        let side = undefined;
        if (order['type'].indexOf('MARKET') >= 0) {
            type = 'market';
        } else {
            type = 'limit';
        }
        if (order['type'].indexOf('SELL') >= 0) {
            side = 'sell';
        } else {
            side = 'buy';
        }
        let price = this.safeFloat(order, 'price', 0.0);
        let cost = this.safeFloat(order, 'commissionByTrade', 0.0);
        let remaining = this.safeFloat(order, 'remainingQuantity', 0.0);
        let amount = this.safeFloat(order, 'quantity', remaining);
        let filled = amount - remaining;
        return {
            'info': order,
            'id': order['id'],
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'status': status,
            'symbol': symbol,
            'type': type,
            'side': side,
            'price': price,
            'cost': cost,
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'trades': trades,
            'fee': {
                'cost': cost,
                'currency': quote
            }
        };
    }

    fetchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this9.loadMarkets();
            let market = undefined;
            if (symbol) market = _this9.market(symbol);
            let pair = market ? market['id'] : undefined;
            let request = {};
            if (pair) request['currencyPair'] = pair;
            if (since) request['issuedFrom'] = parseInt(since);
            if (limit) request['endRow'] = limit - 1;
            let response = yield _this9.privateGetExchangeClientOrders(_this9.extend(request, params));
            let result = [];
            let rawOrders = [];
            if (response['data']) rawOrders = response['data'];
            for (let i = 0; i < rawOrders.length; i++) {
                let order = rawOrders[i];
                result.push(_this9.parseOrder(order, market));
            }
            return result;
        })();
    }

    fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this10 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let result = yield _this10.fetchOrders(symbol, since, limit, _this10.extend({
                'openClosed': 'OPEN'
            }, params));
            return result;
        })();
    }

    fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this11 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let result = yield _this11.fetchOrders(symbol, since, limit, _this11.extend({
                'openClosed': 'CLOSED'
            }, params));
            return result;
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this12 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this12.loadMarkets();
            let method = 'privatePostExchange' + _this12.capitalize(side) + type;
            let market = _this12.market(symbol);
            let order = {
                'quantity': _this12.amountToPrecision(symbol, amount),
                'currencyPair': market['id']
            };
            if (type == 'limit') order['price'] = _this12.priceToPrecision(symbol, price);
            let response = yield _this12[method](_this12.extend(order, params));
            return {
                'info': response,
                'id': response['orderId'].toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this13 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!symbol) throw new ExchangeError(_this13.id + ' cancelOrder requires a symbol argument');
            yield _this13.loadMarkets();
            let market = _this13.market(symbol);
            let currencyPair = market['id'];
            let response = yield _this13.privatePostExchangeCancellimit(_this13.extend({
                'orderId': id,
                'currencyPair': currencyPair
            }, params));
            let message = _this13.safeString(response, 'message', _this13.json(response));
            if ('success' in response) {
                if (!response['success']) {
                    throw new InvalidOrder(message);
                } else if ('cancelled' in response) {
                    if (response['cancelled']) {
                        return response;
                    } else {
                        throw new OrderNotFound(message);
                    }
                }
            }
            throw new ExchangeError(_this13.id + ' cancelOrder() failed: ' + _this13.json(response));
        })();
    }

    fetchDepositAddress(currency, params = {}) {
        var _this14 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let request = {
                'currency': currency
            };
            let response = yield _this14.privateGetPaymentGetAddress(_this14.extend(request, params));
            let address = _this14.safeString(response, 'wallet');
            return {
                'currency': currency,
                'address': address,
                'status': 'ok',
                'info': response
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + path;
        let query = this.urlencode(this.keysort(params));
        if (method == 'GET') {
            if ((0, _keys2.default)(params).length) {
                url += '?' + query;
            }
        }
        if (api == 'private') {
            this.checkRequiredCredentials();
            if (method == 'POST') body = query;
            let signature = this.hmac(this.encode(query), this.encode(this.secret), 'sha256');
            headers = {
                'Api-Key': this.apiKey,
                'Sign': signature.toUpperCase(),
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors(code, reason, url, method, headers, body) {
        if (code >= 300) {
            if (body[0] == "{") {
                let response = JSON.parse(body);
                if ('errorCode' in response) {
                    let error = response['errorCode'];
                    if (error == 1) {
                        throw new ExchangeError(this.id + ' ' + this.json(response));
                    } else if (error == 2) {
                        if ('errorMessage' in response) {
                            if (response['errorMessage'] == 'User not found') throw new AuthenticationError(this.id + ' ' + response['errorMessage']);
                        } else {
                            throw new ExchangeError(this.id + ' ' + this.json(response));
                        }
                    } else if (error == 10 || error == 11 || error == 12 || error == 20 || error == 30 || error == 101 || error == 102) {
                        throw new AuthenticationError(this.id + ' ' + this.json(response));
                    } else if (error == 31) {
                        throw new NotSupported(this.id + ' ' + this.json(response));
                    } else if (error == 32) {
                        throw new ExchangeError(this.id + ' ' + this.json(response));
                    } else if (error == 100) {
                        throw new ExchangeError(this.id + ': Invalid parameters ' + this.json(response));
                    } else if (error == 103) {
                        throw new InvalidOrder(this.id + ': Invalid currency ' + this.json(response));
                    } else if (error == 104) {
                        throw new InvalidOrder(this.id + ': Invalid amount ' + this.json(response));
                    } else if (error == 105) {
                        throw new InvalidOrder(this.id + ': Unable to block funds ' + this.json(response));
                    } else {
                        throw new ExchangeError(this.id + ' ' + this.json(response));
                    }
                }
            }
            throw new ExchangeError(this.id + ' ' + body);
        }
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this15 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this15.fetch2(path, api, method, params, headers, body);
            if ('success' in response) {
                if (!response['success']) {
                    throw new ExchangeError(_this15.id + ' error: ' + _this15.json(response));
                }
            }
            return response;
        })();
    }
};