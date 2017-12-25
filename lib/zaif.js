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

module.exports = class zaif extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'zaif',
            'name': 'Zaif',
            'countries': 'JP',
            'rateLimit': 2000,
            'version': '1',
            'hasCORS': false,
            'hasFetchOpenOrders': true,
            'hasFetchClosedOrders': true,
            'hasWithdraw': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766927-39ca2ada-5eeb-11e7-972f-1b4199518ca6.jpg',
                'api': 'https://api.zaif.jp',
                'www': 'https://zaif.jp',
                'doc': ['http://techbureau-api-document.readthedocs.io/ja/latest/index.html', 'https://corp.zaif.jp/api-docs', 'https://corp.zaif.jp/api-docs/api_links', 'https://www.npmjs.com/package/zaif.jp', 'https://github.com/you21979/node-zaif']
            },
            'api': {
                'public': {
                    'get': ['depth/{pair}', 'currencies/{pair}', 'currencies/all', 'currency_pairs/{pair}', 'currency_pairs/all', 'last_price/{pair}', 'ticker/{pair}', 'trades/{pair}']
                },
                'private': {
                    'post': ['active_orders', 'cancel_order', 'deposit_history', 'get_id_info', 'get_info', 'get_info2', 'get_personal_info', 'trade', 'trade_history', 'withdraw', 'withdraw_history']
                },
                'ecapi': {
                    'post': ['createInvoice', 'getInvoice', 'getInvoiceIdsByOrderNumber', 'cancelInvoice']
                },
                'tlapi': {
                    'post': ['get_positions', 'position_history', 'active_positions', 'create_position', 'change_position', 'cancel_position']
                },
                'fapi': {
                    'get': ['groups/{group_id}', 'last_price/{group_id}/{pair}', 'ticker/{group_id}/{pair}', 'trades/{group_id}/{pair}', 'depth/{group_id}/{pair}']
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let markets = yield _this.publicGetCurrencyPairsAll();
            let result = [];
            for (let p = 0; p < markets.length; p++) {
                let market = markets[p];
                let id = market['currency_pair'];
                let symbol = market['name'];
                let [base, quote] = symbol.split('/');
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

    fetchBalance(params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this2.loadMarkets();
            let response = yield _this2.privatePostGetInfo();
            let balances = response['return'];
            let result = { 'info': balances };
            let currencies = (0, _keys2.default)(balances['funds']);
            for (let c = 0; c < currencies.length; c++) {
                let currency = currencies[c];
                let balance = balances['funds'][currency];
                let uppercase = currency.toUpperCase();
                let account = {
                    'free': balance,
                    'used': 0.0,
                    'total': balance
                };
                if ('deposit' in balances) {
                    if (currency in balances['deposit']) {
                        account['total'] = balances['deposit'][currency];
                        account['used'] = account['total'] - account['free'];
                    }
                }
                result[uppercase] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this3.loadMarkets();
            let orderbook = yield _this3.publicGetDepthPair(_this3.extend({
                'pair': _this3.marketId(symbol)
            }, params));
            return _this3.parseOrderBook(orderbook);
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this4.loadMarkets();
            let ticker = yield _this4.publicGetTickerPair(_this4.extend({
                'pair': _this4.marketId(symbol)
            }, params));
            let timestamp = _this4.milliseconds();
            let vwap = ticker['vwap'];
            let baseVolume = ticker['volume'];
            let quoteVolume = baseVolume * vwap;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': _this4.iso8601(timestamp),
                'high': ticker['high'],
                'low': ticker['low'],
                'bid': ticker['bid'],
                'ask': ticker['ask'],
                'vwap': vwap,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': ticker['last'],
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
        let side = trade['trade_type'] == 'bid' ? 'buy' : 'sell';
        let timestamp = trade['date'] * 1000;
        let id = this.safeString(trade, 'id');
        id = this.safeString(trade, 'tid', id);
        if (!market) market = this.markets_by_id[trade['currency_pair']];
        return {
            'id': id.toString(),
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': side,
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let response = yield _this5.publicGetTradesPair(_this5.extend({
                'pair': market['id']
            }, params));
            return _this5.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this6.loadMarkets();
            if (type == 'market') throw new ExchangeError(_this6.id + ' allows limit orders only');
            let response = yield _this6.privatePostTrade(_this6.extend({
                'currency_pair': _this6.marketId(symbol),
                'action': side == 'buy' ? 'bid' : 'ask',
                'amount': amount,
                'price': price
            }, params));
            return {
                'info': response,
                'id': response['return']['order_id'].toString()
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return yield _this7.privatePostCancelOrder(_this7.extend({
                'order_id': id
            }, params));
        })();
    }

    parseOrder(order, market = undefined) {
        let side = order['action'] == 'bid' ? 'buy' : 'sell';
        let timestamp = parseInt(order['timestamp']) * 1000;
        if (!market) market = this.markets_by_id[order['currency_pair']];
        let price = order['price'];
        let amount = order['amount'];
        return {
            'id': order['id'].toString(),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'status': 'open',
            'symbol': market['symbol'],
            'type': 'limit',
            'side': side,
            'price': price,
            'cost': price * amount,
            'amount': amount,
            'filled': undefined,
            'remaining': undefined,
            'trades': undefined,
            'fee': undefined
        };
    }

    parseOrders(orders, market = undefined, since = undefined, limit = undefined) {
        let ids = (0, _keys2.default)(orders);
        let result = [];
        for (let i = 0; i < ids.length; i++) {
            let id = ids[i];
            let order = orders[id];
            let extended = this.extend(order, { 'id': id });
            result.push(this.parseOrder(extended, market));
        }
        return this.filterBySinceLimit(result, since, limit);
    }

    fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this8.loadMarkets();
            let market = undefined;
            let request = {
                // 'is_token': false,
                // 'is_token_both': false,
            };
            if (symbol) {
                market = _this8.market(symbol);
                request['currency_pair'] = market['id'];
            }
            let response = yield _this8.privatePostActiveOrders(_this8.extend(request, params));
            return _this8.parseOrders(response['return'], market, since, limit);
        })();
    }

    fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this9 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this9.loadMarkets();
            let market = undefined;
            let request = {
                // 'from': 0,
                // 'count': 1000,
                // 'from_id': 0,
                // 'end_id': 1000,
                // 'order': 'DESC',
                // 'since': 1503821051,
                // 'end': 1503821051,
                // 'is_token': false,
            };
            if (symbol) {
                market = _this9.market(symbol);
                request['currency_pair'] = market['id'];
            }
            let response = yield _this9.privatePostTradeHistory(_this9.extend(request, params));
            return _this9.parseOrders(response['return'], market, since, limit);
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this10 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this10.loadMarkets();
            if (currency == 'JPY') throw new ExchangeError(_this10.id + ' does not allow ' + currency + ' withdrawals');
            let result = yield _this10.privatePostWithdraw(_this10.extend({
                'currency': currency,
                'amount': amount,
                'address': address
                // 'message': 'Hi!', // XEM only
                // 'opt_fee': 0.003, // BTC and MONA only
            }, params));
            return {
                'info': result,
                'id': result['return']['txid'],
                'fee': result['return']['fee']
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/';
        if (api == 'public') {
            url += 'api/' + this.version + '/' + this.implodeParams(path, params);
        } else if (api == 'fapi') {
            url += 'fapi/' + this.version + '/' + this.implodeParams(path, params);
        } else {
            this.checkRequiredCredentials();
            if (api == 'ecapi') {
                url += 'ecapi';
            } else if (api == 'tlapi') {
                url += 'tlapi';
            } else {
                url += 'tapi';
            }
            let nonce = this.nonce();
            body = this.urlencode(this.extend({
                'method': path,
                'nonce': nonce
            }, params));
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Key': this.apiKey,
                'Sign': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'api', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this11 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this11.fetch2(path, api, method, params, headers, body);
            if ('error' in response) throw new ExchangeError(_this11.id + ' ' + response['error']);
            if ('success' in response) if (!response['success']) throw new ExchangeError(_this11.id + ' ' + _this11.json(response));
            return response;
        })();
    }
};