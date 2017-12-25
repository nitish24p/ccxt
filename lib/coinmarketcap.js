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

module.exports = class coinmarketcap extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'coinmarketcap',
            'name': 'CoinMarketCap',
            'rateLimit': 10000,
            'version': 'v1',
            'countries': 'US',
            'hasCORS': true,
            'hasPrivateAPI': false,
            'hasCreateOrder': false,
            'hasCancelOrder': false,
            'hasFetchBalance': false,
            'hasFetchOrderBook': false,
            'hasFetchTrades': false,
            'hasFetchTickers': true,
            'hasFetchCurrencies': true,
            'has': {
                'fetchCurrencies': true
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/28244244-9be6312a-69ed-11e7-99c1-7c1797275265.jpg',
                'api': 'https://api.coinmarketcap.com',
                'www': 'https://coinmarketcap.com',
                'doc': 'https://coinmarketcap.com/api'
            },
            'requiredCredentials': {
                'apiKey': false,
                'secret': false
            },
            'api': {
                'public': {
                    'get': ['ticker/', 'ticker/{id}/', 'global/']
                }
            },
            'currencyCodes': ['AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'HKD', 'IDR', 'INR', 'JPY', 'KRW', 'MXN', 'RUB', 'USD']
        });
    }

    fetchOrderBook(symbol, params = {}) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            throw new ExchangeError('Fetching order books is not supported by the API of ' + _this.id);
        })();
    }

    fetchMarkets() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let markets = yield _this2.publicGetTicker({
                'limit': 0
            });
            let result = [];
            for (let p = 0; p < markets.length; p++) {
                let market = markets[p];
                let currencies = _this2.currencyCodes;
                for (let i = 0; i < currencies.length; i++) {
                    let quote = currencies[i];
                    let quoteId = quote.toLowerCase();
                    let base = market['symbol'];
                    let baseId = market['id'];
                    let symbol = base + '/' + quote;
                    let id = baseId + '/' + quote;
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'baseId': baseId,
                        'quoteId': quoteId,
                        'info': market
                    });
                }
            }
            return result;
        })();
    }

    fetchGlobal(currency = 'USD') {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this3.loadMarkets();
            let request = {};
            if (currency) request['convert'] = currency;
            return yield _this3.publicGetGlobal(request);
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = this.milliseconds();
        if ('last_updated' in ticker) if (ticker['last_updated']) timestamp = parseInt(ticker['last_updated']) * 1000;
        let change = undefined;
        if ('percent_change_24h' in ticker) if (ticker['percent_change_24h']) change = this.safeFloat(ticker, 'percent_change_24h');
        let last = undefined;
        let symbol = undefined;
        let volume = undefined;
        if (market) {
            let priceKey = 'price_' + market['quoteId'];
            if (priceKey in ticker) if (ticker[priceKey]) last = this.safeFloat(ticker, priceKey);
            symbol = market['symbol'];
            let volumeKey = '24h_volume_' + market['quoteId'];
            if (volumeKey in ticker) if (ticker[volumeKey]) volume = this.safeFloat(ticker, volumeKey);
        }
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': undefined,
            'low': undefined,
            'bid': undefined,
            'ask': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': last,
            'change': change,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': volume,
            'info': ticker
        };
    }

    fetchTickers(currency = 'USD', params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this4.loadMarkets();
            let request = {
                'limit': 10000
            };
            if (currency) request['convert'] = currency;
            let response = yield _this4.publicGetTicker(_this4.extend(request, params));
            let tickers = {};
            for (let t = 0; t < response.length; t++) {
                let ticker = response[t];
                let id = ticker['id'] + '/' + currency;
                let symbol = id;
                let market = undefined;
                if (id in _this4.markets_by_id) {
                    market = _this4.markets_by_id[id];
                    symbol = market['symbol'];
                }
                tickers[symbol] = _this4.parseTicker(ticker, market);
            }
            return tickers;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let request = _this5.extend({
                'convert': market['quote'],
                'id': market['baseId']
            }, params);
            let response = yield _this5.publicGetTickerId(request);
            let ticker = response[0];
            return _this5.parseTicker(ticker, market);
        })();
    }

    fetchCurrencies(params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let currencies = yield _this6.publicGetTicker(_this6.extend({
                'limit': 0
            }, params));
            let result = {};
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let id = currency['symbol'];
                // todo: will need to rethink the fees
                // to add support for multiple withdrawal/deposit methods and
                // differentiated fees for each particular method
                let precision = 8; // default precision, todo: fix "magic constants"
                let code = _this6.commonCurrencyCode(id);
                result[code] = {
                    'id': id,
                    'code': code,
                    'info': currency,
                    'name': currency['name'],
                    'active': true,
                    'status': 'ok',
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
                            'max': undefined
                        }
                    }
                };
            }
            return result;
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this7.fetch2(path, api, method, params, headers, body);
            if ('error' in response) {
                if (response['error']) {
                    throw new ExchangeError(_this7.id + ' ' + _this7.json(response));
                }
            }
            return response;
        })();
    }
};