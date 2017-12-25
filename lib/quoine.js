"use strict";

// ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var qryptos = require('./qryptos.js');

// ---------------------------------------------------------------------------

module.exports = function (_qryptos) {
    _inherits(quoine, _qryptos);

    function quoine() {
        _classCallCheck(this, quoine);

        return _possibleConstructorReturn(this, (quoine.__proto__ || Object.getPrototypeOf(quoine)).apply(this, arguments));
    }

    _createClass(quoine, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(quoine.prototype.__proto__ || Object.getPrototypeOf(quoine.prototype), 'describe', this).call(this), {
                'id': 'quoine',
                'name': 'QUOINE',
                'countries': ['JP', 'SG', 'VN'],
                'version': '2',
                'rateLimit': 1000,
                'hasFetchTickers': true,
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766844-9615a4e8-5ee8-11e7-8814-fcd004db8cdd.jpg',
                    'api': 'https://api.quoine.com',
                    'www': 'https://www.quoine.com',
                    'doc': 'https://developers.quoine.com'
                }
            });
        }
    }]);

    return quoine;
}(qryptos);