'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let main = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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