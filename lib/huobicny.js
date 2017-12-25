"use strict";

// ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var huobipro = require('./huobipro.js');

// ---------------------------------------------------------------------------

module.exports = function (_huobipro) {
    _inherits(huobicny, _huobipro);

    function huobicny() {
        _classCallCheck(this, huobicny);

        return _possibleConstructorReturn(this, (huobicny.__proto__ || Object.getPrototypeOf(huobicny)).apply(this, arguments));
    }

    _createClass(huobicny, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(huobicny.prototype.__proto__ || Object.getPrototypeOf(huobicny.prototype), 'describe', this).call(this), {
                'id': 'huobicny',
                'name': 'Huobi CNY',
                'hostname': 'be.huobi.com',
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766569-15aa7b9a-5edd-11e7-9e7f-44791f4ee49c.jpg',
                    'api': 'https://be.huobi.com',
                    'www': 'https://www.huobi.com',
                    'doc': 'https://github.com/huobiapi/API_Docs/wiki/REST_api_reference'
                }
            });
        }
    }]);

    return huobicny;
}(huobipro);