'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// run with `node test_timeout_hang`
// TODO: integrate with CI tests somehow...

var _require = require('../base/functions'),
    timeout = _require.timeout;

(0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return timeout(10000, _promise2.default.resolve('foo'));

                case 2:

                    console.log('Look ma, no hangs!'); // should terminate the process immediately..

                case 3:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, this);
}))();