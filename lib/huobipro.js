"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class huobipro extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'huobipro',
            'name': 'Huobi Pro',
            'countries': 'CN',
            'rateLimit': 2000,
            'userAgent': this.userAgents['chrome39'],
            'version': 'v1',
            'accounts': undefined,
            'accountsById': undefined,
            'hostname': 'api.huobi.pro',
            'hasCORS': false,
            // obsolete metainfo structure
            'hasFetchOHLCV': true,
            'hasFetchOrders': true,
            'hasFetchOpenOrders': true,
            // new metainfo structure
            'has': {
                'fetchOHCLV': true,
                'fetchOrders': true,
                'fetchOpenOrders': true
            },
            'timeframes': {
                '1m': '1min',
                '5m': '5min',
                '15m': '15min',
                '30m': '30min',
                '1h': '60min',
                '1d': '1day',
                '1w': '1week',
                '1M': '1mon',
                '1y': '1year'
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766569-15aa7b9a-5edd-11e7-9e7f-44791f4ee49c.jpg',
                'api': 'https://api.huobi.pro',
                'www': 'https://www.huobi.pro',
                'doc': 'https://github.com/huobiapi/API_Docs/wiki/REST_api_reference'
            },
            'api': {
                'market': {
                    'get': ['history/kline', // 获取K线数据
                    'detail/merged', // 获取聚合行情(Ticker)
                    'depth', // 获取 Market Depth 数据
                    'trade', // 获取 Trade Detail 数据
                    'history/trade', // 批量获取最近的交易记录
                    'detail']
                },
                'public': {
                    'get': ['common/symbols', // 查询系统支持的所有交易对
                    'common/currencys', // 查询系统支持的所有币种
                    'common/timestamp']
                },
                'private': {
                    'get': ['account/accounts', // 查询当前用户的所有账户(即account-id)
                    'account/accounts/{id}/balance', // 查询指定账户的余额
                    'order/orders/{id}', // 查询某个订单详情
                    'order/orders/{id}/matchresults', // 查询某个订单的成交明细
                    'order/orders', // 查询当前委托、历史委托
                    'order/matchresults', // 查询当前成交、历史成交
                    'dw/withdraw-virtual/addresses'],
                    'post': ['order/orders/place', // 创建并执行一个新订单 (一步下单， 推荐使用)
                    'order/orders', // 创建一个新的订单请求 （仅创建订单，不执行下单）
                    'order/orders/{id}/place', // 执行一个订单 （仅执行已创建的订单）
                    'order/orders/{id}/submitcancel', // 申请撤销一个订单请求
                    'order/orders/batchcancel', // 批量撤销订单
                    'dw/balance/transfer', // 资产划转
                    'dw/withdraw-virtual/create', // 申请提现虚拟币
                    'dw/withdraw-virtual/{id}/place', // 确认申请虚拟币提现
                    'dw/withdraw-virtual/{id}/cancel']
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let response = yield _this.publicGetCommonSymbols();
            let markets = response['data'];
            let numMarkets = markets.length;
            if (numMarkets < 1) throw new ExchangeError(_this.id + ' publicGetCommonSymbols returned empty response: ' + _this.json(response));
            let result = [];
            for (let i = 0; i < markets.length; i++) {
                let market = markets[i];
                let baseId = market['base-currency'];
                let quoteId = market['quote-currency'];
                let base = baseId.toUpperCase();
                let quote = quoteId.toUpperCase();
                let id = baseId + quoteId;
                base = _this.commonCurrencyCode(base);
                quote = _this.commonCurrencyCode(quote);
                let symbol = base + '/' + quote;
                let precision = {
                    'amount': market['amount-precision'],
                    'price': market['price-precision']
                };
                let lot = Math.pow(10, -precision['amount']);
                let maker = base == 'OMG' ? 0 : 0.2 / 100;
                let taker = base == 'OMG' ? 0 : 0.2 / 100;
                result.push({
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'lot': lot,
                    'precision': precision,
                    'taker': taker,
                    'maker': maker,
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
                    },
                    'info': market
                });
            }
            return result;
        })();
    }

    parseTicker(ticker, market = undefined) {
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        let last = undefined;
        if ('last' in ticker) last = ticker['last'];
        let timestamp = this.milliseconds();
        if ('ts' in ticker) timestamp = ticker['ts'];
        let bid = undefined;
        let ask = undefined;
        if ('bid' in ticker) {
            if (ticker['bid']) bid = this.safeFloat(ticker['bid'], 0);
        }
        if ('ask' in ticker) {
            if (ticker['ask']) ask = this.safeFloat(ticker['ask'], 0);
        }
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': ticker['high'],
            'low': ticker['low'],
            'bid': bid,
            'ask': ask,
            'vwap': undefined,
            'open': ticker['open'],
            'close': ticker['close'],
            'first': undefined,
            'last': last,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': parseFloat(ticker['amount']),
            'quoteVolume': ticker['vol'],
            'info': ticker
        };
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let market = _this2.market(symbol);
            let response = yield _this2.marketGetDepth(_this2.extend({
                'symbol': market['id'],
                'type': 'step0'
            }, params));
            if ('tick' in response) {
                if (!response['tick']) {
                    throw new ExchangeError(_this2.id + ' fetchOrderBook() returned empty response: ' + _this2.json(response));
                }
                return _this2.parseOrderBook(response['tick'], response['tick']['ts']);
            }
            throw new ExchangeError(_this2.id + ' fetchOrderBook() returned unrecognized response: ' + _this2.json(response));
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let response = yield _this3.marketGetDetailMerged(_this3.extend({
                'symbol': market['id']
            }, params));
            return _this3.parseTicker(response['tick'], market);
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

    parseTradesData(data, market, since = undefined, limit = undefined) {
        let result = [];
        for (let i = 0; i < data.length; i++) {
            let trades = this.parseTrades(data[i]['data'], market, since, limit);
            for (let k = 0; k < trades.length; k++) {
                result.push(trades[k]);
            }
        }
        return result;
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let response = yield _this4.marketGetHistoryTrade(_this4.extend({
                'symbol': market['id'],
                'size': 2000
            }, params));
            return _this4.parseTradesData(response['data'], market, since, limit);
        })();
    }

    parseOHLCV(ohlcv, market = undefined, timeframe = '1m', since = undefined, limit = undefined) {
        return [ohlcv['id'] * 1000, ohlcv['open'], ohlcv['high'], ohlcv['low'], ohlcv['close'], ohlcv['vol']];
    }

    fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let response = yield _this5.marketGetHistoryKline(_this5.extend({
                'symbol': market['id'],
                'period': _this5.timeframes[timeframe],
                'size': 2000 // max = 2000
            }, params));
            return _this5.parseOHLCVs(response['data'], market, timeframe, since, limit);
        })();
    }

    loadAccounts(reload = false) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            if (reload) {
                _this6.accounts = yield _this6.fetchAccounts();
            } else {
                if (_this6.accounts) {
                    return _this6.accounts;
                } else {
                    _this6.accounts = yield _this6.fetchAccounts();
                    _this6.accountsById = _this6.indexBy(_this6.accounts, 'id');
                }
            }
            return _this6.accounts;
        })();
    }

    fetchAccounts() {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            let response = yield _this7.privateGetAccountAccounts();
            return response['data'];
        })();
    }

    fetchBalance(params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            yield _this8.loadAccounts();
            let response = yield _this8.privateGetAccountAccountsIdBalance(_this8.extend({
                'id': _this8.accounts[0]['id']
            }, params));
            let balances = response['data']['list'];
            let result = { 'info': response };
            for (let i = 0; i < balances.length; i++) {
                let balance = balances[i];
                let uppercase = balance['currency'].toUpperCase();
                let currency = _this8.commonCurrencyCode(uppercase);
                let account = undefined;
                if (currency in result) account = result[currency];else account = _this8.account();
                if (balance['type'] == 'trade') account['free'] = parseFloat(balance['balance']);
                if (balance['type'] == 'frozen') account['used'] = parseFloat(balance['balance']);
                account['total'] = _this8.sum(account['free'], account['used']);
                result[currency] = account;
            }
            return _this8.parseBalance(result);
        })();
    }

    fetchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            if (!symbol) throw new ExchangeError(_this9.id + ' fetchOrders() requires a symbol parameter');
            _this9.load_markets();
            let market = _this9.market(symbol);
            let status = undefined;
            if ('type' in params) {
                status = params['type'];
            } else if ('status' in params) {
                status = params['status'];
            } else {
                throw new ExchangeError(_this9.id + ' fetchOrders() requires type param or status param for spot market ' + symbol + '(0 or "open" for unfilled or partial filled orders, 1 or "closed" for filled orders)');
            }
            if (status == 0 || status == 'open') {
                status = 'submitted,partial-filled';
            } else if (status == 1 || status == 'closed') {
                status = 'filled,partial-canceled';
            } else {
                throw new ExchangeError(_this9.id + ' fetchOrders() wrong type param or status param for spot market ' + symbol + '(0 or "open" for unfilled or partial filled orders, 1 or "closed" for filled orders)');
            }
            let response = yield _this9.privateGetOrderOrders(_this9.extend({
                'symbol': market['id'],
                'states': status
            }));
            return _this9.parseOrders(response['data'], market, since, limit);
        })();
    }

    fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this10 = this;

        return _asyncToGenerator(function* () {
            let open = 0; // 0 for unfilled orders, 1 for filled orders
            return _this10.fetchOrders(symbol, undefined, undefined, _this10.extend({
                'status': open
            }, params));
        })();
    }

    parseOrderStatus(status) {
        if (status == 'partial-filled') {
            return 'open';
        } else if (status == 'filled') {
            return 'closed';
        } else if (status == 'canceled') {
            return 'canceled';
        } else if (status == 'submitted') {
            return 'open';
        }
        return status;
    }

    parseOrder(order, market = undefined) {
        let side = undefined;
        let type = undefined;
        let status = undefined;
        if ('type' in order) {
            let orderType = order['type'].split('-');
            side = orderType[0];
            type = orderType[1];
            status = this.parseOrderStatus(order['state']);
        }
        let symbol = undefined;
        if (!market) {
            if ('symbol' in order) {
                if (order['symbol'] in this.markets_by_id) {
                    let marketId = order['symbol'];
                    market = this.markets_by_id[marketId];
                }
            }
        }
        if (market) symbol = market['symbol'];
        let timestamp = order['created-at'];
        let amount = parseFloat(order['amount']);
        let filled = parseFloat(order['field-amount']);
        let remaining = amount - filled;
        let price = parseFloat(order['price']);
        let cost = parseFloat(order['field-cash-amount']);
        let average = 0;
        if (filled) average = parseFloat(cost / filled);
        let result = {
            'info': order,
            'id': order['id'],
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'type': type,
            'side': side,
            'price': price,
            'average': average,
            'cost': cost,
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'status': status,
            'fee': undefined
        };
        return result;
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this11 = this;

        return _asyncToGenerator(function* () {
            yield _this11.loadMarkets();
            yield _this11.loadAccounts();
            let market = _this11.market(symbol);
            let order = {
                'account-id': _this11.accounts[0]['id'],
                'amount': _this11.amountToPrecision(symbol, amount),
                'symbol': market['id'],
                'type': side + '-' + type
            };
            if (type == 'limit') order['price'] = _this11.priceToPrecision(symbol, price);
            let response = yield _this11.privatePostOrderOrdersPlace(_this11.extend(order, params));
            return {
                'info': response,
                'id': response['data']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this12 = this;

        return _asyncToGenerator(function* () {
            return yield _this12.privatePostOrderOrdersIdSubmitcancel({ 'id': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = '/';
        if (api == 'market') url += api;else url += this.version;
        url += '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'private') {
            this.checkRequiredCredentials();
            let timestamp = this.YmdHMS(this.milliseconds(), 'T');
            let request = this.keysort(this.extend({
                'SignatureMethod': 'HmacSHA256',
                'SignatureVersion': '2',
                'AccessKeyId': this.apiKey,
                'Timestamp': timestamp
            }, query));
            let auth = this.urlencode(request);
            let payload = [method, this.hostname, url, auth].join("\n");
            let signature = this.hmac(this.encode(payload), this.encode(this.secret), 'sha256', 'base64');
            auth += '&' + this.urlencode({ 'Signature': signature });
            url += '?' + auth;
            if (method == 'POST') {
                body = this.json(query);
                headers = {
                    'Content-Type': 'application/json'
                };
            }
        } else {
            if (Object.keys(params).length) url += '?' + this.urlencode(params);
        }
        url = this.urls['api'] + url;
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this13 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this13.fetch2(path, api, method, params, headers, body);
            if ('status' in response) if (response['status'] == 'error') throw new ExchangeError(_this13.id + ' ' + _this13.json(response));
            return response;
        })();
    }
};