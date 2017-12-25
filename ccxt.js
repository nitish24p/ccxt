"use strict";

/*

MIT License

Copyright (c) 2017 Igor Kroitor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

"use strict";

//-----------------------------------------------------------------------------

const Exchange  = require ('./lib/base/Exchange');
const functions = require ('./lib/base/functions');
const errors    = require ('./lib/base/errors');

//-----------------------------------------------------------------------------
// this is updated by vss.js when building

const version = '1.0.0'

Exchange.ccxtVersion = version

//-----------------------------------------------------------------------------

const exchanges = {
    '_1broker':                require ('./lib/_1broker.js'),
    '_1btcxe':                 require ('./lib/_1btcxe.js'),
    'acx':                     require ('./lib/acx.js'),
    'allcoin':                 require ('./lib/allcoin.js'),
    'anxpro':                  require ('./lib/anxpro.js'),
    'binance':                 require ('./lib/binance.js'),
    'bit2c':                   require ('./lib/bit2c.js'),
    'bitbay':                  require ('./lib/bitbay.js'),
    'bitcoincoid':             require ('./lib/bitcoincoid.js'),
    'bitfinex':                require ('./lib/bitfinex.js'),
    'bitfinex2':               require ('./lib/bitfinex2.js'),
    'bitflyer':                require ('./lib/bitflyer.js'),
    'bithumb':                 require ('./lib/bithumb.js'),
    'bitlish':                 require ('./lib/bitlish.js'),
    'bitmarket':               require ('./lib/bitmarket.js'),
    'bitmex':                  require ('./lib/bitmex.js'),
    'bitso':                   require ('./lib/bitso.js'),
    'bitstamp':                require ('./lib/bitstamp.js'),
    'bitstamp1':               require ('./lib/bitstamp1.js'),
    'bittrex':                 require ('./lib/bittrex.js'),
    'bl3p':                    require ('./lib/bl3p.js'),
    'bleutrade':               require ('./lib/bleutrade.js'),
    'btcbox':                  require ('./lib/btcbox.js'),
    'btcchina':                require ('./lib/btcchina.js'),
    'btcexchange':             require ('./lib/btcexchange.js'),
    'btcmarkets':              require ('./lib/btcmarkets.js'),
    'btctradeua':              require ('./lib/btctradeua.js'),
    'btcturk':                 require ('./lib/btcturk.js'),
    'btcx':                    require ('./lib/btcx.js'),
    'bter':                    require ('./lib/bter.js'),
    'bxinth':                  require ('./lib/bxinth.js'),
    'ccex':                    require ('./lib/ccex.js'),
    'cex':                     require ('./lib/cex.js'),
    'chbtc':                   require ('./lib/chbtc.js'),
    'chilebit':                require ('./lib/chilebit.js'),
    'coincheck':               require ('./lib/coincheck.js'),
    'coinfloor':               require ('./lib/coinfloor.js'),
    'coingi':                  require ('./lib/coingi.js'),
    'coinmarketcap':           require ('./lib/coinmarketcap.js'),
    'coinmate':                require ('./lib/coinmate.js'),
    'coinsecure':              require ('./lib/coinsecure.js'),
    'coinspot':                require ('./lib/coinspot.js'),
    'cryptopia':               require ('./lib/cryptopia.js'),
    'dsx':                     require ('./lib/dsx.js'),
    'exmo':                    require ('./lib/exmo.js'),
    'flowbtc':                 require ('./lib/flowbtc.js'),
    'foxbit':                  require ('./lib/foxbit.js'),
    'fybse':                   require ('./lib/fybse.js'),
    'fybsg':                   require ('./lib/fybsg.js'),
    'gatecoin':                require ('./lib/gatecoin.js'),
    'gateio':                  require ('./lib/gateio.js'),
    'gdax':                    require ('./lib/gdax.js'),
    'gemini':                  require ('./lib/gemini.js'),
    'getbtc':                  require ('./lib/getbtc.js'),
    'hitbtc':                  require ('./lib/hitbtc.js'),
    'hitbtc2':                 require ('./lib/hitbtc2.js'),
    'huobi':                   require ('./lib/huobi.js'),
    'huobicny':                require ('./lib/huobicny.js'),
    'huobipro':                require ('./lib/huobipro.js'),
    'independentreserve':      require ('./lib/independentreserve.js'),
    'itbit':                   require ('./lib/itbit.js'),
    'jubi':                    require ('./lib/jubi.js'),
    'kraken':                  require ('./lib/kraken.js'),
    'kucoin':                  require ('./lib/kucoin.js'),
    'kuna':                    require ('./lib/kuna.js'),
    'lakebtc':                 require ('./lib/lakebtc.js'),
    'liqui':                   require ('./lib/liqui.js'),
    'livecoin':                require ('./lib/livecoin.js'),
    'luno':                    require ('./lib/luno.js'),
    'mercado':                 require ('./lib/mercado.js'),
    'mixcoins':                require ('./lib/mixcoins.js'),
    'nova':                    require ('./lib/nova.js'),
    'okcoincny':               require ('./lib/okcoincny.js'),
    'okcoinusd':               require ('./lib/okcoinusd.js'),
    'okex':                    require ('./lib/okex.js'),
    'paymium':                 require ('./lib/paymium.js'),
    'poloniex':                require ('./lib/poloniex.js'),
    'qryptos':                 require ('./lib/qryptos.js'),
    'quadrigacx':              require ('./lib/quadrigacx.js'),
    'quoine':                  require ('./lib/quoine.js'),
    'southxchange':            require ('./lib/southxchange.js'),
    'surbitcoin':              require ('./lib/surbitcoin.js'),
    'therock':                 require ('./lib/therock.js'),
    'tidex':                   require ('./lib/tidex.js'),
    'urdubit':                 require ('./lib/urdubit.js'),
    'vaultoro':                require ('./lib/vaultoro.js'),
    'vbtc':                    require ('./lib/vbtc.js'),
    'virwox':                  require ('./lib/virwox.js'),
    'wex':                     require ('./lib/wex.js'),
    'xbtce':                   require ('./lib/xbtce.js'),
    'yobit':                   require ('./lib/yobit.js'),
    'yunbi':                   require ('./lib/yunbi.js'),
    'zaif':                    require ('./lib/zaif.js'),
    'zb':                      require ('./lib/zb.js'),    
}

//-----------------------------------------------------------------------------

module.exports = Object.assign ({ version, Exchange, exchanges: Object.keys (exchanges) }, exchanges, functions, errors)

//-----------------------------------------------------------------------------
