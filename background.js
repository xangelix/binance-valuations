// Tells chrome to execute content.js when the extension button is pressed
chrome.browserAction.onClicked.addListener(function(tab) {
   chrome.tabs.executeScript(null, {file: "content.js"});
});
