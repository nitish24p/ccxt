import _Promise from 'babel-runtime/core-js/promise';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
// run with `node test_timeout_hang`
// TODO: integrate with CI tests somehow...

const { timeout } = require('../base/functions');_asyncToGenerator(function* () {

    yield timeout(10000, _Promise.resolve('foo'));

    console.log('Look ma, no hangs!'); // should terminate the process immediately..
})();