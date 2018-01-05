/*jshint esversion: 6 */

// Saves currency info to chrome.storage.sync
function saveCurrency(val) {
  var data = {};
  data.currency = val;
  chrome.storage.sync.set(data);
}

// Updates Binance page to show currencies by executing content.js
function changeCurrency() {
  chrome.tabs.executeScript(null, {file: "content.js"}, () => {
  });
}

// Listener to run whenever the GUI is opened
document.addEventListener('DOMContentLoaded', () => {

  // Reads default setting of currency from popup.html
  var dropdown = document.getElementById('dropdown');

  // Tests if current setting matches what is stored in chrome.storage.sync
  // If they match, neither are modified
  // If they are different, the dropdown is updated to what is stored in chrome.storage.sync
  chrome.storage.sync.get('currency', (data) => {
    if (typeof data.currency === 'undefined') {
      saveCurrency(dropdown.value);
    } else if (dropdown.value != data.currency) {
      dropdown.value = data.currency;
    }
    changeCurrency(data.currency);

    // Listener to run if dropdown value changes
    // If triggered chrome.storage.sync is updated and content.js is reloaded
    dropdown.addEventListener('change', () => {
      changeCurrency(dropdown.value);
      saveCurrency(dropdown.value);
    });
  });
});
