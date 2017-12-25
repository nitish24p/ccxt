"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class ccex extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'ccex',
            'name': 'C-CEX',
            'countries': ['DE', 'EU'],
            'rateLimit': 1500,
            'hasCORS': false,
            'hasFetchTickers': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766433-16881f90-5ed8-11e7-92f8-3d92cc747a6c.jpg',
                'api': {
                    'tickers': 'https://c-cex.com/t',
                    'public': 'https://c-cex.com/t/api_pub.html',
                    'private': 'https://c-cex.com/t/api.html'
                },
                'www': 'https://c-cex.com',
                'doc': 'https://c-cex.com/?id=api'
            },
            'api': {
                'tickers': {
                    'get': ['coinnames', '{market}', 'pairs', 'prices', 'volume_{coin}']
                },
                'public': {
                    'get': ['balancedistribution', 'markethistory', 'markets', 'marketsummaries', 'orderbook']
                },
                'private': {
                    'get': ['buylimit', 'cancel', 'getbalance', 'getbalances', 'getopenorders', 'getorder', 'getorderhistory', 'mytrades', 'selllimit']
                }
            },
            'fees': {
                'trading': {
                    'taker': 0.2 / 100,
                    'maker': 0.2 / 100
                }
            }
        });
    }

    commonCurrencyCode(currency) {
        if (currency == 'IOT') return 'IoTcoin';
        if (currency == 'BLC') return 'Cryptobullcoin';
        if (currency == 'XID') return 'InternationalDiamond';
        return currency;
    }

    fetchMarkets() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let markets = yield _this.publicGetMarkets();
            let result = [];
            for (let p = 0; p < markets['result'].length; p++) {
                let market = markets['result'][p];
                let id = market['MarketName'];
                let base = market['MarketCurrency'];
                let quote = market['BaseCurrency'];
                base = _this.commonCurrencyCode(base);
                quote = _this.commonCurrencyCode(quote);
                let symbol = base + '/' + quote;
                result.push(_this.extend(_this.fees['trading'], {
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'info': market
                }));
            }
            return result;
        })();
    }

    fetchBalance(params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this2.loadMarkets();
            let response = yield _this2.privateGetBalances();
            let balances = response['result'];
            let result = { 'info': balances };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let code = balance['Currency'];
                let currency = _this2.commonCurrencyCode(code);
                let account = {
                    'free': balance['Available'],
                    'used': balance['Pending'],
                    'total': balance['Balance']
                };
                result[currency] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this3.loadMarkets();
            let response = yield _this3.publicGetOrderbook(_this3.extend({
                'market': _this3.marketId(symbol),
                'type': 'both',
                'depth': 100
            }, params));
            let orderbook = response['result'];
            return _this3.parseOrderBook(orderbook, undefined, 'buy', 'sell', 'Rate', 'Quantity');
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = ticker['updated'] * 1000;
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': parseFloat(ticker['high']),
            'low': parseFloat(ticker['low']),
            'bid': parseFloat(ticker['buy']),
            'ask': parseFloat(ticker['sell']),
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': parseFloat(ticker['lastprice']),
            'change': undefined,
            'percentage': undefined,
            'average': parseFloat(ticker['avg']),
            'baseVolume': undefined,
            'quoteVolume': this.safeFloat(ticker, 'buysupport'),
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this4.loadMarkets();
            let tickers = yield _this4.tickersGetPrices(params);
            let result = { 'info': tickers };
            let ids = (0, _keys2.default)(tickers);
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let ticker = tickers[id];
                let uppercase = id.toUpperCase();
                let market = undefined;
                let symbol = undefined;
                if (uppercase in _this4.markets_by_id) {
                    market = _this4.markets_by_id[uppercase];
                    symbol = market['symbol'];
                } else {
                    let [base, quote] = uppercase.split('-');
                    base = _this4.commonCurrencyCode(base);
                    quote = _this4.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;
                }
                result[symbol] = _this4.parseTicker(ticker, market);
            }
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let response = yield _this5.tickersGetMarket(_this5.extend({
                'market': market['id'].toLowerCase()
            }, params));
            let ticker = response['ticker'];
            return _this5.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market) {
        let timestamp = this.parse8601(trade['TimeStamp']);
        return {
            'id': trade['Id'],
            'info': trade,
            'order': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': trade['OrderType'].toLowerCase(),
            'price': trade['Price'],
            'amount': trade['Quantity']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let response = yield _this6.publicGetMarkethistory(_this6.extend({
                'market': market['id'],
                'type': 'both',
                'depth': 100
            }, params));
            return _this6.parseTrades(response['result'], market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this7.loadMarkets();
            let method = 'privateGet' + _this7.capitalize(side) + type;
            let response = yield _this7[method](_this7.extend({
                'market': _this7.marketId(symbol),
                'quantity': amount,
                'rate': price
            }, params));
            return {
                'info': response,
                'id': response['result']['uuid']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this8.loadMarkets();
            return yield _this8.privateGetCancel({ 'uuid': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api];
        if (api == 'private') {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            let query = this.keysort(this.extend({
                'a': path,
                'apikey': this.apiKey,
                'nonce': nonce
            }, params));
            url += '?' + this.urlencode(query);
            headers = { 'apisign': this.hmac(this.encode(url), this.encode(this.secret), 'sha512') };
        } else if (api == 'public') {
            url += '?' + this.urlencode(this.extend({
                'a': 'get' + path
            }, params));
        } else {
            url += '/' + this.implodeParams(path, params) + '.json';
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this9.fetch2(path, api, method, params, headers, body);
            if (api == 'tickers') return response;
            if ('success' in response) if (response['success']) return response;
            throw new ExchangeError(_this9.id + ' ' + _this9.json(response));
        })();
    }
};