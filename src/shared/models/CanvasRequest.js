// Enum for cnavas request types to assist in message passing.
export class CanvasRequest
{
    constructor(type, params = [], id = crypto.randomUUID(), created = Date.now())
    {
        this.created = created;
        this.started = null;
        this.finished = null;

        this.id = id;
        this.type = type;
        this.params = params;
    }

    isRunning()
    {
        if(this.started !== null && this.finished === null)
        {
            return true;
        }

        return false;
    }

    isFinished()
    {
        if(this.finished !== null)
        {
            return true;
        }

        return false;
    }

    start()
    {
        return this.started = Date.now();
    }

    finish()
    {
        if(this.started !== null)
        {
            return this.finished = Date.now();
        }

        return null;
    }

    getInfo()
    {
        return {id: this.id, created: this.created, type: this.type, params: this.params};
    }

    // Get request type enums
    static Get = {
        Announcements: 100,
        Assignments: 101,
        Course: 102,
        CoursesUser: 103,
        CoursesAccount: 104,
        Discussions: 105,
        Modules: 106,
        ModuleItems: 107,
        Pages: 108,
        Tabs: 109,
        UsersSelf: 110
    }
}