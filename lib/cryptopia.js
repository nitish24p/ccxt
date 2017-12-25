"use strict";

//  ---------------------------------------------------------------------------

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Exchange = require('./base/Exchange');
const { ExchangeError, InsufficientFunds, OrderNotFound, OrderNotCached } = require('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class cryptopia extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'cryptopia',
            'name': 'Cryptopia',
            'rateLimit': 1500,
            'countries': 'NZ', // New Zealand
            'hasCORS': false,
            // obsolete metainfo interface
            'hasFetchTickers': true,
            'hasFetchOrder': true,
            'hasFetchOrders': true,
            'hasFetchOpenOrders': true,
            'hasFetchClosedOrders': true,
            'hasFetchMyTrades': true,
            'hasFetchCurrencies': true,
            'hasDeposit': true,
            'hasWithdraw': true,
            // new metainfo interface
            'has': {
                'fetchTickers': true,
                'fetchOrder': 'emulated',
                'fetchOrders': 'emulated',
                'fetchOpenOrders': true,
                'fetchClosedOrders': 'emulated',
                'fetchMyTrades': true,
                'fetchCurrencies': true,
                'deposit': true,
                'withdraw': true
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/29484394-7b4ea6e2-84c6-11e7-83e5-1fccf4b2dc81.jpg',
                'api': 'https://www.cryptopia.co.nz/api',
                'www': 'https://www.cryptopia.co.nz',
                'doc': ['https://www.cryptopia.co.nz/Forum/Category/45', 'https://www.cryptopia.co.nz/Forum/Thread/255', 'https://www.cryptopia.co.nz/Forum/Thread/256']
            },
            'api': {
                'public': {
                    'get': ['GetCurrencies', 'GetTradePairs', 'GetMarkets', 'GetMarkets/{id}', 'GetMarkets/{hours}', 'GetMarkets/{id}/{hours}', 'GetMarket/{id}', 'GetMarket/{id}/{hours}', 'GetMarketHistory/{id}', 'GetMarketHistory/{id}/{hours}', 'GetMarketOrders/{id}', 'GetMarketOrders/{id}/{count}', 'GetMarketOrderGroups/{ids}/{count}']
                },
                'private': {
                    'post': ['CancelTrade', 'GetBalance', 'GetDepositAddress', 'GetOpenOrders', 'GetTradeHistory', 'GetTransactions', 'SubmitTip', 'SubmitTrade', 'SubmitTransfer', 'SubmitWithdraw']
                }
            }
        });
    }

    commonCurrencyCode(currency) {
        if (currency == 'CC') return 'CCX';
        if (currency == 'FCN') return 'Facilecoin';
        if (currency == 'NET') return 'NetCoin';
        if (currency == 'BTG') return 'Bitgem';
        if (currency == 'FUEL') return 'FC2'; // FuelCoin != FUEL
        if (currency == 'WRC') return 'WarCoin';
        return currency;
    }

    currencyId(currency) {
        if (currency == 'CCX') return 'CC';
        if (currency == 'Facilecoin') return 'FCN';
        if (currency == 'NetCoin') return 'NET';
        if (currency == 'Bitgem') return 'BTG';
        if (currency == 'FC2') return 'FUEL'; // FuelCoin != FUEL
        return currency;
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let response = yield _this.publicGetTradePairs();
            let result = [];
            let markets = response['Data'];
            for (let i = 0; i < markets.length; i++) {
                let market = markets[i];
                let id = market['Id'];
                let symbol = market['Label'];
                let [base, quote] = symbol.split('/');
                base = _this.commonCurrencyCode(base);
                quote = _this.commonCurrencyCode(quote);
                symbol = base + '/' + quote;
                let precision = {
                    'amount': 8,
                    'price': 8
                };
                let amountLimits = {
                    'min': market['MinimumTrade'],
                    'max': market['MaximumTrade']
                };
                let priceLimits = {
                    'min': market['MinimumPrice'],
                    'max': market['MaximumPrice']
                };
                let limits = {
                    'amount': amountLimits,
                    'price': priceLimits
                };
                let active = market['Status'] == 'OK';
                result.push({
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'info': market,
                    'maker': market['TradeFee'] / 100,
                    'taker': market['TradeFee'] / 100,
                    'lot': amountLimits['min'],
                    'active': active,
                    'precision': precision,
                    'limits': limits
                });
            }
            return result;
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            yield _this2.loadMarkets();
            let response = yield _this2.publicGetMarketOrdersId(_this2.extend({
                'id': _this2.marketId(symbol)
            }, params));
            let orderbook = response['Data'];
            return _this2.parseOrderBook(orderbook, undefined, 'Buy', 'Sell', 'Price', 'Volume');
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = this.milliseconds();
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'info': ticker,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': parseFloat(ticker['High']),
            'low': parseFloat(ticker['Low']),
            'bid': parseFloat(ticker['BidPrice']),
            'ask': parseFloat(ticker['AskPrice']),
            'vwap': undefined,
            'open': parseFloat(ticker['Open']),
            'close': parseFloat(ticker['Close']),
            'first': undefined,
            'last': parseFloat(ticker['LastPrice']),
            'change': parseFloat(ticker['Change']),
            'percentage': undefined,
            'average': undefined,
            'baseVolume': parseFloat(ticker['Volume']),
            'quoteVolume': parseFloat(ticker['BaseVolume'])
        };
    }

    fetchTicker(symbol, params = {}) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let response = yield _this3.publicGetMarketId(_this3.extend({
                'id': market['id']
            }, params));
            let ticker = response['Data'];
            return _this3.parseTicker(ticker, market);
        })();
    }

    fetchTickers(symbols = undefined, params = {}) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            yield _this4.loadMarkets();
            let response = yield _this4.publicGetMarkets(params);
            let result = {};
            let tickers = response['Data'];
            for (let i = 0; i < tickers.length; i++) {
                let ticker = tickers[i];
                let id = ticker['TradePairId'];
                let recognized = id in _this4.markets_by_id;
                if (!recognized) throw new ExchangeError(_this4.id + ' fetchTickers() returned unrecognized pair id ' + id);
                let market = _this4.markets_by_id[id];
                let symbol = market['symbol'];
                result[symbol] = _this4.parseTicker(ticker, market);
            }
            return result;
        })();
    }

    parseTrade(trade, market = undefined) {
        let timestamp = undefined;
        if ('Timestamp' in trade) {
            timestamp = trade['Timestamp'] * 1000;
        } else if ('TimeStamp' in trade) {
            timestamp = this.parse8601(trade['TimeStamp']);
        }
        let price = this.safeFloat(trade, 'Price');
        if (!price) price = this.safeFloat(trade, 'Rate');
        let cost = this.safeFloat(trade, 'Total');
        let id = this.safeString(trade, 'TradeId');
        if (!market) {
            if ('TradePairId' in trade) if (trade['TradePairId'] in this.markets_by_id) market = this.markets_by_id[trade['TradePairId']];
        }
        let symbol = undefined;
        let fee = undefined;
        if (market) {
            symbol = market['symbol'];
            if ('Fee' in trade) {
                fee = {
                    'currency': market['quote'],
                    'cost': trade['Fee']
                };
            }
        }
        return {
            'id': id,
            'info': trade,
            'order': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'type': 'limit',
            'side': trade['Type'].toLowerCase(),
            'price': price,
            'cost': cost,
            'amount': trade['Amount'],
            'fee': fee
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let response = yield _this5.publicGetMarketHistoryIdHours(_this5.extend({
                'id': market['id'],
                'hours': 24 // default
            }, params));
            let trades = response['Data'];
            return _this5.parseTrades(trades, market, since, limit);
        })();
    }

    fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            yield _this6.loadMarkets();
            let request = {};
            let market = undefined;
            if (symbol) {
                market = _this6.market(symbol);
                request['TradePairId'] = market['id'];
            }
            let response = yield _this6.privatePostGetTradeHistory(_this6.extend(request, params));
            return _this6.parseTrades(response['Data'], market, since, limit);
        })();
    }

    fetchCurrencies(params = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this7.publicGetCurrencies(params);
            let currencies = response['Data'];
            let result = {};
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let id = currency['Symbol'];
                // todo: will need to rethink the fees
                // to add support for multiple withdrawal/deposit methods and
                // differentiated fees for each particular method
                let precision = 8; // default precision, todo: fix "magic constants"
                let code = _this7.commonCurrencyCode(id);
                let active = currency['ListingStatus'] == 'Active';
                let status = currency['Status'].toLowerCase();
                if (status != 'ok') active = false;
                result[code] = {
                    'id': id,
                    'code': code,
                    'info': currency,
                    'name': currency['Name'],
                    'active': active,
                    'status': status,
                    'fee': currency['WithdrawFee'],
                    'precision': precision,
                    'limits': {
                        'amount': {
                            'min': currency['MinBaseTrade'],
                            'max': Math.pow(10, precision)
                        },
                        'price': {
                            'min': Math.pow(10, -precision),
                            'max': Math.pow(10, precision)
                        },
                        'cost': {
                            'min': undefined,
                            'max': undefined
                        },
                        'withdraw': {
                            'min': currency['MinWithdraw'],
                            'max': currency['MaxWithdraw']
                        }
                    }
                };
            }
            return result;
        })();
    }

    fetchBalance(params = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            yield _this8.loadMarkets();
            let response = yield _this8.privatePostGetBalance();
            let balances = response['Data'];
            let result = { 'info': response };
            for (let i = 0; i < balances.length; i++) {
                let balance = balances[i];
                let code = balance['Symbol'];
                let currency = _this8.commonCurrencyCode(code);
                let account = {
                    'free': balance['Available'],
                    'used': 0.0,
                    'total': balance['Total']
                };
                account['used'] = account['total'] - account['free'];
                result[currency] = account;
            }
            return _this8.parseBalance(result);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            if (type == 'market') throw new ExchangeError(_this9.id + ' allows limit orders only');
            yield _this9.loadMarkets();
            let market = _this9.market(symbol);
            price = parseFloat(price);
            amount = parseFloat(amount);
            let request = {
                'TradePairId': market['id'],
                'Type': _this9.capitalize(side),
                'Rate': _this9.priceToPrecision(symbol, price),
                'Amount': _this9.amountToPrecision(symbol, amount)
            };
            let response = yield _this9.privatePostSubmitTrade(_this9.extend(request, params));
            if (!response) throw new ExchangeError(_this9.id + ' createOrder returned unknown error: ' + _this9.json(response));
            let id = undefined;
            let filled = 0.0;
            if ('Data' in response) {
                if ('OrderId' in response['Data']) {
                    if (response['Data']['OrderId']) {
                        id = response['Data']['OrderId'].toString();
                    }
                }
                if ('FilledOrders' in response['Data']) {
                    let filledOrders = response['Data']['FilledOrders'];
                    let filledOrdersLength = filledOrders.length;
                    if (filledOrdersLength) {
                        filled = undefined;
                    }
                }
            }
            let timestamp = _this9.milliseconds();
            let order = {
                'id': id,
                'timestamp': timestamp,
                'datetime': _this9.iso8601(timestamp),
                'status': 'open',
                'symbol': symbol,
                'type': type,
                'side': side,
                'price': price,
                'cost': price * amount,
                'amount': amount,
                'remaining': amount,
                'filled': filled,
                'fee': undefined
                // 'trades': this.parseTrades (order['trades'], market),
            };
            if (id) _this9.orders[id] = order;
            return _this9.extend({ 'info': response }, order);
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this10 = this;

        return _asyncToGenerator(function* () {
            yield _this10.loadMarkets();
            let response = undefined;
            try {
                response = yield _this10.privatePostCancelTrade(_this10.extend({
                    'Type': 'Trade',
                    'OrderId': id
                }, params));
                if (id in _this10.orders) _this10.orders[id]['status'] = 'canceled';
            } catch (e) {
                if (_this10.last_json_response) {
                    let message = _this10.safeString(_this10.last_json_response, 'Error');
                    if (message) {
                        if (message.indexOf('does not exist') >= 0) throw new OrderNotFound(_this10.id + ' cancelOrder() error: ' + _this10.last_http_response);
                    }
                }
                throw e;
            }
            return response;
        })();
    }

    parseOrder(order, market = undefined) {
        let symbol = undefined;
        if (market) {
            symbol = market['symbol'];
        } else if ('Market' in order) {
            let id = order['Market'];
            if (id in this.markets_by_id) {
                market = this.markets_by_id[id];
                symbol = market['symbol'];
            }
        }
        let timestamp = this.parse8601(order['TimeStamp']);
        let amount = this.safeFloat(order, 'Amount');
        let remaining = this.safeFloat(order, 'Remaining');
        let filled = amount - remaining;
        return {
            'id': order['OrderId'].toString(),
            'info': this.omit(order, 'status'),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'status': order['status'],
            'symbol': symbol,
            'type': 'limit',
            'side': order['Type'].toLowerCase(),
            'price': this.safeFloat(order, 'Rate'),
            'cost': this.safeFloat(order, 'Total'),
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'fee': undefined
            // 'trades': this.parseTrades (order['trades'], market),
        };
    }

    fetchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this11 = this;

        return _asyncToGenerator(function* () {
            if (!symbol) throw new ExchangeError(_this11.id + ' fetchOrders requires a symbol param');
            yield _this11.loadMarkets();
            let market = _this11.market(symbol);
            let response = yield _this11.privatePostGetOpenOrders({
                // 'Market': market['id'],
                'TradePairId': market['id'] // Cryptopia identifier (not required if 'Market' supplied)
                // 'Count': 100, // default = 100
            }, params);
            let orders = [];
            for (let i = 0; i < response['Data'].length; i++) {
                orders.push(_this11.extend(response['Data'][i], { 'status': 'open' }));
            }
            let openOrders = _this11.parseOrders(orders, market);
            for (let j = 0; j < openOrders.length; j++) {
                _this11.orders[openOrders[j]['id']] = openOrders[j];
            }
            let openOrdersIndexedById = _this11.indexBy(openOrders, 'id');
            let cachedOrderIds = Object.keys(_this11.orders);
            let result = [];
            for (let k = 0; k < cachedOrderIds.length; k++) {
                let id = cachedOrderIds[k];
                if (id in openOrdersIndexedById) {
                    _this11.orders[id] = _this11.extend(_this11.orders[id], openOrdersIndexedById[id]);
                } else {
                    let order = _this11.orders[id];
                    if (order['status'] == 'open') {
                        _this11.orders[id] = _this11.extend(order, {
                            'status': 'closed',
                            'cost': order['amount'] * order['price'],
                            'filled': order['amount'],
                            'remaining': 0.0
                        });
                    }
                }
                let order = _this11.orders[id];
                if (order['symbol'] == symbol) result.push(order);
            }
            return _this11.filterBySinceLimit(result, since, limit);
        })();
    }

    fetchOrder(id, symbol = undefined, params = {}) {
        var _this12 = this;

        return _asyncToGenerator(function* () {
            id = id.toString();
            let orders = yield _this12.fetchOrders(symbol, params);
            for (let i = 0; i < orders.length; i++) {
                if (orders[i]['id'] == id) return orders[i];
            }
            throw new OrderNotCached(_this12.id + ' order ' + id + ' not found in cached .orders, fetchOrder requires .orders (de)serialization implemented for this method to work properly');
        })();
    }

    fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this13 = this;

        return _asyncToGenerator(function* () {
            let orders = yield _this13.fetchOrders(symbol, params);
            let result = [];
            for (let i = 0; i < orders.length; i++) {
                if (orders[i]['status'] == 'open') result.push(orders[i]);
            }
            return result;
        })();
    }

    fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        var _this14 = this;

        return _asyncToGenerator(function* () {
            let orders = yield _this14.fetchOrders(symbol, params);
            let result = [];
            for (let i = 0; i < orders.length; i++) {
                if (orders[i]['status'] == 'closed') result.push(orders[i]);
            }
            return result;
        })();
    }

    fetchDepositAddress(currency, params = {}) {
        var _this15 = this;

        return _asyncToGenerator(function* () {
            let currencyId = _this15.currencyId(currency);
            let response = yield _this15.privatePostGetDepositAddress(_this15.extend({
                'Currency': currencyId
            }, params));
            let address = _this15.safeString(response['Data'], 'BaseAddress');
            if (!address) address = _this15.safeString(response['Data'], 'Address');
            return {
                'currency': currency,
                'address': address,
                'status': 'ok',
                'info': response
            };
        })();
    }

    withdraw(currency, amount, address, params = {}) {
        var _this16 = this;

        return _asyncToGenerator(function* () {
            let currencyId = _this16.currencyId(currency);
            let response = yield _this16.privatePostSubmitWithdraw(_this16.extend({
                'Currency': currencyId,
                'Amount': amount,
                'Address': address // Address must exist in you AddressBook in security settings
            }, params));
            return {
                'info': response,
                'id': response['Data']
            };
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'] + '/' + this.implodeParams(path, params);
        let query = this.omit(params, this.extractParams(path));
        if (api == 'public') {
            if (Object.keys(query).length) url += '?' + this.urlencode(query);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce().toString();
            body = this.json(query);
            let hash = this.hash(this.encode(body), 'md5', 'base64');
            let secret = this.base64ToBinary(this.secret);
            let uri = this.encodeURIComponent(url);
            let lowercase = uri.toLowerCase();
            let payload = this.apiKey + method + lowercase + nonce + this.binaryToString(hash);
            let signature = this.hmac(this.encode(payload), secret, 'sha256', 'base64');
            let auth = 'amx ' + this.apiKey + ':' + this.binaryToString(signature) + ':' + nonce;
            headers = {
                'Content-Type': 'application/json',
                'Authorization': auth
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this17 = this;

        return _asyncToGenerator(function* () {
            let response = yield _this17.fetch2(path, api, method, params, headers, body);
            if (response) {
                if ('Success' in response) if (response['Success']) {
                    return response;
                } else if ('Error' in response) {
                    if (response['Error'] == 'Insufficient Funds.') throw new InsufficientFunds(_this17.id + ' ' + _this17.json(response));
                }
            }
            throw new ExchangeError(_this17.id + ' ' + _this17.json(response));
        })();
    }
};