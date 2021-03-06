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

module.exports = class coingi extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'coingi',
            'name': 'Coingi',
            'rateLimit': 1000,
            'countries': ['PA', 'BG', 'CN', 'US'], // Panama, Bulgaria, China, US
            'hasFetchTickers': true,
            'hasCORS': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/28619707-5c9232a8-7212-11e7-86d6-98fe5d15cc6e.jpg',
                'api': {
                    'www': 'https://coingi.com',
                    'current': 'https://api.coingi.com',
                    'user': 'https://api.coingi.com'
                },
                'www': 'https://coingi.com',
                'doc': 'http://docs.coingi.apiary.io/'
            },
            'api': {
                'www': {
                    'get': ['']
                },
                'current': {
                    'get': ['order-book/{pair}/{askCount}/{bidCount}/{depth}', 'transactions/{pair}/{maxCount}', '24hour-rolling-aggregation']
                },
                'user': {
                    'post': ['balance', 'add-order', 'cancel-order', 'orders', 'transactions', 'create-crypto-withdrawal']
                }
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'taker': 0.2 / 100,
                    'maker': 0.2 / 100
                },
                'funding': {
                    'tierBased': false,
                    'percentage': false,
                    'withdraw': {
                        'BTC': 0.001,
                        'LTC': 0.01,
                        'DOGE': 2,
                        'PPC': 0.02,
                        'VTC': 0.2,
                        'NMC': 2,
                        'DASH': 0.002,
                        'USD': 10,
                        'EUR': 10
                    },
                    'deposit': {
                        'BTC': 0,
                        'LTC': 0,
                        'DOGE': 0,
                        'PPC': 0,
                        'VTC': 0,
                        'NMC': 0,
                        'DASH': 0,
                        'USD': 5,
                        'EUR': 1
                    }
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this.parseJsonResponse = false;
            let response = yield _this.wwwGet();
            _this.parseJsonResponse = true;
            let parts = response.split('do=currencyPairSelector-selectCurrencyPair" class="active">');
            let currencyParts = parts[1].split('<div class="currency-pair-label">');
            let result = [];
            for (let i = 1; i < currencyParts.length; i++) {
                let currencyPart = currencyParts[i];
                let idParts = currencyPart.split('</div>');
                let id = idParts[0];
                let symbol = id;
                id = id.replace('/', '-');
                id = id.toLowerCase();
                let [base, quote] = symbol.split('/');
                let precision = {
                    'amount': 8,
                    'price': 8
                };
                let lot = Math.pow(10, -precision['amount']);
                result.push({
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'info': id,
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
            return result;
        })();
    }

    fetchBalance(params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this2.loadMarkets();
            let lowercaseCurrencies = [];
            let currencies = (0, _keys2.default)(_this2.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                lowercaseCurrencies.push(currency.toLowerCase());
            }
            let balances = yield _this2.userPostBalance({
                'currencies': lowercaseCurrencies.join(',')
            });
            let result = { 'info': balances };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = balance['currency']['name'];
                currency = currency.toUpperCase();
                let account = {
                    'free': balance['available'],
                    'used': balance['blocked'] + balance['inOrders'] + balance['withdrawing'],
                    'total': 0.0
                };
                account['total'] = _this2.sum(account['free'], account['used']);
                result[currency] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let orderbook = yield _this3.currentGetOrderBookPairAskCountBidCountDepth(_this3.extend({
                'pair': market['id'],
                'askCount': 512, // maximum returned number of asks 1-512
                'bidCount': 512, // maximum returned number of bids 1-512
                'depth': 32 // maximum number of depth range steps 1-32
            }, params));
            return _this3.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'price', 'baseAmount');
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = this.milliseconds();
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': ticker['high'],
            'low': ticker['low'],
            'bid': ticker['highestBid'],
            'ask': ticker['lowestAsk'],
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': ticker['baseVolume'],
            'quoteVolume': ticker['counterVolume'],
            'info': ticker
        };
        return ticker;
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this4.loadMarkets();
            let response = yield _this4.currentGet24hourRollingAggregation(params);
            let result = {};
            for (let t = 0; t < response.length; t++) {
                let ticker = response[t];
                let base = ticker['currencyPair']['base'].toUpperCase();
                let quote = ticker['currencyPair']['counter'].toUpperCase();
                let symbol = base + '/' + quote;
                let market = undefined;
                if (symbol in _this4.markets) {
                    market = _this4.markets[symbol];
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
            let tickers = yield _this5.fetchTickers(undefined, params);
            if (symbol in tickers) return tickers[symbol];
            throw new ExchangeError(_this5.id + ' return did not contain ' + symbol);
        })();
    }

    parseTrade(trade, market = undefined) {
        if (!market) market = this.markets_by_id[trade['currencyPair']];
        return {
            'id': trade['id'],
            'info': trade,
            'timestamp': trade['timestamp'],
            'datetime': this.iso8601(trade['timestamp']),
            'symbol': market['symbol'],
            'type': undefined,
            'side': undefined, // type
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let response = yield _this6.currentGetTransactionsPairMaxCount(_this6.extend({
                'pair': market['id'],
                'maxCount': 128
            }, params));
            return _this6.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this7.loadMarkets();
            let order = {
                'currencyPair': _this7.marketId(symbol),
                'volume': amount,
                'price': price,
                'orderType': side == 'buy' ? 0 : 1
            };
            let response = yield _this7.userPostAddOrder(_this7.extend(order, params));
            return {
                'info': response,
                'id': response['result']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this8.loadMarkets();
            return yield _this8.userPostCancelOrder({ 'orderId': id });
        })();
    }

    sign(path, api = 'current', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api];
        if (api != 'www') {
            url += '/' + api + '/' + this.implodeParams(path, params);
        }
        let query = this.omit(params, this.extractParams(path));
        if (api == 'current') {
            if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
        } else if (api == 'user') {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            let request = this.extend({
                'token': this.apiKey,
                'nonce': nonce
            }, query);
            let auth = nonce.toString() + '$' + this.apiKey;
            request['signature'] = this.hmac(this.encode(auth), this.encode(this.secret));
            body = this.json(request);
            headers = {
                'Content-Type': 'application/json'
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'current', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this9.fetch2(path, api, method, params, headers, body);
            if (typeof response != 'string') {
                if ('errors' in response) throw new ExchangeError(_this9.id + ' ' + _this9.json(response));
            }
            return response;
        })();
    }
};