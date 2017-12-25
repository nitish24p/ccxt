"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class itbit extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'itbit',
            'name': 'itBit',
            'countries': 'US',
            'rateLimit': 2000,
            'version': 'v1',
            'hasCORS': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27822159-66153620-60ad-11e7-89e7-005f6d7f3de0.jpg',
                'api': 'https://api.itbit.com',
                'www': 'https://www.itbit.com',
                'doc': ['https://api.itbit.com/docs', 'https://www.itbit.com/api']
            },
            'api': {
                'public': {
                    'get': ['markets/{symbol}/ticker', 'markets/{symbol}/order_book', 'markets/{symbol}/trades']
                },
                'private': {
                    'get': ['wallets', 'wallets/{walletId}', 'wallets/{walletId}/balances/{currencyCode}', 'wallets/{walletId}/funding_history', 'wallets/{walletId}/trades', 'wallets/{walletId}/orders/{id}'],
                    'post': ['wallet_transfers', 'wallets', 'wallets/{walletId}/cryptocurrency_deposits', 'wallets/{walletId}/cryptocurrency_withdrawals', 'wallets/{walletId}/orders', 'wire_withdrawal'],
                    'delete': ['wallets/{walletId}/orders/{id}']
                }
            },
            'markets': {
                'BTC/USD': { 'id': 'XBTUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
                'BTC/SGD': { 'id': 'XBTSGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' },
                'BTC/EUR': { 'id': 'XBTEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' }
            },
            'fees': {
                'trading': {
                    'maker': 0,
                    'taker': 0.2 / 100
                }
            }
        });
    }

    fetchOrderBook(symbol, params = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            let orderbook = yield _this.publicGetMarketsSymbolOrderBook(_this.extend({
                'symbol': _this.marketId(symbol)
            }, params));
            return _this.parseOrderBook(orderbook);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let ticker = yield _this2.publicGetMarketsSymbolTicker(_this2.extend({
                'symbol': _this2.marketId(symbol)
            }, params));
            let serverTimeUTC = 'serverTimeUTC' in ticker;
            if (!serverTimeUTC) throw new ExchangeError(_this2.id + ' fetchTicker returned a bad response: ' + _this2.json(ticker));
            let timestamp = _this2.parse8601(ticker['serverTimeUTC']);
            let vwap = parseFloat(ticker['vwap24h']);
            let baseVolume = parseFloat(ticker['volume24h']);
            let quoteVolume = baseVolume * vwap;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this2.iso8601(timestamp),
                'high': parseFloat(ticker['high24h']),
                'low': parseFloat(ticker['low24h']),
                'bid': _this2.safeFloat(ticker, 'bid'),
                'ask': _this2.safeFloat(ticker, 'ask'),
                'vwap': vwap,
                'open': parseFloat(ticker['openToday']),
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['lastPrice']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': baseVolume,
                'quoteVolume': quoteVolume,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = this.parse8601(trade['timestamp']);
        let id = trade['matchNumber'].toString();
        return {
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'id': id,
            'order': id,
            'type': undefined,
            'side': undefined,
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['amount'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            let market = _this3.market(symbol);
            let response = yield _this3.publicGetMarketsSymbolTrades(_this3.extend({
                'symbol': market['id']
            }, params));
            return _this3.parseTrades(response['recentTrades'], market, since, limit);
        })();
    }

    fetchBalance(params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this4.privateGetBalances();
            let balances = response['balances'];
            let result = { 'info': response };
            for (let b = 0; b < balances.length; b++) {
                let balance = balances[b];
                let currency = balance['currency'];
                let account = {
                    'free': parseFloat(balance['availableBalance']),
                    'used': 0.0,
                    'total': parseFloat(balance['totalBalance'])
                };
                account['used'] = account['total'] - account['free'];
                result[currency] = account;
            }
            return _this4.parseBalance(result);
        })();
    }

    fetchWallets() {
        return this.privateGetWallets();
    }

    nonce() {
        return this.milliseconds();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            if (type == 'market') throw new ExchangeError(_this5.id + ' allows limit orders only');
            let walletIdInParams = 'walletId' in params;
            if (!walletIdInParams) throw new ExchangeError(_this5.id + ' createOrder requires a walletId parameter');
            amount = amount.toString();
            price = price.toString();
            let market = _this5.market(symbol);
            let order = {
                'side': side,
                'type': type,
                'currency': market['base'],
                'amount': amount,
                'display': amount,
                'price': price,
                'instrument': market['id']
            };
            let response = yield _this5.privatePostTradeAdd(_this5.extend(order, params));
            return {
                'info': response,
                'id': response['id']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            let walletIdInParams = 'walletId' in params;
            if (!walletIdInParams) throw new ExchangeError(_this6.id + ' cancelOrder requires a walletId parameter');
            return yield _this6.privateDeleteWalletsWalletIdOrdersId(_this6.extend({
                'id': id
            }, params));
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if (_Object$keys(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            if (_Object$keys(query).length) body = this.json(query);else body = '';
            let nonce = this.nonce().toString();
            let timestamp = nonce;
            let auth = [method, url, body, nonce, timestamp];
            let message = nonce + this.json(auth);
            let hash = this.hash(this.encode(message), 'sha256', 'binary');
            let binhash = this.binaryConcat(url, hash);
            let signature = this.hmac(binhash, this.encode(this.secret), 'sha512', 'base64');
            headers = {
                'Authorization': self.apiKey + ':' + signature,
                'Content-Type': 'application/json',
                'X-Auth-Timestamp': timestamp,
                'X-Auth-Nonce': nonce
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this7.fetch2(path, api, method, params, headers, body);
            if ('code' in response) throw new ExchangeError(_this7.id + ' ' + _this7.json(response));
            return response;
        })();
    }
};