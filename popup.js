/*jshint esversion: 6 */
console.log("pop");
function saveCurrency(val) {
  console.log("save atempt");
  var data = {};
  data.currency = val;
  chrome.storage.sync.set(data);
}

function changeCurrency() {
  console.log("pop1s");
  chrome.tabs.executeScript(null, {file: "content.js"});
}

document.addEventListener('DOMContentLoaded', () => {

  changeCurrency();

  var dropdown = document.getElementById('dropdown');

  chrome.storage.sync.get('currency', (data) => {
    if (typeof data.currency === 'undefined') {
      saveCurrency(dropdown.value);
      console.log('24');
    } else if (dropdown.value != data.currency) {
      dropdown.value = data.currency;
      console.log('27');
    }
    console.log(currency);
    changeCurrency(data.currency);
  });

  dropdown.addEventListener('change', () => {
    changeCurrency(dropdown.value);
    saveCurrency(dropdown.value);
  });
});
