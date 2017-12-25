"use strict";

// ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var hitbtc = require('./hitbtc');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    OrderNotFound = _require.OrderNotFound,
    InsufficientFunds = _require.InsufficientFunds;

// ---------------------------------------------------------------------------

module.exports = function (_hitbtc) {
    _inherits(hitbtc2, _hitbtc);

    function hitbtc2() {
        _classCallCheck(this, hitbtc2);

        return _possibleConstructorReturn(this, (hitbtc2.__proto__ || Object.getPrototypeOf(hitbtc2)).apply(this, arguments));
    }

    _createClass(hitbtc2, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(hitbtc2.prototype.__proto__ || Object.getPrototypeOf(hitbtc2.prototype), 'describe', this).call(this), {
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
    }, {
        key: 'commonCurrencyCode',
        value: function commonCurrencyCode(currency) {
            if (currency == 'CAT') return 'BitClave';
            return currency;
        }
    }, {
        key: 'currencyId',
        value: function currencyId(currency) {
            if (currency == 'BitClave') return 'CAT';
            return currency;
        }
    }, {
        key: 'feeToPrecision',
        value: function feeToPrecision(symbol, fee) {
            return this.truncate(fee, 8);
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var markets, result, i, market, id, base, quote, symbol, lot, _step, precision, taker, maker;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetSymbol();

                            case 2:
                                markets = _context.sent;
                                result = [];

                                for (i = 0; i < markets.length; i++) {
                                    market = markets[i];
                                    id = market['id'];
                                    base = market['baseCurrency'];
                                    quote = market['quoteCurrency'];

                                    base = this.commonCurrencyCode(base);
                                    quote = this.commonCurrencyCode(quote);
                                    symbol = base + '/' + quote;
                                    lot = parseFloat(market['quantityIncrement']);
                                    _step = parseFloat(market['tickSize']);
                                    precision = {
                                        'price': this.precisionFromString(market['tickSize']),
                                        'amount': this.precisionFromString(market['quantityIncrement'])
                                    };
                                    taker = parseFloat(market['takeLiquidityRate']);
                                    maker = parseFloat(market['provideLiquidityRate']);

                                    result.push(this.extend(this.fees['trading'], {
                                        'info': market,
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'active': true,
                                        'lot': lot,
                                        'step': _step,
                                        'taker': taker,
                                        'maker': maker,
                                        'precision': precision,
                                        'limits': {
                                            'amount': {
                                                'min': lot,
                                                'max': undefined
                                            },
                                            'price': {
                                                'min': _step,
                                                'max': undefined
                                            },
                                            'cost': {
                                                'min': lot * _step,
                                                'max': undefined
                                            }
                                        }
                                    }));
                                }
                                return _context.abrupt('return', result);

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function fetchMarkets() {
                return _ref.apply(this, arguments);
            }

            return fetchMarkets;
        }()
    }, {
        key: 'fetchCurrencies',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var currencies, result, i, currency, id, precision, code, payin, payout, transfer, active, status, type;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.publicGetCurrency(params);

                            case 2:
                                currencies = _context2.sent;
                                result = {};

                                for (i = 0; i < currencies.length; i++) {
                                    currency = currencies[i];
                                    id = currency['id'];
                                    // todo: will need to rethink the fees
                                    // to add support for multiple withdrawal/deposit methods and
                                    // differentiated fees for each particular method

                                    precision = 8; // default precision, todo: fix "magic constants"

                                    code = this.commonCurrencyCode(id);
                                    payin = currency['payinEnabled'];
                                    payout = currency['payoutEnabled'];
                                    transfer = currency['transferEnabled'];
                                    active = payin && payout && transfer;
                                    status = 'ok';

                                    if ('disabled' in currency) if (currency['disabled']) status = 'disabled';
                                    type = currency['crypto'] ? 'crypto' : 'fiat';

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
                                return _context2.abrupt('return', result);

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchCurrencies() {
                return _ref2.apply(this, arguments);
            }

            return fetchCurrencies;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var type, method, balances, result, b, balance, code, currency, account;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                type = this.safeString(params, 'type', 'trading');
                                method = 'privateGet' + this.capitalize(type) + 'Balance';
                                _context3.next = 6;
                                return this[method]();

                            case 6:
                                balances = _context3.sent;
                                result = { 'info': balances };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    code = balance['currency'];
                                    currency = this.commonCurrencyCode(code);
                                    account = {
                                        'free': parseFloat(balance['available']),
                                        'used': parseFloat(balance['reserved']),
                                        'total': 0.0
                                    };

                                    account['total'] = this.sum(account['free'], account['used']);
                                    result[currency] = account;
                                }
                                return _context3.abrupt('return', this.parseBalance(result));

                            case 10:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchBalance() {
                return _ref3.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'parseOHLCV',
        value: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1d';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            var timestamp = this.parse8601(ohlcv['timestamp']);
            return [timestamp, parseFloat(ohlcv['open']), parseFloat(ohlcv['max']), parseFloat(ohlcv['min']), parseFloat(ohlcv['close']), parseFloat(ohlcv['volumeQuote'])];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, request, response;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = {
                                    'symbol': market['id'],
                                    'period': this.timeframes[timeframe]
                                };

                                if (limit) request['limit'] = limit;
                                _context4.next = 7;
                                return this.publicGetCandlesSymbol(this.extend(request, params));

                            case 7:
                                response = _context4.sent;
                                return _context4.abrupt('return', this.parseOHLCVs(response, market, timeframe, since, limit));

                            case 9:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchOHLCV(_x11) {
                return _ref4.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var orderbook;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context5.next = 4;
                                return this.publicGetOrderbookSymbol(this.extend({
                                    'symbol': this.marketId(symbol)
                                }, params));

                            case 4:
                                orderbook = _context5.sent;
                                return _context5.abrupt('return', this.parseOrderBook(orderbook, undefined, 'bid', 'ask', 'price', 'size'));

                            case 6:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchOrderBook(_x13) {
                return _ref5.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.parse8601(ticker['timestamp']);
            var symbol = undefined;
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
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var tickers, result, i, ticker, id, market, symbol;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context6.next = 4;
                                return this.publicGetTicker(params);

                            case 4:
                                tickers = _context6.sent;
                                result = {};

                                for (i = 0; i < tickers.length; i++) {
                                    ticker = tickers[i];
                                    id = ticker['symbol'];
                                    market = this.markets_by_id[id];
                                    symbol = market['symbol'];

                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context6.abrupt('return', result);

                            case 8:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTickers() {
                return _ref6.apply(this, arguments);
            }

            return fetchTickers;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, ticker;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context7.next = 5;
                                return this.publicGetTickerSymbol(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 5:
                                ticker = _context7.sent;

                                if (!('message' in ticker)) {
                                    _context7.next = 8;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + ticker['message']);

                            case 8:
                                return _context7.abrupt('return', this.parseTicker(ticker, market));

                            case 9:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchTicker(_x18) {
                return _ref7.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.parse8601(trade['timestamp']);
            var symbol = undefined;
            if (market) {
                symbol = market['symbol'];
            } else {
                var id = trade['symbol'];
                if (id in this.markets_by_id) {
                    market = this.markets_by_id[id];
                    symbol = market['symbol'];
                } else {
                    symbol = id;
                }
            }
            var fee = undefined;
            if ('fee' in trade) {
                var currency = market ? market['quote'] : undefined;
                fee = {
                    'cost': parseFloat(trade['fee']),
                    'currency': currency
                };
            }
            var orderId = undefined;
            if ('clientOrderId' in trade) orderId = trade['clientOrderId'];
            var price = parseFloat(trade['price']);
            var amount = parseFloat(trade['quantity']);
            var cost = price * amount;
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
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context8.next = 5;
                                return this.publicGetTradesSymbol(this.extend({
                                    'symbol': market['id']
                                }, params));

                            case 5:
                                response = _context8.sent;
                                return _context8.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 7:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function fetchTrades(_x23) {
                return _ref8.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var market, uuid, parts, clientOrderId, request, response, order, id;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                // their max accepted length is 32 characters

                                uuid = this.uuid();
                                parts = uuid.split('-');
                                clientOrderId = parts.join('');

                                clientOrderId = clientOrderId.slice(0, 32);
                                amount = parseFloat(amount);
                                request = {
                                    'clientOrderId': clientOrderId,
                                    'symbol': market['id'],
                                    'side': side,
                                    'quantity': this.amountToPrecision(symbol, amount),
                                    'type': type
                                };

                                if (type == 'limit') {
                                    request['price'] = this.priceToPrecision(symbol, price);
                                } else {
                                    request['timeInForce'] = 'FOK';
                                }
                                _context9.next = 12;
                                return this.privatePostOrder(this.extend(request, params));

                            case 12:
                                response = _context9.sent;
                                order = this.parseOrder(response);
                                id = order['id'];

                                this.orders[id] = order;
                                return _context9.abrupt('return', order);

                            case 17:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function createOrder(_x26, _x27, _x28, _x29) {
                return _ref9.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context10.next = 4;
                                return this.privateDeleteOrderClientOrderId(this.extend({
                                    'clientOrderId': id
                                }, params));

                            case 4:
                                return _context10.abrupt('return', _context10.sent);

                            case 5:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function cancelOrder(_x32) {
                return _ref10.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'parseOrder',
        value: function parseOrder(order) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var created = undefined;
            if ('createdAt' in order) created = this.parse8601(order['createdAt']);
            var updated = undefined;
            if ('updatedAt' in order) updated = this.parse8601(order['updatedAt']);
            if (!market) market = this.markets_by_id[order['symbol']];
            var symbol = market['symbol'];
            var amount = this.safeFloat(order, 'quantity');
            var filled = this.safeFloat(order, 'cumQuantity');
            var status = order['status'];
            if (status == 'new') {
                status = 'open';
            } else if (status == 'suspended') {
                status = 'open';
            } else if (status == 'partiallyFilled') {
                status = 'open';
            } else if (status == 'filled') {
                status = 'closed';
            }
            var id = order['clientOrderId'].toString();
            var price = this.safeFloat(order, 'price');
            if (typeof price == 'undefined') {
                if (id in this.orders) price = this.orders[id]['price'];
            }
            var remaining = undefined;
            var cost = undefined;
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
    }, {
        key: 'fetchOrder',
        value: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var response, numOrders;
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context11.next = 4;
                                return this.privateGetHistoryOrder(this.extend({
                                    'clientOrderId': id
                                }, params));

                            case 4:
                                response = _context11.sent;
                                numOrders = response.length;

                                if (!(numOrders > 0)) {
                                    _context11.next = 8;
                                    break;
                                }

                                return _context11.abrupt('return', this.parseOrder(response[0]));

                            case 8:
                                throw new OrderNotFound(this.id + ' order ' + id + ' not found');

                            case 9:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function fetchOrder(_x36) {
                return _ref11.apply(this, arguments);
            }

            return fetchOrder;
        }()
    }, {
        key: 'fetchActiveOrder',
        value: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                var response;
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                _context12.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context12.next = 4;
                                return this.privateGetOrderClientOrderId(this.extend({
                                    'clientOrderId': id
                                }, params));

                            case 4:
                                response = _context12.sent;
                                return _context12.abrupt('return', this.parseOrder(response));

                            case 6:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function fetchActiveOrder(_x39) {
                return _ref12.apply(this, arguments);
            }

            return fetchActiveOrder;
        }()
    }, {
        key: 'fetchOpenOrders',
        value: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, request, response;
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                _context13.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = undefined;
                                request = {};

                                if (symbol) {
                                    market = this.market(symbol);
                                    request['symbol'] = market['id'];
                                }
                                _context13.next = 7;
                                return this.privateGetOrder(this.extend(request, params));

                            case 7:
                                response = _context13.sent;
                                return _context13.abrupt('return', this.parseOrders(response, market, since, limit));

                            case 9:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function fetchOpenOrders() {
                return _ref13.apply(this, arguments);
            }

            return fetchOpenOrders;
        }()
    }, {
        key: 'fetchClosedOrders',
        value: function () {
            var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, request, response;
                return regeneratorRuntime.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _context14.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = undefined;
                                request = {};

                                if (symbol) {
                                    market = this.market(symbol);
                                    request['symbol'] = market['id'];
                                }
                                if (limit) request['limit'] = limit;
                                if (since) {
                                    request['from'] = this.iso8601(since);
                                }
                                _context14.next = 9;
                                return this.privateGetHistoryOrder(this.extend(request, params));

                            case 9:
                                response = _context14.sent;
                                return _context14.abrupt('return', this.parseOrders(response, market, since, limit));

                            case 11:
                            case 'end':
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function fetchClosedOrders() {
                return _ref14.apply(this, arguments);
            }

            return fetchClosedOrders;
        }()
    }, {
        key: 'fetchMyTrades',
        value: function () {
            var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
                var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var request, market, response;
                return regeneratorRuntime.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                _context15.next = 2;
                                return this.loadMarkets();

                            case 2:
                                request = {
                                    // 'symbol': 'BTC/USD', // optional
                                    // 'sort': 'DESC', // or 'ASC'
                                    // 'by': 'timestamp', // or 'id'	String	timestamp by default, or id
                                    // 'from':	'Datetime or Number', // ISO 8601
                                    // 'till':	'Datetime or Number',
                                    // 'limit': 100,
                                    // 'offset': 0,
                                };
                                market = undefined;

                                if (symbol) {
                                    market = this.market(symbol);
                                    request['symbol'] = market['id'];
                                }
                                if (since) request['from'] = this.iso8601(since);
                                if (limit) request['limit'] = limit;
                                _context15.next = 9;
                                return this.privateGetHistoryTrades(this.extend(request, params));

                            case 9:
                                response = _context15.sent;
                                return _context15.abrupt('return', this.parseTrades(response, market, since, limit));

                            case 11:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function fetchMyTrades() {
                return _ref15.apply(this, arguments);
            }

            return fetchMyTrades;
        }()
    }, {
        key: 'createDepositAddress',
        value: function () {
            var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(currency) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var currencyId, response, address;
                return regeneratorRuntime.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                currencyId = this.currencyId(currency);
                                _context16.next = 3;
                                return this.privatePostAccountCryptoAddressCurrency({
                                    'currency': currencyId
                                });

                            case 3:
                                response = _context16.sent;
                                address = response['address'];
                                return _context16.abrupt('return', {
                                    'currency': currency,
                                    'address': address,
                                    'status': 'ok',
                                    'info': response
                                });

                            case 6:
                            case 'end':
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function createDepositAddress(_x53) {
                return _ref16.apply(this, arguments);
            }

            return createDepositAddress;
        }()
    }, {
        key: 'fetchDepositAddress',
        value: function () {
            var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(currency) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var currencyId, response, address;
                return regeneratorRuntime.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                currencyId = this.currencyId(currency);
                                _context17.next = 3;
                                return this.privateGetAccountCryptoAddressCurrency({
                                    'currency': currencyId
                                });

                            case 3:
                                response = _context17.sent;
                                address = response['address'];
                                return _context17.abrupt('return', {
                                    'currency': currency,
                                    'address': address,
                                    'status': 'ok',
                                    'info': response
                                });

                            case 6:
                            case 'end':
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));

            function fetchDepositAddress(_x55) {
                return _ref17.apply(this, arguments);
            }

            return fetchDepositAddress;
        }()
    }, {
        key: 'withdraw',
        value: function () {
            var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(currency, amount, address) {
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var currencyId, response;
                return regeneratorRuntime.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                currencyId = this.currencyId(currency);

                                amount = parseFloat(amount);
                                _context18.next = 4;
                                return this.privatePostAccountCryptoWithdraw(this.extend({
                                    'currency': currencyId,
                                    'amount': amount,
                                    'address': address
                                }, params));

                            case 4:
                                response = _context18.sent;
                                return _context18.abrupt('return', {
                                    'info': response,
                                    'id': response['id']
                                });

                            case 6:
                            case 'end':
                                return _context18.stop();
                        }
                    }
                }, _callee18, this);
            }));

            function withdraw(_x57, _x58, _x59) {
                return _ref18.apply(this, arguments);
            }

            return withdraw;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = '/api' + '/' + this.version + '/';
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                url += api + '/' + this.implodeParams(path, params);
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                url += this.implodeParams(path, params);
                if (method == 'GET') {
                    if (Object.keys(query).length) url += '?' + this.urlencode(query);
                } else {
                    if (Object.keys(query).length) body = this.json(query);
                }
                var payload = this.encode(this.apiKey + ':' + this.secret);
                var auth = this.stringToBase64(payload);
                headers = {
                    'Authorization': "Basic " + this.decode(auth),
                    'Content-Type': 'application/json'
                };
            }
            url = this.urls['api'] + url;
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'handleErrors',
        value: function handleErrors(code, reason, url, method, headers, body) {
            if (code == 400) {
                if (body[0] == "{") {
                    var response = JSON.parse(body);
                    if ('error' in response) {
                        if ('message' in response['error']) {
                            var message = response['error']['message'];
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
    }, {
        key: 'request',
        value: function () {
            var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return regeneratorRuntime.wrap(function _callee19$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                _context19.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context19.sent;

                                if (!('error' in response)) {
                                    _context19.next = 5;
                                    break;
                                }

                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 5:
                                return _context19.abrupt('return', response);

                            case 6:
                            case 'end':
                                return _context19.stop();
                        }
                    }
                }, _callee19, this);
            }));

            function request(_x70) {
                return _ref19.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return hitbtc2;
}(hitbtc);