import {Message} from "../shared/models/Message.js";
import {CanvasRequest} from "../shared/models/CanvasRequest.js";
import {Utils} from "../shared/utils/Utils.js";
import Task from "../shared/models/Task.js";

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

      // Message requesting a task for progress info
      case Message.Type.Task.Request.PROGRESS:
      {
        const task = this.getTaskById(message.data, false) // Data should only be an integer

        sendResponse(
          new Message(
            Message.Target.SIDE_PANEL,
            Message.Sender.SERVICE_WORKER,
            Message.Type.Task.Response.PROGRESS,
            task ? "Task found" : "No task by received id",
            task ? task : null
          )
        )
      }

        break;
      // Message requesting a task by its id
      case Message.Type.Task.Request.BY_ID:
      {
        const task = this.getTaskById(message.data) // Data should only be an integer

        sendResponse(
          new Message(
            Message.Target.SIDE_PANEL,
            Message.Sender.SERVICE_WORKER,
            Message.Type.Task.Response.BY_ID,
            task ? "Task found" : "No task by received id",
            task ? task : null
          )
        )
      }
        break;

      // Message requesting array of tasks by type, returns array of task IDs
      case Message.Type.Task.Request.BY_TYPE:
      {
        const tasks = this.getTasksByType(message.data) // Data should only be an integer

        sendResponse(
          new Message(
            Message.Target.SIDE_PANEL,
            Message.Sender.SERVICE_WORKER,
            Message.Type.Task.Response.BY_TYPE,
            tasks ? "Tasks found" : "No tasks by received task type",
            tasks ? tasks : null
          )
        )
      }
        break;

      // Message requesting to start a new task
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

      // Message requesting to stop a task
      case Message.Type.Task.Request.STOP:
      {
        const success = this.appController.taskController.stopTask(message.data);

        sendResponse(
          new Message(
            Message.Target.SIDE_PANEL,
            Message.Sender.SERVICE_WORKER,
            Message.Type.Task.Response.STOP,
            success ? "Task stopped" : "Task could not be stopped",
            success
          )
        )
      }
        break;

      default:
        return;
    }
  }

  //////
  ////// Message utility functions
  //////

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

  //////
  ////// Helper functions
  //////

  enqueueTask(task)
  {
    if(!task || !task.type) return null; // Check for a bad task model format
    return this.appController.taskController.enqueue(task); //Enqueue the task and return it with the new id
  }

  // Returns a serializable copy of an original task object
  getTaskById(taskId, includeResults = true)
  {
    if(taskId === null || taskId === undefined || taskId < 0) return null;
    return this.getSerializableTask( this.appController.taskController.getTaskById(taskId), includeResults );
  }

  // Returns array of tasks of a type
  getTasksByType(taskType)
  {
    if(!taskType) return null;
    const tasks = this.appController.taskController.getTasksByType(taskType, false);
    if(!tasks) return null;

    const taskCopies = [];
    tasks.forEach( (task) => taskCopies.push(this.getSerializableTask(task)) );

    return taskCopies;
  }

  // Creates copy of a task without the controller object reference
  // so it can be converted to JSON
  getSerializableTask(task, includeResults = false)
  {
    if(!task) return null;

    const taskCopy = new Task(task.type, task.settingsData);
    taskCopy.setId(task.id);
    taskCopy.uuid = task.uuid;
    taskCopy.setStatus(task.status);
    taskCopy.timeCreated = task.timeCreated;
    taskCopy.timeStarted = task.timeStarted;
    taskCopy.timeUpdated = task.timeUpdated;
    taskCopy.timeFinished = task.timeFinished;
    taskCopy.progress = task.progress;
    taskCopy.progressData = task.progressData;
    taskCopy.errorsData = task.errorsData;
    if(includeResults) taskCopy.resultsData = task.resultsData;

    return taskCopy;
  }
}