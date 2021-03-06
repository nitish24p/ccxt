"use strict";

//  ---------------------------------------------------------------------------

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Exchange = require('./base/Exchange');

//  ---------------------------------------------------------------------------

module.exports = class independentreserve extends Exchange {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'independentreserve',
            'name': 'Independent Reserve',
            'countries': ['AU', 'NZ'], // Australia, New Zealand
            'rateLimit': 1000,
            'hasCORS': false,
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/30521662-cf3f477c-9bcb-11e7-89bc-d1ac85012eda.jpg',
                'api': {
                    'public': 'https://api.independentreserve.com/Public',
                    'private': 'https://api.independentreserve.com/Private'
                },
                'www': 'https://www.independentreserve.com',
                'doc': 'https://www.independentreserve.com/API'
            },
            'api': {
                'public': {
                    'get': ['GetValidPrimaryCurrencyCodes', 'GetValidSecondaryCurrencyCodes', 'GetValidLimitOrderTypes', 'GetValidMarketOrderTypes', 'GetValidOrderTypes', 'GetValidTransactionTypes', 'GetMarketSummary', 'GetOrderBook', 'GetTradeHistorySummary', 'GetRecentTrades', 'GetFxRates']
                },
                'private': {
                    'post': ['PlaceLimitOrder', 'PlaceMarketOrder', 'CancelOrder', 'GetOpenOrders', 'GetClosedOrders', 'GetClosedFilledOrders', 'GetOrderDetails', 'GetAccounts', 'GetTransactions', 'GetDigitalCurrencyDepositAddress', 'GetDigitalCurrencyDepositAddresses', 'SynchDigitalCurrencyDepositAddressWithBlockchain', 'WithdrawDigitalCurrency', 'RequestFiatWithdrawal', 'GetTrades']
                }
            }
        });
    }

    fetchMarkets() {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let baseCurrencies = yield _this.publicGetValidPrimaryCurrencyCodes();
            let quoteCurrencies = yield _this.publicGetValidSecondaryCurrencyCodes();
            let result = [];
            for (let i = 0; i < baseCurrencies.length; i++) {
                let baseId = baseCurrencies[i];
                let baseIdUppercase = baseId.toUpperCase();
                let base = _this.commonCurrencyCode(baseIdUppercase);
                for (let j = 0; j < quoteCurrencies.length; j++) {
                    let quoteId = quoteCurrencies[j];
                    let quoteIdUppercase = quoteId.toUpperCase();
                    let quote = _this.commonCurrencyCode(quoteIdUppercase);
                    let id = baseId + '/' + quoteId;
                    let symbol = base + '/' + quote;
                    let taker = 0.5 / 100;
                    let maker = 0.5 / 100;
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'baseId': baseId,
                        'quoteId': quoteId,
                        'taker': taker,
                        'maker': maker,
                        'info': id
                    });
                }
            }
            return result;
        })();
    }

    fetchBalance(params = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this2.loadMarkets();
            let balances = yield _this2.privatePostGetAccounts();
            let result = { 'info': balances };
            for (let i = 0; i < balances.length; i++) {
                let balance = balances[i];
                let currencyCode = balance['CurrencyCode'];
                let uppercase = currencyCode.toUpperCase();
                let currency = _this2.commonCurrencyCode(uppercase);
                let account = _this2.account();
                account['free'] = balance['AvailableBalance'];
                account['total'] = balance['TotalBalance'];
                account['used'] = account['total'] - account['free'];
                result[currency] = account;
            }
            return _this2.parseBalance(result);
        })();
    }

    fetchOrderBook(symbol, params = {}) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this3.loadMarkets();
            let market = _this3.market(symbol);
            let response = yield _this3.publicGetOrderBook(_this3.extend({
                'primaryCurrencyCode': market['baseId'],
                'secondaryCurrencyCode': market['quoteId']
            }, params));
            let timestamp = _this3.parse8601(response['CreatedTimestampUtc']);
            return _this3.parseOrderBook(response, timestamp, 'BuyOrders', 'SellOrders', 'Price', 'Volume');
        })();
    }

    parseTicker(ticker, market = undefined) {
        let timestamp = this.parse8601(ticker['CreatedTimestampUtc']);
        let symbol = undefined;
        if (market) symbol = market['symbol'];
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': ticker['DayHighestPrice'],
            'low': ticker['DayLowestPrice'],
            'bid': ticker['CurrentHighestBidPrice'],
            'ask': ticker['CurrentLowestOfferPrice'],
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'first': undefined,
            'last': ticker['LastPrice'],
            'change': undefined,
            'percentage': undefined,
            'average': ticker['DayAvgPrice'],
            'baseVolume': ticker['DayVolumeXbtInSecondaryCurrrency'],
            'quoteVolume': undefined,
            'info': ticker
        };
    }

    fetchTicker(symbol, params = {}) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this4.loadMarkets();
            let market = _this4.market(symbol);
            let response = yield _this4.publicGetMarketSummary(_this4.extend({
                'primaryCurrencyCode': market['baseId'],
                'secondaryCurrencyCode': market['quoteId']
            }, params));
            return _this4.parseTicker(response, market);
        })();
    }

    parseTrade(trade, market) {
        let timestamp = this.parse8601(trade['TradeTimestampUtc']);
        return {
            'id': undefined,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'order': undefined,
            'type': undefined,
            'side': undefined,
            'price': trade['SecondaryCurrencyTradePrice'],
            'amount': trade['PrimaryCurrencyAmount']
        };
    }

    fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this5.loadMarkets();
            let market = _this5.market(symbol);
            let response = yield _this5.publicGetRecentTrades(_this5.extend({
                'primaryCurrencyCode': market['baseId'],
                'secondaryCurrencyCode': market['quoteId'],
                'numberOfRecentTradesToRetrieve': 50 // max = 50
            }, params));
            return _this5.parseTrades(response['Trades'], market, since, limit);
        })();
    }

    createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this6.loadMarkets();
            let market = _this6.market(symbol);
            let capitalizedOrderType = _this6.capitalize(type);
            let method = 'Place' + capitalizedOrderType + 'Order';
            let orderType = capitalizedOrderType;
            orderType += side == 'sell' ? 'Offer' : 'Bid';
            let order = _this6.ordered({
                'primaryCurrencyCode': market['baseId'],
                'secondaryCurrencyCode': market['quoteId'],
                'orderType': orderType
            });
            if (type == 'limit') order['price'] = price;
            order['volume'] = amount;
            let response = yield _this6[method](_this6.extend(order, params));
            return {
                'info': response,
                'id': response['OrderGuid']
            };
        })();
    }

    cancelOrder(id, symbol = undefined, params = {}) {
        var _this7 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield _this7.loadMarkets();
            return yield _this7.privatePostCancelOrder({ 'orderGuid': id });
        })();
    }

    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api] + '/' + path;
        if (api == 'public') {
            if ((0, _keys2.default)(params).length) url += '?' + this.urlencode(params);
        } else {
            this.checkRequiredCredentials();
            let nonce = this.nonce();
            let auth = [url, 'apiKey=' + this.apiKey, 'nonce=' + nonce.toString()];
            let keysorted = this.keysort(params);
            let keys = (0, _keys2.default)(keysorted);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                auth.push(key + '=' + params[key]);
            }
            let message = auth.join(',');
            let signature = this.hmac(this.encode(message), this.encode(this.secret));
            let query = this.keysort(this.extend({
                'apiKey': this.apiKey,
                'nonce': nonce,
                'signature': signature
            }, params));
            body = this.json(query);
            headers = { 'Content-Type': 'application/json' };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    request(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        var _this8 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let response = yield _this8.fetch2(path, api, method, params, headers, body);
            // todo error handling
            return response;
        })();
    }
};