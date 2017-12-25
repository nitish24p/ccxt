function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// run with `node test_timeout_hang`
// TODO: integrate with CI tests somehow...

const { timeout } = require('../base/functions');_asyncToGenerator(function* () {

    yield timeout(10000, Promise.resolve('foo'));

    console.log('Look ma, no hangs!'); // should terminate the process immediately..
})();