"use strict";

// ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var okcoinusd = require('./okcoinusd.js');

// ---------------------------------------------------------------------------

module.exports = function (_okcoinusd) {
    _inherits(okex, _okcoinusd);

    function okex() {
        _classCallCheck(this, okex);

        return _possibleConstructorReturn(this, (okex.__proto__ || Object.getPrototypeOf(okex)).apply(this, arguments));
    }

    _createClass(okex, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(okex.prototype.__proto__ || Object.getPrototypeOf(okex.prototype), 'describe', this).call(this), {
                'id': 'okex',
                'name': 'OKEX',
                'countries': ['CN', 'US'],
                'hasCORS': false,
                'hasFutureMarkets': true,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/32552768-0d6dd3c6-c4a6-11e7-90f8-c043b64756a7.jpg',
                    'api': {
                        'web': 'https://www.okex.com/v2',
                        'public': 'https://www.okex.com/api',
                        'private': 'https://www.okex.com/api'
                    },
                    'www': 'https://www.okex.com',
                    'doc': 'https://www.okex.com/rest_getStarted.html'
                }
            });
        }
    }]);

    return okex;
}(okcoinusd);