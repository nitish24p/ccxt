"use strict";

//  ---------------------------------------------------------------------------

import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
const okcoinusd = require('./okcoinusd.js');

//  ---------------------------------------------------------------------------

module.exports = class allcoin extends okcoinusd {

    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'allcoin',
            'name': 'Allcoin',
            'countries': 'CA',
            'hasCORS': false,
            'extension': '',
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/31561809-c316b37c-b061-11e7-8d5a-b547b4d730eb.jpg',
                'api': {
                    'web': 'https://allcoin.com',
                    'public': 'https://api.allcoin.com/api',
                    'private': 'https://api.allcoin.com/api'
                },
                'www': 'https://allcoin.com',
                'doc': 'https://allcoin.com/About/APIReference'
            },
            'api': {
                'web': {
                    'get': ['marketoverviews/']
                },
                'public': {
                    'get': ['depth', 'kline', 'ticker', 'trades']
                },
                'private': {
                    'post': ['batch_trade', 'cancel_order', 'order_history', 'order_info', 'orders_info', 'repayment', 'trade', 'trade_history', 'userinfo']
                }
            },
            'markets': undefined
        });
    }

    fetchMarkets() {
        var _this = this;

        return _asyncToGenerator(function* () {
            // todo rewrite for https://www.allcoin.com/Home/MarketOverViewDetail/
            let currencies = ['BTC', 'ETH', 'USD', 'QTUM', 'CNET', 'CK.USD'];
            let result = [];
            for (let i = 0; i < currencies.length; i++) {
                let currency = currencies[i];
                let response = yield _this.webGetMarketoverviews({
                    'type': 'full',
                    'secondary': currency
                });
                let markets = response['Markets'];
                for (let k = 0; k < markets.length; k++) {
                    let market = markets[k];
                    let base = market['Primary'];
                    let quote = market['Secondary'];
                    let id = base.toLowerCase() + '_' + quote.toLowerCase();
                    let symbol = base + '/' + quote;
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'type': 'spot',
                        'spot': true,
                        'future': false,
                        'info': market
                    });
                }
            }
            return result;
        })();
    }

    parseOrderStatus(status) {
        if (status == -1) return 'canceled';
        if (status == 0) return 'open';
        if (status == 1) return 'open'; // partially filled
        if (status == 2) return 'closed';
        if (status == 10) return 'canceled';
        return status;
    }

    getCreateDateField() {
        // allcoin typo create_data instead of create_date
        return 'create_data';
    }

    getOrdersField() {
        // allcoin typo order instead of orders (expected based on their API docs)
        return 'order';
    }
};