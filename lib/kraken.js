"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeNotAvailable, ExchangeError, OrderNotFound, DDoSProtection, InvalidNonce, InsufficientFunds, CancelPending, InvalidOrder } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class kraken extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'kraken',
            'name': 'Kraken',
            'countries': 'US',
            'version': '0',
            'rateLimit': 3000,
            'hasCORS': false,
            // obsolete metainfo interface
            'hasFetchTickers': true,
            'hasFetchOHLCV': true,
            'hasFetchOrder': true,
            'hasFetchOpenOrders': true,
            'hasFetchClosedOrders': true,
            'hasFetchMyTrades': true,
            'hasWithdraw': true,
            'hasFetchCurrencies': true,
            // new metainfo interface
            'has': {
                'fetchCurrencies': true,
                'fetchTickers': true,
                'fetchOHLCV': true,
                'fetchOrder': true,
                'fetchOpenOrders': true,
                'fetchClosedOrders': true,
                'fetchMyTrades': true,
                'withdraw': true
            },
            'marketsByAltname': {},
            'timeframes': {
                '1m': '1',
                '5m': '5',
                '15m': '15',
                '30m': '30',
                '1h': '60',
                '4h': '240',
                '1d': '1440',
                '1w': '10080',
                '2w': '21600'
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766599-22709304-5ede-11e7-9de1-9f33732e1509.jpg',
                'api': 'https://api.kraken.com',
                'www': 'https://www.kraken.com',
                'doc': ['https://www.kraken.com/en-us/help/api', 'https://github.com/nothingisdead/npm-kraken-api'],
                'fees': ['https://www.kraken.com/en-us/help/fees', 'https://support.kraken.com/hc/en-us/articles/201396777-What-are-the-deposit-fees-', 'https://support.kraken.com/hc/en-us/articles/201893608-What-are-the-withdrawal-fees-']
            },
            'fees': {
                'trading': {
                    'tierBased': true,
                    'percentage': true,
                    'taker': 0.26 / 100,
                    'maker': 0.16 / 100,
                    'tiers': {
                        'taker': [[0, 0.26 / 100], [50000, 0.24 / 100], [100000, 0.22 / 100], [250000, 0.2 / 100], [500000, 0.18 / 100], [1000000, 0.16 / 100], [2500000, 0.14 / 100], [5000000, 0.12 / 100], [10000000, 0.1 / 100]],
                        'maker': [[0, 0.16 / 100], [50000, 0.14 / 100], [100000, 0.12 / 100], [250000, 0.10 / 100], [500000, 0.8 / 100], [1000000, 0.6 / 100], [2500000, 0.4 / 100], [5000000, 0.2 / 100], [10000000, 0.0 / 100]]
                    }
                },
                'funding': {
                    'tierBased': false,
                    'percentage': false,
                    'withdraw': {
                        'BTC': 0.001,
                        'ETH': 0.005,
                        'XRP': 0.02,
                        'XLM': 0.00002,
                        'LTC': 0.02,
                        'DOGE': 2,
                        'ZEC': 0.00010,
                        'ICN': 0.02,
                        'REP': 0.01,
                        'ETC': 0.005,
                        'MLN': 0.003,
                        'XMR': 0.05,
                        'DASH': 0.005,
                        'GNO': 0.01,
                        'EOS': 0.5,
                        'BCH': 0.001,
                        'USD': 5, // if domestic wire
                        'EUR': 5, // if domestic wire
                        'CAD': 10, // CAD EFT Withdrawal
                        'JPY': 300 // if domestic wire
                    },
                    'deposit': {
                        'BTC': 0,
                        'ETH': 0,
                        'XRP': 0,
                        'XLM': 0,
                        'LTC': 0,
                        'DOGE': 0,
                        'ZEC': 0,
                        'ICN': 0,
                        'REP': 0,
                        'ETC': 0,
                        'MLN': 0,
                        'XMR': 0,
                        'DASH': 0,
                        'GNO': 0,
                        'EOS': 0,
                        'BCH': 0,
                        'USD': 5, // if domestic wire
                        'EUR': 0, // free deposit if EUR SEPA Deposit
                        'CAD': 5, // if domestic wire
                        'JPY': 0 // Domestic Deposit (Free, ¥5,000 deposit minimum)
                    }
                }
            },
            'api': {
                'public': {
                    'get': ['Assets', 'AssetPairs', 'Depth', 'OHLC', 'Spread', 'Ticker', 'Time', 'Trades']
                },
                'private': {
                    'post': ['AddOrder', 'Balance', 'CancelOrder', 'ClosedOrders', 'DepositAddresses', 'DepositMethods', 'DepositStatus', 'Ledgers', 'OpenOrders', 'OpenPositions', 'QueryLedgers', 'QueryOrders', 'QueryTrades', 'TradeBalance', 'TradesHistory', 'TradeVolume', 'Withdraw', 'WithdrawCancel', 'WithdrawInfo', 'WithdrawStatus']
                }
            }
        });
    }

    costToPrecision(symbol, cost) {
        return this.truncate(parseFloat(cost), this.markets[symbol]['precision']['price']);
    }

    feeToPrecision(symbol, fee) {
        return this.truncate(parseFloat(fee), this.markets[symbol]['precision']['amount']);
    }

    handleErrors(code, reason, url, method, headers, body) {
        if (body.indexOf('Invalid nonce') >= 0) throw new InvalidNonce(this.id + ' ' + body);
        if (body.indexOf('Insufficient funds') >= 0) throw new InsufficientFunds(this.id + ' ' + body);
        if (body.indexOf('Cancel pending') >= 0) throw new CancelPending(this.id + ' ' + body);
        if (body.indexOf('Invalid arguments:volume') >= 0) throw new InvalidOrder(this.id + ' ' + body);
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.publicGetAssetPairs();
            let keys = Object.keys(markets['result']);
            let result = [];
            for (let i = 0; i < keys.length; i++) {
                let id = keys[i];
                let market = markets['result'][id];
                let base = market['base'];
                let quote = market['quote'];
                if (base[0] == 'X' || base[0] == 'Z') base = base.slice(1);
                if (quote[0] == 'X' || quote[0] == 'Z') quote = quote.slice(1);
                base = _this.commonCurrencyCode(base);
                quote = _this.commonCurrencyCode(quote);
                let darkpool = id.indexOf('.d') >= 0;
                let symbol = darkpool ? market['altname'] : base + '/' + quote;
                let maker = undefined;
                if ('fees_maker' in market) {
                    maker = parseFloat(market['fees_maker'][0][1]) / 100;
                }
                let precision = {
                    'amount': market['lot_decimals'],
                    'price': market['pair_decimals']
                };
                let lot = Math.pow(10, -precision['amount']);
                result.push({
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'darkpool': darkpool,
                    'info': market,
                    'altname': market['altname'],
                    'maker': maker,
                    'taker': parseFloat(market['fees'][0][1]) / 100,
                    'lot': lot,
                    'active': true,
                    'precision': precision,
                    'limits': {
                        'amount': {
                            'min': lot,
                            'max': Math.pow(10, precision['amount'])
                        },
                        'price': {
                            'min': Math.pow(10, -precision['price']),
                            'max': undefined
                        },
                        'cost': {
                            'min': 0,
                            'max': undefined
                        }
                    }
                });
            }
            result = _this.appendInactiveMarkets(result);
            _this.marketsByAltname = _this.indexBy(result, 'altname');
            return result;
        })();
    }

    appendInactiveMarkets(result = []) {
        let precision = { 'amount': 8, 'price': 8 };
        let costLimits = { 'min': 0, 'max': undefined };
        let priceLimits = { 'min': Math.pow(10, -precision['price']), 'max': undefined };
        let amountLimits = { 'min': Math.pow(10, -precision['amount']), 'max': Math.pow(10, precision['amount']) };
        let limits = { 'amount': amountLimits, 'price': priceLimits, 'cost': costLimits };
        let defaults = {
            'darkpool': false,
            'info': undefined,
            'maker': undefined,
            'taker': undefined,
            'lot': amountLimits['min'],
            'active': false,
            'precision': precision,
            'limits': limits
        };
        let markets = [{ 'id': 'XXLMZEUR', 'symbol': 'XLM/EUR', 'base': 'XLM', 'quote': 'EUR', 'altname': 'XLMEUR' }];
        for (let i = 0; i < markets.length; i++) {
            result.push(this.extend(defaults, markets[i]));
        }
        return result;
    }

    fetchCurrencies(params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this2.publicGetAssets(params);
            let currencies = response['result'];
            let ids = Object.keys(currencies);
            let result = {};
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let currency = currencies[id];
                // todo: will need to rethink the fees
                // to add support for multiple withdrawal/deposit methods and
                // differentiated fees for each particular method
                let code = _this2.commonCurrencyCode(currency['altname']);
                let precision = currency['decimals'];
                result[code] = {
                    'id': id,
                    'code': code,
                    'info': currency,
                    'name': code,
                    'active': true,
                    'status': 'ok',
                    'fee': undefined,
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
                            'min': undefined,
                            'max': Math.pow(10, precision)
                        }
                    }
                };
            }
            return result;
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let darkpool = symbol.indexOf('.d') >= 0;
            if (darkpool) throw new ExchangeError(_this3.id + ' does not provide an order book for darkpool symbol ' + symbol);
            let market = _this3.market(symbol);
            let response = yield _this3.publicGetDepth(_this3.extend({
                'pair': market['id']
            }, params));
            let orderbook = response['result'][market['id']];
            return _this3.parseOrderBook(orderbook);
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = this.milliseconds();
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        let baseVolume = parseFloat(ticker['v'][1]);
        let vwap = parseFloat(ticker['p'][1]);
        let quoteVolume = baseVolume * vwap;
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': parseFloat(ticker['h'][1]),
            'low': parseFloat(ticker['l'][1]),
            'bid': parseFloat(ticker['b'][0]),
            'ask': parseFloat(ticker['a'][0]),
            'vwap': vwap,
            'open': parseFloat(ticker['o']),
            'close': undefined,
            'first': undefined,
            'last': parseFloat(ticker['c'][0]),
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let pairs = [];
            for (let s = 0; s < _this4.symbols.length; s++) {
                let symbol = _this4.symbols[s];
                let market = _this4.markets[symbol];
                if (market['active']) if (!market['darkpool']) pairs.push(market['id']);
            }
            let filter = pairs.join(',');
            let response = yield _this4.publicGetTicker(_this4.extend({
                'pair': filter
            }, params));
            let tickers = response['result'];
            let ids = Object.keys(tickers);
            let result = {};
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let market = _this4.markets_by_id[id];
                let symbol = market['symbol'];
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
            let darkpool = symbol.indexOf('.d') >= 0;
            if (darkpool) throw new ExchangeError(_this5.id + ' does not provide a ticker for darkpool symbol ' + symbol);
            let market = _this5.market(symbol);
            let response = yield _this5.publicGetTicker(_this5.extend({
                'pair': market['id']
            }, params));
            let ticker = response['result'][market['id']];
            return _this5.parseTicker(ticker, market);
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '1m', since = undefined, limit = undefined) {
        return [ohlcv[0] * 1000, parseFloat(ohlcv[1]), parseFloat(ohlcv[2]), parseFloat(ohlcv[3]), parseFloat(ohlcv[4]), parseFloat(ohlcv[6])];
    }

    fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let request = {
                'pair': market['id'],
                'interval': _this6.timeframes[timeframe]
            };
            if (since) request['since'] = parseInt(since / 1000);
            let response = yield _this6.publicGetOHLC(_this6.extend(request, params));
            let ohlcvs = response['result'][market['id']];
            return _this6.parseOHLCVs(ohlcvs, market, timeframe, since, limit);
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestamp = undefined;
        let side = undefined;
        let type = undefined;
        let price = undefined;
        let amount = undefined;
        let id = undefined;
        let order = undefined;
        let fee = undefined;
        if (!market) market = this.findMarketByAltnameOrId(trade['pair']);
        if ('ordertxid' in trade) {
            order = trade['ordertxid'];
            id = trade['id'];
            timestamp = parseInt(trade['time'] * 1000);
            side = trade['type'];
            type = trade['ordertype'];
            price = parseFloat(trade['price']);
            amount = parseFloat(trade['vol']);
            if ('fee' in trade) {
                let currency = undefined;
                if (market) currency = market['quote'];
                fee = {
                    'cost': parseFloat(trade['fee']),
                    'currency': currency
                };
            }
        } else {
            timestamp = parseInt(trade[2] * 1000);
            side = trade[3] == 's' ? 'sell' : 'buy';
            type = trade[4] == 'l' ? 'limit' : 'market';
            price = parseFloat(trade[0]);
            amount = parseFloat(trade[1]);
        }
        let symbol = market ? market['symbol'] : undefined;
        return {
            'id': id,
            'order': order,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'type': type,
            'side': side,
            'price': price,
            'amount': amount,
            'fee': fee
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            let market = _this7.market(symbol);
            let id = market['id'];
            let response = yield _this7.publicGetTrades(_this7.extend({
                'pair': id
            }, params));
            let trades = response['result'][id];
            return _this7.parseTrades(trades, market, since, limit);
        })();
    }

    fetchBalance(params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            let response = yield _this8.privatePostBalance();
            let balances = response['result'];
            let result = { 'info': balances };
            let currencies = Object.keys(balances);
            for (let c = 0; c < currencies.length; c++) {
                let currency = currencies[c];
                let code = currency;
                // X-ISO4217-A3 standard currency codes
                if (code[0] == 'X') {
                    code = code.slice(1);
                } else if (code[0] == 'Z') {
                    code = code.slice(1);
                }
                code = _this8.commonCurrencyCode(code);
                let balance = parseFloat(balances[currency]);
                let account = {
                    'free': balance,
                    'used': 0.0,
                    'total': balance
                };
                result[code] = account;
            }
            return _this8.parseBalance(result);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            yield _this9.loadMarkets();
            let market = _this9.market(symbol);
            let order = {
                'pair': market['id'],
                'type': side,
                'ordertype': type,
                'volume': _this9.amountToPrecision(symbol, amount)
            };
            if (type == 'limit') order['price'] = _this9.priceToPrecision(symbol, price);
            let response = yield _this9.privatePostAddOrder(_this9.extend(order, params));
            let length = response['result']['txid'].length;
            let id = length > 1 ? response['result']['txid'] : response['result']['txid'][0];
            return {
                'info': response,
                'id': id
            };
        })();
    }

    findMarketByAltnameOrId(id) {
        let result = undefined;
        if (id in this.marketsByAltname) {
            result = this.marketsByAltname[id];
        } else if (id in this.markets_by_id) {
            result = this.markets_by_id[id];
        }
        return result;
    }

    parseOrder(order, market = undefined) {
        let description = order['descr'];
        let side = description['type'];
        let type = description['ordertype'];
        let symbol = undefined;
        if (!market) market = this.findMarketByAltnameOrId(description['pair']);
        let timestamp = parseInt(order['opentm'] * 1000);
        let amount = parseFloat(order['vol']);
        let filled = parseFloat(order['vol_exec']);
        let remaining = amount - filled;
        let fee = undefined;
        let cost = this.safeFloat(order, 'cost');
        let price = this.safeFloat(description, 'price');
        if (!price) price = this.safeFloat(order, 'price');
        if (market) {
            symbol = market['symbol'];
            if ('fee' in order) {
                let flags = order['oflags'];
                let feeCost = this.safeFloat(order, 'fee');
                fee = {
                    'cost': feeCost,
                    'rate': undefined
                };
                if (flags.indexOf('fciq') >= 0) {
                    fee['currency'] = market['quote'];
                } else if (flags.indexOf('fcib') >= 0) {
                    fee['currency'] = market['base'];
                }
            }
        }
        return {
            'id': order['id'],
            'info': order,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'status': order['status'],
            'symbol': symbol,
            'type': type,
            'side': side,
            'price': price,
            'cost': cost,
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'fee': fee
            // 'trades': this.parseTrades (order['trades'], market),
        };
    }

    parseOrders(orders, market = undefined, since = undefined, limit = undefined) {
        let result = [];
        let ids = Object.keys(orders);
        for (let i = 0; i < ids.length; i++) {
            let id = ids[i];
            let order = this.extend({ 'id': id }, orders[id]);
            result.push(this.parseOrder(order, market));
        }
        return this.filterBySinceLimit(result, since, limit);
    }

    fetchOrder(id, symbol = undefined, params = {}) {
        var _this10 = this;

        return _asyncToGenerator(function* () {
            yield _this10.loadMarkets();
            let response = yield _this10.privatePostQueryOrders(_this10.extend({
                'trades': true, // whether or not to include trades in output (optional, default false)
                'txid': id // comma delimited list of transaction ids to query info about (20 maximum)
                // 'userref': 'optional', // restrict results to given user reference id (optional)
            }, params));
            let orders = response['result'];
            let order = _this10.parseOrder(_this10.extend({ 'id': id }, orders[id]));
            return _this10.extend({ 'info': response }, order);
        })();
    }

    fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this11 = this;

        return _asyncToGenerator(function* () {
            yield _this11.loadMarkets();
            let request = {
                // 'type': 'all', // any position, closed position, closing position, no position
                // 'trades': false, // whether or not to include trades related to position in output
                // 'start': 1234567890, // starting unix timestamp or trade tx id of results (exclusive)
                // 'end': 1234567890, // ending unix timestamp or trade tx id of results (inclusive)
                // 'ofs' = result offset
            };
            if (since) request['start'] = parseInt(since / 1000);
            let response = yield _this11.privatePostTradesHistory(_this11.extend(request, params));
            let trades = response['result']['trades'];
            let ids = Object.keys(trades);
            for (let i = 0; i < ids.length; i++) {
                trades[ids[i]]['id'] = ids[i];
            }
            return _this11.parseTrades(trades, undefined, since, limit);
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this12 = this;

        return _asyncToGenerator(function* () {
            yield _this12.loadMarkets();
            let response = undefined;
            try {
                response = yield _this12.privatePostCancelOrder(_this12.extend({
                    'txid': id
                }, params));
            } catch (e) {
                if (_this12.last_http_response) if (_this12.last_http_response.indexOf('EOrder:Unknown order') >= 0) throw new OrderNotFound(_this12.id + ' cancelOrder() error ' + _this12.last_http_response);
                throw e;
            }
            return response;
        })();
    }

    fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this13 = this;

        return _asyncToGenerator(function* () {
            yield _this13.loadMarkets();
            let request = {};
            if (since) request['start'] = parseInt(since / 1000);
            let response = yield _this13.privatePostOpenOrders(_this13.extend(request, params));
            let orders = _this13.parseOrders(response['result']['open'], undefined, since, limit);
            return _this13.filterOrdersBySymbol(orders, symbol);
        })();
    }

    fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this14 = this;

        return _asyncToGenerator(function* () {
            yield _this14.loadMarkets();
            let request = {};
            if (since) request['start'] = parseInt(since / 1000);
            let response = yield _this14.privatePostClosedOrders(_this14.extend(request, params));
            let orders = _this14.parseOrders(response['result']['closed'], undefined, since, limit);
            return _this14.filterOrdersBySymbol(orders, symbol);
        })();
    }

    fetchDepositMethods(code = undefined, params = {}) {
        var _this15 = this;

        return _asyncToGenerator(function* () {
            yield _this15.loadMarkets();
            let request = {};
            if (code) {
                let currency = _this15.currency(code);
                request['asset'] = currency['id'];
            }
            let response = yield _this15.privatePostDepositMethods(_this15.extend(request, params));
            return response['result'];
        })();
    }

    createDepositAddress(currency, params = {}) {
        var _this16 = this;

        return _asyncToGenerator(function* () {
            let request = {
                'new': 'true'
            };
            let response = yield _this16.fetchDepositAddress(currency, _this16.extend(request, params));
            return {
                'currency': currency,
                'address': response['address'],
                'status': 'ok',
                'info': response
            };
        })();
    }

    fetchDepositAddress(code, params = {}) {
        var _this17 = this;

        return _asyncToGenerator(function* () {
            let method = _this17.safeValue(params, 'method');
            if (!method) throw new ExchangeError(_this17.id + ' fetchDepositAddress() requires an extra `method` parameter');
            yield _this17.loadMarkets();
            let currency = _this17.currency(code);
            let request = {
                'asset': currency['id'],
                'method': method,
                'new': 'false'
            };
            let response = yield _this17.privatePostDepositAddresses(_this17.extend(request, params));
            let result = response['result'];
            let numResults = result.length;
            if (numResults < 1) throw new ExchangeError(_this17.id + ' privatePostDepositAddresses() returned no addresses');
            let address = _this17.safeString(result[0], 'address');
            return {
                'currency': code,
                'address': address,
                'status': 'ok',
                'info': response
            };
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this18 = this;

        return _asyncToGenerator(function* () {
            if ('key' in params) {
                yield _this18.loadMarkets();
                let response = yield _this18.privatePostWithdraw(_this18.extend({
                    'asset': currency,
                    'amount': amount
                    // 'address': address, // they don't allow withdrawals to direct addresses
                }, params));
                return {
                    'info': response,
                    'id': response['result']
                };
            }
            throw new ExchangeError(_this18.id + " withdraw requires a 'key' parameter (withdrawal key name, as set up on your account)");
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = '/' + this.version + '/' + api + '/' + path;
        if (api == 'public') {
            if (Object.keys(params).length) url += '?' + this.urlencode(params);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            body = this.urlencode(this.extend({ 'nonce': nonce }, params));
            let auth = this.encode(nonce + body);
            let hash = this.hash(auth, 'sha256', 'binary');
            let binary = this.stringToBinary(this.encode(url));
            let binhash = this.binaryConcat(binary, hash);
            let secret = this.base64ToBinary(this.secret);
            let signature = this.hmac(binhash, secret, 'sha512', 'base64');
            headers = {
                'API-Key': this.apiKey,
                'API-Sign': this.decode(signature),
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        }
        url = this.urls['api'] + url;
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    nonce() {
        return this.milliseconds();
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this19 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this19.fetch2(path, api, method, params, headers, body);
            if ('error' in response) {
                let numErrors = response['error'].length;
                if (numErrors) {
                    for (let i = 0; i < response['error'].length; i++) {
                        if (response['error'][i] == 'EService:Unavailable') throw new ExchangeNotAvailable(_this19.id + ' ' + _this19.json(response));
                        if (response['error'][i] == 'EService:Busy') throw new DDoSProtection(_this19.id + ' ' + _this19.json(response));
                    }
                    throw new ExchangeError(_this19.id + ' ' + _this19.json(response));
                }
            }
            return response;
        })();
    }
};