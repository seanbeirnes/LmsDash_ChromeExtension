import {TabHandler} from "./TabHandler.js"

const tabHandler = new TabHandler();
tabHandler.init();
console.log(tabHandler.getTabId());

const port = chrome.runtime.connect();

chrome.tabs.onActivated.addListener( () =>
{
    let tabId = tabHandler.getTabId()

    if(tabId != null)
    {
        console.log(tabId);
        chrome.tabs.sendMessage(
            tabId,
            "hello"
        )
        chrome.runtime.sendMessage(
            message = "hello"
        )
    }
})
