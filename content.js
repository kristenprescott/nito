/* -----Send URL-----*/
chrome.runtime.onMessage.addListener((request, sender, sendRequest) => {
  let url = window.location.toString();
  sendResponse({ url });
});
