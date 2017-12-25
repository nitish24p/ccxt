"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError, InvalidOrder, InsufficientFunds, OrderNotFound, DDoSProtection } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class bittrex extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bittrex',
            'name': 'Bittrex',
            'countries': 'US',
            'version': 'v1.1',
            'rateLimit': 1500,
            'hasAlreadyAuthenticatedSuccessfully': false, // a workaround for APIKEY_INVALID
            'hasCORS': false,
            // obsolete metainfo interface
            'hasFetchTickers': true,
            'hasFetchOHLCV': true,
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
                'fetchOHLCV': true,
                'fetchOrder': true,
                'fetchOrders': true,
                'fetchClosedOrders': 'emulated',
                'fetchOpenOrders': true,
                'fetchMyTrades': false,
                'fetchCurrencies': true,
                'withdraw': true
            },
            'timeframes': {
                '1m': 'oneMin',
                '5m': 'fiveMin',
                '30m': 'thirtyMin',
                '1h': 'hour',
                '1d': 'day'
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766352-cf0b3c26-5ed5-11e7-82b7-f3826b7a97d8.jpg',
                'api': {
                    'public': 'https://bittrex.com/api',
                    'account': 'https://bittrex.com/api',
                    'market': 'https://bittrex.com/api',
                    'v2': 'https://bittrex.com/api/v2.0/pub'
                },
                'www': 'https://bittrex.com',
                'doc': ['https://bittrex.com/Home/Api', 'https://www.npmjs.org/package/node.bittrex.api'],
                'fees': ['https://bittrex.com/Fees', 'https://support.bittrex.com/hc/en-us/articles/115000199651-What-fees-does-Bittrex-charge-']
            },
            'api': {
                'v2': {
                    'get': ['currencies/GetBTCPrice', 'market/GetTicks', 'market/GetLatestTick', 'Markets/GetMarketSummaries', 'market/GetLatestTick']
                },
                'public': {
                    'get': ['currencies', 'markethistory', 'markets', 'marketsummaries', 'marketsummary', 'orderbook', 'ticker']
                },
                'account': {
                    'get': ['balance', 'balances', 'depositaddress', 'deposithistory', 'order', 'orderhistory', 'withdrawalhistory', 'withdraw']
                },
                'market': {
                    'get': ['buylimit', 'buymarket', 'cancel', 'openorders', 'selllimit', 'sellmarket']
                }
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'maker': 0.0025,
                    'taker': 0.0025
                },
                'funding': {
                    'tierBased': false,
                    'percentage': false,
                    'withdraw': {
                        'BTC': 0.001,
                        'LTC': 0.01,
                        'DOGE': 2,
                        'VTC': 0.02,
                        'PPC': 0.02,
                        'FTC': 0.2,
                        'RDD': 2,
                        'NXT': 2,
                        'DASH': 0.002,
                        'POT': 0.002
                    },
                    'deposit': {
                        'BTC': 0,
                        'LTC': 0,
                        'DOGE': 0,
                        'VTC': 0,
                        'PPC': 0,
                        'FTC': 0,
                        'RDD': 0,
                        'NXT': 0,
                        'DASH': 0,
                        'POT': 0
                    }
                }
            }
        });
    }

    costToPrecision(symbol, cost) {
        return this.truncate(parseFloat(cost), this.markets[symbol]['precision']['price']);
    }

    feeToPrecision(symbol, fee) {
        return this.truncate(parseFloat(fee), this.markets[symbol]['precision']['price']);
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let response = yield _this.v2GetMarketsGetMarketSummaries();
            let result = [];
            for (let i = 0; i < response['result'].length; i++) {
                let market = response['result'][i]['Market'];
                let id = market['MarketName'];
                let base = market['MarketCurrency'];
                let quote = market['BaseCurrency'];
                base = _this.commonCurrencyCode(base);
                quote = _this.commonCurrencyCode(quote);
                let symbol = base + '/' + quote;
                let precision = {
                    'amount': 8,
                    'price': 8
                };
                let active = market['IsActive'];
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
                            'min': market['MinTradeSize'],
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

    fetchBalance(params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let response = yield _this2.accountGetBalances();
            let balances = response['result'];
            let result = { 'info': balances };
            let indexed = _this2.indexBy(balances, 'Currency');
            let keys = Object.keys(indexed);
            for (let i = 0; i < keys.length; i++) {
                let id = keys[i];
                let currency = _this2.commonCurrencyCode(id);
                let account = _this2.account();
                let balance = indexed[id];
                let free = parseFloat(balance['Available']);
                let total = parseFloat(balance['Balance']);
                let used = total - free;
                account['free'] = free;
                account['used'] = used;
                account['total'] = total;
                result[currency] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let response = yield _this3.publicGetOrderbook(_this3.extend({
                'market': _this3.marketId(symbol),
                'type': 'both'
            }, params));
            let orderbook = response['result'];
            if ('type' in params) {
                if (params['type'] == 'buy') {
                    orderbook = {
                        'buy': response['result'],
                        'sell': []
                    };
                } else if (params['type'] == 'sell') {
                    orderbook = {
                        'buy': [],
                        'sell': response['result']
                    };
                }
            }
            return _this3.parseOrderBook(orderbook, undefined, 'buy', 'sell', 'Rate', 'Quantity');
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = this.parse8601(ticker['TimeStamp']);
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': this.safeFloat(ticker, 'High'),
            'low': this.safeFloat(ticker, 'Low'),
            'bid': this.safeFloat(ticker, 'Bid'),
            'ask': this.safeFloat(ticker, 'Ask'),
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': this.safeFloat(ticker, 'Last'),
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeFloat(ticker, 'Volume'),
            'quoteVolume': this.safeFloat(ticker, 'BaseVolume'),
            'info': ticker
        };
    }

    fetchCurrencies(params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this4.publicGetCurrencies(params);
            let currencies = response['result'];
            let result = {};
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let id = currency['Currency'];
                // todo: will need to rethink the fees
                // to add support for multiple withdrawal/deposit methods and
                // differentiated fees for each particular method
                let code = _this4.commonCurrencyCode(id);
                let precision = 8; // default precision, todo: fix "magic constants"
                result[code] = {
                    'id': id,
                    'code': code,
                    'info': currency,
                    'name': currency['CurrencyLong'],
                    'active': currency['IsActive'],
                    'status': 'ok',
                    'fee': currency['TxFee'], // todo: redesign
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
                            'min': currency['TxFee'],
                            'max': Math.pow(10, precision)
                        }
                    }
                };
            }
            return result;
        })();
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let response = yield _this5.publicGetMarketsummaries(params);
            let tickers = response['result'];
            let result = {};
            for (let t = 0; t < tickers.length; t++) {
                let ticker = tickers[t];
                let id = ticker['MarketName'];
                let market = undefined;
                let symbol = id;
                if (id in _this5.markets_by_id) {
                    market = _this5.markets_by_id[id];
                    symbol = market['symbol'];
                } else {
                    let [quote, base] = id.split('-');
                    base = _this5.commonCurrencyCode(base);
                    quote = _this5.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;
                }
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
            let response = yield _this6.publicGetMarketsummary(_this6.extend({
                'market': market['id']
            }, params));
            let ticker = response['result'][0];
            return _this6.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestamp = this.parse8601(trade['TimeStamp']);
        let side = undefined;
        if (trade['OrderType'] == 'BUY') {
            side = 'buy';
        } else if (trade['OrderType'] == 'SELL') {
            side = 'sell';
        }
        let id = undefined;
        if ('Id' in trade) id = trade['Id'].toString();
        return {
            'id': id,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': 'limit',
            'side': side,
            'price': parseFloat(trade['Price']),
            'amount': parseFloat(trade['Quantity'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            let market = _this7.market(symbol);
            let response = yield _this7.publicGetMarkethistory(_this7.extend({
                'market': market['id']
            }, params));
            if ('result' in response) {
                if (typeof response['result'] != 'undefined') return _this7.parseTrades(response['result'], market, since, limit);
            }
            throw new ExchangeError(_this7.id + ' fetchTrades() returned undefined response');
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '1d', since = undefined, limit = undefined) {
        let timestamp = this.parse8601(ohlcv['T']);
        return [timestamp, ohlcv['O'], ohlcv['H'], ohlcv['L'], ohlcv['C'], ohlcv['V']];
    }

    fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            let market = _this8.market(symbol);
            let request = {
                'tickInterval': _this8.timeframes[timeframe],
                'marketName': market['id']
            };
            let response = yield _this8.v2GetMarketGetTicks(_this8.extend(request, params));
            if ('result' in response) {
                if (response['result']) return _this8.parseOHLCVs(response['result'], market, timeframe, since, limit);
            }
            throw new ExchangeError(_this8.id + ' returned an empty or unrecognized response: ' + _this8.json(response));
        })();
    }

    fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            yield _this9.loadMarkets();
            let request = {};
            let market = undefined;
            if (symbol) {
                market = _this9.market(symbol);
                request['market'] = market['id'];
            }
            let response = yield _this9.marketGetOpenorders(_this9.extend(request, params));
            let orders = _this9.parseOrders(response['result'], market, since, limit);
            return _this9.filterOrdersBySymbol(orders, symbol);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this10 = this;

        return _asyncToGenerator(function* () {
            yield _this10.loadMarkets();
            let market = _this10.market(symbol);
            let method = 'marketGet' + _this10.capitalize(side) + type;
            let order = {
                'market': market['id'],
                'quantity': _this10.amountToPrecision(symbol, amount)
            };
            if (type == 'limit') order['rate'] = _this10.priceToPrecision(symbol, price);
            let response = yield _this10[method](_this10.extend(order, params));
            let result = {
                'info': response,
                'id': response['result']['uuid']
            };
            return result;
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this11 = this;

        return _asyncToGenerator(function* () {
            yield _this11.loadMarkets();
            let response = undefined;
            try {
                response = yield _this11.marketGetCancel(_this11.extend({
                    'uuid': id
                }, params));
            } catch (e) {
                if (_this11.last_json_response) {
                    let message = _this11.safeString(_this11.last_json_response, 'message');
                    if (message == 'ORDER_NOT_OPEN') throw new InvalidOrder(_this11.id + ' cancelOrder() error: ' + _this11.last_http_response);
                    if (message == 'UUID_INVALID') throw new OrderNotFound(_this11.id + ' cancelOrder() error: ' + _this11.last_http_response);
                }
                throw e;
            }
            return response;
        })();
    }

    parseOrder(order, market = undefined) {
        let side = undefined;
        if ('OrderType' in order) side = order['OrderType'] == 'LIMIT_BUY' ? 'buy' : 'sell';
        if ('Type' in order) side = order['Type'] == 'LIMIT_BUY' ? 'buy' : 'sell';
        let status = 'open';
        if (order['Closed']) {
            status = 'closed';
        } else if (order['CancelInitiated']) {
            status = 'canceled';
        }
        let symbol = undefined;
        if (!market) {
            if ('Exchange' in order) if (order['Exchange'] in this.markets_by_id) market = this.markets_by_id[order['Exchange']];
        }
        if (market) symbol = market['symbol'];
        let timestamp = undefined;
        if ('Opened' in order) timestamp = this.parse8601(order['Opened']);
        if ('TimeStamp' in order) timestamp = this.parse8601(order['TimeStamp']);
        let fee = undefined;
        let commission = undefined;
        if ('Commission' in order) {
            commission = 'Commission';
        } else if ('CommissionPaid' in order) {
            commission = 'CommissionPaid';
        }
        if (commission) {
            fee = {
                'cost': parseFloat(order[commission]),
                'currency': market['quote']
            };
        }
        let price = this.safeFloat(order, 'Limit');
        let cost = this.safeFloat(order, 'Price');
        let amount = this.safeFloat(order, 'Quantity');
        let remaining = this.safeFloat(order, 'QuantityRemaining', 0.0);
        let filled = amount - remaining;
        if (!cost) {
            if (price && amount) cost = price * amount;
        }
        if (!price) {
            if (cost && filled) price = cost / filled;
        }
        let average = this.safeFloat(order, 'PricePerUnit');
        let result = {
            'info': order,
            'id': order['OrderUuid'],
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'type': 'limit',
            'side': side,
            'price': price,
            'cost': cost,
            'average': average,
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'status': status,
            'fee': fee
        };
        return result;
    }

    fetchOrder(id, symbol = undefined, params = {}) {
        var _this12 = this;

        return _asyncToGenerator(function* () {
            yield _this12.loadMarkets();
            let response = undefined;
            try {
                response = yield _this12.accountGetOrder(_this12.extend({ 'uuid': id }, params));
            } catch (e) {
                if (_this12.last_json_response) {
                    let message = _this12.safeString(_this12.last_json_response, 'message');
                    if (message == 'UUID_INVALID') throw new OrderNotFound(_this12.id + ' fetchOrder() error: ' + _this12.last_http_response);
                }
                throw e;
            }
            return _this12.parseOrder(response['result']);
        })();
    }

    fetchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this13 = this;

        return _asyncToGenerator(function* () {
            yield _this13.loadMarkets();
            let request = {};
            let market = undefined;
            if (symbol) {
                market = _this13.market(symbol);
                request['market'] = market['id'];
            }
            let response = yield _this13.accountGetOrderhistory(_this13.extend(request, params));
            let orders = _this13.parseOrders(response['result'], market, since, limit);
            return _this13.filterOrdersBySymbol(orders, symbol);
        })();
    }

    fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this14 = this;

        return _asyncToGenerator(function* () {
            let orders = yield _this14.fetchOrders(symbol, params);
            return _this14.filterBy(orders, 'status', 'closed');
        })();
    }

    currencyId(currency) {
        if (currency == 'BCH') return 'BCC';
        return currency;
    }

    fetchDepositAddress(currency, params = {}) {
        var _this15 = this;

        return _asyncToGenerator(function* () {
            let currencyId = _this15.currencyId(currency);
            let response = yield _this15.accountGetDepositaddress(_this15.extend({
                'currency': currencyId
            }, params));
            let address = _this15.safeString(response['result'], 'Address');
            let message = _this15.safeString(response, 'message');
            let status = 'ok';
            if (!address || message == 'ADDRESS_GENERATING') status = 'pending';
            return {
                'currency': currency,
                'address': address,
                'status': status,
                'info': response
            };
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this16 = this;

        return _asyncToGenerator(function* () {
            let currencyId = _this16.currencyId(currency);
            let response = yield _this16.accountGetWithdraw(_this16.extend({
                'currency': currencyId,
                'quantity': amount,
                'address': address
            }, params));
            let id = undefined;
            if ('result' in response) {
                if ('uuid' in response['result']) id = response['result']['uuid'];
            }
            return {
                'info': response,
                'id': id
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api] + '/';
        if (api != 'v2') url += this.version + '/';
        if (api == 'public') {
            url += api + '/' + method.toLowerCase() + path;
            if (Object.keys(params).length) url += '?' + this.urlencode(params);
        } else if (api == 'v2') {
            url += path;
            if (Object.keys(params).length) url += '?' + this.urlencode(params);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            url += api + '/';
            if (api == 'account' && path != 'withdraw' || path == 'openorders') url += method.toLowerCase();
            url += path + '?' + this.urlencode(this.extend({
                'nonce': nonce,
                'apikey': this.apiKey
            }, params));
            let signature = this.hmac(this.encode(url), this.encode(this.secret), 'sha512');
            headers = { 'apisign': signature };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors(code, reason, url, method, headers, body) {
        if (code >= 400) {
            if (body[0] == "{") {
                let response = JSON.parse(body);
                if ('success' in response) {
                    if (!response['success']) {
                        if ('message' in response) {
                            if (response['message'] == 'MIN_TRADE_REQUIREMENT_NOT_MET') throw new InvalidOrder(this.id + ' ' + this.json(response));
                            if (response['message'] == 'APIKEY_INVALID') {
                                if (this.hasAlreadyAuthenticatedSuccessfully) {
                                    throw new DDoSProtection(this.id + ' ' + this.json(response));
                                } else {
                                    throw new AuthenticationError(this.id + ' ' + this.json(response));
                                }
                            }
                            if (response['message'] == 'DUST_TRADE_DISALLOWED_MIN_VALUE_50K_SAT') throw new InvalidOrder(this.id + ' order cost should be over 50k satoshi ' + this.json(response));
                        }
                        throw new ExchangeError(this.id + ' ' + this.json(response));
                    }
                }
            }
        }
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this17 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this17.fetch2(path, api, method, params, headers, body);
            if ('success' in response) {
                if (response['success']) {
                    // a workaround for APIKEY_INVALID
                    if (api == 'account' || api == 'market') _this17.hasAlreadyAuthenticatedSuccessfully = true;
                    return response;
                }
            }
            if ('message' in response) {
                if (response['message'] == 'ADDRESS_GENERATING') return response;
                if (response['message'] == "INSUFFICIENT_FUNDS") throw new InsufficientFunds(_this17.id + ' ' + _this17.json(response));
            }
            throw new ExchangeError(_this17.id + ' ' + _this17.json(response));
        })();
    }
};