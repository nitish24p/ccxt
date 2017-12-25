"use strict";

// ---------------------------------------------------------------------------

import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
var liqui = require('./liqui.js');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    InsufficientFunds = _require.InsufficientFunds,
    OrderNotFound = _require.OrderNotFound,
    DDoSProtection = _require.DDoSProtection;

// ---------------------------------------------------------------------------

module.exports = function (_liqui) {
    _inherits(wex, _liqui);

    function wex() {
        _classCallCheck(this, wex);

        return _possibleConstructorReturn(this, (wex.__proto__ || _Object$getPrototypeOf(wex)).apply(this, arguments));
    }

    _createClass(wex, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(wex.prototype.__proto__ || _Object$getPrototypeOf(wex.prototype), 'describe', this).call(this), {
                'id': 'wex',
                'name': 'WEX',
                'countries': 'NZ', // New Zealand
                'version': '3',
                'hasFetchTickers': true,
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/30652751-d74ec8f8-9e31-11e7-98c5-71469fcef03e.jpg',
                    'api': {
                        'public': 'https://wex.nz/api',
                        'private': 'https://wex.nz/tapi'
                    },
                    'www': 'https://wex.nz',
                    'doc': ['https://wex.nz/api/3/docs', 'https://wex.nz/tapi/docs']
                },
                'api': {
                    'public': {
                        'get': ['info', 'ticker/{pair}', 'depth/{pair}', 'trades/{pair}']
                    },
                    'private': {
                        'post': ['getInfo', 'Trade', 'ActiveOrders', 'OrderInfo', 'CancelOrder', 'TradeHistory', 'TransHistory', 'CoinDepositAddress', 'WithdrawCoin', 'CreateCoupon', 'RedeemCoupon']
                    }
                },
                'fees': {
                    'trading': {
                        'maker': 0.2 / 100,
                        'taker': 0.2 / 100
                    }
                }
            });
        }
    }, {
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = ticker['updated'] * 1000;
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': this.safeFloat(ticker, 'high'),
                'low': this.safeFloat(ticker, 'low'),
                'bid': this.safeFloat(ticker, 'sell'),
                'ask': this.safeFloat(ticker, 'buy'),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': this.safeFloat(ticker, 'last'),
                'change': undefined,
                'percentage': undefined,
                'average': this.safeFloat(ticker, 'avg'),
                'baseVolume': this.safeFloat(ticker, 'vol_cur'),
                'quoteVolume': this.safeFloat(ticker, 'vol'),
                'info': ticker
            };
        }
    }, {
        key: 'handleErrors',
        value: function handleErrors(code, reason, url, method, headers, body) {
            if (code == 200) {
                if (body[0] != '{') {
                    // response is not JSON
                    throw new ExchangeError(this.id + ' returned a non-JSON reply: ' + body);
                }
                var response = JSON.parse(body);
                if ('success' in response) {
                    if (!response['success']) {
                        var error = this.safeValue(response, 'error');
                        if (!error) {
                            throw new ExchangeError(this.id + ' returned a malformed error: ' + body);
                        } else if (error == 'bad status') {
                            throw new OrderNotFound(this.id + ' ' + error);
                        } else if (error.indexOf('It is not enough') >= 0) {
                            throw new InsufficientFunds(this.id + ' ' + error);
                        } else if (error == 'Requests too often') {
                            throw new DDoSProtection(this.id + ' ' + error);
                        } else if (error == 'not available') {
                            throw new DDoSProtection(this.id + ' ' + error);
                        } else if (error == 'external service unavailable') {
                            throw new DDoSProtection(this.id + ' ' + error);
                            // that's what fetchOpenOrders return if no open orders (fix for #489)
                        } else if (error != 'no orders') {
                            throw new ExchangeError(this.id + ' ' + error);
                        }
                    }
                }
            }
        }
    }, {
        key: 'request',
        value: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            return this.fetch2(path, api, method, params, headers, body);
        }
    }]);

    return wex;
}(liqui);