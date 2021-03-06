"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Exchange = require('./base/Exchange');
const { ExchangeError, AuthenticationError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class coinspot extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'coinspot',
            'name': 'CoinSpot',
            'countries': 'AU', // Australia
            'rateLimit': 1000,
            'hasCORS': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/28208429-3cacdf9a-6896-11e7-854e-4c79a772a30f.jpg',
                'api': {
                    'public': 'https://www.coinspot.com.au/pubapi',
                    'private': 'https://www.coinspot.com.au/api'
                },
                'www': 'https://www.coinspot.com.au',
                'doc': 'https://www.coinspot.com.au/api'
            },
            'api': {
                'public': {
                    'get': ['latest']
                },
                'private': {
                    'post': ['orders', 'orders/history', 'my/coin/deposit', 'my/coin/send', 'quote/buy', 'quote/sell', 'my/balances', 'my/orders', 'my/buy', 'my/sell', 'my/buy/cancel', 'my/sell/cancel']
                }
            },
            'markets': {
                'BTC/AUD': { 'id': 'BTC', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD' },
                'LTC/AUD': { 'id': 'LTC', 'symbol': 'LTC/AUD', 'base': 'LTC', 'quote': 'AUD' },
                'DOGE/AUD': { 'id': 'DOGE', 'symbol': 'DOGE/AUD', 'base': 'DOGE', 'quote': 'AUD' }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this.privatePostMyBalances();
            let result = { 'info': response };
            if ('balance' in response) {
                let balances = response['balance'];
                let currencies = (0, _keys2.default)(balances);
                for (let c = 0; c < currencies.length; c++) {
                    let currency = currencies[c];
                    let uppercase = currency.toUpperCase();
                    let account = {
                        'free': balances[currency],
                        'used': 0.0,
                        'total': balances[currency]
                    };
                    if (uppercase == 'DRK') uppercase = 'DASH';
                    result[uppercase] = account;
                }
            }
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this2.market(symbol);
            let orderbook = yield _this2.privatePostOrders(_this2.extend({
                'cointype': market['id']
            }, params));
            let result = _this2.parseOrderBook(orderbook, undefined, 'buyorders', 'sellorders', 'rate', 'amount');
            result['bids'] = _this2.sortBy(result['bids'], 0, true);
            result['asks'] = _this2.sortBy(result['asks'], 0);
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this3.publicGetLatest(params);
            let id = _this3.marketId(symbol);
            id = id.toLowerCase();
            let ticker = response['prices'][id];
            let timestamp = _this3.milliseconds();
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': undefined,
                'info': ticker
            };
        })();
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        return this.privatePostOrdersHistory(this.extend({
            'cointype': this.marketId(symbol)
        }, params));
    }

    createOrder(market, type, side, amount, price = undefined, params = {}) {
        let method = 'privatePostMy' + this.capitalize(side);
        if (type == 'market') throw new ExchangeError(this.id + ' allows limit orders only');
        let order = {
            'cointype': this.marketId(market),
            'amount': amount,
            'rate': price
        };
        return this[method](this.extend(order, params));
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            throw new ExchangeError(_this4.id + ' cancelOrder () is not fully implemented yet');
            let method = 'privatePostMyBuy';
            return yield _this4[method]({ 'id': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        if (!this.apiKey) throw new AuthenticationError(this.id + ' requires apiKey for all requests');
        let url = this.urls['api'][api] + '/' + path;
        if (api == 'private') {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            body = this.json(this.extend({ 'nonce': nonce }, params));
            headers = {
                'Content-Type': 'application/json',
                'key': this.apiKey,
                'sign': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
};