"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
    function Market(exchange, symbol) {
        (0, _classCallCheck3.default)(this, Market);

        this.exchange = exchange;
        this.symbol = symbol;
        this.market = exchange.markets[symbol];
    }

    (0, _createClass3.default)(Market, [{
        key: "amountToPrecision",
        value: function amountToPrecision(amount) {
            return this.exchange.amountToPrecision(this.symbol, amount);
        }
    }, {
        key: "createLimitBuyOrder",
        value: function createLimitBuyOrder(amount, price) {
            return this.exchange.createLimitBuyOrder(this.symbol, amount, price);
        }
    }, {
        key: "createLimitSellOrder",
        value: function createLimitSellOrder(amount, price) {
            return this.exchange.createLimitSellOrder(this.symbol, amount, price);
        }
    }]);
    return Market;
}();