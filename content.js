/* -----Send URL-----*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let url = window.location.toString();
  sendResponse({ url });
});
