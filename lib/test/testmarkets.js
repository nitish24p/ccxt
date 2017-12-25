'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let main = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* () {
    yield liqui.loadMarkets();

    const market = liqui.getMarket('BTC/USDT');

    const amount = market.amountToPrecision(1.123456789);
    console.log(amount); // should truncate to 1.12345678
    console.log(market.market);
  });

  return function main() {
    return _ref.apply(this, arguments);
  };
})();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ccxt = require('./ccxt');
const liqui = new ccxt['liqui']();

main();