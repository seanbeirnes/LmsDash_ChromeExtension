import {Message} from "../shared/models/Message.js";
import {CanvasRequest} from "../shared/models/CanvasRequest.js";
import {Utils} from "../shared/utils/Utils.js";

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
      case Message.Type.Canvas.REQUESTS:
      {
        const response = await this.sendCanvasRequests(message.data)

        sendResponse(
          new Message(
            Message.Target.SIDE_PANEL,
            Message.Sender.SERVICE_WORKER,
            Message.Type.Canvas.RESPONSES,
            "Canvas Responses",
            response
          )
        )
      }
        break;

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

      case Message.Type.Task.Request.NEW:
      {
        const task = this.enqueueTask(message.data);

          sendResponse(
            new Message(
              Message.Target.SIDE_PANEL,
              Message.Sender.SERVICE_WORKER,
              Message.Type.Task.Response.NEW,
              task ? "New task created" : "Task creation failed",
              task ? task : null
            )
          )
      }
        break;

      default:
        return;
    }
  }

  sendSidePanelMessage(text, data, counter = 0)
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
      if(counter < 4)
      {
        this.sendSidePanelMessage(text, data, ++counter);
      }
      else
      {
        console.log("SidePanel not available:\n" + e);
        this.appController.state.hasOpenSidePanel = false;
      }
    });
  }

  async sendCanvasRequests(requests, counter = 0)
  {
    if(counter > 0) await Utils.sleep(Math.pow(10,counter))

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
      if(counter < 4)
      {
        this.sendCanvasRequests(requests, ++counter);
      }
      else
      {
        console.warn("Content script not available:\n" + e)
      }
    });

    return responseMsg ? responseMsg.data : null;
  }

  enqueueTask(task)
  {
    if(!task || !task.type) return null; // Check for a bad task model format
    return this.appController.taskController.enqueue(task); //Enqueue the task and return it with the new id
  }
}