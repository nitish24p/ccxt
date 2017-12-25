"use strict";

// ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const hitbtc = require('./hitbtc');
const { ExchangeError, OrderNotFound, InsufficientFunds } = require('./base/errors');

// ---------------------------------------------------------------------------

module.exports = class hitbtc2 extends hitbtc {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'hitbtc2',
            'name': 'HitBTC v2',
            'countries': 'HK', // Hong Kong
            'rateLimit': 1500,
            'version': '2',
            'hasCORS': true,
            // older metainfo interface
            'hasFetchOHLCV': true,
            'hasFetchTickers': true,
            'hasFetchOrder': true,
            'hasFetchOrders': false,
            'hasFetchOpenOrders': true,
            'hasFetchClosedOrders': true,
            'hasFetchMyTrades': true,
            'hasWithdraw': true,
            'hasFetchCurrencies': true,
            // new metainfo interface
            'has': {
                'fetchCurrencies': true,
                'fetchOHLCV': true,
                'fetchTickers': true,
                'fetchOrder': true,
                'fetchOrders': false,
                'fetchOpenOrders': true,
                'fetchClosedOrders': true,
                'fetchMyTrades': true,
                'withdraw': true
            },
            'timeframes': {
                '1m': 'M1',
                '3m': 'M3',
                '5m': 'M5',
                '15m': 'M15',
                '30m': 'M30', // default
                '1h': 'H1',
                '4h': 'H4',
                '1d': 'D1',
                '1w': 'D7',
                '1M': '1M'
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766555-8eaec20e-5edc-11e7-9c5b-6dc69fc42f5e.jpg',
                'api': 'https://api.hitbtc.com',
                'www': 'https://hitbtc.com',
                'doc': 'https://api.hitbtc.com'
            },
            'api': {
                'public': {
                    'get': ['symbol', // Available Currency Symbols
                    'symbol/{symbol}', // Get symbol info
                    'currency', // Available Currencies
                    'currency/{currency}', // Get currency info
                    'ticker', // Ticker list for all symbols
                    'ticker/{symbol}', // Ticker for symbol
                    'trades/{symbol}', // Trades
                    'orderbook/{symbol}', // Orderbook
                    'candles/{symbol}']
                },
                'private': {
                    'get': ['order', // List your current open orders
                    'order/{clientOrderId}', // Get a single order by clientOrderId
                    'trading/balance', // Get trading balance
                    'trading/fee/{symbol}', // Get trading fee rate
                    'history/trades', // Get historical trades
                    'history/order', // Get historical orders
                    'history/order/{id}/trades', // Get historical trades by specified order
                    'account/balance', // Get main acccount balance
                    'account/transactions', // Get account transactions
                    'account/transactions/{id}', // Get account transaction by id
                    'account/crypto/address/{currency}'],
                    'post': ['order', // Create new order
                    'account/crypto/withdraw', // Withdraw crypro
                    'account/crypto/address/{currency}', // Create new deposit crypro address
                    'account/transfer'],
                    'put': ['order/{clientOrderId}', // Create new order
                    'account/crypto/withdraw/{id}'],
                    'delete': ['order', // Cancel all open orders
                    'order/{clientOrderId}', // Cancel order
                    'account/crypto/withdraw/{id}'],
                    'patch': ['order/{clientOrderId}']
                }
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'maker': -0.01 / 100,
                    'taker': 0.1 / 100
                },
                'funding': {
                    'tierBased': false,
                    'percentage': false,
                    'withdraw': {
                        'BTC': 0.0007,
                        'ETH': 0.00958,
                        'BCH': 0.0018,
                        'USDT': 5,
                        'BTG': 0.0005,
                        'LTC': 0.003,
                        'ZEC': 0.0001,
                        'XMR': 0.09,
                        '1ST': 0.84,
                        'ADX': 5.7,
                        'AE': 6.7,
                        'AEON': 0.01006,
                        'AIR': 565,
                        'AMP': 9,
                        'ANT': 6.7,
                        'ARDR': 2,
                        'ARN': 18.5,
                        'ART': 26,
                        'ATB': 0.0004,
                        'ATL': 27,
                        'ATM': 504,
                        'ATS': 860,
                        'AVT': 1.9,
                        'BAS': 113,
                        'BCN': 0.1,
                        'BET': 124,
                        'BKB': 46,
                        'BMC': 32,
                        'BMT': 100,
                        'BNT': 2.57,
                        'BQX': 4.7,
                        'BTM': 40,
                        'BTX': 0.04,
                        'BUS': 0.004,
                        'CCT': 115,
                        'CDT': 100,
                        'CDX': 30,
                        'CFI': 61,
                        'CLD': 0.88,
                        'CND': 574,
                        'CNX': 0.04,
                        'COSS': 65,
                        'CSNO': 16,
                        'CTR': 15,
                        'CTX': 146,
                        'CVC': 8.46,
                        'DBIX': 0.0168,
                        'DCN': 120000,
                        'DCT': 0.02,
                        'DDF': 342,
                        'DENT': 6240,
                        'DGB': 0.4,
                        'DGD': 0.01,
                        'DICE': 0.32,
                        'DLT': 0.26,
                        'DNT': 0.21,
                        'DOGE': 2,
                        'DOV': 34,
                        'DRPU': 24,
                        'DRT': 240,
                        'DSH': 0.017,
                        'EBET': 84,
                        'EBTC': 20,
                        'EBTCOLD': 6.6,
                        'ECAT': 14,
                        'EDG': 2,
                        'EDO': 2.9,
                        'ELE': 0.00172,
                        'ELM': 0.004,
                        'EMC': 0.03,
                        'EMGO': 14,
                        'ENJ': 163,
                        'EOS': 1.5,
                        'ERO': 34,
                        'ETBS': 15,
                        'ETC': 0.002,
                        'ETP': 0.004,
                        'EVX': 5.4,
                        'EXN': 456,
                        'FRD': 65,
                        'FUEL': 123.00105,
                        'FUN': 202.9598309,
                        'FYN': 1.849,
                        'FYP': 66.13,
                        'GNO': 0.0034,
                        'GUP': 4,
                        'GVT': 1.2,
                        'HAC': 144,
                        'HDG': 7,
                        'HGT': 1082,
                        'HPC': 0.4,
                        'HVN': 120,
                        'ICN': 0.55,
                        'ICO': 34,
                        'ICOS': 0.35,
                        'IND': 76,
                        'INDI': 5913,
                        'ITS': 15.0012,
                        'IXT': 11,
                        'KBR': 143,
                        'KICK': 112,
                        'LA': 41,
                        'LAT': 1.44,
                        'LIFE': 13000,
                        'LRC': 27,
                        'LSK': 0.3,
                        'LUN': 0.34,
                        'MAID': 5,
                        'MANA': 143,
                        'MCAP': 5.44,
                        'MIPS': 43,
                        'MNE': 1.33,
                        'MSP': 121,
                        'MTH': 92,
                        'MYB': 3.9,
                        'NDC': 165,
                        'NEBL': 0.04,
                        'NET': 3.96,
                        'NTO': 998,
                        'NXC': 13.39,
                        'NXT': 3,
                        'OAX': 15,
                        'ODN': 0.004,
                        'OMG': 2,
                        'OPT': 335,
                        'ORME': 2.8,
                        'OTN': 0.57,
                        'PAY': 3.1,
                        'PIX': 96,
                        'PLBT': 0.33,
                        'PLR': 114,
                        'PLU': 0.87,
                        'POE': 784,
                        'POLL': 3.5,
                        'PPT': 2,
                        'PRE': 32,
                        'PRG': 39,
                        'PRO': 41,
                        'PRS': 60,
                        'PTOY': 0.5,
                        'QAU': 63,
                        'QCN': 0.03,
                        'QTUM': 0.04,
                        'QVT': 64,
                        'REP': 0.02,
                        'RKC': 15,
                        'RVT': 14,
                        'SAN': 2.24,
                        'SBD': 0.03,
                        'SCL': 2.6,
                        'SISA': 1640,
                        'SKIN': 407,
                        'SMART': 0.4,
                        'SMS': 0.0375,
                        'SNC': 36,
                        'SNGLS': 4,
                        'SNM': 48,
                        'SNT': 233,
                        'STEEM': 0.01,
                        'STRAT': 0.01,
                        'STU': 14,
                        'STX': 11,
                        'SUB': 17,
                        'SUR': 3,
                        'SWT': 0.51,
                        'TAAS': 0.91,
                        'TBT': 2.37,
                        'TFL': 15,
                        'TIME': 0.03,
                        'TIX': 7.1,
                        'TKN': 1,
                        'TKR': 84,
                        'TNT': 90,
                        'TRST': 1.6,
                        'TRX': 1395,
                        'UET': 480,
                        'UGT': 15,
                        'VEN': 14,
                        'VERI': 0.037,
                        'VIB': 50,
                        'VIBE': 145,
                        'VOISE': 618,
                        'WEALTH': 0.0168,
                        'WINGS': 2.4,
                        'WTC': 0.75,
                        'XAUR': 3.23,
                        'XDN': 0.01,
                        'XEM': 15,
                        'XUC': 0.9,
                        'YOYOW': 140,
                        'ZAP': 24,
                        'ZRX': 23,
                        'ZSC': 191
                    },
                    'deposit': {
                        'BTC': 0,
                        'ETH': 0,
                        'BCH': 0,
                        'USDT': 0,
                        'BTG': 0,
                        'LTC': 0,
                        'ZEC': 0,
                        'XMR': 0,
                        '1ST': 0,
                        'ADX': 0,
                        'AE': 0,
                        'AEON': 0,
                        'AIR': 0,
                        'AMP': 0,
                        'ANT': 0,
                        'ARDR': 0,
                        'ARN': 0,
                        'ART': 0,
                        'ATB': 0,
                        'ATL': 0,
                        'ATM': 0,
                        'ATS': 0,
                        'AVT': 0,
                        'BAS': 0,
                        'BCN': 0,
                        'BET': 0,
                        'BKB': 0,
                        'BMC': 0,
                        'BMT': 0,
                        'BNT': 0,
                        'BQX': 0,
                        'BTM': 0,
                        'BTX': 0,
                        'BUS': 0,
                        'CCT': 0,
                        'CDT': 0,
                        'CDX': 0,
                        'CFI': 0,
                        'CLD': 0,
                        'CND': 0,
                        'CNX': 0,
                        'COSS': 0,
                        'CSNO': 0,
                        'CTR': 0,
                        'CTX': 0,
                        'CVC': 0,
                        'DBIX': 0,
                        'DCN': 0,
                        'DCT': 0,
                        'DDF': 0,
                        'DENT': 0,
                        'DGB': 0,
                        'DGD': 0,
                        'DICE': 0,
                        'DLT': 0,
                        'DNT': 0,
                        'DOGE': 0,
                        'DOV': 0,
                        'DRPU': 0,
                        'DRT': 0,
                        'DSH': 0,
                        'EBET': 0,
                        'EBTC': 0,
                        'EBTCOLD': 0,
                        'ECAT': 0,
                        'EDG': 0,
                        'EDO': 0,
                        'ELE': 0,
                        'ELM': 0,
                        'EMC': 0,
                        'EMGO': 0,
                        'ENJ': 0,
                        'EOS': 0,
                        'ERO': 0,
                        'ETBS': 0,
                        'ETC': 0,
                        'ETP': 0,
                        'EVX': 0,
                        'EXN': 0,
                        'FRD': 0,
                        'FUEL': 0,
                        'FUN': 0,
                        'FYN': 0,
                        'FYP': 0,
                        'GNO': 0,
                        'GUP': 0,
                        'GVT': 0,
                        'HAC': 0,
                        'HDG': 0,
                        'HGT': 0,
                        'HPC': 0,
                        'HVN': 0,
                        'ICN': 0,
                        'ICO': 0,
                        'ICOS': 0,
                        'IND': 0,
                        'INDI': 0,
                        'ITS': 0,
                        'IXT': 0,
                        'KBR': 0,
                        'KICK': 0,
                        'LA': 0,
                        'LAT': 0,
                        'LIFE': 0,
                        'LRC': 0,
                        'LSK': 0,
                        'LUN': 0,
                        'MAID': 0,
                        'MANA': 0,
                        'MCAP': 0,
                        'MIPS': 0,
                        'MNE': 0,
                        'MSP': 0,
                        'MTH': 0,
                        'MYB': 0,
                        'NDC': 0,
                        'NEBL': 0,
                        'NET': 0,
                        'NTO': 0,
                        'NXC': 0,
                        'NXT': 0,
                        'OAX': 0,
                        'ODN': 0,
                        'OMG': 0,
                        'OPT': 0,
                        'ORME': 0,
                        'OTN': 0,
                        'PAY': 0,
                        'PIX': 0,
                        'PLBT': 0,
                        'PLR': 0,
                        'PLU': 0,
                        'POE': 0,
                        'POLL': 0,
                        'PPT': 0,
                        'PRE': 0,
                        'PRG': 0,
                        'PRO': 0,
                        'PRS': 0,
                        'PTOY': 0,
                        'QAU': 0,
                        'QCN': 0,
                        'QTUM': 0,
                        'QVT': 0,
                        'REP': 0,
                        'RKC': 0,
                        'RVT': 0,
                        'SAN': 0,
                        'SBD': 0,
                        'SCL': 0,
                        'SISA': 0,
                        'SKIN': 0,
                        'SMART': 0,
                        'SMS': 0,
                        'SNC': 0,
                        'SNGLS': 0,
                        'SNM': 0,
                        'SNT': 0,
                        'STEEM': 0,
                        'STRAT': 0,
                        'STU': 0,
                        'STX': 0,
                        'SUB': 0,
                        'SUR': 0,
                        'SWT': 0,
                        'TAAS': 0,
                        'TBT': 0,
                        'TFL': 0,
                        'TIME': 0,
                        'TIX': 0,
                        'TKN': 0,
                        'TKR': 0,
                        'TNT': 0,
                        'TRST': 0,
                        'TRX': 0,
                        'UET': 0,
                        'UGT': 0,
                        'VEN': 0,
                        'VERI': 0,
                        'VIB': 0,
                        'VIBE': 0,
                        'VOISE': 0,
                        'WEALTH': 0,
                        'WINGS': 0,
                        'WTC': 0,
                        'XAUR': 0,
                        'XDN': 0,
                        'XEM': 0,
                        'XUC': 0,
                        'YOYOW': 0,
                        'ZAP': 0,
                        'ZRX': 0,
                        'ZSC': 0
                    }
                }
            }
        });
    }

    commonCurrencyCode(currency) {
        if (currency == 'CAT') return 'BitClave';
        return currency;
    }

    currencyId(currency) {
        if (currency == 'BitClave') return 'CAT';
        return currency;
    }

    feeToPrecision(symbol, fee) {
        return this.truncate(fee, 8);
    }

    fetchMarkets() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let markets = yield _this.publicGetSymbol();
            let result = [];
            for (let i = 0; i < markets.length; i++) {
                let market = markets[i];
                let id = market['id'];
                let base = market['baseCurrency'];
                let quote = market['quoteCurrency'];
                base = _this.commonCurrencyCode(base);
                quote = _this.commonCurrencyCode(quote);
                let symbol = base + '/' + quote;
                let lot = parseFloat(market['quantityIncrement']);
                let step = parseFloat(market['tickSize']);
                let precision = {
                    'price': _this.precisionFromString(market['tickSize']),
                    'amount': _this.precisionFromString(market['quantityIncrement'])
                };
                let taker = parseFloat(market['takeLiquidityRate']);
                let maker = parseFloat(market['provideLiquidityRate']);
                result.push(_this.extend(_this.fees['trading'], {
                    'info': market,
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'active': true,
                    'lot': lot,
                    'step': step,
                    'taker': taker,
                    'maker': maker,
                    'precision': precision,
                    'limits': {
                        'amount': {
                            'min': lot,
                            'max': undefined
                        },
                        'price': {
                            'min': step,
                            'max': undefined
                        },
                        'cost': {
                            'min': lot * step,
                            'max': undefined
                        }
                    }
                }));
            }
            return result;
        })();
    }

    fetchCurrencies(params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let currencies = yield _this2.publicGetCurrency(params);
            let result = {};
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let id = currency['id'];
                // todo: will need to rethink the fees
                // to add support for multiple withdrawal/deposit methods and
                // differentiated fees for each particular method
                let precision = 8; // default precision, todo: fix "magic constants"
                let code = _this2.commonCurrencyCode(id);
                let payin = currency['payinEnabled'];
                let payout = currency['payoutEnabled'];
                let transfer = currency['transferEnabled'];
                let active = payin && payout && transfer;
                let status = 'ok';
                if ('disabled' in currency) if (currency['disabled']) status = 'disabled';
                let type = currency['crypto'] ? 'crypto' : 'fiat';
                result[code] = {
                    'id': id,
                    'code': code,
                    'type': type,
                    'payin': payin,
                    'payout': payout,
                    'transfer': transfer,
                    'info': currency,
                    'name': currency['fullName'],
                    'active': active,
                    'status': status,
                    'fee': undefined, // todo: redesign
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

    fetchBalance(params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this3.loadMarkets();
            let type = _this3.safeString(params, 'type', 'trading');
            let method = 'privateGet' + _this3.capitalize(type) + 'Balance';
            let balances = yield _this3[method]();
            let result = { 'info': balances };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let code = balance['currency'];
                let currency = _this3.commonCurrencyCode(code);
                let account = {
                    'free': parseFloat(balance['available']),
                    'used': parseFloat(balance['reserved']),
                    'total': 0.0
                };
                account['total'] = _this3.sum(account['free'], account['used']);
                result[currency] = account;
            }
            return _this3.parseBalance(result);
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '1d', since = undefined, limit = undefined) {
        let timestamp = this.parse8601(ohlcv['timestamp']);
        return [timestamp, parseFloat(ohlcv['open']), parseFloat(ohlcv['max']), parseFloat(ohlcv['min']), parseFloat(ohlcv['close']), parseFloat(ohlcv['volumeQuote'])];
    }

    fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let request = {
                'symbol': market['id'],
                'period': _this4.timeframes[timeframe]
            };
            if (limit) request['limit'] = limit;
            let response = yield _this4.publicGetCandlesSymbol(_this4.extend(request, params));
            return _this4.parseOHLCVs(response, market, timeframe, since, limit);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this5.loadMarkets();
            let orderbook = yield _this5.publicGetOrderbookSymbol(_this5.extend({
                'symbol': _this5.marketId(symbol)
            }, params));
            return _this5.parseOrderBook(orderbook, undefined, 'bid', 'ask', 'price', 'size');
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = this.parse8601(ticker['timestamp']);
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': this.safeFloat(ticker, 'high'),
            'low': this.safeFloat(ticker, 'low'),
            'bid': this.safeFloat(ticker, 'bid'),
            'ask': this.safeFloat(ticker, 'ask'),
            'vwap': undefined,
            'open': this.safeFloat(ticker, 'open'),
            'close': this.safeFloat(ticker, 'close'),
            'first': undefined,
            'last': this.safeFloat(ticker, 'last'),
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': this.safeFloat(ticker, 'volume'),
            'quoteVolume': this.safeFloat(ticker, 'volumeQuote'),
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this6.loadMarkets();
            let tickers = yield _this6.publicGetTicker(params);
            let result = {};
            for (let i = 0; i < tickers.length; i++) {
                let ticker = tickers[i];
                let id = ticker['symbol'];
                let market = _this6.markets_by_id[id];
                let symbol = market['symbol'];
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
            let ticker = yield _this7.publicGetTickerSymbol(_this7.extend({
                'symbol': market['id']
            }, params));
            if ('message' in ticker) throw new ExchangeError(_this7.id + ' ' + ticker['message']);
            return _this7.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestamp = this.parse8601(trade['timestamp']);
        let symbol = undefined;
        if (market) {
            symbol = market['symbol'];
        } else {
            let id = trade['symbol'];
            if (id in this.markets_by_id) {
                market = this.markets_by_id[id];
                symbol = market['symbol'];
            } else {
                symbol = id;
            }
        }
        let fee = undefined;
        if ('fee' in trade) {
            let currency = market ? market['quote'] : undefined;
            fee = {
                'cost': parseFloat(trade['fee']),
                'currency': currency
            };
        }
        let orderId = undefined;
        if ('clientOrderId' in trade) orderId = trade['clientOrderId'];
        let price = parseFloat(trade['price']);
        let amount = parseFloat(trade['quantity']);
        let cost = price * amount;
        return {
            'info': trade,
            'id': trade['id'].toString(),
            'order': orderId,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'type': undefined,
            'side': trade['side'],
            'price': price,
            'amount': amount,
            'cost': cost,
            'fee': fee
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this8.loadMarkets();
            let market = _this8.market(symbol);
            let response = yield _this8.publicGetTradesSymbol(_this8.extend({
                'symbol': market['id']
            }, params));
            return _this8.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this9.loadMarkets();
            let market = _this9.market(symbol);
            // their max accepted length is 32 characters
            let uuid = _this9.uuid();
            let parts = uuid.split('-');
            let clientOrderId = parts.join('');
            clientOrderId = clientOrderId.slice(0, 32);
            amount = parseFloat(amount);
            let request = {
                'clientOrderId': clientOrderId,
                'symbol': market['id'],
                'side': side,
                'quantity': _this9.amountToPrecision(symbol, amount),
                'type': type
            };
            if (type == 'limit') {
                request['price'] = _this9.priceToPrecision(symbol, price);
            } else {
                request['timeInForce'] = 'FOK';
            }
            let response = yield _this9.privatePostOrder(_this9.extend(request, params));
            let order = _this9.parseOrder(response);
            let id = order['id'];
            _this9.orders[id] = order;
            return order;
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this10 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this10.loadMarkets();
            return yield _this10.privateDeleteOrderClientOrderId(_this10.extend({
                'clientOrderId': id
            }, params));
        })();
    }

    parseOrder(order, market = undefined) {
        let created = undefined;
        if ('createdAt' in order) created = this.parse8601(order['createdAt']);
        let updated = undefined;
        if ('updatedAt' in order) updated = this.parse8601(order['updatedAt']);
        if (!market) market = this.markets_by_id[order['symbol']];
        let symbol = market['symbol'];
        let amount = this.safeFloat(order, 'quantity');
        let filled = this.safeFloat(order, 'cumQuantity');
        let status = order['status'];
        if (status == 'new') {
            status = 'open';
        } else if (status == 'suspended') {
            status = 'open';
        } else if (status == 'partiallyFilled') {
            status = 'open';
        } else if (status == 'filled') {
            status = 'closed';
        }
        let id = order['clientOrderId'].toString();
        let price = this.safeFloat(order, 'price');
        if (typeof price == 'undefined') {
            if (id in this.orders) price = this.orders[id]['price'];
        }
        let remaining = undefined;
        let cost = undefined;
        if (typeof amount != 'undefined') {
            if (typeof filled != 'undefined') {
                remaining = amount - filled;
                if (typeof price != 'undefined') {
                    cost = filled * price;
                }
            }
        }
        return {
            'id': id,
            'timestamp': created,
            'datetime': this.iso8601(created),
            'created': created,
            'updated': updated,
            'status': status,
            'symbol': symbol,
            'type': order['type'],
            'side': order['side'],
            'price': price,
            'amount': amount,
            'cost': cost,
            'filled': filled,
            'remaining': remaining,
            'fee': undefined,
            'info': order
        };
    }

    fetchOrder(id, symbol = undefined, params = {}) {
        var _this11 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this11.loadMarkets();
            let response = yield _this11.privateGetHistoryOrder(_this11.extend({
                'clientOrderId': id
            }, params));
            let numOrders = response.length;
            if (numOrders > 0) return _this11.parseOrder(response[0]);
            throw new OrderNotFound(_this11.id + ' order ' + id + ' not found');
        })();
    }

    fetchActiveOrder(id, symbol = undefined, params = {}) {
        var _this12 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this12.loadMarkets();
            let response = yield _this12.privateGetOrderClientOrderId(_this12.extend({
                'clientOrderId': id
            }, params));
            return _this12.parseOrder(response);
        })();
    }

    fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this13 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this13.loadMarkets();
            let market = undefined;
            let request = {};
            if (symbol) {
                market = _this13.market(symbol);
                request['symbol'] = market['id'];
            }
            let response = yield _this13.privateGetOrder(_this13.extend(request, params));
            return _this13.parseOrders(response, market, since, limit);
        })();
    }

    fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this14 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this14.loadMarkets();
            let market = undefined;
            let request = {};
            if (symbol) {
                market = _this14.market(symbol);
                request['symbol'] = market['id'];
            }
            if (limit) request['limit'] = limit;
            if (since) {
                request['from'] = _this14.iso8601(since);
            }
            let response = yield _this14.privateGetHistoryOrder(_this14.extend(request, params));
            return _this14.parseOrders(response, market, since, limit);
        })();
    }

    fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this15 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this15.loadMarkets();
            let request = {
                // 'symbol': 'BTC/USD', // optional
                // 'sort': 'DESC', // or 'ASC'
                // 'by': 'timestamp', // or 'id'	String	timestamp by default, or id
                // 'from':	'Datetime or Number', // ISO 8601
                // 'till':	'Datetime or Number',
                // 'limit': 100,
                // 'offset': 0,
            };
            let market = undefined;
            if (symbol) {
                market = _this15.market(symbol);
                request['symbol'] = market['id'];
            }
            if (since) request['from'] = _this15.iso8601(since);
            if (limit) request['limit'] = limit;
            let response = yield _this15.privateGetHistoryTrades(_this15.extend(request, params));
            return _this15.parseTrades(response, market, since, limit);
        })();
    }

    createDepositAddress(currency, params = {}) {
        var _this16 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let currencyId = _this16.currencyId(currency);
            let response = yield _this16.privatePostAccountCryptoAddressCurrency({
                'currency': currencyId
            });
            let address = response['address'];
            return {
                'currency': currency,
                'address': address,
                'status': 'ok',
                'info': response
            };
        })();
    }

    fetchDepositAddress(currency, params = {}) {
        var _this17 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let currencyId = _this17.currencyId(currency);
            let response = yield _this17.privateGetAccountCryptoAddressCurrency({
                'currency': currencyId
            });
            let address = response['address'];
            return {
                'currency': currency,
                'address': address,
                'status': 'ok',
                'info': response
            };
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this18 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let currencyId = _this18.currencyId(currency);
            amount = parseFloat(amount);
            let response = yield _this18.privatePostAccountCryptoWithdraw(_this18.extend({
                'currency': currencyId,
                'amount': amount,
                'address': address
            }, params));
            return {
                'info': response,
                'id': response['id']
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = '/api' + '/' + this.version + '/';
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            url += api + '/' + this.implodeParams(path, params);
            if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            url += this.implodeParams(path, params);
            if (method == 'GET') {
                if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
            } else {
                if ((0, _keys2.default)(query).length) body = this.json(query);
            }
            let payload = this.encode(this.apiKey + ':' + this.secret);
            let auth = this.stringToBase64(payload);
            headers = {
                'Authorization': "Basic " + this.decode(auth),
                'Content-Type': 'application/json'
            };
        }
        url = this.urls['api'] + url;
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors(code, reason, url, method, headers, body) {
        if (code == 400) {
            if (body[0] == "{") {
                let response = JSON.parse(body);
                if ('error' in response) {
                    if ('message' in response['error']) {
                        let message = response['error']['message'];
                        if (message == 'Order not found') {
                            throw new OrderNotFound(this.id + ' order not found in active orders');
                        } else if (message == 'Insufficient funds') {
                            throw new InsufficientFunds(this.id + ' ' + message);
                        }
                    }
                }
            }
            throw new ExchangeError(this.id + ' ' + body);
        }
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this19 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this19.fetch2(path, api, method, params, headers, body);
            if ('error' in response) throw new ExchangeError(_this19.id + ' ' + _this19.json(response));
            return response;
        })();
    }
};