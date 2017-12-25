'use strict';

import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';

var main = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    var market, amount;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return liqui.loadMarkets();

          case 2:
            market = liqui.getMarket('BTC/USDT');
            amount = market.amountToPrecision(1.123456789);

            console.log(amount); // should truncate to 1.12345678
            console.log(market.market);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

var ccxt = require('./ccxt');
var liqui = new ccxt['liqui']();

main();