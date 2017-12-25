'use strict';

let main = (() => {
  var _ref = _asyncToGenerator(function* () {
    yield exchange.loadMarkets();
    try {
      yield exchange.createLimitBuyOrder('BTC/USD', 1000, 1000);
    } catch (e) {
      if (e instanceof ccxt.InsufficientFunds) {
        // swallow
      } else {
        throw e;
      }
    }

    try {
      yield exchange.cancelOrder(1);
    } catch (e) {
      if (e instanceof ccxt.OrderNotFound) {
        // swallow
      } else {
        throw e;
      }
    }

    yield exchange.fetchOpenOrders('BTC/USD');
  });

  return function main() {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ccxt = require('../../ccxt');
const keys = require('../../../mm/config');

const argv = process.argv;

const [, /* node */script, exchangeId] = argv;
if (!exchangeId) {
  console.error(`Usage: node ${script} exchangeId`);
  //return;
}

const exchange = new ccxt[exchangeId](keys[exchangeId]);

main();