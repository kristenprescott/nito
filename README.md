# Cookie-Free

A chrome extension made with javascript. It takes advantage of cookies to get unlimited access to Medium's paid blogs. The Content script listens for a message from the background script, get's the url of the current tab and sends it back to the background script using message passing. The Background script opens an incognito window using the given url and removes any cookie matching the gived arguments after every three seconds.

---

**Manifest version** specifies the version of the manifest file format your package requires. Name is a desired name to identify the extension. Version as the name suggests identifies the extension’s version.

The **background** field is used to include a background script. Background scripts are loaded as soon as the extension is loaded and they persist until the extension is disabled or uninstalled .We can prevent that by setting “persistent” to false.

**Permissions** field to determine the extension’s ability to access websites and chrome APIs. “Tabs” enable the extension to interact with the browser tab system. “Cookies” enables the extension to use the Cookie API to query and modify cookies in the browser. “Medium.com/\*” is a host permission that identifies a group of URLs for which the extension is requesting extra privileges.

**Browser action** field is used to put icons in the main Google Chrome toolbar , to the right of the address bar.

**Content scripts** field contain files that run in the context of web pages. They are able to read details of the web pages the browser visits, make changes to them and pass information to their parent extension.

Since content scripts run in the context of a web page and not the extension, they often need some way of communicating with the rest of the extension. Communication between an extension and it’s content script is made possible by Message Passing. Either side can listen for messages sent from the other end, and respond on the same channel.

---

## Content File

`content.js`:

```js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  var url = window.location.toString();
  sendResponse({ url: url });
});
```

The above code listens for a message from the background `script.On` receiving the message it will get the URL of the current tab and send it to the background script.

---

## Background Script

Background script is used to monitor events for the extension. Events are browser triggers, such as navigating to a new page,clicking an icon,removing a bookmark, or closing a tab. In layman terms, whenever the chrome browser is opened, the background scripts listens for events and responds to these events. Our extension will be listening to the click event on the extension’s icon.

`background.js file`:

```js
Chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.sendMessage(tab.id, {message:"Send me the url "),      function(response){
  var storedUrl = response.url;
  chrome.windows.create({url: storedUrl, incognito: true});
  chrome.windows.getAll({populate: true}, function(window_list){
      for (let window of window_list){
        if(window.incognito){
          chrome.cookies.getAllCookieStores(
            function(cs){
              incognitocs = cs[1].id;
                setTimeout(() => chrome.cookies.remove(
                  {storeId :incognitoCs,
                   name : 'uid',
                   url : storedUrl},function(IncognitoCookies){
                                      console.log("Cookie removed")
                                     })}, 3000);)})}}
})
  }})
```

The above code listens for a click event on the extension’s icon. It then sends a message to the content script to trigger the listener which will in turn get the URL and send it back to the background script.

With the received URL the code will open an incognito window.

Next step is to get all the opened windows. Populate being set to true means that each window opened has a list of all its opened tabs.

It then loops through the list of the opened windows checking for an incognito window and then retrieves all the Cookie Stores as an array.

From the array it gets Incognito Window cookie ID.

With the cookie ID the code removed cookies from the Incognito Window alone. If it deleted cookies from both the incognito and normal window you’d be logged out every time you clicked in the extension’s icon.

Incognito Window stores session cookies only that they are cleared when you close the window. Due to this fact, the extension deletes cookies after every 3 seconds when an Incognito Window is open.

[github repo](https://github.com/Hassanzaid-bit/Unlimited-Access)

---

## How to Use

The directory holding the manifest file can be added as an extension in developer mode in its current state.

1. Open the Extension Management page by navigating to `chrome://extensions`.

- The Extension Management page can also be opened by clicking on the Chrome menu, hovering over More Tools then selecting Extensions.

2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the LOAD UNPACKED button and select the extension directory.

Ta-da! The extension has been successfully installed. Because no icons were included in the manifest, a generic toolbar icon will be created for the extension.

[Docs](https://developer.chrome.com/docs/extensions/mv2/getstarted/)
