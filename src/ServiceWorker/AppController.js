import {TabHandler} from "./TabHandler.js";
import {AppState} from "../shared/models/AppState.js";
import {CanvasRequest} from "../shared/models/CanvasRequest.js";
import {MessageHandler} from "./MessageHandler.js";

export class AppController
{
  static APP_LOOP_MS = 500;
  static APP_LOOP_MULTIPLIER = 20;
  countCheckedIsAdmin = 0;
  tasks = []

  constructor()
  {
    this.state = new AppState(
    );

    this.messageHandler = new MessageHandler(this);
    this.messageHandler.init();

    // Update hasTabs var
    this.tabHandler = new TabHandler();
    this.tabHandler.init();
    this.state.hasTabs = this.tabHandler.hasTabs()
  }

  getState()
  {
    return this.state;
  }

  runTasks()
  {
    return 0;
  }

  // Set the sidePanel as open in app state and notify sidePanel of state change
  setSidePanelOpen()
  {
    if(this.state.hasOpenSidePanel === true) return;

    this.state.hasOpenSidePanel = true;
    this.state.timeChanged = Date.now();
    this.#notifySidePanel();
  }

  // Updates the app state and returns true if it has changed
  async update(counter = 1)
  {
    this.state.timeUpdated = Date.now();

    const newActiveTabId = this.tabHandler.getLastActiveTabId();
    const newIsOnline = navigator.onLine;
    const newHasTabs = this.tabHandler.hasTabs();
    let newIsAdmin = this.state.isAdmin;

    const isChanged_isOnline = (this.state.isOnline !== newIsOnline);
    const isChanged_hasTabs = (this.state.hasTabs !== newHasTabs);
    const isChanged_activeTabId = (this.state.activeTabId !== newActiveTabId);

    // Update activeTab if activeTabId changed
    if(isChanged_activeTabId) this.state.activeTab = newActiveTabId !== null ?
      await chrome.tabs.get(newActiveTabId) : null;

    // Check if non-dependant rules changed
    let isChanged = (isChanged_isOnline || isChanged_hasTabs || isChanged_activeTabId);

    // Check if isAdmin changed
    // Will only run if is admin is false AND checked < 5 times OR at the max app loop count
    if(isChanged ||
      ( this.countCheckedIsAdmin < 5 && this.state.isAdmin === false ) ||
      (counter === AppController.APP_LOOP_MS * AppController.APP_LOOP_MULTIPLIER))
    {
      if(this.state.hasTabs)
      {
        newIsAdmin = await this.#checkIsAdmin();
        this.countCheckedIsAdmin++;
      }
    }

    // Update isChanged if it was not already true AND isAdmin changed
    if(isChanged === false)
    {
      isChanged = (this.state.isAdmin !== newIsAdmin);
    }

    // Update states
    // Updating these after checking isAdmin gives the content script time to load
    this.state.isOnline = newIsOnline;
    this.state.hasTabs = newHasTabs;
    this.state.isAdmin = newIsAdmin;
    this.state.activeTabId = newActiveTabId;

    // If any changed, send update to SidePanel
    if(isChanged)
    {
      this.state.timeChanged = Date.now();
      this.#notifySidePanel();
    }
  }

  // Message the side panel of the app state
  #notifySidePanel()
  {
    this.messageHandler.sendSidePanelMessage("app state", this.state);

    console.log(this.state);
  }

  // Sends Canvas account courses request /api/v1/accounts/1/courses...
  // If 200 status, returns true (since only an admin would have that permission)
  // Otherwise, return false
  async #checkIsAdmin()
  {
    const response = await this.messageHandler.sendCanvasRequests(
      [new CanvasRequest(CanvasRequest.Get.CoursesAccount)]
    )

    return response && response[0].status !== 401;
  }
}