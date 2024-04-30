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

    async #removeTab(tabId)
    {
        if(this.#canvasTabs.includes(tabId))
        {
            return this.#canvasTabs.splice( this.#canvasTabs.indexOf(tabId), 1 );
        }

        return null;
    }
    
    init()
    {
        // If a valid tab URL is found, a new tab opens to start the content script
        /*
        chrome.runtime.onStartup.addListener(async () => {
            const tabs = await chrome.tabs.query({})
            console.log(tabs)

            for(let i = 0; i < tabs.length; i++)
            {
                if(TabHandler.#isValidTab(tabs[i].id))
                {
                    chrome.tabs.create({url: tabs[i].url});
                    return;
                }
            }
        });
        */

        // If a valid tab URL is found, a new tab opens to start the content script
        chrome.runtime.onInstalled.addListener(async () => {
            const tabs = await chrome.tabs.query({})

            for(let i = 0; i < tabs.length; i++)
            {
                if(TabHandler.#isValidTab(tabs[i].id))
                {
                    chrome.tabs.create({url: tabs[i].url});
                    return;
                }
            }
        });

        chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
            this.#updateValidTabs(tabId);
        });

        chrome.tabs.onRemoved.addListener(async (tabId, info) => {
            this.#removeTab(tabId);
        });

        return null;
    }
}