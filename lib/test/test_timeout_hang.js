'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// run with `node test_timeout_hang`
// TODO: integrate with CI tests somehow...

var _require = require('../base/functions'),
    timeout = _require.timeout;

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return timeout(10000, Promise.resolve('foo'));

                case 2:

                    console.log('Look ma, no hangs!'); // should terminate the process immediately..

                case 3:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, this);
}))();