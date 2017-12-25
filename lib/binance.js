"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _log = require('babel-runtime/core-js/math/log10');

var _log2 = _interopRequireDefault(_log);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Exchange = require('./base/Exchange');
const { ExchangeError, InsufficientFunds, OrderNotFound, InvalidOrder, DDoSProtection } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class binance extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'binance',
            'name': 'Binance',
            'countries': 'CN', // China
            'rateLimit': 500,
            'hasCORS': false,
            // obsolete metainfo interface
            'hasFetchTickers': true,
            'hasFetchOHLCV': true,
            'hasFetchMyTrades': true,
            'hasFetchOrder': true,
            'hasFetchOrders': true,
            'hasFetchOpenOrders': true,
            'hasWithdraw': true,
            // new metainfo interface
            'has': {
                'fetchTickers': true,
                'fetchOHLCV': true,
                'fetchMyTrades': true,
                'fetchOrder': true,
                'fetchOrders': true,
                'fetchOpenOrders': true,
                'withdraw': true
            },
            'timeframes': {
                '1m': '1m',
                '3m': '3m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1h',
                '2h': '2h',
                '4h': '4h',
                '6h': '6h',
                '8h': '8h',
                '12h': '12h',
                '1d': '1d',
                '3d': '3d',
                '1w': '1w',
                '1M': '1M'
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/29604020-d5483cdc-87ee-11e7-94c7-d1a8d9169293.jpg',
                'api': {
                    'web': 'https://www.binance.com',
                    'wapi': 'https://api.binance.com/wapi/v3',
                    'public': 'https://api.binance.com/api/v1',
                    'private': 'https://api.binance.com/api/v3'
                },
                'www': 'https://www.binance.com',
                'doc': 'https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md',
                'fees': ['https://binance.zendesk.com/hc/en-us/articles/115000429332', 'https://support.binance.com/hc/en-us/articles/115000583311']
            },
            'api': {
                'web': {
                    'get': ['exchange/public/product']
                },
                'wapi': {
                    'post': ['withdraw'],
                    'get': ['depositHistory', 'withdrawHistory', 'depositAddress']
                },
                'public': {
                    'get': ['exchangeInfo', 'ping', 'time', 'depth', 'aggTrades', 'klines', 'ticker/24hr', 'ticker/allPrices', 'ticker/allBookTickers']
                },
                'private': {
                    'get': ['order', 'openOrders', 'allOrders', 'account', 'myTrades'],
                    'post': ['order', 'order/test', 'userDataStream'],
                    'put': ['userDataStream'],
                    'delete': ['order', 'userDataStream']
                }
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'taker': 0.001,
                    'maker': 0.001
                },
                'funding': {
                    'tierBased': false,
                    'percentage': false,
                    'withdraw': {
                        'BNB': 1.0,
                        'BTC': 0.0005,
                        'ETH': 0.005,
                        'LTC': 0.001,
                        'NEO': 0.0,
                        'QTUM': 0.01,
                        'SNT': 50.0,
                        'BNT': 0.6,
                        'EOS': 2.0,
                        'BCH': 0.0005,
                        'GAS': 0.0,
                        'USDT': 5.0,
                        'OAX': 2.0,
                        'DNT': 30.0,
                        'MCO': 0.15,
                        'ICN': 0.5,
                        'WTC': 0.2,
                        'OMG': 0.1,
                        'ZRX': 5.0,
                        'STRAT': 0.1,
                        'SNGLS': 8.0,
                        'BQX': 2.0,
                        'KNC': 1.0,
                        'FUN': 50.0,
                        'SNM': 10.0,
                        'LINK': 5.0,
                        'XVG': 0.1,
                        'CTR': 1.0,
                        'SALT': 0.3,
                        'IOTA': 0.0,
                        'MDA': 0.5,
                        'MTL': 0.15,
                        'SUB': 10.0,
                        'ETC': 0.01,
                        'MTH': 10.0,
                        'ENG': 2.0,
                        'AST': 4.0,
                        'BTG': undefined,
                        'DASH': 0.002,
                        'EVX': 1.0,
                        'REQ': 30.0,
                        'LRC': 7.0,
                        'VIB': 7.0,
                        'HSR': 0.0001,
                        'TRX': 500.0,
                        'POWR': 15.0,
                        'ARK': 0.1,
                        'YOYO': 30.0,
                        'XRP': 0.15,
                        'MOD': 1.0,
                        'ENJ': 1.0,
                        'STORJ': 2.0
                    },
                    'deposit': {
                        'BNB': 0,
                        'BTC': 0,
                        'ETH': 0,
                        'LTC': 0,
                        'NEO': 0,
                        'QTUM': 0,
                        'SNT': 0,
                        'BNT': 0,
                        'EOS': 0,
                        'BCH': 0,
                        'GAS': 0,
                        'USDT': 0,
                        'OAX': 0,
                        'DNT': 0,
                        'MCO': 0,
                        'ICN': 0,
                        'WTC': 0,
                        'OMG': 0,
                        'ZRX': 0,
                        'STRAT': 0,
                        'SNGLS': 0,
                        'BQX': 0,
                        'KNC': 0,
                        'FUN': 0,
                        'SNM': 0,
                        'LINK': 0,
                        'XVG': 0,
                        'CTR': 0,
                        'SALT': 0,
                        'IOTA': 0,
                        'MDA': 0,
                        'MTL': 0,
                        'SUB': 0,
                        'ETC': 0,
                        'MTH': 0,
                        'ENG': 0,
                        'AST': 0,
                        'BTG': 0,
                        'DASH': 0,
                        'EVX': 0,
                        'REQ': 0,
                        'LRC': 0,
                        'VIB': 0,
                        'HSR': 0,
                        'TRX': 0,
                        'POWR': 0,
                        'ARK': 0,
                        'YOYO': 0,
                        'XRP': 0,
                        'MOD': 0,
                        'ENJ': 0,
                        'STORJ': 0
                    }
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this.publicGetExchangeInfo();
            let markets = response['symbols'];
            let result = [];
            for (let i = 0; i < markets.length; i++) {
                let market = markets[i];
                let id = market['symbol'];
                let base = _this.commonCurrencyCode(market['baseAsset']);
                let quote = _this.commonCurrencyCode(market['quoteAsset']);
                let symbol = base + '/' + quote;
                let filters = _this.indexBy(market['filters'], 'filterType');
                let precision = {
                    'base': market['baseAssetPrecision'],
                    'quote': market['quotePrecision'],
                    'amount': market['baseAssetPrecision'],
                    'price': market['quotePrecision']
                };
                let active = market['status'] == 'TRADING';
                let lot = -1 * (0, _log2.default)(precision['amount']);
                let entry = _this.extend(_this.fees['trading'], {
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
                            'min': -1 * (0, _log2.default)(precision['price']),
                            'max': undefined
                        },
                        'cost': {
                            'min': lot,
                            'max': undefined
                        }
                    }
                });
                if ('PRICE_FILTER' in filters) {
                    let filter = filters['PRICE_FILTER'];
                    entry['precision']['price'] = _this.precisionFromString(filter['tickSize']);
                    entry['limits']['price'] = {
                        'min': parseFloat(filter['minPrice']),
                        'max': parseFloat(filter['maxPrice'])
                    };
                }
                if ('LOT_SIZE' in filters) {
                    let filter = filters['LOT_SIZE'];
                    entry['precision']['amount'] = _this.precisionFromString(filter['stepSize']);
                    entry['lot'] = parseFloat(filter['stepSize']);
                    entry['limits']['amount'] = {
                        'min': parseFloat(filter['minQty']),
                        'max': parseFloat(filter['maxQty'])
                    };
                }
                if ('MIN_NOTIONAL' in filters) {
                    entry['limits']['cost']['min'] = parseFloat(filters['MIN_NOTIONAL']['minNotional']);
                }
                result.push(entry);
            }
            return result;
        })();
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

    fetchBalance(params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this2.loadMarkets();
            let response = yield _this2.privateGetAccount(params);
            let result = { 'info': response };
            let balances = response['balances'];
            for (let i = 0; i < balances.length; i++) {
                let balance = balances[i];
                let asset = balance['asset'];
                let currency = _this2.commonCurrencyCode(asset);
                let account = {
                    'free': parseFloat(balance['free']),
                    'used': parseFloat(balance['locked']),
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

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let orderbook = yield _this3.publicGetDepth(_this3.extend({
                'symbol': market['id'],
                'limit': 100 // default = maximum = 100
            }, params));
            return _this3.parseOrderBook(orderbook);
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = this.safeInteger(ticker, 'closeTime');
        if (typeof timestamp == 'undefined') timestamp = this.milliseconds();
        let symbol = ticker['symbol'];
        if (!market) {
            if (symbol in this.markets_by_id) {
                market = this.markets_by_id[symbol];
            }
        }
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': this.safeFloat(ticker, 'highPrice'),
            'low': this.safeFloat(ticker, 'lowPrice'),
            'bid': this.safeFloat(ticker, 'bidPrice'),
            'ask': this.safeFloat(ticker, 'askPrice'),
            'vwap': this.safeFloat(ticker, 'weightedAvgPrice'),
            'open': this.safeFloat(ticker, 'openPrice'),
            'close': this.safeFloat(ticker, 'prevClosePrice'),
            'first': undefined,
            'last': this.safeFloat(ticker, 'lastPrice'),
            'change': this.safeFloat(ticker, 'priceChangePercent'),
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeFloat(ticker, 'volume'),
            'quoteVolume': this.safeFloat(ticker, 'quoteVolume'),
            'info': ticker
        };
    }

    fetchTicker(symbol, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetTicker24hr(_this4.extend({
                'symbol': market['id']
            }, params));
            return _this4.parseTicker(response, market);
        })();
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this5.loadMarkets();
            let rawTickers = yield _this5.publicGetTicker24hr(params);
            let tickers = [];
            for (let i = 0; i < rawTickers.length; i++) {
                tickers.push(_this5.parseTicker(rawTickers[i]));
            }
            let tickersBySymbol = _this5.indexBy(tickers, 'symbol');
            // return all of them if no symbols were passed in the first argument
            if (!symbols) return tickersBySymbol;
            // otherwise filter by symbol
            let result = {};
            for (let i = 0; i < symbols.length; i++) {
                let symbol = symbols[i];
                if (symbol in tickersBySymbol) result[symbol] = tickersBySymbol[symbol];
            }
            return result;
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '1m', since = undefined, limit = undefined) {
        return [ohlcv[0], parseFloat(ohlcv[1]), parseFloat(ohlcv[2]), parseFloat(ohlcv[3]), parseFloat(ohlcv[4]), parseFloat(ohlcv[5])];
    }

    fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let request = {
                'symbol': market['id'],
                'interval': _this6.timeframes[timeframe]
            };
            request['limit'] = limit ? limit : 500; // default == max == 500
            if (since) request['startTime'] = since;
            let response = yield _this6.publicGetKlines(_this6.extend(request, params));
            return _this6.parseOHLCVs(response, market, timeframe, since, limit);
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestampField = 'T' in trade ? 'T' : 'time';
        let timestamp = trade[timestampField];
        let priceField = 'p' in trade ? 'p' : 'price';
        let price = parseFloat(trade[priceField]);
        let amountField = 'q' in trade ? 'q' : 'qty';
        let amount = parseFloat(trade[amountField]);
        let idField = 'a' in trade ? 'a' : 'id';
        let id = trade[idField].toString();
        let side = undefined;
        let order = undefined;
        if ('orderId' in trade) order = trade['orderId'].toString();
        if ('m' in trade) {
            side = trade['m'] ? 'sell' : 'buy'; // this is reversed intentionally
        } else {
            side = trade['isBuyer'] ? 'buy' : 'sell'; // this is a true side
        }
        let fee = undefined;
        if ('commission' in trade) {
            fee = {
                'cost': parseFloat(trade['commission']),
                'currency': this.commonCurrencyCode(trade['commissionAsset'])
            };
        }
        return {
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'id': id,
            'order': order,
            'type': undefined,
            'side': side,
            'price': price,
            'cost': price * amount,
            'amount': amount,
            'fee': fee
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this7.loadMarkets();
            let market = _this7.market(symbol);
            let request = {
                'symbol': market['id']
            };
            if (since) {
                request['startTime'] = since;
                request['endTime'] = since + 86400000;
            }
            if (limit) request['limit'] = limit;
            // 'fromId': 123,    // ID to get aggregate trades from INCLUSIVE.
            // 'startTime': 456, // Timestamp in ms to get aggregate trades from INCLUSIVE.
            // 'endTime': 789,   // Timestamp in ms to get aggregate trades until INCLUSIVE.
            // 'limit': 500,     // default = maximum = 500
            let response = yield _this7.publicGetAggTrades(_this7.extend(request, params));
            return _this7.parseTrades(response, market, since, limit);
        })();
    }

    parseOrderStatus(status) {
        if (status == 'NEW') return 'open';
        if (status == 'PARTIALLY_FILLED') return 'open';
        if (status == 'FILLED') return 'closed';
        if (status == 'CANCELED') return 'canceled';
        return status.toLowerCase();
    }

    parseOrder(order, market = undefined) {
        let status = this.parseOrderStatus(order['status']);
        let symbol = undefined;
        if (market) {
            symbol = market['symbol'];
        } else {
            let id = order['symbol'];
            if (id in this.markets_by_id) {
                market = this.markets_by_id[id];
                symbol = market['symbol'];
            }
        }
        let timestamp = order['time'];
        let price = parseFloat(order['price']);
        let amount = parseFloat(order['origQty']);
        let filled = this.safeFloat(order, 'executedQty', 0.0);
        let remaining = Math.max(amount - filled, 0.0);
        let result = {
            'info': order,
            'id': order['orderId'].toString(),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'type': order['type'].toLowerCase(),
            'side': order['side'].toLowerCase(),
            'price': price,
            'amount': amount,
            'cost': price * amount,
            'filled': filled,
            'remaining': remaining,
            'status': status,
            'fee': undefined
        };
        return result;
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this8.loadMarkets();
            let market = _this8.market(symbol);
            let order = {
                'symbol': market['id'],
                'quantity': _this8.amountToPrecision(symbol, amount),
                'type': type.toUpperCase(),
                'side': side.toUpperCase()
            };
            if (type == 'limit') {
                order = _this8.extend(order, {
                    'price': _this8.priceToPrecision(symbol, price),
                    'timeInForce': 'GTC' // 'GTC' = Good To Cancel (default), 'IOC' = Immediate Or Cancel
                });
            }
            let response = yield _this8.privatePostOrder(_this8.extend(order, params));
            return {
                'info': response,
                'id': response['orderId'].toString()
            };
        })();
    }

    fetchOrder(id, symbol = undefined, params = {}) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!symbol) throw new ExchangeError(_this9.id + ' fetchOrder requires a symbol param');
            yield _this9.loadMarkets();
            let market = _this9.market(symbol);
            let response = yield _this9.privateGetOrder(_this9.extend({
                'symbol': market['id'],
                'orderId': parseInt(id)
            }, params));
            return _this9.parseOrder(response, market);
        })();
    }

    fetchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this10 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!symbol) throw new ExchangeError(_this10.id + ' fetchOrders requires a symbol param');
            yield _this10.loadMarkets();
            let market = _this10.market(symbol);
            let request = {
                'symbol': market['id']
            };
            if (limit) request['limit'] = limit;
            let response = yield _this10.privateGetAllOrders(_this10.extend(request, params));
            return _this10.parseOrders(response, market, since, limit);
        })();
    }

    fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this11 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!symbol) throw new ExchangeError(_this11.id + ' fetchOpenOrders requires a symbol param');
            yield _this11.loadMarkets();
            let market = _this11.market(symbol);
            let response = yield _this11.privateGetOpenOrders(_this11.extend({
                'symbol': market['id']
            }, params));
            return _this11.parseOrders(response, market, since, limit);
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this12 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!symbol) throw new ExchangeError(_this12.id + ' cancelOrder requires a symbol param');
            yield _this12.loadMarkets();
            let market = _this12.market(symbol);
            let response = undefined;
            try {
                response = yield _this12.privateDeleteOrder(_this12.extend({
                    'symbol': market['id'],
                    'orderId': parseInt(id)
                    // 'origClientOrderId': id,
                }, params));
            } catch (e) {
                if (_this12.last_http_response.indexOf('UNKNOWN_ORDER') >= 0) throw new OrderNotFound(_this12.id + ' cancelOrder() error: ' + _this12.last_http_response);
                throw e;
            }
            return response;
        })();
    }

    nonce() {
        return this.milliseconds();
    }

    fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this13 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!symbol) throw new ExchangeError(_this13.id + ' fetchMyTrades requires a symbol');
            yield _this13.loadMarkets();
            let market = _this13.market(symbol);
            let request = {
                'symbol': market['id']
            };
            if (limit) request['limit'] = limit;
            let response = yield _this13.privateGetMyTrades(_this13.extend(request, params));
            return _this13.parseTrades(response, market, since, limit);
        })();
    }

    commonCurrencyCode(currency) {
        if (currency == 'BCC') return 'BCH';
        return currency;
    }

    currencyId(currency) {
        if (currency == 'BCH') return 'BCC';
        return currency;
    }

    fetchDepositAddress(currency, params = {}) {
        var _this14 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this14.wapiGetDepositAddress(_this14.extend({
                'asset': _this14.currencyId(currency),
                'recvWindow': 10000000
            }, params));
            if ('success' in response) {
                if (response['success']) {
                    let address = _this14.safeString(response, 'address');
                    return {
                        'currency': currency,
                        'address': address,
                        'status': 'ok',
                        'info': response
                    };
                }
            }
            throw new ExchangeError(_this14.id + ' fetchDepositAddress failed: ' + _this14.last_http_response);
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this15 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this15.wapiPostWithdraw(_this15.extend({
                'asset': _this15.currencyId(currency),
                'address': address,
                'amount': parseFloat(amount),
                'recvWindow': 10000000
            }, params));
            return {
                'info': response,
                'id': undefined
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api];
        url += '/' + path;
        if (api == 'wapi') url += '.html';
        if (api == 'private' || api == 'wapi') {
            this.checkRequiredCredentials();
            let nonce = this.milliseconds();
            let query = this.urlencode(this.extend({ 'timestamp': nonce }, params));
            let signature = this.hmac(this.encode(query), this.encode(this.secret));
            query += '&' + 'signature=' + signature;
            headers = {
                'X-MBX-APIKEY': this.apiKey
            };
            if (method == 'GET' || api == 'wapi') {
                url += '?' + query;
            } else {
                body = query;
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
        } else {
            if ((0, _keys2.default)(params).length) url += '?' + this.urlencode(params);
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors(code, reason, url, method, headers, body) {
        if (code >= 400) {
            if (code == 418) throw new DDoSProtection(this.id + ' ' + code.toString() + ' ' + reason + ' ' + body);
            if (body.indexOf('MIN_NOTIONAL') >= 0) throw new InvalidOrder(this.id + ' order cost = amount * price should be > 0.001 BTC ' + body);
            if (body.indexOf('LOT_SIZE') >= 0) throw new InvalidOrder(this.id + ' order amount should be evenly divisible by lot size, use this.amountToLots (symbol, amount) ' + body);
            if (body.indexOf('PRICE_FILTER') >= 0) throw new InvalidOrder(this.id + ' order price exceeds allowed price precision or invalid, use this.priceToPrecision (symbol, amount) ' + body);
            if (body.indexOf('Order does not exist') >= 0) throw new OrderNotFound(this.id + ' ' + body);
        }
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this16 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this16.fetch2(path, api, method, params, headers, body);
            if ('code' in response) {
                if (response['code'] < 0) {
                    if (response['code'] == -2010) throw new InsufficientFunds(_this16.id + ' ' + _this16.json(response));
                    if (response['code'] == -2011) throw new OrderNotFound(_this16.id + ' ' + _this16.json(response));
                    throw new ExchangeError(_this16.id + ' ' + _this16.json(response));
                }
            }
            return response;
        })();
    }
};