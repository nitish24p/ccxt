"use strict";

/*  ------------------------------------------------------------------------ */

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const [processPath,, exchangeId = null, exchangeSymbol = null] = process.argv.filter(x => !x.startsWith('--'));
const verbose = process.argv.includes('--verbose') || false;
const debug = process.argv.includes('--debug') || false;

/*  ------------------------------------------------------------------------ */

const asTable = require('as-table'),
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

const warn = log.bright.yellow.error; // .error → stderr

/*  ------------------------------------------------------------------------ */

process.on('uncaughtException', e => {
    log.bright.red.error(e);process.exit(1);
});
process.on('unhandledRejection', e => {
    log.bright.red.error(e);process.exit(1);
});

/*  ------------------------------------------------------------------------ */

log.bright('\nTESTING', { exchange: exchangeId, symbol: exchangeSymbol || 'all' }, '\n');

/*  ------------------------------------------------------------------------ */

let proxies = ['', 'https://cors-anywhere.herokuapp.com/'];

/*  ------------------------------------------------------------------------ */

const enableRateLimit = true;

const exchange = new ccxt[exchangeId]({
    verbose,
    enableRateLimit,
    debug,
    timeout: 20000
});

//-----------------------------------------------------------------------------

const keysGlobal = 'keys.json';
const keysLocal = 'keys.local.json';

let keysFile = fs.existsSync(keysLocal) ? keysLocal : keysGlobal;
let settings = require('../../' + keysFile)[exchangeId];

(0, _assign2.default)(exchange, settings);

if (settings && settings.skip) {
    log.bright('[Skipped]', { exchange: exchangeId, symbol: exchangeSymbol || 'all' });
    process.exit();
}

const verboseList = [];
if (verboseList.indexOf(exchange.id) >= 0) {
    exchange.verbose = true;
}

//-----------------------------------------------------------------------------

let countryName = function (code) {
    return typeof countries[code] !== 'undefined' ? countries[code] : code;
};

//-----------------------------------------------------------------------------

let human_value = function (price) {
    return typeof price == 'undefined' ? 'N/A' : price;
};

//-----------------------------------------------------------------------------

let testTicker = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (exchange, symbol) {

        if (exchange.hasFetchTicker) {

            // log (symbol.green, 'fetching ticker...')

            let ticker = yield exchange.fetchTicker(symbol);
            const keys = ['datetime', 'timestamp', 'high', 'low', 'bid', 'ask', 'quoteVolume'];

            keys.forEach(function (key) {
                return assert(key in ticker);
            });

            log(symbol.green, 'ticker', ticker['datetime'], ...keys.map(function (key) {
                return key + ': ' + human_value(ticker[key]);
            }));

            if (exchange.id != 'coinmarketcap' && exchange.id != 'xbtce') if (ticker['bid'] && ticker['ask']) assert(ticker['bid'] <= ticker['ask']);
        } else {

            log(symbol.green, 'fetchTicker () not supported');
        }
    });

    return function testTicker(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

//-----------------------------------------------------------------------------

let testOrderBook = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (exchange, symbol) {

        // log (symbol.green, 'fetching order book...')

        let orderbook = yield exchange.fetchOrderBook(symbol);

        const format = {
            'bids': [],
            'asks': [],
            'timestamp': 1234567890,
            'datetime': '2017-09-01T00:00:00'
        };

        expect(orderbook).to.have.all.keys(format);

        const bids = orderbook.bids;
        const asks = orderbook.asks;

        log(symbol.green, orderbook['datetime'], 'bid: ' + (bids.length > 0 ? human_value(bids[0][0]) : 'N/A'), 'bidVolume: ' + (bids.length > 0 ? human_value(bids[0][1]) : 'N/A'), 'ask: ' + (asks.length > 0 ? human_value(asks[0][0]) : 'N/A'), 'askVolume: ' + (asks.length > 0 ? human_value(asks[0][1]) : 'N/A'));

        if (bids.length > 1) assert(bids[0][0] >= bids[bids.length - 1][0]);

        if (asks.length > 1) assert(asks[0][0] <= asks[asks.length - 1][0]);

        if (exchange.id != 'xbtce') if (bids.length && asks.length) assert(bids[0][0] <= asks[0][0]);

        return orderbook;
    });

    return function testOrderBook(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
})();

//-----------------------------------------------------------------------------

let testTrades = (() => {
    var _ref3 = (0, _asyncToGenerator3.default)(function* (exchange, symbol) {

        if (exchange.hasFetchTrades) {

            // log (symbol.green, 'fetching trades...')

            let trades = yield exchange.fetchTrades(symbol);

            log(symbol.green, 'fetched', (0, _values2.default)(trades).length.toString().green, 'trades');
            // log (asTable (trades))
        } else {

            log(symbol.green, 'fetchTrades () not supported'.yellow);
        }
    });

    return function testTrades(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
})();

//-----------------------------------------------------------------------------

let testTickers = (() => {
    var _ref4 = (0, _asyncToGenerator3.default)(function* (exchange, symbol) {

        if (exchange.hasFetchTickers) {

            // log ('fetching all tickers at once...')

            let tickers = undefined;

            try {

                tickers = yield exchange.fetchTickers();
                log('fetched all', (0, _keys2.default)(tickers).length.toString().green, 'tickers');
            } catch (e) {

                log('failed to fetch all tickers, fetching multiple tickers at once...');
                tickers = yield exchange.fetchTickers([symbol]);
                log('fetched', (0, _keys2.default)(tickers).length.toString().green, 'tickers');
            }
        } else {

            log('fetching all tickers at once not supported');
        }
    });

    return function testTickers(_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
})();

//-----------------------------------------------------------------------------

let testOHLCV = (() => {
    var _ref5 = (0, _asyncToGenerator3.default)(function* (exchange, symbol) {

        if (exchange.hasFetchOHLCV) {

            // log (symbol.green, 'fetching OHLCV...')
            let ohlcv = yield exchange.fetchOHLCV(symbol);
            log(symbol.green, 'fetched', (0, _keys2.default)(ohlcv).length.toString().green, 'OHLCVs');
        } else {

            log('fetching OHLCV not supported');
        }
    });

    return function testOHLCV(_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
})();

//-----------------------------------------------------------------------------

let testSymbol = (() => {
    var _ref6 = (0, _asyncToGenerator3.default)(function* (exchange, symbol) {

        yield testTicker(exchange, symbol);
        yield testTickers(exchange, symbol);
        yield testOHLCV(exchange, symbol);
        yield testTrades(exchange, symbol);

        if (exchange.id == 'coinmarketcap') {

            log((yield exchange.fetchTickers()));
            log((yield exchange.fetchGlobal()));
        } else {

            yield testOrderBook(exchange, symbol);
        }
    });

    return function testSymbol(_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
})();

//-----------------------------------------------------------------------------

let testOrders = (() => {
    var _ref7 = (0, _asyncToGenerator3.default)(function* (exchange, symbol) {

        if (exchange.hasFetchOrders) {

            // log ('fetching orders...')
            let orders = yield exchange.fetchOrders(symbol);
            log('fetched', orders.length.toString().green, 'orders');
            // log (asTable (orders))
        } else {

            log('fetching orders not supported');
        }
    });

    return function testOrders(_x13, _x14) {
        return _ref7.apply(this, arguments);
    };
})();

//-----------------------------------------------------------------------------

let testClosedOrders = (() => {
    var _ref8 = (0, _asyncToGenerator3.default)(function* (exchange, symbol) {

        if (exchange.hasFetchClosedOrders) {

            // log ('fetching closed orders...')
            let orders = yield exchange.fetchClosedOrders(symbol);
            log('fetched', orders.length.toString().green, 'closed orders');
            // log (asTable (orders))
        } else {

            log('fetching closed orders not supported');
        }
    });

    return function testClosedOrders(_x15, _x16) {
        return _ref8.apply(this, arguments);
    };
})();

//-----------------------------------------------------------------------------

let testOpenOrders = (() => {
    var _ref9 = (0, _asyncToGenerator3.default)(function* (exchange, symbol) {

        if (exchange.hasFetchOpenOrders) {

            // log ('fetching open orders...')
            let orders = yield exchange.fetchOpenOrders(symbol);
            log('fetched', orders.length.toString().green, 'open orders');
            // log (asTable (orders))
        } else {

            log('fetching open orders not supported');
        }
    });

    return function testOpenOrders(_x17, _x18) {
        return _ref9.apply(this, arguments);
    };
})();

//-----------------------------------------------------------------------------

let testMyTrades = (() => {
    var _ref10 = (0, _asyncToGenerator3.default)(function* (exchange, symbol) {

        if (exchange.hasFetchMyTrades) {

            // log ('fetching my trades...')
            let trades = yield exchange.fetchMyTrades(symbol, 0);
            log('fetched', trades.length.toString().green, 'trades');
            // trades.forEach (trade => log.dim ('-'.repeat (80), "\n", trade))
            // log (asTable (trades))
        } else {

            log('fetching my trades not supported');
        }
    });

    return function testMyTrades(_x19, _x20) {
        return _ref10.apply(this, arguments);
    };
})();

//-----------------------------------------------------------------------------

let testFetchCurrencies = (() => {
    var _ref11 = (0, _asyncToGenerator3.default)(function* (exchange, symbol) {

        if (exchange.hasFetchCurrencies) {

            // log ('fetching currencies...')
            let currencies = yield exchange.fetchCurrencies();
            log('fetched', currencies.length.toString().green, 'currencies');
            // log (asTable (currencies))
        } else {

            log('fetching currencies not supported');
        }
    });

    return function testFetchCurrencies(_x21, _x22) {
        return _ref11.apply(this, arguments);
    };
})();

//-----------------------------------------------------------------------------

let testBalance = (() => {
    var _ref12 = (0, _asyncToGenerator3.default)(function* (exchange, symbol) {

        log('fetching balance...');
        let balance = yield exchange.fetchBalance();

        let currencies = ['USD', 'CNY', 'EUR', 'BTC', 'ETH', 'JPY', 'LTC', 'DASH', 'DOGE', 'UAH', 'RUB'];

        // log.yellow (balance)

        if ('info' in balance) {

            let result = currencies.filter(function (currency) {
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
    });

    return function testBalance(_x23, _x24) {
        return _ref12.apply(this, arguments);
    };
})();

//-----------------------------------------------------------------------------

let loadExchange = (() => {
    var _ref13 = (0, _asyncToGenerator3.default)(function* (exchange) {

        let markets = yield exchange.loadMarkets();

        let symbols = ['BTC/CNY', 'BTC/USD', 'BTC/EUR', 'BTC/ETH', 'ETH/BTC', 'BTC/JPY', 'ETH/EUR', 'ETH/JPY', 'ETH/CNY', 'LTC/CNY', 'DASH/BTC', 'DOGE/BTC', 'BTC/AUD', 'BTC/PLN', 'USD/SLL', 'BTC/RUB', 'BTC/UAH', 'LTC/BTC'];

        let result = exchange.symbols.filter(function (symbol) {
            return symbols.indexOf(symbol) >= 0;
        });
        if (result.length > 0) if (exchange.symbols.length > result.length) result = result.join(', ') + ' + more...';else result = result.join(', ');
        log(exchange.symbols.length.toString().bright.green, 'symbols', result);
    });

    return function loadExchange(_x25) {
        return _ref13.apply(this, arguments);
    };
})();

//-----------------------------------------------------------------------------

let testExchange = (() => {
    var _ref14 = (0, _asyncToGenerator3.default)(function* (exchange) {

        yield loadExchange(exchange);

        let delay = exchange.rateLimit;
        let symbol = exchange.symbols[0];
        let symbols = ['BTC/USD', 'BTC/CNY', 'BTC/EUR', 'BTC/ETH', 'ETH/BTC', 'BTC/JPY', 'LTC/BTC'];
        for (let s in symbols) {
            if (exchange.symbols.includes(symbols[s])) {
                symbol = symbols[s];
                break;
            }
        }

        log.green('SYMBOL:', symbol);
        if (symbol.indexOf('.d') < 0) {
            yield testSymbol(exchange, symbol);
        }

        if (!exchange.apiKey || exchange.apiKey.length < 1) return true;

        // move to testnet/sandbox if possible before accessing the balance if possible
        if (exchange.urls['test']) exchange.urls['api'] = exchange.urls['test'];

        yield testOrders(exchange, symbol);
        yield testOpenOrders(exchange, symbol);
        yield testClosedOrders(exchange, symbol);
        yield testMyTrades(exchange, symbol);
        yield testBalance(exchange);

        // try {
        //     let marketSellOrder =
        //         await exchange.createMarketSellOrder (exchange.symbols[0], 1)
        //     console.log (exchange.id, 'ok', marketSellOrder)
        // } catch (e) {
        //     console.log (exchange.id, 'error', 'market sell', e)
        // }

        // try {
        //     let marketBuyOrder = await exchange.createMarketBuyOrder (exchange.symbols[0], 1)
        //     console.log (exchange.id, 'ok', marketBuyOrder)
        // } catch (e) {
        //     console.log (exchange.id, 'error', 'market buy', e)
        // }

        // try {
        //     let limitSellOrder = await exchange.createLimitSellOrder (exchange.symbols[0], 1, 3000)
        //     console.log (exchange.id, 'ok', limitSellOrder)
        // } catch (e) {
        //     console.log (exchange.id, 'error', 'limit sell', e)
        // }

        // try {
        //     let limitBuyOrder = await exchange.createLimitBuyOrder (exchange.symbols[0], 1, 3000)
        //     console.log (exchange.id, 'ok', limitBuyOrder)
        // } catch (e) {
        //     console.log (exchange.id, 'error', 'limit buy', e)
        // }
    });

    return function testExchange(_x26) {
        return _ref14.apply(this, arguments);
    };
})();

//-----------------------------------------------------------------------------

let printExchangesTable = function () {

    let astable = asTable.configure({ delimiter: ' | ' });

    console.log(astable((0, _values2.default)(exchanges).map(exchange => {

        let website = Array.isArray(exchange.urls.www) ? exchange.urls.www[0] : exchange.urls.www;

        let countries = Array.isArray(exchange.countries) ? exchange.countries.map(countryName).join(', ') : countryName(exchange.countries);

        let doc = Array.isArray(exchange.urls.doc) ? exchange.urls.doc[0] : exchange.urls.doc;

        return {
            'id': exchange.id,
            'name': exchange.name,
            'countries': countries
        };
    })));
};

//-----------------------------------------------------------------------------

let tryAllProxies = (() => {
    var _ref15 = (0, _asyncToGenerator3.default)(function* (exchange, proxies) {

        let currentProxy = 0;
        let maxRetries = proxies.length;

        if (settings && 'proxy' in settings) currentProxy = proxies.indexOf(settings.proxy);

        for (let numRetries = 0; numRetries < maxRetries; numRetries++) {

            try {

                exchange.proxy = proxies[currentProxy];
                yield testExchange(exchange);
                break;
            } catch (e) {

                currentProxy = ++currentProxy % proxies.length;
                if (e instanceof ccxt.DDoSProtection) {
                    warn('[DDoS Protection]' + e.message.slice(0, 200));
                } else if (e instanceof ccxt.RequestTimeout) {
                    warn('[Request Timeout] ' + e.message.slice(0, 200));
                } else if (e instanceof ccxt.AuthenticationError) {
                    warn('[Authentication Error] ' + e.message.slice(0, 200));
                } else if (e instanceof ccxt.ExchangeNotAvailable) {
                    warn('[Exchange Not Available] ' + e.message.slice(0, 200));
                } else if (e instanceof ccxt.NotSupported) {
                    warn('[Not Supported] ' + e.message.slice(0, 200));
                } else if (e instanceof ccxt.ExchangeError) {
                    warn('[Exchange Error] ' + e.message.slice(0, 200));
                } else {
                    throw e;
                }
            }
        }
    });

    return function tryAllProxies(_x27, _x28) {
        return _ref15.apply(this, arguments);
    };
})()

//-----------------------------------------------------------------------------

;(() => {
    var _ref16 = (0, _asyncToGenerator3.default)(function* () {

        if (exchangeSymbol) {

            yield loadExchange(exchange);
            (yield exchangeSymbol == 'balance') ? testBalance(exchange) : testSymbol(exchange, exchangeSymbol);
        } else {

            yield tryAllProxies(exchange, proxies);
        }
    });

    function test() {
        return _ref16.apply(this, arguments);
    }

    return test;
})()();