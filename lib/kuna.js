"use strict";

// ---------------------------------------------------------------------------

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const acx = require('./acx.js');
const { ExchangeError, InsufficientFunds, OrderNotFound } = require('./base/errors');

// ---------------------------------------------------------------------------

module.exports = class kuna extends acx {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'kuna',
            'name': 'Kuna',
            'countries': 'UA',
            'rateLimit': 1000,
            'version': 'v2',
            'hasCORS': false,
            'hasFetchTickers': false,
            'hasFetchOHLCV': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/31697638-912824fa-b3c1-11e7-8c36-cf9606eb94ac.jpg',
                'api': 'https://kuna.io',
                'www': 'https://kuna.io',
                'doc': 'https://kuna.io/documents/api'
            },
            'api': {
                'public': {
                    'get': ['tickers/{market}', 'order_book', 'order_book/{market}', 'trades', 'trades/{market}', 'timestamp']
                },
                'private': {
                    'get': ['members/me', 'orders', 'trades/my'],
                    'post': ['orders', 'order/delete']
                }
            },
            'markets': {
                'BTC/UAH': { 'id': 'btcuah', 'symbol': 'BTC/UAH', 'base': 'BTC', 'quote': 'UAH', 'precision': { 'amount': 6, 'price': 0 }, 'lot': 0.000001, 'limits': { 'amount': { 'min': 0.000001, 'max': undefined }, 'price': { 'min': 1, 'max': undefined } } },
                'ETH/UAH': { 'id': 'ethuah', 'symbol': 'ETH/UAH', 'base': 'ETH', 'quote': 'UAH', 'precision': { 'amount': 6, 'price': 0 }, 'lot': 0.000001, 'limits': { 'amount': { 'min': 0.000001, 'max': undefined }, 'price': { 'min': 1, 'max': undefined } } },
                'GBG/UAH': { 'id': 'gbguah', 'symbol': 'GBG/UAH', 'base': 'GBG', 'quote': 'UAH', 'precision': { 'amount': 3, 'price': 2 }, 'lot': 0.001, 'limits': { 'amount': { 'min': 0.000001, 'max': undefined }, 'price': { 'min': 0.01, 'max': undefined } } }, // Golos Gold (GBG != GOLOS)
                'KUN/BTC': { 'id': 'kunbtc', 'symbol': 'KUN/BTC', 'base': 'KUN', 'quote': 'BTC', 'precision': { 'amount': 6, 'price': 6 }, 'lot': 0.000001, 'limits': { 'amount': { 'min': 0.000001, 'max': undefined }, 'price': { 'min': 0.000001, 'max': undefined } } },
                'BCH/BTC': { 'id': 'bchbtc', 'symbol': 'BCH/BTC', 'base': 'BCH', 'quote': 'BTC', 'precision': { 'amount': 6, 'price': 6 }, 'lot': 0.000001, 'limits': { 'amount': { 'min': 0.000001, 'max': undefined }, 'price': { 'min': 0.000001, 'max': undefined } } },
                'WAVES/UAH': { 'id': 'wavesuah', 'symbol': 'WAVES/UAH', 'base': 'WAVES', 'quote': 'UAH', 'precision': { 'amount': 6, 'price': 0 }, 'lot': 0.000001, 'limits': { 'amount': { 'min': 0.000001, 'max': undefined }, 'price': { 'min': 1, 'max': undefined } } }
            },
            'fees': {
                'trading': {
                    'taker': 0.25 / 100,
                    'maker': 0.25 / 100
                }
            }
        });
    }

    handleErrors(code, reason, url, method, headers, body) {
        if (code == 400) {
            let data = JSON.parse(body);
            let error = data['error'];
            let errorCode = error['code'];
            if (errorCode == 2002) {
                throw new InsufficientFunds([this.id, method, url, code, reason, body].join(' '));
            } else if (errorCode == 2003) {
                throw new OrderNotFound([this.id, method, url, code, reason, body].join(' '));
            }
        }
    }

    fetchOrderBook(symbol, params = {}) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this.market(symbol);
            let orderBook = yield _this.publicGetOrderBook(_this.extend({
                'market': market['id']
            }, params));
            return _this.parseOrderBook(orderBook, undefined, 'bids', 'asks', 'price', 'remaining_volume');
        })();
    }

    fetchL3OrderBook(symbol, params) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return _this2.fetchOrderBook(symbol, params);
        })();
    }

    fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!symbol) throw new ExchangeError(_this3.id + ' fetchOpenOrders requires a symbol argument');
            let market = _this3.market(symbol);
            let orders = yield _this3.privateGetOrders(_this3.extend({
                'market': market['id']
            }, params));
            // todo emulation of fetchClosedOrders, fetchOrders, fetchOrder
            // with order cache + fetchOpenOrders
            // as in BTC-e, Liqui, Yobit, DSX, Tidex, WEX
            return _this3.parseOrders(orders, market, since, limit);
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestamp = this.parse8601(trade['created_at']);
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'id': trade['id'],
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'type': undefined,
            'side': undefined,
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['volume']),
            'info': trade
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetTrades(_this4.extend({
                'market': market['id']
            }, params));
            return _this4.parseTrades(response, market, since, limit);
        })();
    }

    parseMyTrade(trade, market) {
        let timestamp = this.parse8601(trade['created_at']);
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'id': trade['id'],
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'price': trade['price'],
            'amount': trade['volume'],
            'cost': trade['funds'],
            'symbol': symbol,
            'side': trade['side'],
            'order': trade['order_id']
        };
    }

    parseMyTrades(trades, market = undefined) {
        let parsedTrades = [];
        for (let i = 0; i < trades.length; i++) {
            let trade = trades[i];
            let parsedTrade = this.parseMyTrade(trade, market);
            parsedTrades.push(parsedTrade);
        }
        return parsedTrades;
    }

    fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!symbol) throw new ExchangeError(_this5.id + ' fetchOpenOrders requires a symbol argument');
            let market = _this5.market(symbol);
            let response = yield _this5.privateGetTradesMy({ 'market': market['id'] });
            return _this5.parseMyTrades(response, market);
        })();
    }
};