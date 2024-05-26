import {TabHandler} from "./TabHandler.js";
import {AppState} from "../shared/models/AppState.js";
import {CanvasRequest} from "../shared/models/CanvasRequest.js";
import {MessageListener} from "../shared/observers/MessageListener.js";
import {Message} from "../shared/models/Message.js";

export class AppStateController
{
  isAdminRunning = false;

  constructor()
  {
    this.appState = new AppState(
    );

    // Update hasTabs var
    this.tabHandler = new TabHandler();
    this.tabHandler.init();
    this.appState.hasTabs = this.tabHandler.hasTabs();
  }

  getState()
  {
    return this.appState;
  }

  // Updates the app state and returns true if it has changed
  update()
  {
    this.appState.timeUpdated = Date.now();

    let newIsOnline = navigator.onLine;
    let newHasTabs = this.tabHandler.hasTabs();

    let isChanged = false;
    isChanged = (this.appState.isOnline !== newIsOnline || this.appState.hasTabs !== newHasTabs);

    if(isChanged) this.appState.timeChanged = Date.now();

    this.appState.isOnline = newIsOnline;
    this.appState.hasTabs = newHasTabs;

    return isChanged;
  }

  async checkIsAdmin()
  {
    let message = null;

    if(this.isAdminRunning || !this.appState.hasTabs) return message;

    this.isAdminRunning = true;

    function updateMessage(msg)
    {
      message = msg;
    }

    const messageListener = new MessageListener(Message.Target.SERVICE_WORKER, updateMessage);
    messageListener.listen();

    chrome.tabs.sendMessage(
      this.tabHandler.getTabId(),
      new Message(
        Message.Target.TAB,
        Message.Type.Canvas.REQUESTS,
        "get-courses-by-account request to check if admin",
        [new CanvasRequest(CanvasRequest.Get.CoursesAccount)]
      )
    ).catch( e => {console.error("Content script not available:\n" + e)});

    async function sleep(time)
    {
      return new Promise ( (resolve) =>
        {
          setTimeout(resolve, time)
        })
    }

    let counter = 0;
    while(counter < 30 && message === null)
    {
      await sleep(Math.pow(counter, 2));
      counter++
    }

    if(message !== null)
    {
      this.appState.isAdmin = message.data[0].status !== 401;
    }

    messageListener.remove();
    this.isAdminChecked = false;

    return this.appState.isAdmin;
  }
}