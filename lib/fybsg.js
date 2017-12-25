"use strict";

// ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fybse = require('./fybse.js');

// ---------------------------------------------------------------------------

module.exports = function (_fybse) {
    _inherits(fybsg, _fybse);

    function fybsg() {
        _classCallCheck(this, fybsg);

        return _possibleConstructorReturn(this, (fybsg.__proto__ || Object.getPrototypeOf(fybsg)).apply(this, arguments));
    }

    _createClass(fybsg, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(fybsg.prototype.__proto__ || Object.getPrototypeOf(fybsg.prototype), 'describe', this).call(this), {
                'id': 'fybsg',
                'name': 'FYB-SG',
                'countries': 'SG', // Singapore
                'hasCORS': false,
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/27766513-3364d56a-5edb-11e7-9e6b-d5898bb89c81.jpg',
                    'api': 'https://www.fybsg.com/api/SGD',
                    'www': 'https://www.fybsg.com',
                    'doc': 'http://docs.fyb.apiary.io'
                },
                'markets': {
                    'BTC/SGD': { 'id': 'SGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' }
                }
            });
        }
    }]);

    return fybsg;
}(fybse);