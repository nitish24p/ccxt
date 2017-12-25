"use strict";

// ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var btcturk = require('./btcturk.js');

// ---------------------------------------------------------------------------

module.exports = function (_btcturk) {
    _inherits(btcexchange, _btcturk);

    function btcexchange() {
        _classCallCheck(this, btcexchange);

        return _possibleConstructorReturn(this, (btcexchange.__proto__ || Object.getPrototypeOf(btcexchange)).apply(this, arguments));
    }

    _createClass(btcexchange, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(btcexchange.prototype.__proto__ || Object.getPrototypeOf(btcexchange.prototype), 'describe', this).call(this), {
                'id': 'btcexchange',
                'name': 'BTCExchange',
                'countries': 'PH', // Philippines
                'rateLimit': 1500,
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27993052-4c92911a-64aa-11e7-96d8-ec6ac3435757.jpg',
                    'api': 'https://www.btcexchange.ph/api',
                    'www': 'https://www.btcexchange.ph',
                    'doc': 'https://github.com/BTCTrader/broker-api-docs'
                },
                'markets': {
                    'BTC/PHP': { 'id': 'BTC/PHP', 'symbol': 'BTC/PHP', 'base': 'BTC', 'quote': 'PHP' }
                }
            });
        }
    }]);

    return btcexchange;
}(btcturk);