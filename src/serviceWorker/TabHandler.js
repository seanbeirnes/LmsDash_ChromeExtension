// Handles tracking valid Canvas tabs in the browser to serve to the app controller
export class TabHandler
{
    // Tracks valid canvas tabs open in browser
    #canvasTabs = [];

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
        }
        else if (!isValid && this.#canvasTabs.includes(tabId))
        {
            this.#canvasTabs.splice( this.#canvasTabs.indexOf(tabId), 1 );
        }
    }
    
    init()
    {
        chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
            this.#updateValidTabs(tabId);
            console.log(this.#canvasTabs) // For testing purposes
        });

        return null;
    }
}