'use strict';

import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';

let main = (() => {
  var _ref = _asyncToGenerator(function* () {
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

const ccxt = require('./ccxt');
const liqui = new ccxt['liqui']();

main();