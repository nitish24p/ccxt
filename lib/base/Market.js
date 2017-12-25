"use strict";

import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _createClass from "babel-runtime/helpers/createClass";
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