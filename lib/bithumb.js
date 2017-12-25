"use strict";

//  ---------------------------------------------------------------------------

import _Object$keys from 'babel-runtime/core-js/object/keys';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const Exchange = require('./base/Exchange');
const { ExchangeError, NotSupported } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class bithumb extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'bithumb',
            'name': 'Bithumb',
            'countries': 'KR', // South Korea
            'rateLimit': 500,
            'hasCORS': true,
            'hasFetchTickers': true,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/30597177-ea800172-9d5e-11e7-804c-b9d4fa9b56b0.jpg',
                'api': {
                    'public': 'https://api.bithumb.com/public',
                    'private': 'https://api.bithumb.com'
                },
                'www': 'https://www.bithumb.com',
                'doc': 'https://www.bithumb.com/u1/US127'
            },
            'api': {
                'public': {
                    'get': ['ticker/{currency}', 'ticker/all', 'orderbook/{currency}', 'orderbook/all', 'recent_transactions/{currency}', 'recent_transactions/all']
                },
                'private': {
                    'post': ['info/account', 'info/balance', 'info/wallet_address', 'info/ticker', 'info/orders', 'info/user_transactions', 'trade/place', 'info/order_detail', 'trade/cancel', 'trade/btc_withdrawal', 'trade/krw_deposit', 'trade/krw_withdrawal', 'trade/market_buy', 'trade/market_sell']
                }
            },
            'fees': {
                'trading': {
                    'maker': 0.15 / 100,
                    'taker': 0.15 / 100
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let markets = yield _this.publicGetTickerAll();
            let currencies = _Object$keys(markets['data']);
            let result = [];
            for (let i = 0; i < currencies.length; i++) {
                let id = currencies[i];
                if (id != 'date') {
                    let market = markets['data'][id];
                    let base = id;
                    let quote = 'KRW';
                    let symbol = id + '/' + quote;
                    result.push(_this.extend(_this.fees['trading'], {
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market,
                        'lot': undefined,
                        'active': true,
                        'precision': {
                            'amount': undefined,
                            'price': undefined
                        },
                        'limits': {
                            'amount': {
                                'min': undefined,
                                'max': undefined
                            },
                            'price': {
                                'min': undefined,
                                'max': undefined
                            },
                            'cost': {
                                'min': undefined,
                                'max': undefined
                            }
                        }
                    }));
                }
            }
            return result;
        })();
    }

    fetchBalance(params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let response = yield _this2.privatePostInfoBalance(_this2.extend({
                'currency': 'ALL'
            }, params));
            let result = { 'info': response };
            let balances = response['data'];
            let currencies = _Object$keys(_this2.currencies);
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let account = _this2.account();
                let lowercase = currency.toLowerCase();
                account['total'] = _this2.safeFloat(balances, 'total_' + lowercase);
                account['used'] = _this2.safeFloat(balances, 'in_use_' + lowercase);
                account['free'] = _this2.safeFloat(balances, 'available_' + lowercase);
                result[currency] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let response = yield _this3.publicGetOrderbookCurrency(_this3.extend({
                'count': 50, // max = 50
                'currency': market['base']
            }, params));
            let orderbook = response['data'];
            let timestamp = parseInt(orderbook['timestamp']);
            return _this3.parseOrderBook(orderbook, timestamp, 'bids', 'asks', 'price', 'quantity');
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = parseInt(ticker['date']);
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': this.safeFloat(ticker, 'max_price'),
            'low': this.safeFloat(ticker, 'min_price'),
            'bid': this.safeFloat(ticker, 'buy_price'),
            'ask': this.safeFloat(ticker, 'sell_price'),
            'vwap': undefined,
            'open': this.safeFloat(ticker, 'opening_price'),
            'close': this.safeFloat(ticker, 'closing_price'),
            'first': undefined,
            'last': this.safeFloat(ticker, 'last_trade'),
            'change': undefined,
            'percentage': undefined,
            'average': this.safeFloat(ticker, 'average_price'),
            'baseVolume': this.safeFloat(ticker, 'volume_1day'),
            'quoteVolume': undefined,
            'info': ticker
        };
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let response = yield _this4.publicGetTickerAll(params);
            let result = {};
            let timestamp = response['data']['date'];
            let tickers = _this4.omit(response['data'], 'date');
            let ids = _Object$keys(tickers);
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let symbol = id;
                let market = undefined;
                if (id in _this4.markets_by_id) {
                    market = _this4.markets_by_id[id];
                    symbol = market['symbol'];
                }
                let ticker = tickers[id];
                ticker['date'] = timestamp;
                result[symbol] = _this4.parseTicker(ticker, market);
            }
            return result;
        })();
    }

    fetchTicker(symbol, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let response = yield _this5.publicGetTickerCurrency(_this5.extend({
                'currency': market['base']
            }, params));
            return _this5.parseTicker(response['data'], market);
        })();
    }

    parseTrade(trade, market) {
        // a workaround for their bug in date format, hours are not 0-padded
        let [transaction_date, transaction_time] = trade['transaction_date'].split(' ');
        let transaction_time_short = transaction_time.length < 8;
        if (transaction_time_short) transaction_time = '0' + transaction_time;
        let timestamp = this.parse8601(transaction_date + ' ' + transaction_time);
        let side = trade['type'] == 'ask' ? 'sell' : 'buy';
        return {
            'id': undefined,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'order': undefined,
            'type': undefined,
            'side': side,
            'price': parseFloat(trade['price']),
            'amount': parseFloat(trade['units_traded'])
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let response = yield _this6.publicGetRecentTransactionsCurrency(_this6.extend({
                'currency': market['base'],
                'count': 100 // max = 100
            }, params));
            return _this6.parseTrades(response['data'], market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        throw new NotSupported(this.id + ' private API not implemented yet');
        //     let prefix = '';
        //     if (type == 'market')
        //         prefix = 'market_';
        //     let order = {
        //         'pair': this.marketId (symbol),
        //         'quantity': amount,
        //         'price': price || 0,
        //         'type': prefix + side,
        //     };
        //     let response = await this.privatePostOrderCreate (this.extend (order, params));
        //     return {
        //         'info': response,
        //         'id': response['order_id'].toString (),
        //     };
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            let side = 'side' in params;
            if (!side) throw new ExchangeError(_this7.id + ' cancelOrder requires a side parameter (sell or buy)');
            side = side == 'buy' ? 'purchase' : 'sales';
            let currency = 'currency' in params;
            if (!currency) throw new ExchangeError(_this7.id + ' cancelOrder requires a currency parameter');
            return yield _this7.privatePostTradeCancel({
                'order_id': id,
                'type': params['side'],
                'currency': params['currency']
            });
        })();
    }

    nonce() {
        return this.milliseconds();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let endpoint = '/' + this.implodeParams(path, params);
        let url = this.urls['api'][api] + endpoint;
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if (_Object$keys(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            body = this.urlencode(this.extend({
                'endpoint': endpoint
            }, query));
            let nonce = this.nonce().toString();
            let auth = endpoint + "\0" + body + "\0" + nonce;
            let signature = this.hmac(this.encode(auth), this.encode(this.secret), 'sha512');
            headers = {
                'Api-Key': this.apiKey,
                'Api-Sign': this.decode(this.stringToBase64(this.encode(signature))),
                'Api-Nonce': nonce
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this8.fetch2(path, api, method, params, headers, body);
            if ('status' in response) {
                if (response['status'] == '0000') return response;
                throw new ExchangeError(_this8.id + ' ' + _this8.json(response));
            }
            return response;
        })();
    }
};