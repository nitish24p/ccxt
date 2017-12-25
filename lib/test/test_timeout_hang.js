import _regeneratorRuntime from 'babel-runtime/regenerator';
import _Promise from 'babel-runtime/core-js/promise';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';

// run with `node test_timeout_hang`
// TODO: integrate with CI tests somehow...

var _require = require('../base/functions'),
    timeout = _require.timeout;

_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return timeout(10000, _Promise.resolve('foo'));

                case 2:

                    console.log('Look ma, no hangs!'); // should terminate the process immediately..

                case 3:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, this);
}))();