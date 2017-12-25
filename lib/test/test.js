"use strict";

/*  ------------------------------------------------------------------------ */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _process$argv$filter = process.argv.filter(function (x) {
    return !x.startsWith('--');
}),
    _process$argv$filter2 = _slicedToArray(_process$argv$filter, 4),
    processPath = _process$argv$filter2[0],
    _process$argv$filter3 = _process$argv$filter2[2],
    exchangeId = _process$argv$filter3 === undefined ? null : _process$argv$filter3,
    _process$argv$filter4 = _process$argv$filter2[3],
    exchangeSymbol = _process$argv$filter4 === undefined ? null : _process$argv$filter4;

var verbose = process.argv.includes('--verbose') || false;
var debug = process.argv.includes('--debug') || false;

/*  ------------------------------------------------------------------------ */

var asTable = require('as-table'),
    util = require('util'),
    log = require('ololog'),
    ansi = require('ansicolor').nice,
    fs = require('fs'),
    ccxt = require('../../ccxt.js'),
    countries = require('../../countries.js'),
    chai = require('chai'),
    expect = chai.expect,
    assert = chai.assert;

/*  ------------------------------------------------------------------------ */

var warn = log.bright.yellow.error; // .error → stderr

/*  ------------------------------------------------------------------------ */

process.on('uncaughtException', function (e) {
    log.bright.red.error(e);process.exit(1);
});
process.on('unhandledRejection', function (e) {
    log.bright.red.error(e);process.exit(1);
});

/*  ------------------------------------------------------------------------ */

log.bright('\nTESTING', { exchange: exchangeId, symbol: exchangeSymbol || 'all' }, '\n');

/*  ------------------------------------------------------------------------ */

var proxies = ['', 'https://cors-anywhere.herokuapp.com/'];

/*  ------------------------------------------------------------------------ */

var enableRateLimit = true;

var exchange = new ccxt[exchangeId]({
    verbose: verbose,
    enableRateLimit: enableRateLimit,
    debug: debug,
    timeout: 20000
});

//-----------------------------------------------------------------------------

var keysGlobal = 'keys.json';
var keysLocal = 'keys.local.json';

var keysFile = fs.existsSync(keysLocal) ? keysLocal : keysGlobal;
var settings = require('../../' + keysFile)[exchangeId];

Object.assign(exchange, settings);

if (settings && settings.skip) {
    log.bright('[Skipped]', { exchange: exchangeId, symbol: exchangeSymbol || 'all' });
    process.exit();
}

var verboseList = [];
if (verboseList.indexOf(exchange.id) >= 0) {
    exchange.verbose = true;
}

//-----------------------------------------------------------------------------

var countryName = function countryName(code) {
    return typeof countries[code] !== 'undefined' ? countries[code] : code;
};

//-----------------------------------------------------------------------------

var human_value = function human_value(price) {
    return typeof price == 'undefined' ? 'N/A' : price;
};

//-----------------------------------------------------------------------------

var testTicker = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(exchange, symbol) {
        var ticker, keys;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!exchange.hasFetchTicker) {
                            _context.next = 10;
                            break;
                        }

                        _context.next = 3;
                        return exchange.fetchTicker(symbol);

                    case 3:
                        ticker = _context.sent;
                        keys = ['datetime', 'timestamp', 'high', 'low', 'bid', 'ask', 'quoteVolume'];


                        keys.forEach(function (key) {
                            return assert(key in ticker);
                        });

                        log.apply(undefined, [symbol.green, 'ticker', ticker['datetime']].concat(_toConsumableArray(keys.map(function (key) {
                            return key + ': ' + human_value(ticker[key]);
                        }))));

                        if (exchange.id != 'coinmarketcap' && exchange.id != 'xbtce') if (ticker['bid'] && ticker['ask']) assert(ticker['bid'] <= ticker['ask']);

                        _context.next = 11;
                        break;

                    case 10:

                        log(symbol.green, 'fetchTicker () not supported');

                    case 11:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function testTicker(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

//-----------------------------------------------------------------------------

var testOrderBook = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(exchange, symbol) {
        var orderbook, format, bids, asks;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return exchange.fetchOrderBook(symbol);

                    case 2:
                        orderbook = _context2.sent;
                        format = {
                            'bids': [],
                            'asks': [],
                            'timestamp': 1234567890,
                            'datetime': '2017-09-01T00:00:00'
                        };


                        expect(orderbook).to.have.all.keys(format);

                        bids = orderbook.bids;
                        asks = orderbook.asks;


                        log(symbol.green, orderbook['datetime'], 'bid: ' + (bids.length > 0 ? human_value(bids[0][0]) : 'N/A'), 'bidVolume: ' + (bids.length > 0 ? human_value(bids[0][1]) : 'N/A'), 'ask: ' + (asks.length > 0 ? human_value(asks[0][0]) : 'N/A'), 'askVolume: ' + (asks.length > 0 ? human_value(asks[0][1]) : 'N/A'));

                        if (bids.length > 1) assert(bids[0][0] >= bids[bids.length - 1][0]);

                        if (asks.length > 1) assert(asks[0][0] <= asks[asks.length - 1][0]);

                        if (exchange.id != 'xbtce') if (bids.length && asks.length) assert(bids[0][0] <= asks[0][0]);

                        return _context2.abrupt('return', orderbook);

                    case 12:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function testOrderBook(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

//-----------------------------------------------------------------------------

var testTrades = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(exchange, symbol) {
        var trades;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        if (!exchange.hasFetchTrades) {
                            _context3.next = 7;
                            break;
                        }

                        _context3.next = 3;
                        return exchange.fetchTrades(symbol);

                    case 3:
                        trades = _context3.sent;


                        log(symbol.green, 'fetched', Object.values(trades).length.toString().green, 'trades');
                        // log (asTable (trades))

                        _context3.next = 8;
                        break;

                    case 7:

                        log(symbol.green, 'fetchTrades () not supported'.yellow);

                    case 8:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function testTrades(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

//-----------------------------------------------------------------------------

var testTickers = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(exchange, symbol) {
        var tickers;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        if (!exchange.hasFetchTickers) {
                            _context4.next = 18;
                            break;
                        }

                        // log ('fetching all tickers at once...')

                        tickers = undefined;
                        _context4.prev = 2;
                        _context4.next = 5;
                        return exchange.fetchTickers();

                    case 5:
                        tickers = _context4.sent;

                        log('fetched all', Object.keys(tickers).length.toString().green, 'tickers');

                        _context4.next = 16;
                        break;

                    case 9:
                        _context4.prev = 9;
                        _context4.t0 = _context4['catch'](2);


                        log('failed to fetch all tickers, fetching multiple tickers at once...');
                        _context4.next = 14;
                        return exchange.fetchTickers([symbol]);

                    case 14:
                        tickers = _context4.sent;

                        log('fetched', Object.keys(tickers).length.toString().green, 'tickers');

                    case 16:
                        _context4.next = 19;
                        break;

                    case 18:

                        log('fetching all tickers at once not supported');

                    case 19:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined, [[2, 9]]);
    }));

    return function testTickers(_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}();

//-----------------------------------------------------------------------------

var testOHLCV = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(exchange, symbol) {
        var ohlcv;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        if (!exchange.hasFetchOHLCV) {
                            _context5.next = 7;
                            break;
                        }

                        _context5.next = 3;
                        return exchange.fetchOHLCV(symbol);

                    case 3:
                        ohlcv = _context5.sent;

                        log(symbol.green, 'fetched', Object.keys(ohlcv).length.toString().green, 'OHLCVs');

                        _context5.next = 8;
                        break;

                    case 7:

                        log('fetching OHLCV not supported');

                    case 8:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function testOHLCV(_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}();

//-----------------------------------------------------------------------------

var testSymbol = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(exchange, symbol) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return testTicker(exchange, symbol);

                    case 2:
                        _context6.next = 4;
                        return testTickers(exchange, symbol);

                    case 4:
                        _context6.next = 6;
                        return testOHLCV(exchange, symbol);

                    case 6:
                        _context6.next = 8;
                        return testTrades(exchange, symbol);

                    case 8:
                        if (!(exchange.id == 'coinmarketcap')) {
                            _context6.next = 21;
                            break;
                        }

                        _context6.t0 = log;
                        _context6.next = 12;
                        return exchange.fetchTickers();

                    case 12:
                        _context6.t1 = _context6.sent;
                        (0, _context6.t0)(_context6.t1);
                        _context6.t2 = log;
                        _context6.next = 17;
                        return exchange.fetchGlobal();

                    case 17:
                        _context6.t3 = _context6.sent;
                        (0, _context6.t2)(_context6.t3);
                        _context6.next = 23;
                        break;

                    case 21:
                        _context6.next = 23;
                        return testOrderBook(exchange, symbol);

                    case 23:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function testSymbol(_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
}();

//-----------------------------------------------------------------------------

var testOrders = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(exchange, symbol) {
        var orders;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        if (!exchange.hasFetchOrders) {
                            _context7.next = 7;
                            break;
                        }

                        _context7.next = 3;
                        return exchange.fetchOrders(symbol);

                    case 3:
                        orders = _context7.sent;

                        log('fetched', orders.length.toString().green, 'orders');
                        // log (asTable (orders))

                        _context7.next = 8;
                        break;

                    case 7:

                        log('fetching orders not supported');

                    case 8:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function testOrders(_x13, _x14) {
        return _ref7.apply(this, arguments);
    };
}();

//-----------------------------------------------------------------------------

var testClosedOrders = function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(exchange, symbol) {
        var orders;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        if (!exchange.hasFetchClosedOrders) {
                            _context8.next = 7;
                            break;
                        }

                        _context8.next = 3;
                        return exchange.fetchClosedOrders(symbol);

                    case 3:
                        orders = _context8.sent;

                        log('fetched', orders.length.toString().green, 'closed orders');
                        // log (asTable (orders))

                        _context8.next = 8;
                        break;

                    case 7:

                        log('fetching closed orders not supported');

                    case 8:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function testClosedOrders(_x15, _x16) {
        return _ref8.apply(this, arguments);
    };
}();

//-----------------------------------------------------------------------------

var testOpenOrders = function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(exchange, symbol) {
        var orders;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        if (!exchange.hasFetchOpenOrders) {
                            _context9.next = 7;
                            break;
                        }

                        _context9.next = 3;
                        return exchange.fetchOpenOrders(symbol);

                    case 3:
                        orders = _context9.sent;

                        log('fetched', orders.length.toString().green, 'open orders');
                        // log (asTable (orders))

                        _context9.next = 8;
                        break;

                    case 7:

                        log('fetching open orders not supported');

                    case 8:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, undefined);
    }));

    return function testOpenOrders(_x17, _x18) {
        return _ref9.apply(this, arguments);
    };
}();

//-----------------------------------------------------------------------------

var testMyTrades = function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(exchange, symbol) {
        var trades;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        if (!exchange.hasFetchMyTrades) {
                            _context10.next = 7;
                            break;
                        }

                        _context10.next = 3;
                        return exchange.fetchMyTrades(symbol, 0);

                    case 3:
                        trades = _context10.sent;

                        log('fetched', trades.length.toString().green, 'trades');
                        // trades.forEach (trade => log.dim ('-'.repeat (80), "\n", trade))
                        // log (asTable (trades))

                        _context10.next = 8;
                        break;

                    case 7:

                        log('fetching my trades not supported');

                    case 8:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, undefined);
    }));

    return function testMyTrades(_x19, _x20) {
        return _ref10.apply(this, arguments);
    };
}();

//-----------------------------------------------------------------------------

var testFetchCurrencies = function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(exchange, symbol) {
        var currencies;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        if (!exchange.hasFetchCurrencies) {
                            _context11.next = 7;
                            break;
                        }

                        _context11.next = 3;
                        return exchange.fetchCurrencies();

                    case 3:
                        currencies = _context11.sent;

                        log('fetched', currencies.length.toString().green, 'currencies');
                        // log (asTable (currencies))

                        _context11.next = 8;
                        break;

                    case 7:

                        log('fetching currencies not supported');

                    case 8:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, _callee11, undefined);
    }));

    return function testFetchCurrencies(_x21, _x22) {
        return _ref11.apply(this, arguments);
    };
}();

//-----------------------------------------------------------------------------

var testBalance = function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(exchange, symbol) {
        var balance, currencies, result;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:

                        log('fetching balance...');
                        _context12.next = 3;
                        return exchange.fetchBalance();

                    case 3:
                        balance = _context12.sent;
                        currencies = ['USD', 'CNY', 'EUR', 'BTC', 'ETH', 'JPY', 'LTC', 'DASH', 'DOGE', 'UAH', 'RUB'];

                        // log.yellow (balance)

                        if ('info' in balance) {
                            result = currencies.filter(function (currency) {
                                return currency in balance && typeof balance[currency]['total'] != 'undefined';
                            });


                            if (result.length > 0) {
                                result = result.map(function (currency) {
                                    return currency + ': ' + human_value(balance[currency]['total']);
                                });
                                if (exchange.currencies.length > result.length) result = result.join(', ') + ' + more...';else result = result.join(', ');
                            } else {

                                result = 'zero balance';
                            }

                            log(result);
                        } else {

                            log(exchange.omit(balance, 'info'));
                        }

                    case 6:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _callee12, undefined);
    }));

    return function testBalance(_x23, _x24) {
        return _ref12.apply(this, arguments);
    };
}();

//-----------------------------------------------------------------------------

var loadExchange = function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(exchange) {
        var markets, symbols, result;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        _context13.next = 2;
                        return exchange.loadMarkets();

                    case 2:
                        markets = _context13.sent;
                        symbols = ['BTC/CNY', 'BTC/USD', 'BTC/EUR', 'BTC/ETH', 'ETH/BTC', 'BTC/JPY', 'ETH/EUR', 'ETH/JPY', 'ETH/CNY', 'LTC/CNY', 'DASH/BTC', 'DOGE/BTC', 'BTC/AUD', 'BTC/PLN', 'USD/SLL', 'BTC/RUB', 'BTC/UAH', 'LTC/BTC'];
                        result = exchange.symbols.filter(function (symbol) {
                            return symbols.indexOf(symbol) >= 0;
                        });

                        if (result.length > 0) if (exchange.symbols.length > result.length) result = result.join(', ') + ' + more...';else result = result.join(', ');
                        log(exchange.symbols.length.toString().bright.green, 'symbols', result);

                    case 7:
                    case 'end':
                        return _context13.stop();
                }
            }
        }, _callee13, undefined);
    }));

    return function loadExchange(_x25) {
        return _ref13.apply(this, arguments);
    };
}();

//-----------------------------------------------------------------------------

var testExchange = function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(exchange) {
        var delay, symbol, symbols, s;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        _context14.next = 2;
                        return loadExchange(exchange);

                    case 2:
                        delay = exchange.rateLimit;
                        symbol = exchange.symbols[0];
                        symbols = ['BTC/USD', 'BTC/CNY', 'BTC/EUR', 'BTC/ETH', 'ETH/BTC', 'BTC/JPY', 'LTC/BTC'];
                        _context14.t0 = regeneratorRuntime.keys(symbols);

                    case 6:
                        if ((_context14.t1 = _context14.t0()).done) {
                            _context14.next = 13;
                            break;
                        }

                        s = _context14.t1.value;

                        if (!exchange.symbols.includes(symbols[s])) {
                            _context14.next = 11;
                            break;
                        }

                        symbol = symbols[s];
                        return _context14.abrupt('break', 13);

                    case 11:
                        _context14.next = 6;
                        break;

                    case 13:

                        log.green('SYMBOL:', symbol);

                        if (!(symbol.indexOf('.d') < 0)) {
                            _context14.next = 17;
                            break;
                        }

                        _context14.next = 17;
                        return testSymbol(exchange, symbol);

                    case 17:
                        if (!(!exchange.apiKey || exchange.apiKey.length < 1)) {
                            _context14.next = 19;
                            break;
                        }

                        return _context14.abrupt('return', true);

                    case 19:

                        // move to testnet/sandbox if possible before accessing the balance if possible
                        if (exchange.urls['test']) exchange.urls['api'] = exchange.urls['test'];

                        _context14.next = 22;
                        return testOrders(exchange, symbol);

                    case 22:
                        _context14.next = 24;
                        return testOpenOrders(exchange, symbol);

                    case 24:
                        _context14.next = 26;
                        return testClosedOrders(exchange, symbol);

                    case 26:
                        _context14.next = 28;
                        return testMyTrades(exchange, symbol);

                    case 28:
                        _context14.next = 30;
                        return testBalance(exchange);

                    case 30:
                    case 'end':
                        return _context14.stop();
                }
            }
        }, _callee14, undefined);
    }));

    return function testExchange(_x26) {
        return _ref14.apply(this, arguments);
    };
}();

//-----------------------------------------------------------------------------

var printExchangesTable = function printExchangesTable() {

    var astable = asTable.configure({ delimiter: ' | ' });

    console.log(astable(Object.values(exchanges).map(function (exchange) {

        var website = Array.isArray(exchange.urls.www) ? exchange.urls.www[0] : exchange.urls.www;

        var countries = Array.isArray(exchange.countries) ? exchange.countries.map(countryName).join(', ') : countryName(exchange.countries);

        var doc = Array.isArray(exchange.urls.doc) ? exchange.urls.doc[0] : exchange.urls.doc;

        return {
            'id': exchange.id,
            'name': exchange.name,
            'countries': countries
        };
    })));
};

//-----------------------------------------------------------------------------

var tryAllProxies = function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(exchange, proxies) {
        var currentProxy, maxRetries, numRetries;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
                switch (_context15.prev = _context15.next) {
                    case 0:
                        currentProxy = 0;
                        maxRetries = proxies.length;


                        if (settings && 'proxy' in settings) currentProxy = proxies.indexOf(settings.proxy);

                        numRetries = 0;

                    case 4:
                        if (!(numRetries < maxRetries)) {
                            _context15.next = 43;
                            break;
                        }

                        _context15.prev = 5;


                        exchange.proxy = proxies[currentProxy];
                        _context15.next = 9;
                        return testExchange(exchange);

                    case 9:
                        return _context15.abrupt('break', 43);

                    case 12:
                        _context15.prev = 12;
                        _context15.t0 = _context15['catch'](5);


                        currentProxy = ++currentProxy % proxies.length;

                        if (!(_context15.t0 instanceof ccxt.DDoSProtection)) {
                            _context15.next = 19;
                            break;
                        }

                        warn('[DDoS Protection]' + _context15.t0.message.slice(0, 200));
                        _context15.next = 40;
                        break;

                    case 19:
                        if (!(_context15.t0 instanceof ccxt.RequestTimeout)) {
                            _context15.next = 23;
                            break;
                        }

                        warn('[Request Timeout] ' + _context15.t0.message.slice(0, 200));
                        _context15.next = 40;
                        break;

                    case 23:
                        if (!(_context15.t0 instanceof ccxt.AuthenticationError)) {
                            _context15.next = 27;
                            break;
                        }

                        warn('[Authentication Error] ' + _context15.t0.message.slice(0, 200));
                        _context15.next = 40;
                        break;

                    case 27:
                        if (!(_context15.t0 instanceof ccxt.ExchangeNotAvailable)) {
                            _context15.next = 31;
                            break;
                        }

                        warn('[Exchange Not Available] ' + _context15.t0.message.slice(0, 200));
                        _context15.next = 40;
                        break;

                    case 31:
                        if (!(_context15.t0 instanceof ccxt.NotSupported)) {
                            _context15.next = 35;
                            break;
                        }

                        warn('[Not Supported] ' + _context15.t0.message.slice(0, 200));
                        _context15.next = 40;
                        break;

                    case 35:
                        if (!(_context15.t0 instanceof ccxt.ExchangeError)) {
                            _context15.next = 39;
                            break;
                        }

                        warn('[Exchange Error] ' + _context15.t0.message.slice(0, 200));
                        _context15.next = 40;
                        break;

                    case 39:
                        throw _context15.t0;

                    case 40:
                        numRetries++;
                        _context15.next = 4;
                        break;

                    case 43:
                    case 'end':
                        return _context15.stop();
                }
            }
        }, _callee15, this, [[5, 12]]);
    }));

    return function tryAllProxies(_x27, _x28) {
        return _ref15.apply(this, arguments);
    };
}()

//-----------------------------------------------------------------------------

;(function () {
    var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
            while (1) {
                switch (_context16.prev = _context16.next) {
                    case 0:
                        if (!exchangeSymbol) {
                            _context16.next = 12;
                            break;
                        }

                        _context16.next = 3;
                        return loadExchange(exchange);

                    case 3:
                        _context16.next = 5;
                        return exchangeSymbol == 'balance';

                    case 5:
                        if (!_context16.sent) {
                            _context16.next = 9;
                            break;
                        }

                        testBalance(exchange);
                        _context16.next = 10;
                        break;

                    case 9:
                        testSymbol(exchange, exchangeSymbol);

                    case 10:
                        _context16.next = 14;
                        break;

                    case 12:
                        _context16.next = 14;
                        return tryAllProxies(exchange, proxies);

                    case 14:
                    case 'end':
                        return _context16.stop();
                }
            }
        }, _callee16, this);
    }));

    function test() {
        return _ref16.apply(this, arguments);
    }

    return test;
})()();