"use strict";

// ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var liqui = require('./liqui.js');

// ---------------------------------------------------------------------------

module.exports = function (_liqui) {
    _inherits(tidex, _liqui);

    function tidex() {
        _classCallCheck(this, tidex);

        return _possibleConstructorReturn(this, (tidex.__proto__ || Object.getPrototypeOf(tidex)).apply(this, arguments));
    }

    _createClass(tidex, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(tidex.prototype.__proto__ || Object.getPrototypeOf(tidex.prototype), 'describe', this).call(this), {
                'id': 'tidex',
                'name': 'Tidex',
                'countries': 'UK',
                'rateLimit': 2000,
                'version': '3',
                // 'hasCORS': false,
                // 'hasFetchTickers': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/30781780-03149dc4-a12e-11e7-82bb-313b269d24d4.jpg',
                    'api': {
                        'public': 'https://api.tidex.com/api',
                        'private': 'https://api.tidex.com/tapi'
                    },
                    'www': 'https://tidex.com',
                    'doc': 'https://tidex.com/public-api',
                    'fees': 'https://tidex.com/pairs-spec'
                },
                'fees': {
                    'trading': {
                        'tierBased': false,
                        'percentage': true,
                        'taker': 0.1 / 100,
                        'maker': 0.1 / 100
                    },
                    'funding': {
                        'tierBased': false,
                        'percentage': false,
                        'withdraw': {
                            'BTC': 0.0012,
                            'ETH': 0.01,
                            'LTC': 0.001,
                            'DOGE': 0.01,
                            'ICN': 2,
                            'DASH': 0.002,
                            'GNO': 2,
                            'EOS': 2,
                            'BCH': 2,
                            'USDT': 0
                        },
                        'deposit': {
                            'BTC': 0,
                            'ETH': 0,
                            'LTC': 0,
                            'DOGE': 0,
                            'ICN': 0,
                            'DASH': 0,
                            'GNO': 0,
                            'EOS': 0,
                            'BCH': 0,
                            'USDT': 0
                        }
                    }
                }
            });
        }
    }]);

    return tidex;
}(liqui);