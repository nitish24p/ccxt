"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Exchange = require('./base/Exchange');
const { ExchangeError, InsufficientFunds, OrderNotFound, OrderNotCached } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class poloniex extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'poloniex',
            'name': 'Poloniex',
            'countries': 'US',
            'rateLimit': 1000, // up to 6 calls per second
            'hasCORS': true,
            // obsolete metainfo interface
            'hasFetchMyTrades': true,
            'hasFetchOrder': true,
            'hasFetchOrders': true,
            'hasFetchOpenOrders': true,
            'hasFetchClosedOrders': true,
            'hasFetchTickers': true,
            'hasFetchCurrencies': true,
            'hasWithdraw': true,
            'hasFetchOHLCV': true,
            // new metainfo interface
            'has': {
                'fetchOHLCV': true,
                'fetchMyTrades': true,
                'fetchOrder': 'emulated',
                'fetchOrders': 'emulated',
                'fetchOpenOrders': true,
                'fetchClosedOrders': 'emulated',
                'fetchTickers': true,
                'fetchCurrencies': true,
                'withdraw': true
            },
            'timeframes': {
                '5m': 300,
                '15m': 900,
                '30m': 1800,
                '2h': 7200,
                '4h': 14400,
                '1d': 86400
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766817-e9456312-5ee6-11e7-9b3c-b628ca5626a5.jpg',
                'api': {
                    'public': 'https://poloniex.com/public',
                    'private': 'https://poloniex.com/tradingApi'
                },
                'www': 'https://poloniex.com',
                'doc': ['https://poloniex.com/support/api/', 'http://pastebin.com/dMX7mZE0'],
                'fees': 'https://poloniex.com/fees'
            },
            'api': {
                'public': {
                    'get': ['return24hVolume', 'returnChartData', 'returnCurrencies', 'returnLoanOrders', 'returnOrderBook', 'returnTicker', 'returnTradeHistory']
                },
                'private': {
                    'post': ['buy', 'cancelLoanOffer', 'cancelOrder', 'closeMarginPosition', 'createLoanOffer', 'generateNewAddress', 'getMarginPosition', 'marginBuy', 'marginSell', 'moveOrder', 'returnActiveLoans', 'returnAvailableAccountBalances', 'returnBalances', 'returnCompleteBalances', 'returnDepositAddresses', 'returnDepositsWithdrawals', 'returnFeeInfo', 'returnLendingHistory', 'returnMarginAccountSummary', 'returnOpenLoanOffers', 'returnOpenOrders', 'returnOrderTrades', 'returnTradableBalances', 'returnTradeHistory', 'sell', 'toggleAutoRenew', 'transferBalance', 'withdraw']
                }
            },
            'fees': {
                'trading': {
                    'maker': 0.0015,
                    'taker': 0.0025
                },
                'funding': 0.0
            },
            'limits': {
                'amount': {
                    'min': 0.00000001,
                    'max': 1000000000
                },
                'price': {
                    'min': 0.00000001,
                    'max': 1000000000
                },
                'cost': {
                    'min': 0.00000000,
                    'max': 1000000000
                }
            },
            'precision': {
                'amount': 8,
                'price': 8
            }
        });
    }

    calculateFee(symbol, type, side, amount, price, takerOrMaker = 'taker', params = {}) {
        let market = this.markets[symbol];
        let key = 'quote';
        let rate = market[takerOrMaker];
        let cost = parseFloat(this.costToPrecision(symbol, amount * rate));
        if (side == 'sell') {
            cost *= price;
        } else {
            key = 'base';
        }
        return {
            'type': takerOrMaker,
            'currency': market[key],
            'rate': rate,
            'cost': parseFloat(this.feeToPrecision(symbol, cost))
        };
    }

    commonCurrencyCode(currency) {
        if (currency == 'BTM') return 'Bitmark';
        if (currency == 'STR') return 'XLM';
        return currency;
    }

    currencyId(currency) {
        if (currency == 'Bitmark') return 'BTM';
        if (currency == 'XLM') return 'STR';
        return currency;
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '5m', since = undefined, limit = undefined) {
        return [ohlcv['date'] * 1000, ohlcv['open'], ohlcv['high'], ohlcv['low'], ohlcv['close'], ohlcv['volume']];
    }

    fetchOHLCV(symbol, timeframe = '5m', since = undefined, limit = undefined, params = {}) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this.loadMarkets();
            let market = _this.market(symbol);
            if (!since) since = 0;
            let request = {
                'currencyPair': market['id'],
                'period': _this.timeframes[timeframe],
                'start': parseInt(since / 1000)
            };
            if (limit) request['end'] = _this.sum(request['start'], limit * _this.timeframes[timeframe]);
            let response = yield _this.publicGetReturnChartData(_this.extend(request, params));
            return _this.parseOHLCVs(response, market, timeframe, since, limit);
        })();
    }

    fetchMarkets() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let markets = yield _this2.publicGetReturnTicker();
            let keys = (0, _keys2.default)(markets);
            let result = [];
            for (let p = 0; p < keys.length; p++) {
                let id = keys[p];
                let market = markets[id];
                let [quote, base] = id.split('_');
                base = _this2.commonCurrencyCode(base);
                quote = _this2.commonCurrencyCode(quote);
                let symbol = base + '/' + quote;
                result.push(_this2.extend(_this2.fees['trading'], {
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'active': true,
                    'lot': _this2.limits['amount']['min'],
                    'info': market
                }));
            }
            return result;
        })();
    }

    fetchBalance(params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this3.loadMarkets();
            let balances = yield _this3.privatePostReturnCompleteBalances(_this3.extend({
                'account': 'all'
            }, params));
            let result = { 'info': balances };
            let currencies = (0, _keys2.default)(balances);
            for (let c = 0; c < currencies.length; c++) {
                let id = currencies[c];
                let balance = balances[id];
                let currency = _this3.commonCurrencyCode(id);
                let account = {
                    'free': parseFloat(balance['available']),
                    'used': parseFloat(balance['onOrders']),
                    'total': 0.0
                };
                account['total'] = _this3.sum(account['free'], account['used']);
                result[currency] = account;
            }
            return _this3.parseBalance(result);
        })();
    }

    fetchFees(params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this4.loadMarkets();
            let fees = yield _this4.privatePostReturnFeeInfo();
            return {
                'info': fees,
                'maker': parseFloat(fees['makerFee']),
                'taker': parseFloat(fees['takerFee']),
                'withdraw': 0.0
            };
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this5.loadMarkets();
            let orderbook = yield _this5.publicGetReturnOrderBook(_this5.extend({
                'currencyPair': _this5.marketId(symbol)
            }, params));
            return _this5.parseOrderBook(orderbook);
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
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this6.loadMarkets();
            let tickers = yield _this6.publicGetReturnTicker(params);
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

    fetchCurrencies(params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let currencies = yield _this7.publicGetReturnCurrencies(params);
            let ids = (0, _keys2.default)(currencies);
            let result = {};
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let currency = currencies[id];
                // todo: will need to rethink the fees
                // to add support for multiple withdrawal/deposit methods and
                // differentiated fees for each particular method
                let precision = 8; // default precision, todo: fix "magic constants"
                let code = _this7.commonCurrencyCode(id);
                let active = currency['delisted'] == 0;
                let status = currency['disabled'] ? 'disabled' : 'ok';
                if (status != 'ok') active = false;
                result[code] = {
                    'id': id,
                    'code': code,
                    'info': currency,
                    'name': currency['name'],
                    'active': active,
                    'status': status,
                    'fee': currency['txFee'], // todo: redesign
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
                            'min': currency['txFee'],
                            'max': Math.pow(10, precision)
                        }
                    }
                };
            }
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this8.loadMarkets();
            let market = _this8.market(symbol);
            let tickers = yield _this8.publicGetReturnTicker(params);
            let ticker = tickers[market['id']];
            return _this8.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestamp = this.parse8601(trade['date']);
        let symbol = undefined;
        if (!market && 'currencyPair' in trade) market = this.markets_by_id[trade['currencyPair']];
        if (market) symbol = market['symbol'];
        let side = trade['type'];
        let fee = undefined;
        let cost = this.safeFloat(trade, 'total');
        let amount = parseFloat(trade['amount']);
        if ('fee' in trade) {
            let rate = parseFloat(trade['fee']);
            let feeCost = undefined;
            let currency = undefined;
            if (side == 'buy') {
                currency = market['base'];
                feeCost = amount * rate;
            } else {
                currency = market['quote'];
                if (typeof cost != 'undefined') feeCost = cost * rate;
            }
            fee = {
                'type': undefined,
                'rate': rate,
                'cost': feeCost,
                'currency': currency
            };
        }
        return {
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'id': this.safeString(trade, 'tradeID'),
            'order': this.safeString(trade, 'orderNumber'),
            'type': 'limit',
            'side': side,
            'price': parseFloat(trade['rate']),
            'amount': amount,
            'cost': cost,
            'fee': fee
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this9.loadMarkets();
            let market = _this9.market(symbol);
            let request = {
                'currencyPair': market['id']
            };
            if (since) {
                request['start'] = parseInt(since / 1000);
                request['end'] = _this9.seconds(); // last 50000 trades by default
            }
            let trades = yield _this9.publicGetReturnTradeHistory(_this9.extend(request, params));
            return _this9.parseTrades(trades, market, since, limit);
        })();
    }

    fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this10 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this10.loadMarkets();
            let market = undefined;
            if (symbol) market = _this10.market(symbol);
            let pair = market ? market['id'] : 'all';
            let request = { 'currencyPair': pair };
            if (since) {
                request['start'] = parseInt(since / 1000);
                request['end'] = _this10.seconds();
            }
            // limit is disabled (does not really work as expected)
            // if (limit)
            //     request['limit'] = parseInt (limit);
            let response = yield _this10.privatePostReturnTradeHistory(_this10.extend(request, params));
            let result = [];
            if (market) {
                result = _this10.parseTrades(response, market);
            } else {
                if (response) {
                    let ids = (0, _keys2.default)(response);
                    for (let i = 0; i < ids.length; i++) {
                        let id = ids[i];
                        let market = _this10.markets_by_id[id];
                        let symbol = market['symbol'];
                        let trades = _this10.parseTrades(response[id], market);
                        for (let j = 0; j < trades.length; j++) {
                            result.push(trades[j]);
                        }
                    }
                }
            }
            return _this10.filterBySinceLimit(result, since, limit);
        })();
    }

    parseOrder(order, market = undefined) {
        let timestamp = this.safeInteger(order, 'timestamp');
        if (!timestamp) timestamp = this.parse8601(order['date']);
        let trades = undefined;
        if ('resultingTrades' in order) trades = this.parseTrades(order['resultingTrades'], market);
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        let price = parseFloat(order['price']);
        let cost = this.safeFloat(order, 'total', 0.0);
        let remaining = this.safeFloat(order, 'amount');
        let amount = this.safeFloat(order, 'startingAmount', remaining);
        let filled = amount - remaining;
        return {
            'info': order,
            'id': order['orderNumber'],
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'status': order['status'],
            'symbol': symbol,
            'type': order['type'],
            'side': order['side'],
            'price': price,
            'cost': cost,
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'trades': trades,
            'fee': undefined
        };
    }

    parseOpenOrders(orders, market, result = []) {
        for (let i = 0; i < orders.length; i++) {
            let order = orders[i];
            let extended = this.extend(order, {
                'status': 'open',
                'type': 'limit',
                'side': order['type'],
                'price': order['rate']
            });
            result.push(this.parseOrder(extended, market));
        }
        return result;
    }

    fetchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this11 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this11.loadMarkets();
            let market = undefined;
            if (symbol) market = _this11.market(symbol);
            let pair = market ? market['id'] : 'all';
            let response = yield _this11.privatePostReturnOpenOrders(_this11.extend({
                'currencyPair': pair
            }));
            let openOrders = [];
            if (market) {
                openOrders = _this11.parseOpenOrders(response, market, openOrders);
            } else {
                let marketIds = (0, _keys2.default)(response);
                for (let i = 0; i < marketIds.length; i++) {
                    let marketId = marketIds[i];
                    let orders = response[marketId];
                    let m = _this11.markets_by_id[marketId];
                    openOrders = _this11.parseOpenOrders(orders, m, openOrders);
                }
            }
            for (let j = 0; j < openOrders.length; j++) {
                _this11.orders[openOrders[j]['id']] = openOrders[j];
            }
            let openOrdersIndexedById = _this11.indexBy(openOrders, 'id');
            let cachedOrderIds = (0, _keys2.default)(_this11.orders);
            let result = [];
            for (let k = 0; k < cachedOrderIds.length; k++) {
                let id = cachedOrderIds[k];
                if (id in openOrdersIndexedById) {
                    _this11.orders[id] = _this11.extend(_this11.orders[id], openOrdersIndexedById[id]);
                } else {
                    let order = _this11.orders[id];
                    if (order['status'] == 'open') {
                        _this11.orders[id] = _this11.extend(order, {
                            'status': 'closed',
                            'cost': order['amount'] * order['price'],
                            'filled': order['amount'],
                            'remaining': 0.0
                        });
                    }
                }
                let order = _this11.orders[id];
                if (market) {
                    if (order['symbol'] == symbol) result.push(order);
                } else {
                    result.push(order);
                }
            }
            return _this11.filterBySinceLimit(result, since, limit);
        })();
    }

    fetchOrder(id, symbol = undefined, params = {}) {
        var _this12 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let since = _this12.safeValue(params, 'since');
            let limit = _this12.safeValue(params, 'limit');
            let request = _this12.omit(params, ['since', 'limit']);
            let orders = yield _this12.fetchOrders(symbol, since, limit, request);
            for (let i = 0; i < orders.length; i++) {
                if (orders[i]['id'] == id) return orders[i];
            }
            throw new OrderNotCached(_this12.id + ' order id ' + id.toString() + ' not found in cache');
        })();
    }

    filterOrdersByStatus(orders, status) {
        let result = [];
        for (let i = 0; i < orders.length; i++) {
            if (orders[i]['status'] == status) result.push(orders[i]);
        }
        return result;
    }

    fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this13 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let orders = yield _this13.fetchOrders(symbol, since, limit, params);
            return _this13.filterOrdersByStatus(orders, 'open');
        })();
    }

    fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this14 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let orders = yield _this14.fetchOrders(symbol, since, limit, params);
            return _this14.filterOrdersByStatus(orders, 'closed');
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this15 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (type == 'market') throw new ExchangeError(_this15.id + ' allows limit orders only');
            yield _this15.loadMarkets();
            let method = 'privatePost' + _this15.capitalize(side);
            let market = _this15.market(symbol);
            price = parseFloat(price);
            amount = parseFloat(amount);
            let response = yield _this15[method](_this15.extend({
                'currencyPair': market['id'],
                'rate': _this15.priceToPrecision(symbol, price),
                'amount': _this15.amountToPrecision(symbol, amount)
            }, params));
            let timestamp = _this15.milliseconds();
            let order = _this15.parseOrder(_this15.extend({
                'timestamp': timestamp,
                'status': 'open',
                'type': type,
                'side': side,
                'price': price,
                'amount': amount
            }, response), market);
            let id = order['id'];
            _this15.orders[id] = order;
            return _this15.extend({ 'info': response }, order);
        })();
    }

    editOrder(id, symbol, type, side, amount, price = undefined, params = {}) {
        var _this16 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this16.loadMarkets();
            price = parseFloat(price);
            amount = parseFloat(amount);
            let request = {
                'orderNumber': id,
                'rate': _this16.priceToPrecision(symbol, price),
                'amount': _this16.amountToPrecision(symbol, amount)
            };
            let response = yield _this16.privatePostMoveOrder(_this16.extend(request, params));
            let result = undefined;
            if (id in _this16.orders) {
                _this16.orders[id]['status'] = 'canceled';
                let newid = response['orderNumber'];
                _this16.orders[newid] = _this16.extend(_this16.orders[id], {
                    'id': newid,
                    'price': price,
                    'amount': amount,
                    'status': 'open'
                });
                result = _this16.extend(_this16.orders[newid], { 'info': response });
            } else {
                result = {
                    'info': response,
                    'id': response['orderNumber']
                };
            }
            return result;
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this17 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this17.loadMarkets();
            let response = undefined;
            try {
                response = yield _this17.privatePostCancelOrder(_this17.extend({
                    'orderNumber': id
                }, params));
                if (id in _this17.orders) _this17.orders[id]['status'] = 'canceled';
            } catch (e) {
                if (_this17.last_http_response) {
                    if (_this17.last_http_response.indexOf('Invalid order') >= 0) throw new OrderNotFound(_this17.id + ' cancelOrder() error: ' + _this17.last_http_response);
                }
                throw e;
            }
            return response;
        })();
    }

    fetchOrderStatus(id, symbol = undefined) {
        var _this18 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this18.loadMarkets();
            let orders = yield _this18.fetchOpenOrders(symbol);
            let indexed = _this18.indexBy(orders, 'id');
            return id in indexed ? 'open' : 'closed';
        })();
    }

    fetchOrderTrades(id, symbol = undefined, params = {}) {
        var _this19 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this19.loadMarkets();
            let trades = yield _this19.privatePostReturnOrderTrades(_this19.extend({
                'orderNumber': id
            }, params));
            return _this19.parseTrades(trades);
        })();
    }

    createDepositAddress(currency, params = {}) {
        var _this20 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let currencyId = _this20.currencyId(currency);
            let response = yield _this20.privatePostGenerateNewAddress({
                'currency': currencyId
            });
            let address = undefined;
            if (response['success'] == 1) address = _this20.safeString(response, 'response');
            if (!address) throw new ExchangeError(_this20.id + ' createDepositAddress failed: ' + _this20.last_http_response);
            return {
                'currency': currency,
                'address': address,
                'status': 'ok',
                'info': response
            };
        })();
    }

    fetchDepositAddress(currency, params = {}) {
        var _this21 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this21.privatePostReturnDepositAddresses();
            let currencyId = _this21.currencyId(currency);
            let address = _this21.safeString(response, currencyId);
            let status = address ? 'ok' : 'none';
            return {
                'currency': currency,
                'address': address,
                'status': status,
                'info': response
            };
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this22 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this22.loadMarkets();
            let currencyId = _this22.currencyId(currency);
            let result = yield _this22.privatePostWithdraw(_this22.extend({
                'currency': currencyId,
                'amount': amount,
                'address': address
            }, params));
            return {
                'info': result,
                'id': result['response']
            };
        })();
    }

    nonce() {
        return this.milliseconds();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api];
        let query = this.extend({ 'command': path }, params);
        if (api == 'public') {
            url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            query['nonce'] = this.nonce();
            body = this.urlencode(query);
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Key': this.apiKey,
                'Sign': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this23 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this23.fetch2(path, api, method, params, headers, body);
            if ('error' in response) {
                let error = _this23.id + ' ' + _this23.json(response);
                let failed = response['error'].indexOf('Not enough') >= 0;
                if (failed) throw new InsufficientFunds(error);
                throw new ExchangeError(error);
            }
            return response;
        })();
    }
};