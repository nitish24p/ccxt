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

module.exports = class mercado extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'mercado',
            'name': 'Mercado Bitcoin',
            'countries': 'BR', // Brazil
            'rateLimit': 1000,
            'version': 'v3',
            'hasCORS': true,
            'hasWithdraw': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27837060-e7c58714-60ea-11e7-9192-f05e86adb83f.jpg',
                'api': {
                    'public': 'https://www.mercadobitcoin.net/api',
                    'private': 'https://www.mercadobitcoin.net/tapi'
                },
                'www': 'https://www.mercadobitcoin.com.br',
                'doc': ['https://www.mercadobitcoin.com.br/api-doc', 'https://www.mercadobitcoin.com.br/trade-api']
            },
            'api': {
                'public': {
                    'get': ['{coin}/orderbook/', // last slash critical
                    '{coin}/ticker/', '{coin}/trades/', '{coin}/trades/{from}/', '{coin}/trades/{from}/{to}', '{coin}/day-summary/{year}/{month}/{day}/']
                },
                'private': {
                    'post': ['cancel_order', 'get_account_info', 'get_order', 'get_withdrawal', 'list_system_messages', 'list_orders', 'list_orderbook', 'place_buy_order', 'place_sell_order', 'withdraw_coin']
                }
            },
            'markets': {
                'BTC/BRL': { 'id': 'BRLBTC', 'symbol': 'BTC/BRL', 'base': 'BTC', 'quote': 'BRL', 'suffix': 'Bitcoin' },
                'LTC/BRL': { 'id': 'BRLLTC', 'symbol': 'LTC/BRL', 'base': 'LTC', 'quote': 'BRL', 'suffix': 'Litecoin' },
                'BCH/BRL': { 'id': 'BRLBCH', 'symbol': 'BCH/BRL', 'base': 'BCH', 'quote': 'BRL', 'suffix': 'BCash' }
            },
            'fees': {
                'trading': {
                    'maker': 0.3 / 100,
                    'taker': 0.7 / 100
                }
            }
        });
    }

    fetchOrderBook(symbol, params = {}) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this.market(symbol);
            let orderbook = yield _this.publicGetCoinOrderbook(_this.extend({
                'coin': market['base']
            }, params));
            return _this.parseOrderBook(orderbook);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this2.market(symbol);
            let response = yield _this2.publicGetCoinTicker(_this2.extend({
                'coin': market['base']
            }, params));
            let ticker = response['ticker'];
            let timestamp = parseInt(ticker['date']) * 1000;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this2.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy']),
                'ask': parseFloat(ticker['sell']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['vol']),
                'quoteVolume': undefined,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = trade['date'] * 1000;
        return {
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'id': trade['tid'].toString(),
            'order': undefined,
            'type': undefined,
            'side': trade['type'],
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this3.market(symbol);
            let response = yield _this3.publicGetCoinTrades(_this3.extend({
                'coin': market['base']
            }, params));
            return _this3.parseTrades(response, market, since, limit);
        })();
    }

    fetchBalance(params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this4.privatePostGetAccountInfo();
            let balances = response['response_data']['balance'];
            let result = { 'info': response };
            let currencies = (0, _keys2.default)(_this4.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let lowercase = currency.toLowerCase();
                let account = _this4.account();
                if (lowercase in balances) {
                    account['free'] = parseFloat(balances[lowercase]['available']);
                    account['total'] = parseFloat(balances[lowercase]['total']);
                    account['used'] = account['total'] - account['free'];
                }
                result[currency] = account;
            }
            return _this4.parseBalance(result);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (type == 'market') throw new ExchangeError(_this5.id + ' allows limit orders only');
            let method = 'privatePostPlace' + _this5.capitalize(side) + 'Order';
            let order = {
                'coin_pair': _this5.marketId(symbol),
                'quantity': amount,
                'limit_price': price
            };
            let response = yield _this5[method](_this5.extend(order, params));
            return {
                'info': response,
                'id': response['response_data']['order']['order_id'].toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!symbol) throw new ExchangeError(_this6.id + ' cancelOrder() requires a symbol argument');
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            return yield _this6.privatePostCancelOrder(_this6.extend({
                'coin_pair': market['id'],
                'order_id': id
            }, params));
        })();
    }

    parseOrder(order, market = undefined) {
        let side = undefined;
        if ('order_type' in order) side = order['order_type'] == 1 ? 'buy' : 'sell';
        let status = order['status'];
        let symbol = undefined;
        if (!market) {
            if ('coin_pair' in order) if (order['coin_pair'] in this.markets_by_id) market = this.markets_by_id[order['coin_pair']];
        }
        if (market) symbol = market['symbol'];
        let timestamp = undefined;
        if ('created_timestamp' in order) timestamp = parseInt(order['created_timestamp']) * 1000;
        if ('updated_timestamp' in order) timestamp = parseInt(order['updated_timestamp']) * 1000;
        let fee = {
            'cost': parseFloat(order['fee']),
            'currency': market['quote']
        };
        let price = this.safeFloat(order, 'limit_price');
        // price = this.safeFloat (order, 'executed_price_avg', price);
        let average = this.safeFloat(order, 'executed_price_avg');
        let amount = this.safeFloat(order, 'quantity');
        let filled = this.safeFloat(order, 'executed_quantity');
        let remaining = amount - filled;
        let cost = amount * average;
        let result = {
            'info': order,
            'id': order['order_id'].toString(),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'type': 'limit',
            'side': side,
            'price': price,
            'cost': cost,
            'average': average,
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'status': status,
            'fee': fee
        };
        return result;
    }

    fetchOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!symbol) throw new ExchangeError(_this7.id + ' cancelOrder() requires a symbol argument');
            yield _this7.loadMarkets();
            let market = _this7.market(symbol);
            let response = undefined;
            response = yield _this7.privatePostGetOrder(_this7.extend({
                'coin_pair': market['id'],
                'order_id': parseInt(id)
            }, params));
            return _this7.parseOrder(response['response_data']['order']);
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this8.loadMarkets();
            let request = {
                'coin': currency,
                'quantity': amount.toFixed(10),
                'address': address
            };
            if (currency == 'BRL') {
                let account_ref = 'account_ref' in params;
                if (!account_ref) throw new ExchangeError(_this8.id + ' requires account_ref parameter to withdraw ' + currency);
            } else if (currency != 'LTC') {
                let tx_fee = 'tx_fee' in params;
                if (!tx_fee) throw new ExchangeError(_this8.id + ' requires tx_fee parameter to withdraw ' + currency);
            }
            let response = yield _this8.privatePostWithdrawCoin(_this8.extend(request, params));
            return {
                'info': response,
                'id': response['response_data']['withdrawal']['id']
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api] + '/';
        if (api == 'public') {
            url += this.implodeParams(path, params);
        } else {
            this.checkRequiredCredentials();
            url += this.version + '/';
            let nonce = this.nonce();
            body = this.urlencode(this.extend({
                'tapi_method': path,
                'tapi_nonce': nonce
            }, params));
            let auth = '/tapi/' + this.version + '/' + '?' + body;
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'TAPI-ID': this.apiKey,
                'TAPI-MAC': this.hmac(this.encode(auth), this.encode(this.secret), 'sha512')
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this9.fetch2(path, api, method, params, headers, body);
            if ('error_message' in response) throw new ExchangeError(_this9.id + ' ' + _this9.json(response));
            return response;
        })();
    }
};