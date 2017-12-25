'use strict';

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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ccxt = require('./ccxt');
const liqui = new ccxt['liqui']();

main();