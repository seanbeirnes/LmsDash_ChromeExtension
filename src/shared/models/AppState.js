export class AppState
{
  constructor()
  {
    this.timeStarted = Date.now();
    this.timeUpdated = Date.now();
    this.timeChanged = Date.now();

    this.isOnline = navigator.onLine;
    this.networkInfo = navigator.connection;

    this.activeTabId = null;
    this.activeTab = null;

    this.hasTabs = false;
    this.isAdmin = false;
    this.hasOpenSidePanel = false;

  }
}