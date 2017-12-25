"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Exchange = require('./base/Exchange');
const { NotSupported } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class bitlish extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bitlish',
            'name': 'Bitlish',
            'countries': ['GB', 'EU', 'RU'],
            'rateLimit': 1500,
            'version': 'v1',
            'hasCORS': false,
            'hasFetchTickers': true,
            'hasFetchOHLCV': true,
            'hasWithdraw': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766275-dcfc6c30-5ed3-11e7-839d-00a846385d0b.jpg',
                'api': 'https://bitlish.com/api',
                'www': 'https://bitlish.com',
                'doc': 'https://bitlish.com/api'
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': false
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'taker': 0.3 / 100, // anonymous 0.3%, verified 0.2%
                    'maker': 0
                },
                'funding': {
                    'tierBased': false,
                    'percentage': false,
                    'withdraw': {
                        'BTC': 0.001,
                        'LTC': 0.001,
                        'DOGE': 0.001,
                        'ETH': 0.001,
                        'XMR': 0,
                        'ZEC': 0.001,
                        'DASH': 0.0001,
                        'EUR': 50
                    },
                    'deposit': {
                        'BTC': 0,
                        'LTC': 0,
                        'DOGE': 0,
                        'ETH': 0,
                        'XMR': 0,
                        'ZEC': 0,
                        'DASH': 0,
                        'EUR': 0
                    }
                }
            },
            'api': {
                'public': {
                    'get': ['instruments', 'ohlcv', 'pairs', 'tickers', 'trades_depth', 'trades_history'],
                    'post': ['instruments', 'ohlcv', 'pairs', 'tickers', 'trades_depth', 'trades_history']
                },
                'private': {
                    'post': ['accounts_operations', 'balance', 'cancel_trade', 'cancel_trades_by_ids', 'cancel_all_trades', 'create_bcode', 'create_template_wallet', 'create_trade', 'deposit', 'list_accounts_operations_from_ts', 'list_active_trades', 'list_bcodes', 'list_my_matches_from_ts', 'list_my_trades', 'list_my_trads_from_ts', 'list_payment_methods', 'list_payments', 'redeem_code', 'resign', 'signin', 'signout', 'trade_details', 'trade_options', 'withdraw', 'withdraw_by_id']
                }
            }
        });
    }

    commonCurrencyCode(currency) {
        if (!this.substituteCommonCurrencyCodes) return currency;
        if (currency == 'XBT') return 'BTC';
        if (currency == 'BCC') return 'BCH';
        if (currency == 'DRK') return 'DASH';
        if (currency == 'DSH') currency = 'DASH';
        if (currency == 'XDG') currency = 'DOGE';
        return currency;
    }

    fetchMarkets() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let markets = yield _this.publicGetPairs();
            let result = [];
            let keys = (0, _keys2.default)(markets);
            for (let p = 0; p < keys.length; p++) {
                let market = markets[keys[p]];
                let id = market['id'];
                let symbol = market['name'];
                let [base, quote] = symbol.split('/');
                base = _this.commonCurrencyCode(base);
                quote = _this.commonCurrencyCode(quote);
                symbol = base + '/' + quote;
                result.push({
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'info': market
                });
            }
            return result;
        })();
    }

    parseTicker(ticker, market) {
        let timestamp = this.milliseconds();
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'high': this.safeFloat(ticker, 'max'),
            'low': this.safeFloat(ticker, 'min'),
            'bid': undefined,
            'ask': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': this.safeFloat(ticker, 'first'),
            'last': this.safeFloat(ticker, 'last'),
            'change': undefined,
            'percentage': this.safeFloat(ticker, 'prc'),
            'average': undefined,
            'baseVolume': this.safeFloat(ticker, 'sum'),
            'quoteVolume': undefined,
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this2.loadMarkets();
            let tickers = yield _this2.publicGetTickers(params);
            let ids = (0, _keys2.default)(tickers);
            let result = {};
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let market = _this2.markets_by_id[id];
                let symbol = market['symbol'];
                let ticker = tickers[id];
                result[symbol] = _this2.parseTicker(ticker, market);
            }
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let tickers = yield _this3.publicGetTickers(params);
            let ticker = tickers[market['id']];
            return _this3.parseTicker(ticker, market);
        })();
    }

    fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this4.loadMarkets();
            // let market = this.market (symbol);
            let now = _this4.seconds();
            let start = now - 86400 * 30; // last 30 days
            let interval = [start.toString(), undefined];
            return yield _this4.publicPostOhlcv(_this4.extend({
                'time_range': interval
            }, params));
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this5.loadMarkets();
            let orderbook = yield _this5.publicGetTradesDepth(_this5.extend({
                'pair_id': _this5.marketId(symbol)
            }, params));
            let timestamp = undefined;
            let last = _this5.safeInteger(orderbook, 'last');
            if (last) timestamp = parseInt(last / 1000);
            return _this5.parseOrderBook(orderbook, timestamp, 'bid', 'ask', 'price', 'volume');
        })();
    }

    parseTrade(trade, market = undefined) {
        let side = trade['dir'] == 'bid' ? 'buy' : 'sell';
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        let timestamp = parseInt(trade['created'] / 1000);
        return {
            'id': undefined,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'order': undefined,
            'type': undefined,
            'side': side,
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let response = yield _this6.publicGetTradesHistory(_this6.extend({
                'pair_id': market['id']
            }, params));
            return _this6.parseTrades(response['list'], market, since, limit);
        })();
    }

    fetchBalance(params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this7.loadMarkets();
            let response = yield _this7.privatePostBalance();
            let result = { 'info': response };
            let currencies = (0, _keys2.default)(response);
            let balance = {};
            for (let c = 0; c < currencies.length; c++) {
                let currency = currencies[c];
                let account = response[currency];
                currency = currency.toUpperCase();
                // issue #4 bitlish names Dash as DSH, instead of DASH
                if (currency == 'DSH') currency = 'DASH';
                if (currency == 'XDG') currency = 'DOGE';
                balance[currency] = account;
            }
            currencies = (0, _keys2.default)(_this7.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let account = _this7.account();
                if (currency in balance) {
                    account['free'] = parseFloat(balance[currency]['funds']);
                    account['used'] = parseFloat(balance[currency]['holded']);
                    account['total'] = _this7.sum(account['free'], account['used']);
                }
                result[currency] = account;
            }
            return _this7.parseBalance(result);
        })();
    }

    signIn() {
        return this.privatePostSignin({
            'login': this.login,
            'passwd': this.password
        });
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this8.loadMarkets();
            let order = {
                'pair_id': _this8.marketId(symbol),
                'dir': side == 'buy' ? 'bid' : 'ask',
                'amount': amount
            };
            if (type == 'limit') order['price'] = price;
            let result = yield _this8.privatePostCreateTrade(_this8.extend(order, params));
            return {
                'info': result,
                'id': result['id']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this9.loadMarkets();
            return yield _this9.privatePostCancelTrade({ 'id': id });
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this10 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this10.loadMarkets();
            if (currency != 'BTC') {
                // they did not document other types...
                throw new NotSupported(_this10.id + ' currently supports BTC withdrawals only, until they document other currencies...');
            }
            let response = yield _this10.privatePostWithdraw(_this10.extend({
                'currency': currency.toLowerCase(),
                'amount': parseFloat(amount),
                'account': address,
                'payment_method': 'bitcoin' // they did not document other types...
            }, params));
            return {
                'info': response,
                'id': response['message_id']
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.version + '/' + path;
        if (api == 'public') {
            if (method == 'GET') {
                if ((0, _keys2.default)(params).length) url += '?' + this.urlencode(params);
            } else {
                body = this.json(params);
                headers = { 'Content-Type': 'application/json' };
            }
        } else {
            this.checkRequiredCredentials();
            body = this.json(this.extend({ 'token': this.apiKey }, params));
            headers = { 'Content-Type': 'application/json' };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
};