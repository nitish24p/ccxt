"use strict";

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseError = function (_Error) {
    (0, _inherits3.default)(BaseError, _Error);

    function BaseError(message) {
        (0, _classCallCheck3.default)(this, BaseError);

        // a workaround to make `instanceof BaseError` work in ES5
        var _this = (0, _possibleConstructorReturn3.default)(this, (BaseError.__proto__ || (0, _getPrototypeOf2.default)(BaseError)).call(this, message));

        _this.constructor = BaseError;
        _this.__proto__ = BaseError.prototype;
        _this.message = message;
        return _this;
    }

    return BaseError;
}(Error);

var ExchangeError = function (_BaseError) {
    (0, _inherits3.default)(ExchangeError, _BaseError);

    function ExchangeError(message) {
        (0, _classCallCheck3.default)(this, ExchangeError);

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (ExchangeError.__proto__ || (0, _getPrototypeOf2.default)(ExchangeError)).call(this, message));

        _this2.constructor = ExchangeError;
        _this2.__proto__ = ExchangeError.prototype;
        _this2.message = message;
        return _this2;
    }

    return ExchangeError;
}(BaseError);

var NotSupported = function (_ExchangeError) {
    (0, _inherits3.default)(NotSupported, _ExchangeError);

    function NotSupported(message) {
        (0, _classCallCheck3.default)(this, NotSupported);

        var _this3 = (0, _possibleConstructorReturn3.default)(this, (NotSupported.__proto__ || (0, _getPrototypeOf2.default)(NotSupported)).call(this, message));

        _this3.constructor = NotSupported;
        _this3.__proto__ = NotSupported.prototype;
        _this3.message = message;
        return _this3;
    }

    return NotSupported;
}(ExchangeError);

var AuthenticationError = function (_ExchangeError2) {
    (0, _inherits3.default)(AuthenticationError, _ExchangeError2);

    function AuthenticationError(message) {
        (0, _classCallCheck3.default)(this, AuthenticationError);

        var _this4 = (0, _possibleConstructorReturn3.default)(this, (AuthenticationError.__proto__ || (0, _getPrototypeOf2.default)(AuthenticationError)).call(this, message));

        _this4.constructor = AuthenticationError;
        _this4.__proto__ = AuthenticationError.prototype;
        _this4.message = message;
        return _this4;
    }

    return AuthenticationError;
}(ExchangeError);

var InvalidNonce = function (_ExchangeError3) {
    (0, _inherits3.default)(InvalidNonce, _ExchangeError3);

    function InvalidNonce(message) {
        (0, _classCallCheck3.default)(this, InvalidNonce);

        var _this5 = (0, _possibleConstructorReturn3.default)(this, (InvalidNonce.__proto__ || (0, _getPrototypeOf2.default)(InvalidNonce)).call(this, message));

        _this5.constructor = InvalidNonce;
        _this5.__proto__ = InvalidNonce.prototype;
        _this5.message = message;
        return _this5;
    }

    return InvalidNonce;
}(ExchangeError);

var InsufficientFunds = function (_ExchangeError4) {
    (0, _inherits3.default)(InsufficientFunds, _ExchangeError4);

    function InsufficientFunds(message) {
        (0, _classCallCheck3.default)(this, InsufficientFunds);

        var _this6 = (0, _possibleConstructorReturn3.default)(this, (InsufficientFunds.__proto__ || (0, _getPrototypeOf2.default)(InsufficientFunds)).call(this, message));

        _this6.constructor = InsufficientFunds;
        _this6.__proto__ = InsufficientFunds.prototype;
        _this6.message = message;
        return _this6;
    }

    return InsufficientFunds;
}(ExchangeError);

var InvalidOrder = function (_ExchangeError5) {
    (0, _inherits3.default)(InvalidOrder, _ExchangeError5);

    function InvalidOrder(message) {
        (0, _classCallCheck3.default)(this, InvalidOrder);

        var _this7 = (0, _possibleConstructorReturn3.default)(this, (InvalidOrder.__proto__ || (0, _getPrototypeOf2.default)(InvalidOrder)).call(this, message));

        _this7.constructor = InvalidOrder;
        _this7.__proto__ = InvalidOrder.prototype;
        _this7.message = message;
        return _this7;
    }

    return InvalidOrder;
}(ExchangeError);

var OrderNotFound = function (_InvalidOrder) {
    (0, _inherits3.default)(OrderNotFound, _InvalidOrder);

    function OrderNotFound(message) {
        (0, _classCallCheck3.default)(this, OrderNotFound);

        var _this8 = (0, _possibleConstructorReturn3.default)(this, (OrderNotFound.__proto__ || (0, _getPrototypeOf2.default)(OrderNotFound)).call(this, message));

        _this8.constructor = OrderNotFound;
        _this8.__proto__ = OrderNotFound.prototype;
        _this8.message = message;
        return _this8;
    }

    return OrderNotFound;
}(InvalidOrder);

var OrderNotCached = function (_InvalidOrder2) {
    (0, _inherits3.default)(OrderNotCached, _InvalidOrder2);

    function OrderNotCached(message) {
        (0, _classCallCheck3.default)(this, OrderNotCached);

        var _this9 = (0, _possibleConstructorReturn3.default)(this, (OrderNotCached.__proto__ || (0, _getPrototypeOf2.default)(OrderNotCached)).call(this, message));

        _this9.constructor = OrderNotCached;
        _this9.__proto__ = OrderNotCached.prototype;
        _this9.message = message;
        return _this9;
    }

    return OrderNotCached;
}(InvalidOrder);

var CancelPending = function (_InvalidOrder3) {
    (0, _inherits3.default)(CancelPending, _InvalidOrder3);

    function CancelPending(message) {
        (0, _classCallCheck3.default)(this, CancelPending);

        var _this10 = (0, _possibleConstructorReturn3.default)(this, (CancelPending.__proto__ || (0, _getPrototypeOf2.default)(CancelPending)).call(this, message));

        _this10.constructor = CancelPending;
        _this10.__proto__ = CancelPending.prototype;
        _this10.message = message;
        return _this10;
    }

    return CancelPending;
}(InvalidOrder);

var NetworkError = function (_BaseError2) {
    (0, _inherits3.default)(NetworkError, _BaseError2);

    function NetworkError(message) {
        (0, _classCallCheck3.default)(this, NetworkError);

        var _this11 = (0, _possibleConstructorReturn3.default)(this, (NetworkError.__proto__ || (0, _getPrototypeOf2.default)(NetworkError)).call(this, message));

        _this11.constructor = NetworkError;
        _this11.__proto__ = NetworkError.prototype;
        _this11.message = message;
        return _this11;
    }

    return NetworkError;
}(BaseError);

var DDoSProtection = function (_NetworkError) {
    (0, _inherits3.default)(DDoSProtection, _NetworkError);

    function DDoSProtection(message) {
        (0, _classCallCheck3.default)(this, DDoSProtection);

        var _this12 = (0, _possibleConstructorReturn3.default)(this, (DDoSProtection.__proto__ || (0, _getPrototypeOf2.default)(DDoSProtection)).call(this, message));

        _this12.constructor = DDoSProtection;
        _this12.__proto__ = DDoSProtection.prototype;
        _this12.message = message;
        return _this12;
    }

    return DDoSProtection;
}(NetworkError);

var RequestTimeout = function (_NetworkError2) {
    (0, _inherits3.default)(RequestTimeout, _NetworkError2);

    function RequestTimeout(message) {
        (0, _classCallCheck3.default)(this, RequestTimeout);

        var _this13 = (0, _possibleConstructorReturn3.default)(this, (RequestTimeout.__proto__ || (0, _getPrototypeOf2.default)(RequestTimeout)).call(this, message));

        _this13.constructor = RequestTimeout;
        _this13.__proto__ = RequestTimeout.prototype;
        _this13.message = message;
        return _this13;
    }

    return RequestTimeout;
}(NetworkError);

var ExchangeNotAvailable = function (_NetworkError3) {
    (0, _inherits3.default)(ExchangeNotAvailable, _NetworkError3);

    function ExchangeNotAvailable(message) {
        (0, _classCallCheck3.default)(this, ExchangeNotAvailable);

        var _this14 = (0, _possibleConstructorReturn3.default)(this, (ExchangeNotAvailable.__proto__ || (0, _getPrototypeOf2.default)(ExchangeNotAvailable)).call(this, message));

        _this14.constructor = ExchangeNotAvailable;
        _this14.__proto__ = ExchangeNotAvailable.prototype;
        _this14.message = message;
        return _this14;
    }

    return ExchangeNotAvailable;
}(NetworkError);

module.exports = {

    BaseError: BaseError,
    ExchangeError: ExchangeError,
    NotSupported: NotSupported,
    AuthenticationError: AuthenticationError,
    InvalidNonce: InvalidNonce,
    InsufficientFunds: InsufficientFunds,
    InvalidOrder: InvalidOrder,
    OrderNotFound: OrderNotFound,
    OrderNotCached: OrderNotCached,
    CancelPending: CancelPending,
    NetworkError: NetworkError,
    DDoSProtection: DDoSProtection,
    RequestTimeout: RequestTimeout,
    ExchangeNotAvailable: ExchangeNotAvailable
};