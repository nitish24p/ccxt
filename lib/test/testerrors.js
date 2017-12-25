'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var main = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return exchange.loadMarkets();

          case 2:
            _context.prev = 2;
            _context.next = 5;
            return exchange.createLimitBuyOrder('BTC/USD', 1000, 1000);

          case 5:
            _context.next = 13;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](2);

            if (!(_context.t0 instanceof ccxt.InsufficientFunds)) {
              _context.next = 12;
              break;
            }

            _context.next = 13;
            break;

          case 12:
            throw _context.t0;

          case 13:
            _context.prev = 13;
            _context.next = 16;
            return exchange.cancelOrder(1);

          case 16:
            _context.next = 24;
            break;

          case 18:
            _context.prev = 18;
            _context.t1 = _context['catch'](13);

            if (!(_context.t1 instanceof ccxt.OrderNotFound)) {
              _context.next = 23;
              break;
            }

            _context.next = 24;
            break;

          case 23:
            throw _context.t1;

          case 24:
            _context.next = 26;
            return exchange.fetchOpenOrders('BTC/USD');

          case 26:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 7], [13, 18]]);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ccxt = require('../../ccxt');
var keys = require('../../../mm/config');

var argv = process.argv;

var _argv = (0, _slicedToArray3.default)(argv, 3),
    /* node */script = _argv[1],
    exchangeId = _argv[2];

if (!exchangeId) {
  console.error('Usage: node ' + script + ' exchangeId');
  //return;
}

var exchange = new ccxt[exchangeId](keys[exchangeId]);

main();