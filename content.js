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

// Key of currency symbols
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

// Global variables
var namesIndex = [];
var index;
var currency = 'USD';

// Links formatting constants
var prefix0 = `<br><button class="btn btn-success" onclick=" window.open('https://www.cryptocompare.com/coins/`;
var suffix0 = `/overview/`;
var suffix1 = `','_blank')">`;
var spacing = ` (`;
var suffix2 = `)</button>`;

// Test if prices have already been added
if (amounts[1].innerHTML.includes('<button class="btn btn-success"')) {
  for (var i = 1; i < amounts.length; i++) {
    namesIndex.push(names[i].innerHTML);
    if (parseFloat(btcs[indexFinder(names[i].innerHTML) + 1].innerHTML) > 0) {

    // Removal of previous prices and formatting
    amounts[i].innerHTML = amounts[i].innerHTML.substring(0, amounts[i].innerHTML.indexOf('-'));
    amounts[i].innerHTML = amounts[i].innerHTML.replace('<br>', '');
    }
  }
}

chrome.storage.sync.get('currency', (data) => {

  // Synchronous spawner of asynchronous requests based off found wallets
  for (var i = 1, l = amounts.length; i < l; i++) {
    var coinValue = '';
    currency = data.currency;
    namesIndex.push(names[i].innerHTML);
    var request = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=' + data.currency;
    if (parseFloat(btcs[indexFinder(names[i].innerHTML) + 1].innerHTML) > 0) {
      requestion(request, names[i].innerHTML);
    }
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
  index = indexFinder(coinName);
  if (parseFloat(btcs[index + 1].innerHTML) > 0) {
    var output = parseFloat(coinValue) * parseFloat(btcs[index + 1].innerHTML);
    var outputEach = output.toFixed(2) / 1;
    output = getCurrency(currency) + output.toFixed(2);
    outputEach = getCurrency(currency) + outputEach.toFixed(2);

    // Dropdown for links to different resources when hovering over value
    // Final posting of data
    amounts[index + 1].innerHTML += prefix0 + coinName.replace(/<(?:.|\n)*?>/gm, '').toLowerCase() + suffix0 + currency + suffix1 + output + spacing + outputEach + suffix2;
  }
}

//Indexing agent for matching asynchronous replies to page
function indexFinder(coinName) {
  function finding(element) {
    return element === coinName;
  }
  return namesIndex.findIndex(finding);
}
