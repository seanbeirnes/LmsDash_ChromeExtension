import { CanvasAPIClient } from "./CanvasAPIClient.js";
import {Message} from "../shared/models/Message.js"

const CanvasAPI = new CanvasAPIClient();

chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) =>
    {
        if(message.type === Message.Type.REQUEST.NEW && message.target === Message.Target.TAB)
        {
            let res = await CanvasAPI.Get.CoursesUser();
            console.log(res)
            alert(await JSON.stringify( await res.json()));
        }
    }
)