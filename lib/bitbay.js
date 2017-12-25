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

module.exports = class bitbay extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bitbay',
            'name': 'BitBay',
            'countries': ['PL', 'EU'], // Poland
            'rateLimit': 1000,
            'hasCORS': true,
            'hasWithdraw': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766132-978a7bd8-5ece-11e7-9540-bc96d1e9bbb8.jpg',
                'www': 'https://bitbay.net',
                'api': {
                    'public': 'https://bitbay.net/API/Public',
                    'private': 'https://bitbay.net/API/Trading/tradingApi.php'
                },
                'doc': ['https://bitbay.net/public-api', 'https://bitbay.net/account/tab-api', 'https://github.com/BitBayNet/API']
            },
            'api': {
                'public': {
                    'get': ['{id}/all', '{id}/market', '{id}/orderbook', '{id}/ticker', '{id}/trades']
                },
                'private': {
                    'post': ['info', 'trade', 'cancel', 'orderbook', 'orders', 'transfer', 'withdraw', 'history', 'transactions']
                }
            },
            'markets': {
                'BTC/USD': { 'id': 'BTCUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'baseId': 'BTC', 'quoteId': 'USD' },
                'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR', 'baseId': 'BTC', 'quoteId': 'EUR' },
                'BTC/PLN': { 'id': 'BTCPLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN', 'baseId': 'BTC', 'quoteId': 'PLN' },
                'LTC/USD': { 'id': 'LTCUSD', 'symbol': 'LTC/USD', 'base': 'LTC', 'quote': 'USD', 'baseId': 'LTC', 'quoteId': 'USD' },
                'LTC/EUR': { 'id': 'LTCEUR', 'symbol': 'LTC/EUR', 'base': 'LTC', 'quote': 'EUR', 'baseId': 'LTC', 'quoteId': 'EUR' },
                'LTC/PLN': { 'id': 'LTCPLN', 'symbol': 'LTC/PLN', 'base': 'LTC', 'quote': 'PLN', 'baseId': 'LTC', 'quoteId': 'PLN' },
                'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'baseId': 'LTC', 'quoteId': 'BTC' },
                'ETH/USD': { 'id': 'ETHUSD', 'symbol': 'ETH/USD', 'base': 'ETH', 'quote': 'USD', 'baseId': 'ETH', 'quoteId': 'USD' },
                'ETH/EUR': { 'id': 'ETHEUR', 'symbol': 'ETH/EUR', 'base': 'ETH', 'quote': 'EUR', 'baseId': 'ETH', 'quoteId': 'EUR' },
                'ETH/PLN': { 'id': 'ETHPLN', 'symbol': 'ETH/PLN', 'base': 'ETH', 'quote': 'PLN', 'baseId': 'ETH', 'quoteId': 'PLN' },
                'ETH/BTC': { 'id': 'ETHBTC', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'baseId': 'ETH', 'quoteId': 'BTC' },
                'LSK/USD': { 'id': 'LSKUSD', 'symbol': 'LSK/USD', 'base': 'LSK', 'quote': 'USD', 'baseId': 'LSK', 'quoteId': 'USD' },
                'LSK/EUR': { 'id': 'LSKEUR', 'symbol': 'LSK/EUR', 'base': 'LSK', 'quote': 'EUR', 'baseId': 'LSK', 'quoteId': 'EUR' },
                'LSK/PLN': { 'id': 'LSKPLN', 'symbol': 'LSK/PLN', 'base': 'LSK', 'quote': 'PLN', 'baseId': 'LSK', 'quoteId': 'PLN' },
                'LSK/BTC': { 'id': 'LSKBTC', 'symbol': 'LSK/BTC', 'base': 'LSK', 'quote': 'BTC', 'baseId': 'LSK', 'quoteId': 'BTC' },
                'BCH/USD': { 'id': 'BCCUSD', 'symbol': 'BCH/USD', 'base': 'BCH', 'quote': 'USD', 'baseId': 'BCC', 'quoteId': 'USD' },
                'BCH/EUR': { 'id': 'BCCEUR', 'symbol': 'BCH/EUR', 'base': 'BCH', 'quote': 'EUR', 'baseId': 'BCC', 'quoteId': 'EUR' },
                'BCH/PLN': { 'id': 'BCCPLN', 'symbol': 'BCH/PLN', 'base': 'BCH', 'quote': 'PLN', 'baseId': 'BCC', 'quoteId': 'PLN' },
                'BCH/BTC': { 'id': 'BCCBTC', 'symbol': 'BCH/BTC', 'base': 'BCH', 'quote': 'BTC', 'baseId': 'BCC', 'quoteId': 'BTC' },
                'BTG/USD': { 'id': 'BTGUSD', 'symbol': 'BTG/USD', 'base': 'BTG', 'quote': 'USD', 'baseId': 'BTG', 'quoteId': 'USD' },
                'BTG/EUR': { 'id': 'BTGEUR', 'symbol': 'BTG/EUR', 'base': 'BTG', 'quote': 'EUR', 'baseId': 'BTG', 'quoteId': 'EUR' },
                'BTG/PLN': { 'id': 'BTGPLN', 'symbol': 'BTG/PLN', 'base': 'BTG', 'quote': 'PLN', 'baseId': 'BTG', 'quoteId': 'PLN' },
                'BTG/BTC': { 'id': 'BTGBTC', 'symbol': 'BTG/BTC', 'base': 'BTG', 'quote': 'BTC', 'baseId': 'BTG', 'quoteId': 'BTC' },
                'DASH/USD': { 'id': 'DASHUSD', 'symbol': 'DASH/USD', 'base': 'DASH', 'quote': 'USD', 'baseId': 'DASH', 'quoteId': 'USD' },
                'DASH/EUR': { 'id': 'DASHEUR', 'symbol': 'DASH/EUR', 'base': 'DASH', 'quote': 'EUR', 'baseId': 'DASH', 'quoteId': 'EUR' },
                'DASH/PLN': { 'id': 'DASHPLN', 'symbol': 'DASH/PLN', 'base': 'DASH', 'quote': 'PLN', 'baseId': 'DASH', 'quoteId': 'PLN' },
                'DASH/BTC': { 'id': 'DASHBTC', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC', 'baseId': 'DASH', 'quoteId': 'BTC' },
                'GAME/USD': { 'id': 'GAMEUSD', 'symbol': 'GAME/USD', 'base': 'GAME', 'quote': 'USD', 'baseId': 'GAME', 'quoteId': 'USD' },
                'GAME/EUR': { 'id': 'GAMEEUR', 'symbol': 'GAME/EUR', 'base': 'GAME', 'quote': 'EUR', 'baseId': 'GAME', 'quoteId': 'EUR' },
                'GAME/PLN': { 'id': 'GAMEPLN', 'symbol': 'GAME/PLN', 'base': 'GAME', 'quote': 'PLN', 'baseId': 'GAME', 'quoteId': 'PLN' },
                'GAME/BTC': { 'id': 'GAMEBTC', 'symbol': 'GAME/BTC', 'base': 'GAME', 'quote': 'BTC', 'baseId': 'GAME', 'quoteId': 'BTC' }
            },
            'fees': {
                'trading': {
                    'maker': 0.3 / 100,
                    'taker': 0.0043
                }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this.privatePostInfo();
            if ('balances' in response) {
                let balance = response['balances'];
                let result = { 'info': balance };
                let codes = (0, _keys2.default)(_this.currencies);
                for (let i = 0; i < codes.length; i++) {
                    let code = codes[i];
                    let currency = _this.currencies[code];
                    let id = currency['id'];
                    let account = _this.account();
                    if (id in balance) {
                        account['free'] = parseFloat(balance[id]['available']);
                        account['used'] = parseFloat(balance[id]['locked']);
                        account['total'] = _this.sum(account['free'], account['used']);
                    }
                    result[code] = account;
                }
                return _this.parseBalance(result);
            }
            throw new ExchangeError(_this.id + ' empty balance response ' + _this.json(response));
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let orderbook = yield _this2.publicGetIdOrderbook(_this2.extend({
                'id': _this2.marketId(symbol)
            }, params));
            return _this2.parseOrderBook(orderbook);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let ticker = yield _this3.publicGetIdTicker(_this3.extend({
                'id': _this3.marketId(symbol)
            }, params));
            let timestamp = _this3.milliseconds();
            let baseVolume = _this3.safeFloat(ticker, 'volume');
            let vwap = _this3.safeFloat(ticker, 'vwap');
            let quoteVolume = baseVolume * vwap;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': _this3.safeFloat(ticker, 'max'),
                'low': _this3.safeFloat(ticker, 'min'),
                'bid': _this3.safeFloat(ticker, 'bid'),
                'ask': _this3.safeFloat(ticker, 'ask'),
                'vwap': vwap,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': _this3.safeFloat(ticker, 'last'),
                'change': undefined,
                'percentage': undefined,
                'average': _this3.safeFloat(ticker, 'average'),
                'baseVolume': baseVolume,
                'quoteVolume': quoteVolume,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = trade['date'] * 1000;
        return {
            'id': trade['tid'],
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': trade['type'],
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetIdTrades(_this4.extend({
                'id': market['id']
            }, params));
            return _this4.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this5.market(symbol);
            return _this5.privatePostTrade(_this5.extend({
                'type': side,
                'currency': market['baseId'],
                'amount': amount,
                'payment_currency': market['quoteId'],
                'rate': price
            }, params));
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return yield _this6.privatePostCancel({ 'id': id });
        })();
    }

    isFiat(currency) {
        let fiatCurrencies = {
            'USD': true,
            'EUR': true,
            'PLN': true
        };
        if (currency in fiatCurrencies) return true;
        return false;
    }

    withdraw(code, amount, address, params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this7.loadMarkets();
            let method = undefined;
            let currency = _this7.currency(code);
            let request = {
                'currency': currency['id'],
                'quantity': amount
            };
            if (_this7.isFiat(code)) {
                method = 'privatePostWithdraw';
                // request['account'] = params['account']; // they demand an account number
                // request['express'] = params['express']; // whatever it means, they don't explain
                // request['bic'] = '';
            } else {
                method = 'privatePostTransfer';
                request['address'] = address;
            }
            let response = yield _this7[method](_this7.extend(request, params));
            return {
                'info': response,
                'id': undefined
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api];
        if (api == 'public') {
            url += '/' + this.implodeParams(path, params) + '.json';
        } else {
            this.checkRequiredCredentials();
            body = this.urlencode(this.extend({
                'method': path,
                'moment': this.nonce()
            }, params));
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'API-Key': this.apiKey,
                'API-Hash': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
};