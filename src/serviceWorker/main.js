import {TabHandler} from "./TabHandler.js"
import { Message } from '../models/Message.js'

const tabHandler = new TabHandler();
tabHandler.init();
console.log(tabHandler.getTabId());

chrome.runtime.onMessage.addListener(
    async (message, sender, response) => {
        if(message.type === Message.Type.REQUEST.NEW) {
            console.log(message.text, message.type)

            let tabId = tabHandler.getTabId()

            if(tabId != null)
            {
                await chrome.tabs.sendMessage(
                    tabId,
                    new Message(Message.Target.TAB, Message.Type.REQUEST.NEW, "Hello world!")
                )
            }
        }
    }
)
