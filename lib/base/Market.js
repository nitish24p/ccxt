"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
    function Market(exchange, symbol) {
        _classCallCheck(this, Market);

        this.exchange = exchange;
        this.symbol = symbol;
        this.market = exchange.markets[symbol];
    }

    _createClass(Market, [{
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