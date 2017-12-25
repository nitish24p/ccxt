"use strict";

// ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var acx = require('./acx.js');

// ---------------------------------------------------------------------------

module.exports = function (_acx) {
    _inherits(yunbi, _acx);

    function yunbi() {
        _classCallCheck(this, yunbi);

        return _possibleConstructorReturn(this, (yunbi.__proto__ || Object.getPrototypeOf(yunbi)).apply(this, arguments));
    }

    _createClass(yunbi, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(yunbi.prototype.__proto__ || Object.getPrototypeOf(yunbi.prototype), 'describe', this).call(this), {
                'id': 'yunbi',
                'name': 'YUNBI',
                'countries': 'CN',
                'rateLimit': 1000,
                'version': 'v2',
                'hasCORS': false,
                'hasFetchTickers': true,
                'hasFetchOHLCV': true,
                'timeframes': {
                    '1m': '1',
                    '5m': '5',
                    '15m': '15',
                    '30m': '30',
                    '1h': '60',
                    '2h': '120',
                    '4h': '240',
                    '12h': '720',
                    '1d': '1440',
                    '3d': '4320',
                    '1w': '10080'
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/28570548-4d646c40-7147-11e7-9cf6-839b93e6d622.jpg',
                    'extension': '.json', // default extension appended to endpoint URLs
                    'api': 'https://yunbi.com',
                    'www': 'https://yunbi.com',
                    'doc': ['https://yunbi.com/documents/api/guide', 'https://yunbi.com/swagger/']
                },
                'api': {
                    'public': {
                        'get': ['tickers', 'tickers/{market}', 'markets', 'order_book', 'k', 'depth', 'trades', 'k_with_pending_trades', 'timestamp', 'addresses/{address}', 'partners/orders/{id}/trades']
                    },
                    'private': {
                        'get': ['deposits', 'members/me', 'deposit', 'deposit_address', 'order', 'orders', 'trades/my'],
                        'post': ['order/delete', 'orders', 'orders/multi', 'orders/clear']
                    }
                }
            });
        }
    }]);

    return yunbi;
}(acx);