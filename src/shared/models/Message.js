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

    static Type = {
        // General info messages
        STATUS: {
            IS_ALIVE: 0,
            INFO: 1
        },
    
        // Error message types
        ERROR: {
            CONNECTION_LOST: 100,
            CSRF_MISSING: 101,
            UNAUTHORIZED: 102
        },
    
        // Request message types
        REQUEST: {
            NEW: 200,
            OK: 201,
            PROGRESS: 210
        }
    }

    static Target = {
        SERVICE_WORKER: 100,
        SIDE_PANEL: 200,
        TAB: 300
    }
}

export default {Message}