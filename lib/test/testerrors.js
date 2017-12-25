'use strict';

import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';

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