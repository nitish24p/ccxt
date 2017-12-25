"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class bitmarket extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bitmarket',
            'name': 'BitMarket',
            'countries': ['PL', 'EU'],
            'rateLimit': 1500,
            'hasCORS': false,
            'hasFetchOHLCV': true,
            'hasWithdraw': true,
            'timeframes': {
                '90m': '90m',
                '6h': '6h',
                '1d': '1d',
                '1w': '7d',
                '1M': '1m',
                '3M': '3m',
                '6M': '6m',
                '1y': '1y'
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27767256-a8555200-5ef9-11e7-96fd-469a65e2b0bd.jpg',
                'api': {
                    'public': 'https://www.bitmarket.net',
                    'private': 'https://www.bitmarket.pl/api2/' // last slash is critical
                },
                'www': ['https://www.bitmarket.pl', 'https://www.bitmarket.net'],
                'doc': ['https://www.bitmarket.net/docs.php?file=api_public.html', 'https://www.bitmarket.net/docs.php?file=api_private.html', 'https://github.com/bitmarket-net/api']
            },
            'api': {
                'public': {
                    'get': ['json/{market}/ticker', 'json/{market}/orderbook', 'json/{market}/trades', 'json/ctransfer', 'graphs/{market}/90m', 'graphs/{market}/6h', 'graphs/{market}/1d', 'graphs/{market}/7d', 'graphs/{market}/1m', 'graphs/{market}/3m', 'graphs/{market}/6m', 'graphs/{market}/1y']
                },
                'private': {
                    'post': ['info', 'trade', 'cancel', 'orders', 'trades', 'history', 'withdrawals', 'tradingdesk', 'tradingdeskStatus', 'tradingdeskConfirm', 'cryptotradingdesk', 'cryptotradingdeskStatus', 'cryptotradingdeskConfirm', 'withdraw', 'withdrawFiat', 'withdrawPLNPP', 'withdrawFiatFast', 'deposit', 'transfer', 'transfers', 'marginList', 'marginOpen', 'marginClose', 'marginCancel', 'marginModify', 'marginBalanceAdd', 'marginBalanceRemove', 'swapList', 'swapOpen', 'swapClose']
                }
            },
            'markets': {
                'BCH/PLN': { 'id': 'BCCPLN', 'symbol': 'BCH/PLN', 'base': 'BCH', 'quote': 'PLN' },
                'BTG/PLN': { 'id': 'BTGPLN', 'symbol': 'BTG/PLN', 'base': 'BTG', 'quote': 'PLN' },
                'BTC/PLN': { 'id': 'BTCPLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
                'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
                'LTC/PLN': { 'id': 'LTCPLN', 'symbol': 'LTC/PLN', 'base': 'LTC', 'quote': 'PLN' },
                'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
                'LiteMineX/BTC': { 'id': 'LiteMineXBTC', 'symbol': 'LiteMineX/BTC', 'base': 'LiteMineX', 'quote': 'BTC' }
            },
            'fees': {
                'trading': {
                    'tierBased': true,
                    'percentage': true,
                    'taker': 0.45 / 100,
                    'maker': 0.15 / 100,
                    'tiers': {
                        'taker': [[0, 0.45 / 100], [99.99, 0.44 / 100], [299.99, 0.43 / 100], [499.99, 0.42 / 100], [999.99, 0.41 / 100], [1999.99, 0.40 / 100], [2999.99, 0.39 / 100], [4999.99, 0.38 / 100], [9999.99, 0.37 / 100], [19999.99, 0.36 / 100], [29999.99, 0.35 / 100], [49999.99, 0.34 / 100], [99999.99, 0.33 / 100], [199999.99, 0.32 / 100], [299999.99, 0.31 / 100], [499999.99, 0.0 / 100]],
                        'maker': [[0, 0.15 / 100], [99.99, 0.14 / 100], [299.99, 0.13 / 100], [499.99, 0.12 / 100], [999.99, 0.11 / 100], [1999.99, 0.10 / 100], [2999.99, 0.9 / 100], [4999.99, 0.8 / 100], [9999.99, 0.7 / 100], [19999.99, 0.6 / 100], [29999.99, 0.5 / 100], [49999.99, 0.4 / 100], [99999.99, 0.3 / 100], [199999.99, 0.2 / 100], [299999.99, 0.1 / 100], [499999.99, 0.0 / 100]]
                    }
                },
                'funding': {
                    'tierBased': false,
                    'percentage': false,
                    'withdraw': {
                        'BTC': 0.0008,
                        'LTC': 0.005,
                        'BCH': 0.0008,
                        'BTG': 0.0008,
                        'DOGE': 1,
                        'EUR': 2,
                        'PLN': 2
                    },
                    'deposit': {
                        'BTC': 0,
                        'LTC': 0,
                        'BCH': 0,
                        'BTG': 0,
                        'DOGE': 25,
                        'EUR': 2, // SEPA. Transfer INT (SHA): 5 EUR
                        'PLN': 0
                    }
                }
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            yield _this.loadMarkets();
            let response = yield _this.privatePostInfo();
            let data = response['data'];
            let balance = data['balances'];
            let result = { 'info': data };
            let currencies = Object.keys(_this.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let account = _this.account();
                if (currency in balance['available']) account['free'] = balance['available'][currency];
                if (currency in balance['blocked']) account['used'] = balance['blocked'][currency];
                account['total'] = _this.sum(account['free'], account['used']);
                result[currency] = account;
            }
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let orderbook = yield _this2.publicGetJsonMarketOrderbook(_this2.extend({
                'market': _this2.marketId(symbol)
            }, params));
            let timestamp = _this2.milliseconds();
            return {
                'bids': orderbook['bids'],
                'asks': orderbook['asks'],
                'timestamp': timestamp,
                'datetime': _this2.iso8601(timestamp)
            };
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            let ticker = yield _this3.publicGetJsonMarketTicker(_this3.extend({
                'market': _this3.marketId(symbol)
            }, params));
            let timestamp = _this3.milliseconds();
            let vwap = parseFloat(ticker['vwap']);
            let baseVolume = parseFloat(ticker['volume']);
            let quoteVolume = baseVolume * vwap;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': vwap,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': baseVolume,
                'quoteVolume': quoteVolume,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market = undefined) {
        let side = trade['type'] == 'bid' ? 'buy' : 'sell';
        let timestamp = trade['date'] * 1000;
        return {
            'id': trade['tid'].toString(),
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'order': undefined,
            'type': undefined,
            'side': side,
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetJsonMarketTrades(_this4.extend({
                'market': market['id']
            }, params));
            return _this4.parseTrades(response, market, since, limit);
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '90m', since = undefined, limit = undefined) {
        return [ohlcv['time'] * 1000, parseFloat(ohlcv['open']), parseFloat(ohlcv['high']), parseFloat(ohlcv['low']), parseFloat(ohlcv['close']), parseFloat(ohlcv['vol'])];
    }

    fetchOHLCV(symbol, timeframe = '90m', since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let method = 'publicGetGraphsMarket' + _this5.timeframes[timeframe];
            let market = _this5.market(symbol);
            let response = yield _this5[method](_this5.extend({
                'market': market['id']
            }, params));
            return _this5.parseOHLCVs(response, market, timeframe, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this6.privatePostTrade(_this6.extend({
                'market': _this6.marketId(symbol),
                'type': side,
                'amount': amount,
                'rate': price
            }, params));
            let result = {
                'info': response
            };
            if ('id' in response['order']) result['id'] = response['id'];
            return result;
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            return yield _this7.privatePostCancel({ 'id': id });
        })();
    }

    isFiat(currency) {
        if (currency == 'EUR') return true;
        if (currency == 'PLN') return true;
        return false;
    }

    withdraw(currency, amount, address, params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            let method = undefined;
            let request = {
                'currency': currency,
                'quantity': amount
            };
            if (_this8.isFiat(currency)) {
                method = 'privatePostWithdrawFiat';
                if ('account' in params) {
                    request['account'] = params['account']; // bank account code for withdrawal
                } else {
                    throw new ExchangeError(_this8.id + ' requires account parameter to withdraw fiat currency');
                }
                if ('account2' in params) {
                    request['account2'] = params['account2']; // bank SWIFT code (EUR only)
                } else {
                    if (currency == 'EUR') throw new ExchangeError(_this8.id + ' requires account2 parameter to withdraw EUR');
                }
                if ('withdrawal_note' in params) {
                    request['withdrawal_note'] = params['withdrawal_note']; // a 10-character user-specified withdrawal note (PLN only)
                } else {
                    if (currency == 'PLN') throw new ExchangeError(_this8.id + ' requires withdrawal_note parameter to withdraw PLN');
                }
            } else {
                method = 'privatePostWithdraw';
                request['address'] = address;
            }
            let response = yield _this8[method](_this8.extend(request, params));
            return {
                'info': response,
                'id': response
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api];
        if (api == 'public') {
            url += '/' + this.implodeParams(path + '.json', params);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            let query = this.extend({
                'tonce': nonce,
                'method': path
            }, params);
            body = this.urlencode(query);
            headers = {
                'API-Key': this.apiKey,
                'API-Hash': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
};