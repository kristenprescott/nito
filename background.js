chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(
    tab.id,
    { message: "Hey send me the url" },
    ((response) => {
      let storedUrl = response.url;
      chrome.windows.create({ url: storedUrl, incognito: true });
      chrome.windows.getAll({ populate: true }, ((window_list) => {
        // console.log(window_list);
        for (let w of window_list) {
          if (w.incognito) {
            chrome.cookies.getAllCookieStores((cs) => {
              console.log(cs);
              incognitoCs = cs[1].id;
              setTimeout(() => {
                chrome.cookies.remove(
                  { storeId: incognitoCs, name: "uid", url: storedUrl },
                  ((IncognitoCookies) => {
                    console.log("Cookie removed");
                  })
                )
              }, 3000)
            })
          }
        }
      }))
    })
  )
})