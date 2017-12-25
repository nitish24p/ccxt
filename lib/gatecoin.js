"use strict";

//  ---------------------------------------------------------------------------

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Exchange = require('./base/Exchange');

var _require = require('./base/errors'),
    ExchangeError = _require.ExchangeError,
    AuthenticationError = _require.AuthenticationError;

//  ---------------------------------------------------------------------------

module.exports = function (_Exchange) {
    _inherits(gatecoin, _Exchange);

    function gatecoin() {
        _classCallCheck(this, gatecoin);

        return _possibleConstructorReturn(this, (gatecoin.__proto__ || Object.getPrototypeOf(gatecoin)).apply(this, arguments));
    }

    _createClass(gatecoin, [{
        key: 'describe',
        value: function describe() {
            return this.deepExtend(_get(gatecoin.prototype.__proto__ || Object.getPrototypeOf(gatecoin.prototype), 'describe', this).call(this), {
                'id': 'gatecoin',
                'name': 'Gatecoin',
                'rateLimit': 2000,
                'countries': 'HK', // Hong Kong
                'comment': 'a regulated/licensed exchange',
                'hasCORS': false,
                'hasFetchTickers': true,
                'hasFetchOHLCV': true,
                'timeframes': {
                    '1m': '1m',
                    '15m': '15m',
                    '1h': '1h',
                    '6h': '6h',
                    '1d': '24h'
                },
                'urls': {
                    'logo': 'https://user-images.githubusercontent.com/1294454/28646817-508457f2-726c-11e7-9eeb-3528d2413a58.jpg',
                    'api': 'https://api.gatecoin.com',
                    'www': 'https://gatecoin.com',
                    'doc': ['https://gatecoin.com/api', 'https://github.com/Gatecoin/RESTful-API-Implementation', 'https://api.gatecoin.com/swagger-ui/index.html']
                },
                'api': {
                    'public': {
                        'get': ['Public/ExchangeRate', // Get the exchange rates
                        'Public/LiveTicker', // Get live ticker for all currency
                        'Public/LiveTicker/{CurrencyPair}', // Get live ticker by currency
                        'Public/LiveTickers', // Get live ticker for all currency
                        'Public/MarketDepth/{CurrencyPair}', // Gets prices and market depth for the currency pair.
                        'Public/NetworkStatistics/{DigiCurrency}', // Get the network status of a specific digital currency
                        'Public/StatisticHistory/{DigiCurrency}/{Typeofdata}', // Get the historical data of a specific digital currency
                        'Public/TickerHistory/{CurrencyPair}/{Timeframe}', // Get ticker history
                        'Public/Transactions/{CurrencyPair}', // Gets recent transactions
                        'Public/TransactionsHistory/{CurrencyPair}', // Gets all transactions
                        'Reference/BusinessNatureList', // Get the business nature list.
                        'Reference/Countries', // Get the country list.
                        'Reference/Currencies', // Get the currency list.
                        'Reference/CurrencyPairs', // Get the currency pair list.
                        'Reference/CurrentStatusList', // Get the current status list.
                        'Reference/IdentydocumentTypes', // Get the different types of identity documents possible.
                        'Reference/IncomeRangeList', // Get the income range list.
                        'Reference/IncomeSourceList', // Get the income source list.
                        'Reference/VerificationLevelList', // Get the verif level list.
                        'Stream/PublicChannel'],
                        'post': ['Export/Transactions', // Request a export of all trades from based on currencypair, start date and end date
                        'Ping', // Post a string, then get it back.
                        'Public/Unsubscribe/{EmailCode}', // Lets the user unsubscribe from emails
                        'RegisterUser']
                    },
                    'private': {
                        'get': ['Account/CorporateData', // Get corporate account data
                        'Account/DocumentAddress', // Check if residence proof uploaded
                        'Account/DocumentCorporation', // Check if registered document uploaded
                        'Account/DocumentID', // Check if ID document copy uploaded
                        'Account/DocumentInformation', // Get Step3 Data
                        'Account/Email', // Get user email
                        'Account/FeeRate', // Get fee rate of logged in user
                        'Account/Level', // Get verif level of logged in user
                        'Account/PersonalInformation', // Get Step1 Data
                        'Account/Phone', // Get user phone number
                        'Account/Profile', // Get trader profile
                        'Account/Questionnaire', // Fill the questionnaire
                        'Account/Referral', // Get referral information
                        'Account/ReferralCode', // Get the referral code of the logged in user
                        'Account/ReferralNames', // Get names of referred traders
                        'Account/ReferralReward', // Get referral reward information
                        'Account/ReferredCode', // Get referral code
                        'Account/ResidentInformation', // Get Step2 Data
                        'Account/SecuritySettings', // Get verif details of logged in user
                        'Account/User', // Get all user info
                        'APIKey/APIKey', // Get API Key for logged in user
                        'Auth/ConnectionHistory', // Gets connection history of logged in user
                        'Balance/Balances', // Gets the available balance for each currency for the logged in account.
                        'Balance/Balances/{Currency}', // Gets the available balance for s currency for the logged in account.
                        'Balance/Deposits', // Get all account deposits, including wire and digital currency, of the logged in user
                        'Balance/Withdrawals', // Get all account withdrawals, including wire and digital currency, of the logged in user
                        'Bank/Accounts/{Currency}/{Location}', // Get internal bank account for deposit
                        'Bank/Transactions', // Get all account transactions of the logged in user
                        'Bank/UserAccounts', // Gets all the bank accounts related to the logged in user.
                        'Bank/UserAccounts/{Currency}', // Gets all the bank accounts related to the logged in user.
                        'ElectronicWallet/DepositWallets', // Gets all crypto currency addresses related deposits to the logged in user.
                        'ElectronicWallet/DepositWallets/{DigiCurrency}', // Gets all crypto currency addresses related deposits to the logged in user by currency.
                        'ElectronicWallet/Transactions', // Get all digital currency transactions of the logged in user
                        'ElectronicWallet/Transactions/{DigiCurrency}', // Get all digital currency transactions of the logged in user
                        'ElectronicWallet/UserWallets', // Gets all external digital currency addresses related to the logged in user.
                        'ElectronicWallet/UserWallets/{DigiCurrency}', // Gets all external digital currency addresses related to the logged in user by currency.
                        'Info/ReferenceCurrency', // Get user's reference currency
                        'Info/ReferenceLanguage', // Get user's reference language
                        'Notification/Messages', // Get from oldest unread + 3 read message to newest messages
                        'Trade/Orders', // Gets open orders for the logged in trader.
                        'Trade/Orders/{OrderID}', // Gets an order for the logged in trader.
                        'Trade/StopOrders', // Gets all stop orders for the logged in trader. Max 1000 record.
                        'Trade/StopOrdersHistory', // Gets all stop orders for the logged in trader. Max 1000 record.
                        'Trade/Trades', // Gets all transactions of logged in user
                        'Trade/UserTrades'],
                        'post': ['Account/DocumentAddress', // Upload address proof document
                        'Account/DocumentCorporation', // Upload registered document document
                        'Account/DocumentID', // Upload ID document copy
                        'Account/Email/RequestVerify', // Request for verification email
                        'Account/Email/Verify', // Verification email
                        'Account/GoogleAuth', // Enable google auth
                        'Account/Level', // Request verif level of logged in user
                        'Account/Questionnaire', // Fill the questionnaire
                        'Account/Referral', // Post a referral email
                        'APIKey/APIKey', // Create a new API key for logged in user
                        'Auth/ChangePassword', // Change password.
                        'Auth/ForgotPassword', // Request reset password
                        'Auth/ForgotUserID', // Request user id
                        'Auth/Login', // Trader session log in.
                        'Auth/Logout', // Logout from the current session.
                        'Auth/LogoutOtherSessions', // Logout other sessions.
                        'Auth/ResetPassword', // Reset password
                        'Bank/Transactions', // Request a transfer from the traders account of the logged in user. This is only available for bank account
                        'Bank/UserAccounts', // Add an account the logged in user
                        'ElectronicWallet/DepositWallets/{DigiCurrency}', // Add an digital currency addresses to the logged in user.
                        'ElectronicWallet/Transactions/Deposits/{DigiCurrency}', // Get all internal digital currency transactions of the logged in user
                        'ElectronicWallet/Transactions/Withdrawals/{DigiCurrency}', // Get all external digital currency transactions of the logged in user
                        'ElectronicWallet/UserWallets/{DigiCurrency}', // Add an external digital currency addresses to the logged in user.
                        'ElectronicWallet/Withdrawals/{DigiCurrency}', // Request a transfer from the traders account to an external address. This is only available for crypto currencies.
                        'Notification/Messages', // Mark all as read
                        'Notification/Messages/{ID}', // Mark as read
                        'Trade/Orders', // Place an order at the exchange.
                        'Trade/StopOrders'],
                        'put': ['Account/CorporateData', // Update user company data for corporate account
                        'Account/DocumentID', // Update ID document meta data
                        'Account/DocumentInformation', // Update Step3 Data
                        'Account/Email', // Update user email
                        'Account/PersonalInformation', // Update Step1 Data
                        'Account/Phone', // Update user phone number
                        'Account/Questionnaire', // update the questionnaire
                        'Account/ReferredCode', // Update referral code
                        'Account/ResidentInformation', // Update Step2 Data
                        'Account/SecuritySettings', // Update verif details of logged in user
                        'Account/User', // Update all user info
                        'Bank/UserAccounts', // Update the label of existing user bank accounnt
                        'ElectronicWallet/DepositWallets/{DigiCurrency}/{AddressName}', // Update the name of an address
                        'ElectronicWallet/UserWallets/{DigiCurrency}', // Update the name of an external address
                        'Info/ReferenceCurrency', // User's reference currency
                        'Info/ReferenceLanguage'],
                        'delete': ['APIKey/APIKey/{PublicKey}', // Remove an API key
                        'Bank/Transactions/{RequestID}', // Delete pending account withdraw of the logged in user
                        'Bank/UserAccounts/{Currency}/{Label}', // Delete an account of the logged in user
                        'ElectronicWallet/DepositWallets/{DigiCurrency}/{AddressName}', // Delete an digital currency addresses related to the logged in user.
                        'ElectronicWallet/UserWallets/{DigiCurrency}/{AddressName}', // Delete an external digital currency addresses related to the logged in user.
                        'Trade/Orders', // Cancels all existing order
                        'Trade/Orders/{OrderID}', // Cancels an existing order
                        'Trade/StopOrders', // Cancels all existing stop orders
                        'Trade/StopOrders/{ID}']
                    }
                },
                'fees': {
                    'trading': {
                        'maker': 0.0025,
                        'taker': 0.0035
                    }
                }
            });
        }
    }, {
        key: 'fetchMarkets',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var response, markets, result, p, market, id, base, quote, symbol;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.publicGetPublicLiveTickers();

                            case 2:
                                response = _context.sent;
                                markets = response['tickers'];
                                result = [];

                                for (p = 0; p < markets.length; p++) {
                                    market = markets[p];
                                    id = market['currencyPair'];
                                    base = id.slice(0, 3);
                                    quote = id.slice(3, 6);
                                    symbol = base + '/' + quote;

                                    result.push({
                                        'id': id,
                                        'symbol': symbol,
                                        'base': base,
                                        'quote': quote,
                                        'info': market
                                    });
                                }
                                return _context.abrupt('return', result);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function fetchMarkets() {
                return _ref.apply(this, arguments);
            }

            return fetchMarkets;
        }()
    }, {
        key: 'fetchBalance',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var response, balances, result, b, balance, currency, account;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context2.next = 4;
                                return this.privateGetBalanceBalances();

                            case 4:
                                response = _context2.sent;
                                balances = response['balances'];
                                result = { 'info': balances };

                                for (b = 0; b < balances.length; b++) {
                                    balance = balances[b];
                                    currency = balance['currency'];
                                    account = {
                                        'free': balance['availableBalance'],
                                        'used': this.sum(balance['pendingIncoming'], balance['pendingOutgoing'], balance['openOrder']),
                                        'total': balance['balance']
                                    };

                                    result[currency] = account;
                                }
                                return _context2.abrupt('return', this.parseBalance(result));

                            case 9:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function fetchBalance() {
                return _ref2.apply(this, arguments);
            }

            return fetchBalance;
        }()
    }, {
        key: 'fetchOrderBook',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, orderbook;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context3.next = 5;
                                return this.publicGetPublicMarketDepthCurrencyPair(this.extend({
                                    'CurrencyPair': market['id']
                                }, params));

                            case 5:
                                orderbook = _context3.sent;
                                return _context3.abrupt('return', this.parseOrderBook(orderbook, undefined, 'bids', 'asks', 'price', 'volume'));

                            case 7:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function fetchOrderBook(_x3) {
                return _ref3.apply(this, arguments);
            }

            return fetchOrderBook;
        }()
    }, {
        key: 'parseTicker',
        value: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = parseInt(ticker['createDateTime']) * 1000;
            var symbol = undefined;
            if (market) symbol = market['symbol'];
            var baseVolume = parseFloat(ticker['volume']);
            var vwap = parseFloat(ticker['vwap']);
            var quoteVolume = baseVolume * vwap;
            return {
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': vwap,
                'open': parseFloat(ticker['open']),
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': baseVolume,
                'quoteVolume': quoteVolume,
                'info': ticker
            };
        }
    }, {
        key: 'fetchTickers',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var symbols = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var response, tickers, result, t, ticker, id, market, symbol;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context4.next = 4;
                                return this.publicGetPublicLiveTickers(params);

                            case 4:
                                response = _context4.sent;
                                tickers = response['tickers'];
                                result = {};

                                for (t = 0; t < tickers.length; t++) {
                                    ticker = tickers[t];
                                    id = ticker['currencyPair'];
                                    market = this.markets_by_id[id];
                                    symbol = market['symbol'];

                                    result[symbol] = this.parseTicker(ticker, market);
                                }
                                return _context4.abrupt('return', result);

                            case 9:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function fetchTickers() {
                return _ref4.apply(this, arguments);
            }

            return fetchTickers;
        }()
    }, {
        key: 'fetchTicker',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(symbol) {
                var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var market, response, ticker;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context5.next = 5;
                                return this.publicGetPublicLiveTickerCurrencyPair(this.extend({
                                    'CurrencyPair': market['id']
                                }, params));

                            case 5:
                                response = _context5.sent;
                                ticker = response['ticker'];
                                return _context5.abrupt('return', this.parseTicker(ticker, market));

                            case 8:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function fetchTicker(_x8) {
                return _ref5.apply(this, arguments);
            }

            return fetchTicker;
        }()
    }, {
        key: 'parseTrade',
        value: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var side = undefined;
            var order = undefined;
            if ('way' in trade) {
                side = trade['way'] == 'bid' ? 'buy' : 'sell';
                var orderId = trade['way'] + 'OrderId';
                order = trade[orderId];
            }
            var timestamp = parseInt(trade['transactionTime']) * 1000;
            if (!market) market = this.markets_by_id[trade['currencyPair']];
            return {
                'info': trade,
                'id': trade['transactionId'].toString(),
                'order': order,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': side,
                'price': trade['price'],
                'amount': trade['quantity']
            };
        }
    }, {
        key: 'fetchTrades',
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(symbol) {
                var since = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var market, response;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                _context6.next = 5;
                                return this.publicGetPublicTransactionsCurrencyPair(this.extend({
                                    'CurrencyPair': market['id']
                                }, params));

                            case 5:
                                response = _context6.sent;
                                return _context6.abrupt('return', this.parseTrades(response['transactions'], market, since, limit));

                            case 7:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function fetchTrades(_x13) {
                return _ref6.apply(this, arguments);
            }

            return fetchTrades;
        }()
    }, {
        key: 'parseOHLCV',
        value: function parseOHLCV(ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1m';
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return [parseInt(ohlcv['createDateTime']) * 1000, ohlcv['open'], ohlcv['high'], ohlcv['low'], undefined, ohlcv['volume']];
        }
    }, {
        key: 'fetchOHLCV',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(symbol) {
                var timeframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1m';
                var since = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
                var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
                var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
                var market, request, response;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.loadMarkets();

                            case 2:
                                market = this.market(symbol);
                                request = {
                                    'CurrencyPair': market['id'],
                                    'Timeframe': this.timeframes[timeframe]
                                };

                                if (limit) request['Count'] = limit;
                                request = this.extend(request, params);
                                _context7.next = 8;
                                return this.publicGetPublicTickerHistoryCurrencyPairTimeframe(request);

                            case 8:
                                response = _context7.sent;
                                return _context7.abrupt('return', this.parseOHLCVs(response['tickers'], market, timeframe, since, limit));

                            case 10:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function fetchOHLCV(_x22) {
                return _ref7.apply(this, arguments);
            }

            return fetchOHLCV;
        }()
    }, {
        key: 'createOrder',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(symbol, type, side, amount) {
                var price = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
                var order, response;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.loadMarkets();

                            case 2:
                                order = {
                                    'Code': this.marketId(symbol),
                                    'Way': side == 'buy' ? 'Bid' : 'Ask',
                                    'Amount': amount
                                };

                                if (type == 'limit') order['Price'] = price;

                                if (!this.twofa) {
                                    _context8.next = 10;
                                    break;
                                }

                                if (!('ValidationCode' in params)) {
                                    _context8.next = 9;
                                    break;
                                }

                                order['ValidationCode'] = params['ValidationCode'];
                                _context8.next = 10;
                                break;

                            case 9:
                                throw new AuthenticationError(this.id + ' two-factor authentication requires a missing ValidationCode parameter');

                            case 10:
                                _context8.next = 12;
                                return this.privatePostTradeOrders(this.extend(order, params));

                            case 12:
                                response = _context8.sent;
                                return _context8.abrupt('return', {
                                    'info': response,
                                    'id': response['clOrderId']
                                });

                            case 14:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function createOrder(_x25, _x26, _x27, _x28) {
                return _ref8.apply(this, arguments);
            }

            return createOrder;
        }()
    }, {
        key: 'cancelOrder',
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(id) {
                var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
                var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.loadMarkets();

                            case 2:
                                _context9.next = 4;
                                return this.privateDeleteTradeOrdersOrderID({ 'OrderID': id });

                            case 4:
                                return _context9.abrupt('return', _context9.sent);

                            case 5:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function cancelOrder(_x31) {
                return _ref9.apply(this, arguments);
            }

            return cancelOrder;
        }()
    }, {
        key: 'sign',
        value: function sign(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                this.checkRequiredCredentials();
                var nonce = this.nonce();
                var contentType = method == 'GET' ? '' : 'application/json';
                var auth = method + url + contentType + nonce.toString();
                auth = auth.toLowerCase();
                var signature = this.hmac(this.encode(auth), this.encode(this.secret), 'sha256', 'base64');
                headers = {
                    'API_PUBLIC_KEY': this.apiKey,
                    'API_REQUEST_SIGNATURE': signature,
                    'API_REQUEST_DATE': nonce
                };
                if (method != 'GET') {
                    headers['Content-Type'] = contentType;
                    body = this.json(this.extend({ 'nonce': nonce }, params));
                }
            }
            return { 'url': url, 'method': method, 'body': body, 'headers': headers };
        }
    }, {
        key: 'request',
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(path) {
                var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
                var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
                var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
                var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
                var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
                var response;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return this.fetch2(path, api, method, params, headers, body);

                            case 2:
                                response = _context10.sent;

                                if (!('responseStatus' in response)) {
                                    _context10.next = 7;
                                    break;
                                }

                                if (!('message' in response['responseStatus'])) {
                                    _context10.next = 7;
                                    break;
                                }

                                if (!(response['responseStatus']['message'] == 'OK')) {
                                    _context10.next = 7;
                                    break;
                                }

                                return _context10.abrupt('return', response);

                            case 7:
                                throw new ExchangeError(this.id + ' ' + this.json(response));

                            case 8:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function request(_x42) {
                return _ref10.apply(this, arguments);
            }

            return request;
        }()
    }]);

    return gatecoin;
}(Exchange);