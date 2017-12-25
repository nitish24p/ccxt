'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// run with `node test_timeout_hang`
// TODO: integrate with CI tests somehow...

const { timeout } = require('../base/functions');(0, _asyncToGenerator3.default)(function* () {

    yield timeout(10000, _promise2.default.resolve('foo'));

    console.log('Look ma, no hangs!'); // should terminate the process immediately..
})();