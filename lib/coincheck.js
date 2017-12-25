"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Exchange = require('./base/Exchange');
const { ExchangeError, NotSupported } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class coincheck extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'coincheck',
            'name': 'coincheck',
            'countries': ['JP', 'ID'],
            'rateLimit': 1500,
            'hasCORS': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766464-3b5c3c74-5ed9-11e7-840e-31b32968e1da.jpg',
                'api': 'https://coincheck.com/api',
                'www': 'https://coincheck.com',
                'doc': 'https://coincheck.com/documents/exchange/api'
            },
            'api': {
                'public': {
                    'get': ['exchange/orders/rate', 'order_books', 'rate/{pair}', 'ticker', 'trades']
                },
                'private': {
                    'get': ['accounts', 'accounts/balance', 'accounts/leverage_balance', 'bank_accounts', 'deposit_money', 'exchange/orders/opens', 'exchange/orders/transactions', 'exchange/orders/transactions_pagination', 'exchange/leverage/positions', 'lending/borrows/matches', 'send_money', 'withdraws'],
                    'post': ['bank_accounts', 'deposit_money/{id}/fast', 'exchange/orders', 'exchange/transfers/to_leverage', 'exchange/transfers/from_leverage', 'lending/borrows', 'lending/borrows/{id}/repay', 'send_money', 'withdraws'],
                    'delete': ['bank_accounts/{id}', 'exchange/orders/{id}', 'withdraws/{id}']
                }
            },
            'markets': {
                'BTC/JPY': { 'id': 'btc_jpy', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY' } // the only real pair
                // 'ETH/JPY': { 'id': 'eth_jpy', 'symbol': 'ETH/JPY', 'base': 'ETH', 'quote': 'JPY' },
                // 'ETC/JPY': { 'id': 'etc_jpy', 'symbol': 'ETC/JPY', 'base': 'ETC', 'quote': 'JPY' },
                // 'DAO/JPY': { 'id': 'dao_jpy', 'symbol': 'DAO/JPY', 'base': 'DAO', 'quote': 'JPY' },
                // 'LSK/JPY': { 'id': 'lsk_jpy', 'symbol': 'LSK/JPY', 'base': 'LSK', 'quote': 'JPY' },
                // 'FCT/JPY': { 'id': 'fct_jpy', 'symbol': 'FCT/JPY', 'base': 'FCT', 'quote': 'JPY' },
                // 'XMR/JPY': { 'id': 'xmr_jpy', 'symbol': 'XMR/JPY', 'base': 'XMR', 'quote': 'JPY' },
                // 'REP/JPY': { 'id': 'rep_jpy', 'symbol': 'REP/JPY', 'base': 'REP', 'quote': 'JPY' },
                // 'XRP/JPY': { 'id': 'xrp_jpy', 'symbol': 'XRP/JPY', 'base': 'XRP', 'quote': 'JPY' },
                // 'ZEC/JPY': { 'id': 'zec_jpy', 'symbol': 'ZEC/JPY', 'base': 'ZEC', 'quote': 'JPY' },
                // 'XEM/JPY': { 'id': 'xem_jpy', 'symbol': 'XEM/JPY', 'base': 'XEM', 'quote': 'JPY' },
                // 'LTC/JPY': { 'id': 'ltc_jpy', 'symbol': 'LTC/JPY', 'base': 'LTC', 'quote': 'JPY' },
                // 'DASH/JPY': { 'id': 'dash_jpy', 'symbol': 'DASH/JPY', 'base': 'DASH', 'quote': 'JPY' },
                // 'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
                // 'ETC/BTC': { 'id': 'etc_btc', 'symbol': 'ETC/BTC', 'base': 'ETC', 'quote': 'BTC' },
                // 'LSK/BTC': { 'id': 'lsk_btc', 'symbol': 'LSK/BTC', 'base': 'LSK', 'quote': 'BTC' },
                // 'FCT/BTC': { 'id': 'fct_btc', 'symbol': 'FCT/BTC', 'base': 'FCT', 'quote': 'BTC' },
                // 'XMR/BTC': { 'id': 'xmr_btc', 'symbol': 'XMR/BTC', 'base': 'XMR', 'quote': 'BTC' },
                // 'REP/BTC': { 'id': 'rep_btc', 'symbol': 'REP/BTC', 'base': 'REP', 'quote': 'BTC' },
                // 'XRP/BTC': { 'id': 'xrp_btc', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC' },
                // 'ZEC/BTC': { 'id': 'zec_btc', 'symbol': 'ZEC/BTC', 'base': 'ZEC', 'quote': 'BTC' },
                // 'XEM/BTC': { 'id': 'xem_btc', 'symbol': 'XEM/BTC', 'base': 'XEM', 'quote': 'BTC' },
                // 'LTC/BTC': { 'id': 'ltc_btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
                // 'DASH/BTC': { 'id': 'dash_btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC' },
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let balances = yield _this.privateGetAccountsBalance();
            let result = { 'info': balances };
            let currencies = (0, _keys2.default)(_this.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let lowercase = currency.toLowerCase();
                let account = _this.account();
                if (lowercase in balances) account['free'] = parseFloat(balances[lowercase]);
                let reserved = lowercase + '_reserved';
                if (reserved in balances) account['used'] = parseFloat(balances[reserved]);
                account['total'] = _this.sum(account['free'], account['used']);
                result[currency] = account;
            }
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (symbol != 'BTC/JPY') throw new NotSupported(_this2.id + ' fetchOrderBook () supports BTC/JPY only');
            let orderbook = yield _this2.publicGetOrderBooks(params);
            return _this2.parseOrderBook(orderbook);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (symbol != 'BTC/JPY') throw new NotSupported(_this3.id + ' fetchTicker () supports BTC/JPY only');
            let ticker = yield _this3.publicGetTicker(params);
            let timestamp = ticker['timestamp'] * 1000;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
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
                'baseVolume': parseFloat(ticker['volume']),
                'quoteVolume': undefined,
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = this.parse8601(trade['created_at']);
        return {
            'id': trade['id'].toString(),
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': trade['order_type'],
            'price': parseFloat(trade['rate']),
            'amount': parseFloat(trade['amount'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (symbol != 'BTC/JPY') throw new NotSupported(_this4.id + ' fetchTrades () supports BTC/JPY only');
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetTrades(params);
            return _this4.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let prefix = '';
            let order = {
                'pair': _this5.marketId(symbol)
            };
            if (type == 'market') {
                let order_type = type + '_' + side;
                order['order_type'] = order_type;
                let prefix = side == 'buy' ? order_type + '_' : '';
                order[prefix + 'amount'] = amount;
            } else {
                order['order_type'] = side;
                order['rate'] = price;
                order['amount'] = amount;
            }
            let response = yield _this5.privatePostExchangeOrders(_this5.extend(order, params));
            return {
                'info': response,
                'id': response['id'].toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return yield _this6.privateDeleteExchangeOrdersId({ 'id': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            let queryString = '';
            if (method == 'GET') {
                if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(this.keysort(query));
            } else {
                if ((0, _keys2.default)(query).length) {
                    body = this.urlencode(this.keysort(query));
                    queryString = body;
                }
            }
            let auth = nonce + url + queryString;
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'ACCESS-KEY': this.apiKey,
                'ACCESS-NONCE': nonce,
                'ACCESS-SIGNATURE': this.hmac(this.encode(auth), this.encode(this.secret))
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this7.fetch2(path, api, method, params, headers, body);
            if (api == 'public') return response;
            if ('success' in response) if (response['success']) return response;
            throw new ExchangeError(_this7.id + ' ' + _this7.json(response));
        })();
    }
};