// Handles tracking valid Canvas tabs in the browser to serve to the app controller
export class TabHandler
{
    // Tracks valid canvas tabs open in browser
    #canvasTabs = [];
    #lastActiveTabId = null;

    // Returns a valid Canvas tabId
    getTabId()
    {
        if(this.#canvasTabs.length > 0)
        {
            return this.#canvasTabs[0];
        }
        else
        {
            return null;
        }
    }

    getLastActiveTabId()
    {
        if(this.#lastActiveTabId === null) return null;

        if(this.#canvasTabs.includes(this.#lastActiveTabId))
        {
            return this.#lastActiveTabId;
        }

        return null;
    }

    hasTabs()
    {
        return this.#canvasTabs.length > 0;
    }

    static async #isValidTab(tabId)
    {
        const tab = await chrome.tabs.get(Number(tabId));
        
        if(!tab.url)
        {
            return false;
        }

        const INSTRUCTURE_HOSTED_PATTERN = /https:\/\/(?:\w{1,255}\.)+instructure\.com/;
        const CANVAS_SUBDOMAIN_PATTERN =  /https:\/\/canvas\.(?:\w{1,255}\.)+\w{1,26}/;
        
        const tabUrl = new URL(tab.url);
        const isValidUrl = (INSTRUCTURE_HOSTED_PATTERN.test(tabUrl.origin) || CANVAS_SUBDOMAIN_PATTERN.test(tabUrl.origin));

        return isValidUrl;
    }

    async #updateValidTabs(tabId)
    {
        const isValid = await TabHandler.#isValidTab(tabId);
    
        if(isValid && !this.#canvasTabs.includes(tabId))
        {
            this.#canvasTabs.push(tabId)
            this.#lastActiveTabId = tabId;
        }
        else if (!isValid && this.#canvasTabs.includes(tabId))
        {
            this.#canvasTabs.splice( this.#canvasTabs.indexOf(tabId), 1 );
        }
    }

    async #removeTab(tabId)
    {
        if(this.#canvasTabs.includes(tabId))
        {
            return this.#canvasTabs.splice( this.#canvasTabs.indexOf(tabId), 1 );
        }

        return null;
    }

    async #updateActiveTab()
    {
        const response = await chrome.tabs.query({active: true, currentWindow: true});

        if(response.length < 1) return;

        const newTab = response[0];
        if(this.#canvasTabs.includes(newTab.id)) this.#lastActiveTabId = newTab.id;
    }
    
    init()
    {
        // Add listeners to track all valid tabs
        chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
            this.#updateValidTabs(tabId);
        });

        chrome.tabs.onRemoved.addListener(async (tabId, info) => {
            this.#removeTab(tabId);
            if(this.#lastActiveTabId === tabId) this.#lastActiveTabId = null;
        });

        // Add listener to track last active tab
        chrome.tabs.onActivated.addListener( async () => {
            this.#updateActiveTab();
        });

        return null;
    }
}