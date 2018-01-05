/*jshint esversion: 6 */
function saveCurrency(val) {
  var data = {};
  data.currency = val;
  chrome.storage.sync.set(data);
}

function changeCurrency() {
  chrome.tabs.executeScript(null, {file: "content.js"}, () => {
    //chrome.tabs.executeScript(null, {file: "tv.js"});
  });
}

chrome.tabs.executeScript(null, {file: "jquery-3.2.1.min.js"});

document.addEventListener('DOMContentLoaded', () => {

  var dropdown = document.getElementById('dropdown');

  chrome.storage.sync.get('currency', (data) => {
    if (typeof data.currency === 'undefined') {
      saveCurrency(dropdown.value);
    } else if (dropdown.value != data.currency) {
      dropdown.value = data.currency;
    }
    changeCurrency(data.currency);


    dropdown.addEventListener('change', () => {
      changeCurrency(dropdown.value);
      saveCurrency(dropdown.value);
    });
  });
});
