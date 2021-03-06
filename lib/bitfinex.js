"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Exchange = require('./base/Exchange');
const { ExchangeError, InsufficientFunds, NotSupported, InvalidOrder, OrderNotFound } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class bitfinex extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bitfinex',
            'name': 'Bitfinex',
            'countries': 'VG',
            'version': 'v1',
            'rateLimit': 1500,
            'hasCORS': false,
            // old metainfo interface
            'hasFetchOrder': true,
            'hasFetchTickers': true,
            'hasDeposit': true,
            'hasWithdraw': true,
            'hasFetchOHLCV': true,
            'hasFetchOpenOrders': true,
            'hasFetchClosedOrders': true,
            // new metainfo interface
            'has': {
                'fetchOHLCV': true,
                'fetchTickers': true,
                'fetchOrder': true,
                'fetchOpenOrders': true,
                'fetchClosedOrders': true,
                'fetchMyTrades': true,
                'withdraw': true,
                'deposit': true
            },
            'timeframes': {
                '1m': '1m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1h',
                '3h': '3h',
                '6h': '6h',
                '12h': '12h',
                '1d': '1D',
                '1w': '7D',
                '2w': '14D',
                '1M': '1M'
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766244-e328a50c-5ed2-11e7-947b-041416579bb3.jpg',
                'api': 'https://api.bitfinex.com',
                'www': 'https://www.bitfinex.com',
                'doc': ['https://bitfinex.readme.io/v1/docs', 'https://github.com/bitfinexcom/bitfinex-api-node']
            },
            'api': {
                'v2': {
                    'get': ['candles/trade:{timeframe}:{symbol}/{section}', 'candles/trade:{timeframe}:{symbol}/last', 'candles/trade:{timeframe}:{symbol}/hist']
                },
                'public': {
                    'get': ['book/{symbol}',
                    // 'candles/{symbol}',
                    'lendbook/{currency}', 'lends/{currency}', 'pubticker/{symbol}', 'stats/{symbol}', 'symbols', 'symbols_details', 'tickers', 'today', 'trades/{symbol}']
                },
                'private': {
                    'post': ['account_fees', 'account_infos', 'balances', 'basket_manage', 'credits', 'deposit/new', 'funding/close', 'history', 'history/movements', 'key_info', 'margin_infos', 'mytrades', 'mytrades_funding', 'offer/cancel', 'offer/new', 'offer/status', 'offers', 'offers/hist', 'order/cancel', 'order/cancel/all', 'order/cancel/multi', 'order/cancel/replace', 'order/new', 'order/new/multi', 'order/status', 'orders', 'orders/hist', 'position/claim', 'positions', 'summary', 'taken_funds', 'total_taken_funds', 'transfer', 'unused_taken_funds', 'withdraw']
                }
            },
            'fees': {
                'trading': {
                    'tierBased': true,
                    'percentage': true,
                    'maker': 0.1 / 100,
                    'taker': 0.2 / 100,
                    'tiers': {
                        'taker': [[0, 0.2 / 100], [500000, 0.2 / 100], [1000000, 0.2 / 100], [2500000, 0.2 / 100], [5000000, 0.2 / 100], [7500000, 0.2 / 100], [10000000, 0.18 / 100], [15000000, 0.16 / 100], [20000000, 0.14 / 100], [25000000, 0.12 / 100], [30000000, 0.1 / 100]],
                        'maker': [[0, 0.1 / 100], [500000, 0.08 / 100], [1000000, 0.06 / 100], [2500000, 0.04 / 100], [5000000, 0.02 / 100], [7500000, 0], [10000000, 0], [15000000, 0], [20000000, 0], [25000000, 0], [30000000, 0]]
                    }
                },
                'funding': {
                    'tierBased': false, // true for tier-based/progressive
                    'percentage': false, // fixed commission
                    'deposit': {
                        'BTC': 0.0005,
                        'IOTA': 0.5,
                        'ETH': 0.01,
                        'BCH': 0.01,
                        'LTC': 0.1,
                        'EOS': 0.1,
                        'XMR': 0.04,
                        'SAN': 0.1,
                        'DASH': 0.01,
                        'ETC': 0.01,
                        'XPR': 0.02,
                        'YYW': 0.1,
                        'NEO': 0,
                        'ZEC': 0.1,
                        'BTG': 0,
                        'OMG': 0.1,
                        'DATA': 1,
                        'QASH': 1,
                        'ETP': 0.01,
                        'QTUM': 0.01,
                        'EDO': 0.5,
                        'AVT': 0.5,
                        'USDT': 0
                    },
                    'withdraw': {
                        'BTC': 0.0005,
                        'IOTA': 0.5,
                        'ETH': 0.01,
                        'BCH': 0.01,
                        'LTC': 0.1,
                        'EOS': 0.1,
                        'XMR': 0.04,
                        'SAN': 0.1,
                        'DASH': 0.01,
                        'ETC': 0.01,
                        'XPR': 0.02,
                        'YYW': 0.1,
                        'NEO': 0,
                        'ZEC': 0.1,
                        'BTG': 0,
                        'OMG': 0.1,
                        'DATA': 1,
                        'QASH': 1,
                        'ETP': 0.01,
                        'QTUM': 0.01,
                        'EDO': 0.5,
                        'AVT': 0.5,
                        'USDT': 5
                    }
                }
            }
        });
    }

    commonCurrencyCode(currency) {
        // issue #4 Bitfinex names Dash as DSH, instead of DASH
        if (currency == 'DSH') return 'DASH';
        if (currency == 'QTM') return 'QTUM';
        if (currency == 'BCC') return 'CST_BCC';
        if (currency == 'BCU') return 'CST_BCU';
        // issue #796
        if (currency == 'IOT') return 'IOTA';
        return currency;
    }

    fetchMarkets() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let markets = yield _this.publicGetSymbolsDetails();
            let result = [];
            for (let p = 0; p < markets.length; p++) {
                let market = markets[p];
                let id = market['pair'].toUpperCase();
                let baseId = id.slice(0, 3);
                let quoteId = id.slice(3, 6);
                let base = _this.commonCurrencyCode(baseId);
                let quote = _this.commonCurrencyCode(quoteId);
                let symbol = base + '/' + quote;
                let precision = {
                    'price': market['price_precision'],
                    'amount': market['price_precision']
                };
                result.push(_this.extend(_this.fees['trading'], {
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'baseId': baseId,
                    'quoteId': quoteId,
                    'active': true,
                    'info': market,
                    'precision': precision,
                    'limits': {
                        'amount': {
                            'min': parseFloat(market['minimum_order_size']),
                            'max': parseFloat(market['maximum_order_size'])
                        },
                        'price': {
                            'min': Math.pow(10, -precision['price']),
                            'max': Math.pow(10, precision['price'])
                        },
                        'cost': {
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

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this2.loadMarkets();
            let balanceType = _this2.safeString(params, 'type', 'exchange');
            let balances = yield _this2.privatePostBalances();
            let result = { 'info': balances };
            for (let i = 0; i < balances.length; i++) {
                let balance = balances[i];
                if (balance['type'] == balanceType) {
                    let currency = balance['currency'];
                    let uppercase = currency.toUpperCase();
                    uppercase = _this2.commonCurrencyCode(uppercase);
                    let account = _this2.account();
                    account['free'] = parseFloat(balance['available']);
                    account['total'] = parseFloat(balance['amount']);
                    account['used'] = account['total'] - account['free'];
                    result[uppercase] = account;
                }
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this3.loadMarkets();
            let orderbook = yield _this3.publicGetBookSymbol(_this3.extend({
                'symbol': _this3.marketId(symbol)
            }, params));
            return _this3.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'price', 'amount');
        })();
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this4.loadMarkets();
            let tickers = yield _this4.publicGetTickers(params);
            let result = {};
            for (let i = 0; i < tickers.length; i++) {
                let ticker = tickers[i];
                if ('pair' in ticker) {
                    let id = ticker['pair'];
                    if (id in _this4.markets_by_id) {
                        let market = _this4.markets_by_id[id];
                        let symbol = market['symbol'];
                        result[symbol] = _this4.parseTicker(ticker, market);
                    } else {
                        throw new ExchangeError(_this4.id + ' fetchTickers() failed to recognize symbol ' + id + ' ' + _this4.json(ticker));
                    }
                } else {
                    throw new ExchangeError(_this4.id + ' fetchTickers() response not recognized ' + _this4.json(tickers));
                }
            }
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let ticker = yield _this5.publicGetPubtickerSymbol(_this5.extend({
                'symbol': market['id']
            }, params));
            return _this5.parseTicker(ticker, market);
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = parseFloat(ticker['timestamp']) * 1000;
        let symbol = undefined;
        if (market) {
            symbol = market['symbol'];
        } else if ('pair' in ticker) {
            let id = ticker['pair'];
            if (id in this.markets_by_id) {
                market = this.markets_by_id[id];
                symbol = market['symbol'];
            } else {
                throw new ExchangeError(this.id + ' unrecognized ticker symbol ' + id + ' ' + this.json(ticker));
            }
        }
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': parseFloat(ticker['high']),
            'low': parseFloat(ticker['low']),
            'bid': parseFloat(ticker['bid']),
            'ask': parseFloat(ticker['ask']),
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': parseFloat(ticker['last_price']),
            'change': undefined,
            'percentage': undefined,
            'average': parseFloat(ticker['mid']),
            'baseVolume': parseFloat(ticker['volume']),
            'quoteVolume': undefined,
            'info': ticker
        };
    }

    parseTrade(trade, market) {
        let timestamp = parseInt(parseFloat(trade['timestamp'])) * 1000;
        let side = trade['type'].toLowerCase();
        let orderId = this.safeString(trade, 'order_id');
        let price = parseFloat(trade['price']);
        let amount = parseFloat(trade['amount']);
        let cost = price * amount;
        return {
            'id': trade['tid'].toString(),
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'order': orderId,
            'side': side,
            'price': price,
            'amount': amount,
            'cost': cost,
            'fee': undefined
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let response = yield _this6.publicGetTradesSymbol(_this6.extend({
                'symbol': market['id']
            }, params));
            return _this6.parseTrades(response, market, since, limit);
        })();
    }

    fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this7.loadMarkets();
            let market = _this7.market(symbol);
            let request = { 'symbol': market['id'] };
            if (limit) {
                request['limit_trades'] = limit;
            }
            if (since) {
                request['timestamp'] = parseInt(since / 1000);
            }
            let response = yield _this7.privatePostMytrades(_this7.extend(request, params));
            return _this7.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this8.loadMarkets();
            let orderType = type;
            if (type == 'limit' || type == 'market') orderType = 'exchange ' + type;
            // amount = this.amountToPrecision (symbol, amount);
            let order = {
                'symbol': _this8.marketId(symbol),
                'amount': amount.toString(),
                'side': side,
                'type': orderType,
                'ocoorder': false,
                'buy_price_oco': 0,
                'sell_price_oco': 0
            };
            if (type == 'market') {
                order['price'] = _this8.nonce().toString();
            } else {
                // price = this.priceToPrecision (symbol, price);
                order['price'] = price.toString();
            }
            let result = yield _this8.privatePostOrderNew(_this8.extend(order, params));
            return _this8.parseOrder(result);
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this9.loadMarkets();
            return yield _this9.privatePostOrderCancel({ 'order_id': parseInt(id) });
        })();
    }

    parseOrder(order, market = undefined) {
        let side = order['side'];
        let open = order['is_live'];
        let canceled = order['is_cancelled'];
        let status = undefined;
        if (open) {
            status = 'open';
        } else if (canceled) {
            status = 'canceled';
        } else {
            status = 'closed';
        }
        let symbol = undefined;
        if (!market) {
            let exchange = order['symbol'].toUpperCase();
            if (exchange in this.markets_by_id) {
                market = this.markets_by_id[exchange];
            }
        }
        if (market) symbol = market['symbol'];
        let orderType = order['type'];
        let exchange = orderType.indexOf('exchange ') >= 0;
        if (exchange) {
            let [prefix, orderType] = order['type'].split(' ');
        }
        let timestamp = parseInt(parseFloat(order['timestamp']) * 1000);
        let result = {
            'info': order,
            'id': order['id'].toString(),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'type': orderType,
            'side': side,
            'price': parseFloat(order['price']),
            'average': parseFloat(order['avg_execution_price']),
            'amount': parseFloat(order['original_amount']),
            'remaining': parseFloat(order['remaining_amount']),
            'filled': parseFloat(order['executed_amount']),
            'status': status,
            'fee': undefined
        };
        return result;
    }

    fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this10 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this10.loadMarkets();
            let response = yield _this10.privatePostOrders(params);
            let orders = _this10.parseOrders(response, undefined, since, limit);
            if (symbol) orders = _this10.filterBy(orders, 'symbol', symbol);
            return orders;
        })();
    }

    fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this11 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this11.loadMarkets();
            let request = {};
            if (limit) request['limit'] = limit;
            let response = yield _this11.privatePostOrdersHist(_this11.extend(request, params));
            let orders = _this11.parseOrders(response, undefined, since, limit);
            if (symbol) orders = _this11.filterBy(orders, 'symbol', symbol);
            orders = _this11.filterBy(orders, 'status', 'closed');
            return orders;
        })();
    }

    fetchOrder(id, symbol = undefined, params = {}) {
        var _this12 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this12.loadMarkets();
            let response = yield _this12.privatePostOrderStatus(_this12.extend({
                'order_id': parseInt(id)
            }, params));
            return _this12.parseOrder(response);
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '1m', since = undefined, limit = undefined) {
        return [ohlcv[0], ohlcv[1], ohlcv[3], ohlcv[4], ohlcv[2], ohlcv[5]];
    }

    fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        var _this13 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this13.loadMarkets();
            let market = _this13.market(symbol);
            let v2id = 't' + market['id'];
            let request = {
                'symbol': v2id,
                'timeframe': _this13.timeframes[timeframe]
            };
            if (limit) request['limit'] = limit;
            if (since) request['start'] = since;
            request = _this13.extend(request, params);
            let response = yield _this13.v2GetCandlesTradeTimeframeSymbolHist(request);
            return _this13.parseOHLCVs(response, market, timeframe, since, limit);
        })();
    }

    getCurrencyName(currency) {
        if (currency == 'BTC') {
            return 'bitcoin';
        } else if (currency == 'LTC') {
            return 'litecoin';
        } else if (currency == 'ETH') {
            return 'ethereum';
        } else if (currency == 'ETC') {
            return 'ethereumc';
        } else if (currency == 'OMNI') {
            return 'mastercoin'; // ???
        } else if (currency == 'ZEC') {
            return 'zcash';
        } else if (currency == 'XMR') {
            return 'monero';
        } else if (currency == 'USD') {
            return 'wire';
        } else if (currency == 'DASH') {
            return 'dash';
        } else if (currency == 'XRP') {
            return 'ripple';
        } else if (currency == 'EOS') {
            return 'eos';
        } else if (currency == 'BCH') {
            return 'bcash';
        } else if (currency == 'USDT') {
            return 'tetheruso';
        }
        throw new NotSupported(this.id + ' ' + currency + ' not supported for withdrawal');
    }

    createDepositAddress(currency, params = {}) {
        var _this14 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this14.fetchDepositAddress(currency, _this14.extend({
                'renew': 1
            }, params));
            return {
                'currency': currency,
                'address': response['address'],
                'status': 'ok',
                'info': response['info']
            };
        })();
    }

    fetchDepositAddress(currency, params = {}) {
        var _this15 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let name = _this15.getCurrencyName(currency);
            let request = {
                'method': name,
                'wallet_name': 'exchange',
                'renew': 0 // a value of 1 will generate a new address
            };
            let response = yield _this15.privatePostDepositNew(_this15.extend(request, params));
            return {
                'currency': currency,
                'address': response['address'],
                'status': 'ok',
                'info': response
            };
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this16 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let name = _this16.getCurrencyName(currency);
            let request = {
                'withdraw_type': name,
                'walletselected': 'exchange',
                'amount': amount.toString(),
                'address': address
            };
            let responses = yield _this16.privatePostWithdraw(_this16.extend(request, params));
            let response = responses[0];
            return {
                'info': response,
                'id': response['withdrawal_id']
            };
        })();
    }

    nonce() {
        return this.milliseconds();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let request = '/' + this.implodeParams(path, params);
        if (api == 'v2') {
            request = '/' + api + request;
        } else {
            request = '/' + this.version + request;
        }
        let query = this.omit(params, this.extractParams(path));
        let url = this.urls['api'] + request;
        if (api == 'public' || path.indexOf('/hist') >= 0) {
            if ((0, _keys2.default)(query).length) {
                let suffix = '?' + this.urlencode(query);
                url += suffix;
                request += suffix;
            }
        }
        if (api == 'private') {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            query = this.extend({
                'nonce': nonce.toString(),
                'request': request
            }, query);
            query = this.json(query);
            query = this.encode(query);
            let payload = this.stringToBase64(query);
            let secret = this.encode(this.secret);
            let signature = this.hmac(payload, secret, 'sha384');
            headers = {
                'X-BFX-APIKEY': this.apiKey,
                'X-BFX-PAYLOAD': this.decode(payload),
                'X-BFX-SIGNATURE': signature
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors(code, reason, url, method, headers, body) {
        if (code == 400) {
            if (body[0] == "{") {
                let response = JSON.parse(body);
                let message = response['message'];
                if (message.indexOf('Key price should be a decimal number') >= 0) {
                    throw new InvalidOrder(this.id + ' ' + message);
                } else if (message.indexOf('Invalid order: not enough exchange balance') >= 0) {
                    throw new InsufficientFunds(this.id + ' ' + message);
                } else if (message.indexOf('Invalid order') >= 0) {
                    throw new InvalidOrder(this.id + ' ' + message);
                } else if (message.indexOf('Order could not be cancelled.') >= 0) {
                    throw new OrderNotFound(this.id + ' ' + message);
                }
            }
            throw new ExchangeError(this.id + ' ' + body);
        }
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this17 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this17.fetch2(path, api, method, params, headers, body);
            if ('message' in response) {
                throw new ExchangeError(_this17.id + ' ' + _this17.json(response));
            }
            return response;
        })();
    }
};