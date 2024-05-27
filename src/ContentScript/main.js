import {Message} from "../shared/models/Message.js";
import {RequestHandler} from "./RequestHandler.js";

const requestHandler = new RequestHandler();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
  {
    const isTarget = (message.target === Message.Target.TAB && message.type === Message.Type.Canvas.REQUESTS);

    (async () =>
    {
      console.log(message);
      // Only accept messages for the conent script
      if(message.target !== Message.Target.TAB)
      {
        return;
      }

      // If message is a request, make requests in batches and send respones back in a message
      if(isTarget)
      {
        requestHandler.enqueueList(message.data);

        const responses = await requestHandler.run(); // Array of responses returned

        sendResponse(
          new Message(Message.Target.SERVICE_WORKER, Message.Type.Canvas.RESPONSES, "Response", responses)
        );
      }
    })();

    if(isTarget) return true;
  }
)
