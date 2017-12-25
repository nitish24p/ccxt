"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { AuthenticationError } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class btcchina extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'btcchina',
            'name': 'BTCChina',
            'countries': 'CN',
            'rateLimit': 1500,
            'version': 'v1',
            'hasCORS': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/27766368-465b3286-5ed6-11e7-9a11-0f6467e1d82b.jpg',
                'api': {
                    'plus': 'https://plus-api.btcchina.com/market',
                    'public': 'https://data.btcchina.com/data',
                    'private': 'https://api.btcchina.com/api_trade_v1.php'
                },
                'www': 'https://www.btcchina.com',
                'doc': 'https://www.btcchina.com/apidocs'
            },
            'api': {
                'plus': {
                    'get': ['orderbook', 'ticker', 'trade']
                },
                'public': {
                    'get': ['historydata', 'orderbook', 'ticker', 'trades']
                },
                'private': {
                    'post': ['BuyIcebergOrder', 'BuyOrder', 'BuyOrder2', 'BuyStopOrder', 'CancelIcebergOrder', 'CancelOrder', 'CancelStopOrder', 'GetAccountInfo', 'getArchivedOrder', 'getArchivedOrders', 'GetDeposits', 'GetIcebergOrder', 'GetIcebergOrders', 'GetMarketDepth', 'GetMarketDepth2', 'GetOrder', 'GetOrders', 'GetStopOrder', 'GetStopOrders', 'GetTransactions', 'GetWithdrawal', 'GetWithdrawals', 'RequestWithdrawal', 'SellIcebergOrder', 'SellOrder', 'SellOrder2', 'SellStopOrder']
                }
            },
            'markets': {
                'BTC/CNY': { 'id': 'btccny', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY', 'api': 'public', 'plus': false },
                'LTC/CNY': { 'id': 'ltccny', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY', 'api': 'public', 'plus': false },
                'LTC/BTC': { 'id': 'ltcbtc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'api': 'public', 'plus': false },
                'BCH/CNY': { 'id': 'bcccny', 'symbol': 'BCH/CNY', 'base': 'BCH', 'quote': 'CNY', 'api': 'plus', 'plus': true },
                'ETH/CNY': { 'id': 'ethcny', 'symbol': 'ETH/CNY', 'base': 'ETH', 'quote': 'CNY', 'api': 'plus', 'plus': true }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.publicGetTicker({
                'market': 'all'
            });
            let result = [];
            let keys = Object.keys(markets);
            for (let p = 0; p < keys.length; p++) {
                let key = keys[p];
                let market = markets[key];
                let parts = key.split('_');
                let id = parts[1];
                let base = id.slice(0, 3);
                let quote = id.slice(3, 6);
                base = base.toUpperCase();
                quote = quote.toUpperCase();
                let symbol = base + '/' + quote;
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

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let response = yield _this2.privatePostGetAccountInfo();
            let balances = response['result'];
            let result = { 'info': balances };
            let currencies = Object.keys(_this2.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let lowercase = currency.toLowerCase();
                let account = _this2.account();
                if (lowercase in balances['balance']) account['total'] = parseFloat(balances['balance'][lowercase]['amount']);
                if (lowercase in balances['frozen']) account['used'] = parseFloat(balances['frozen'][lowercase]['amount']);
                account['free'] = account['total'] - account['used'];
                result[currency] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    createMarketRequest(market) {
        let request = {};
        let field = market['plus'] ? 'symbol' : 'market';
        request[field] = market['id'];
        return request;
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let method = market['api'] + 'GetOrderbook';
            let request = _this3.createMarketRequest(market);
            let orderbook = yield _this3[method](_this3.extend(request, params));
            let timestamp = orderbook['date'] * 1000;
            let result = _this3.parseOrderBook(orderbook, timestamp);
            result['asks'] = _this3.sortBy(result['asks'], 0);
            return result;
        })();
    }

    parseTicker(ticker, market) {
        let timestamp = ticker['date'] * 1000;
        return {
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': parseFloat(ticker['high']),
            'low': parseFloat(ticker['low']),
            'bid': parseFloat(ticker['buy']),
            'ask': parseFloat(ticker['sell']),
            'vwap': parseFloat(ticker['vwap']),
            'open': parseFloat(ticker['open']),
            'close': parseFloat(ticker['prev_close']),
            'first': undefined,
            'last': parseFloat(ticker['last']),
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': parseFloat(ticker['vol']),
            'quoteVolume': undefined,
            'info': ticker
        };
    }

    parseTickerPlus(ticker, market) {
        let timestamp = ticker['Timestamp'];
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': parseFloat(ticker['High']),
            'low': parseFloat(ticker['Low']),
            'bid': parseFloat(ticker['BidPrice']),
            'ask': parseFloat(ticker['AskPrice']),
            'vwap': undefined,
            'open': parseFloat(ticker['Open']),
            'close': parseFloat(ticker['PrevCls']),
            'first': undefined,
            'last': parseFloat(ticker['Last']),
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': parseFloat(ticker['Volume24H']),
            'quoteVolume': undefined,
            'info': ticker
        };
    }

    fetchTicker(symbol, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let method = market['api'] + 'GetTicker';
            let request = _this4.createMarketRequest(market);
            let tickers = yield _this4[method](_this4.extend(request, params));
            let ticker = tickers['ticker'];
            if (market['plus']) return _this4.parseTickerPlus(ticker, market);
            return _this4.parseTicker(ticker, market);
        })();
    }

    parseTrade(trade, market) {
        let timestamp = parseInt(trade['date']) * 1000;
        return {
            'id': trade['tid'],
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': undefined,
            'price': trade['price'],
            'amount': trade['amount']
        };
    }

    parseTradePlus(trade, market) {
        let timestamp = this.parse8601(trade['timestamp']);
        return {
            'id': undefined,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'side': trade['side'].toLowerCase(),
            'price': trade['price'],
            'amount': trade['size']
        };
    }

    parseTradesPlus(trades, market = undefined) {
        let result = [];
        for (let i = 0; i < trades.length; i++) {
            result.push(this.parseTradePlus(trades[i], market));
        }
        return result;
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let method = market['api'] + 'GetTrade';
            let request = _this5.createMarketRequest(market);
            if (market['plus']) {
                let now = _this5.milliseconds();
                request['start_time'] = now - 86400 * 1000;
                request['end_time'] = now;
            } else {
                method += 's'; // trades vs trade
            }
            let response = yield _this5[method](_this5.extend(request, params));
            if (market['plus']) {
                return _this5.parseTradesPlus(response['trades'], market);
            }
            return _this5.parseTrades(response, market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let method = 'privatePost' + _this6.capitalize(side) + 'Order2';
            let order = {};
            let id = market['id'].toUpperCase();
            if (type == 'market') {
                order['params'] = [undefined, amount, id];
            } else {
                order['params'] = [price, amount, id];
            }
            let response = yield _this6[method](_this6.extend(order, params));
            return {
                'info': response,
                'id': response['id']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            yield _this7.loadMarkets();
            let market = params['market']; // TODO fixme
            return yield _this7.privatePostCancelOrder(_this7.extend({
                'params': [id, market]
            }, params));
        })();
    }

    nonce() {
        return this.microseconds();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api] + '/' + path;
        if (api == 'private') {
            this.checkRequiredCredentials();
            let p = [];
            if ('params' in params) p = params['params'];
            let nonce = this.nonce();
            let request = {
                'method': path,
                'id': nonce,
                'params': p
            };
            p = p.join(',');
            body = this.json(request);
            let query = 'tonce=' + nonce + '&accesskey=' + this.apiKey + '&requestmethod=' + method.toLowerCase() + '&id=' + nonce + '&method=' + path + '&params=' + p;
            let signature = this.hmac(this.encode(query), this.encode(this.secret), 'sha1');
            let auth = this.encode(this.apiKey + ':' + signature);
            headers = {
                'Authorization': 'Basic ' + this.stringToBase64(auth),
                'Json-Rpc-Tonce': nonce
            };
        } else {
            if (Object.keys(params).length) url += '?' + this.urlencode(params);
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
};