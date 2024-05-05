import {TabHandler} from "./TabHandler.js"
import { Message } from '../shared/models/Message.js'
import { CanvasRequest } from "../shared/models/CanvasRequest.js";

// Sets the panel to open when clicking the extension's icon in Chrome
chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true})

const tabHandler = new TabHandler();
tabHandler.init();
console.log(tabHandler.getTabId());

chrome.runtime.onMessage.addListener(
    async (message, sender, response) => {
        if(message.target === Message.Target.SERVICE_WORKER && message.type === Message.Type.REQUEST.NEW) {
            console.log(message.text, message.type)

            let tabId = tabHandler.getTabId()

            if(tabId != null)
            {
                // Test requests
                const requests = [
                new CanvasRequest(CanvasRequest.Get.UsersSelf),
                new CanvasRequest(CanvasRequest.Get.CoursesUser)
            ]

            const message = new Message(Message.Target.TAB, Message.Type.REQUEST.NEW, "", requests)

                await chrome.tabs.sendMessage(
                    tabId,
                    message
                )
            }
        }

        console.log(message);
    }
)
