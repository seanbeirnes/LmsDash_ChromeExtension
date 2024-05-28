import {Message} from "../shared/models/Message.js";
import {CanvasRequest} from "../shared/models/CanvasRequest.js";

export class MessageHandler
{

  constructor(appController)
  {
    this.appController = appController;
  }

  init()
  {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
      { ( async () => {
        if(message.target !== Message.Target.SERVICE_WORKER) return;

        if(message.sender === Message.Sender.SIDE_PANEL)
        {
          this.handleSidePanelMessage(message, sender, sendResponse);
        }

        // if(message.sender === Message.Sender.TAB)
        // {
        //   // Future: Handle messages initiated by contentScript
        //   return;
        // }
      })();
        return true;
      }
    )
  }

  async handleSidePanelMessage(message, sender, sendResponse)
  {
    switch(message.type)
    {
      case Message.Type.Task.Request.App.STATE:
      {
       //TO DO: return App State
      }
        break;

      case Message.Type.Task.Request.App.SET_PANEL_OPENED:
      {
        this.appController.setSidePanelOpen();
        sendResponse(
          new Message(
            Message.Target.SIDE_PANEL,
            Message.Sender.SERVICE_WORKER,
            Message.Type.Task.Response.App.SET_PANEL_OPENED,
            "SidePanel was opened",
            this.appController.state
          )
        )
      }
        break;

      case Message.Type.Task.Request.Info.USER:
      {
        const response = await this.sendCanvasRequests(
          [new CanvasRequest(CanvasRequest.Get.UsersSelf)]
        )

        sendResponse(
          new Message(
            Message.Target.SIDE_PANEL,
            Message.Sender.SERVICE_WORKER,
            Message.Type.Task.Response.Info.USER,
            "User info response",
            response
          )
        )
      }
        break;

      default:
        return;
    }
  }

  sendSidePanelMessage(text, data)
  {
    if(this.appController.state.hasOpenSidePanel === false) return;

    chrome.runtime.sendMessage(new Message(
      Message.Target.SIDE_PANEL,
      Message.Sender.SERVICE_WORKER,
      Message.Type.Task.Response.App.STATE,
      text,
      data
    )).catch(e =>
    {
      console.log("SidePanel not available:\n" + e);
      this.appController.state.hasOpenSidePanel = false;
    });
  }

  async sendCanvasRequests(requests)
  {
    let tabId = this.appController.tabHandler.getTabId();

    if(!tabId) return null;

    const responseMsg = await chrome.tabs.sendMessage(
      tabId,
      new Message(Message.Target.TAB,
        Message.Sender.SERVICE_WORKER,
        Message.Type.Canvas.REQUESTS,
        "Canvas requests",
        requests)
    ).catch(e =>
    {
      console.warn("Content script not available:\n" + e)
    });

    return responseMsg ? responseMsg.data : null;
  }
}