export class Message 
{
    constructor(target, type, text = "", data = {}, time = Date.now())
    {
        this.target = target;
        this.type = type;
        this.text = text;
        this.data = data;
        this.time = time;
    }

    // Enums for message types
    static Type = {
        // Canvas requests (for making content script API requests)
        Canvas: {
            REQUESTS: 1,
            RESPONSES: 2,
        },

        // Tasks for serviceWorker (called from SidePanel and response to SidePanel)
        Task: {
            Request: {
                App: {
                    STATE: 100, // Application info and state
                },
                Info: {
                    USER: 200, // User info
                    SEARCH_TERMS: 210
                },
                Scanner: {
                    NEW: 300,
                    PROGRESS: 301
                }
            },
            Response: {
                App: {
                    STATE: 100, // Application info and state
                },
                Info: {
                    USER: 200, // User info
                    SEARCH_TERMS: 210
                },
                Scanner: {
                    NEW: 300,
                    PROGRESS: 301
                }
            }
        }
    }

    static Target = {
        SERVICE_WORKER: 100,
        SIDE_PANEL: 200,
        TAB: 300
    }
}