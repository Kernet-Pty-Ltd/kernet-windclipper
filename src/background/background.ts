
chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id as number, {
      command: 'open'
    })
  }
})

export { }
