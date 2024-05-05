import { Message } from "../shared/models/Message.js";
import { CanvasRequest } from "../shared/models/CanvasRequest.js";
import { RequestHandler } from "./RequestHandler.js";

const requestHandler = new (RequestHandler);

chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) =>
    {
        // Only accept messages for the conent script
        if(message.target !== Message.Target.TAB)
        {
            return;
        }

        // If message is a request, make requests in batches and send respones back in a message
        if(message.type === Message.Type.REQUEST.NEW)
        {
            requestHandler.enqueueList(message.data);

            const responses = await requestHandler.run(); // Array of responses returned

            chrome.runtime.sendMessage(
                new Message(Message.Target.SERVICE_WORKER, Message.Type.REQUEST.OK, "Response", responses)
            )
        }
    }
)