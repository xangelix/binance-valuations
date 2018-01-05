/*jshint esversion: 6 */
// Asynchronous HTTP Requestor
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        };

        anHttpRequest.open( 'GET', aUrl, true );
        anHttpRequest.send( null );
    };
};

function getCurrency(currency) {
const symbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
  JPY: 'J￥',
  CNY: 'C￥'
};
return symbols[currency];
}

// Collection of website information by class
var names = document.getElementsByClassName('coin ng-binding');
var amounts = document.getElementsByClassName('total f-right ng-binding');
var btcs = document.getElementsByClassName('equalValue f-right ng-binding');
var namesIndex = [];
var index;
var currency = 'USD';
var prefix = `<button class="btn btn-success" onclick=" window.open('https://www.tradingview.com/chart/?symbol=BITFINEX%3A`;
var suffix1 = `','_blank')">`;
var suffix2 = `</button>`;

/*
<!-- TradingView Widget BEGIN -->
<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
new TradingView.widget({
  "width": 980,
  "height": 610,
  "symbol": "",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "Light",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "allow_symbol_change": true,
   "news": [
		"stocktwits"
	  ],
  "hideideas": true
});
</script>
<!-- TradingView Widget END -->
*/
// Test if prices have already been added
if (amounts[1].innerHTML.includes('" class="btn btn-success"')) {
  for (var i = 1; i < amounts.length; i++) {
    // Removal of previous prices
    amounts[i].innerHTML = amounts[i].innerHTML.substring(0, amounts[i].innerHTML.indexOf('-'));
  }
}

chrome.storage.sync.get('currency', (data) => {
  // Synchronous spawner of asynchronous requests based off found wallets
  // To-do: Only request values above 0
  for (var i = 1, l = amounts.length; i < l; i++) {
    var coinValue = '';
    currency = data.currency;
    namesIndex.push(names[i].innerHTML);
    var request = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=' + data.currency;
    requestion(request, names[i].innerHTML);
  }
});
// Asynchronous calling
function requestion(request, name) {
  var client = new HttpClient();
  client.get(request, function(response) {
    parseP(name, response);
  });
}

// Parsing of HTTP request
function parseP(coinName, coinValue) {
  coinValue = coinValue.substr(7);
  coinValue = coinValue.substr(0, coinValue.length - 1);
  //console.log('DEBUG: Coin Name: ' + coinName.replace(/<(?:.|\n)*?>/gm, ''));
  //console.log('DEBUG: Coin Value: ' + parseFloat(coinValue));
  index = indexFinder(coinName);
  if (parseFloat(btcs[index + 1].innerHTML) > 0) {
    //console.log('DEBUG: Coin Amounts: ' + parseFloat(amounts[index].innerHTML));
    var output = parseFloat(coinValue) * parseFloat(btcs[index + 1].innerHTML);

    output = getCurrency(currency) + output.toFixed(2);
    //console.log('TOTAL: ' + output);
    // To-do: Add tradingview graphs to changed elements
    // Final posting of data
    amounts[index + 1].innerHTML += prefix + coinName.replace(/<(?:.|\n)*?>/gm, '') + currency + suffix1 + output + suffix2;
  }
}


//Indexing agent for matching asynchronous replies to page
function indexFinder(coinName) {
  function finding(element) {
    return element === coinName;
  }
  return namesIndex.findIndex(finding);
}
