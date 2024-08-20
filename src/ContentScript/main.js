import {Message} from "../shared/models/Message.js";
import {RequestHandler} from "./RequestHandler.js";
import Logger from "../shared/utils/Logger.js";

const requestHandler = new RequestHandler();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
  {
    const isTarget = (message.target === Message.Target.TAB && message.type === Message.Type.Canvas.REQUESTS);

    (async () =>
    {
      Logger.debug(__dirname, JSON.stringify(message))

      // Only accept messages for the conent script
      if(message.target !== Message.Target.TAB)
      {
        return;
      }

      // If message is a request, make requests in batches and send respones back in a message
      if(isTarget)
      {
        if(!message.signature) throw new Error("Invalid message. No signature found.");
        requestHandler.enqueueList(message.data);

        const responses = await requestHandler.run(); // Array of responses returned

        const responseMessage = new Message( Message.Target.SERVICE_WORKER,
            Message.Sender.TAB,
            Message.Type.Canvas.RESPONSES,
            "Response",
            responses )
        responseMessage.signature = message.signature;
        sendResponse(responseMessage);
      }
    })();

    if(isTarget) return true;
  }
)
