'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var main = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ccxt = require('../../ccxt');
var keys = require('../../../mm/config');

var argv = process.argv;

var _argv = _slicedToArray(argv, 3),
    /* node */script = _argv[1],
    exchangeId = _argv[2];

if (!exchangeId) {
  console.error('Usage: node ' + script + ' exchangeId');
  //return;
}

var exchange = new ccxt[exchangeId](keys[exchangeId]);

main();