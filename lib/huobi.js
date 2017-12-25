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

module.exports = class huobi extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'huobi',
            'name': 'Huobi',
            'countries': 'CN',
            'rateLimit': 2000,
            'version': 'v3',
            'hasCORS': false,
            'hasFetchOHLCV': true,
            'timeframes': {
                '1m': '001',
                '5m': '005',
                '15m': '015',
                '30m': '030',
                '1h': '060',
                '1d': '100',
                '1w': '200',
                '1M': '300',
                '1y': '400'
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766569-15aa7b9a-5edd-11e7-9e7f-44791f4ee49c.jpg',
                'api': 'http://api.huobi.com',
                'www': 'https://www.huobi.com',
                'doc': 'https://github.com/huobiapi/API_Docs_en/wiki'
            },
            'api': {
                'staticmarket': {
                    'get': ['{id}_kline_{period}', 'ticker_{id}', 'depth_{id}', 'depth_{id}_{length}', 'detail_{id}']
                },
                'usdmarket': {
                    'get': ['{id}_kline_{period}', 'ticker_{id}', 'depth_{id}', 'depth_{id}_{length}', 'detail_{id}']
                },
                'trade': {
                    'post': ['get_account_info', 'get_orders', 'order_info', 'buy', 'sell', 'buy_market', 'sell_market', 'cancel_order', 'get_new_deal_orders', 'get_order_id_by_trade_id', 'withdraw_coin', 'cancel_withdraw_coin', 'get_withdraw_coin_result', 'transfer', 'loan', 'repayment', 'get_loan_available', 'get_loans']
                }
            },
            'markets': {
                'BTC/CNY': { 'id': 'btc', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY', 'type': 'staticmarket', 'coinType': 1 },
                'LTC/CNY': { 'id': 'ltc', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY', 'type': 'staticmarket', 'coinType': 2 }
                // 'BTC/USD': { 'id': 'btc', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'type': 'usdmarket',    'coinType': 1 },
            }
        });
    }

    fetchBalance(params = {}) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let balances = yield _this.tradePostGetAccountInfo();
            let result = { 'info': balances };
            let currencies = (0, _keys2.default)(_this.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let lowercase = currency.toLowerCase();
                let account = _this.account();
                let available = 'available_' + lowercase + '_display';
                let frozen = 'frozen_' + lowercase + '_display';
                let loan = 'loan_' + lowercase + '_display';
                if (available in balances) account['free'] = parseFloat(balances[available]);
                if (frozen in balances) account['used'] = parseFloat(balances[frozen]);
                if (loan in balances) account['used'] = _this.sum(account['used'], parseFloat(balances[loan]));
                account['total'] = _this.sum(account['free'], account['used']);
                result[currency] = account;
            }
            return _this.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this2.market(symbol);
            let method = market['type'] + 'GetDepthId';
            let orderbook = yield _this2[method](_this2.extend({ 'id': market['id'] }, params));
            return _this2.parseOrderBook(orderbook);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this3.market(symbol);
            let method = market['type'] + 'GetTickerId';
            let response = yield _this3[method](_this3.extend({
                'id': market['id']
            }, params));
            let ticker = response['ticker'];
            let timestamp = parseInt(response['time']) * 1000;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this3.iso8601(timestamp),
                'high': _this3.safeFloat(ticker, 'high'),
                'low': _this3.safeFloat(ticker, 'low'),
                'bid': _this3.safeFloat(ticker, 'buy'),
                'ask': _this3.safeFloat(ticker, 'sell'),
                'vwap': undefined,
                'open': _this3.safeFloat(ticker, 'open'),
                'close': undefined,
                'first': undefined,
                'last': _this3.safeFloat(ticker, 'last'),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': _this3.safeFloat(ticker, 'vol'),
                'info': ticker
            };
        })();
    }

    parseTrade(trade, market) {
        let timestamp = trade['ts'];
        return {
            'info': trade,
            'id': trade['id'].toString(),
            'order': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': trade['direction'],
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this4.market(symbol);
            let method = market['type'] + 'GetDetailId';
            let response = yield _this4[method](_this4.extend({
                'id': market['id']
            }, params));
            return _this4.parseTrades(response['trades'], market, since, limit);
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '1m', since = undefined, limit = undefined) {
        // not implemented yet
        return [ohlcv[0], ohlcv[1], ohlcv[2], ohlcv[3], ohlcv[4], ohlcv[6]];
    }

    fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this5.market(symbol);
            let method = market['type'] + 'GetIdKlinePeriod';
            let ohlcvs = yield _this5[method](_this5.extend({
                'id': market['id'],
                'period': _this5.timeframes[timeframe]
            }, params));
            return ohlcvs;
            // return this.parseOHLCVs (ohlcvs, market, timeframe, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let market = _this6.market(symbol);
            let method = 'tradePost' + _this6.capitalize(side);
            let order = {
                'coin_type': market['coinType'],
                'amount': amount,
                'market': market['quote'].toLowerCase()
            };
            if (type == 'limit') order['price'] = price;else method += _this6.capitalize(type);
            let response = _this6[method](_this6.extend(order, params));
            return {
                'info': response,
                'id': response['id']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return yield _this7.tradePostCancelOrder({ 'id': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'];
        if (api == 'trade') {
            this.checkRequiredCredentials();
            url += '/api' + this.version;
            let query = this.keysort(this.extend({
                'method': path,
                'access_key': this.apiKey,
                'created': this.nonce()
            }, params));
            let queryString = this.urlencode(this.omit(query, 'market'));
            // secret key must be appended to the query before signing
            queryString += '&secret_key=' + this.secret;
            query['sign'] = this.hash(this.encode(queryString));
            body = this.urlencode(query);
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        } else {
            url += '/' + api + '/' + this.implodeParams(path, params) + '_json.js';
            let query = this.omit(params, this.extractParams(path));
            if ((0, _keys2.default)(query).length) url += '?' + this.urlencode(query);
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'trade', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this8.fetch2(path, api, method, params, headers, body);
            if ('status' in response) if (response['status'] == 'error') throw new ExchangeError(_this8.id + ' ' + _this8.json(response));
            if ('code' in response) throw new ExchangeError(_this8.id + ' ' + _this8.json(response));
            return response;
        })();
    }
};