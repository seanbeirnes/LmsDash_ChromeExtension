import {HTTPClient} from "./HTTPClient.js"

export class CanvasAPIClient
{
    constructor()
    {
        this.Get = GetRequests;
    }

    static formatURL(url)
    {
        const baseURL = "https://" + document.location.host;
        return baseURL + "/api/v1" + url;
    }
}

class GetRequests
{
    static Announcements(courseId, page=1){
        return HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/discussion_topics?only_announcements=true&page=${page}&per_page=100`)
        )
    }

    static Assignments(courseId, page=1){
        return HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/assignments?page=${page}&per_page=100`)
        )
    }

    static Course(courseId){
        return HTTPClient.get(
            CanvasAPIClient.formatURL("/courses/" + courseId)
        )
    }

    static CoursesUser(){
        return HTTPClient.get(
            CanvasAPIClient.formatURL("/courses")
        )
    }
    static CoursesAccount(page=1){
        return HTTPClient.get(
            CanvasAPIClient.formatURL(`/accounts/1/courses?page=${page}&per_page=100`)
        )
    }

    static Discussions(courseId, page=1){
        return HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/discussion_topics?page=${page}&per_page=100`)
        )
    }

    static Modules(courseId, moduleId, page=1){
        return HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/modules?page=${page}&per_page=100`)
        )
    }

    static ModuleItems(courseId, page=1){
        return HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/modules/${moduleId}/items?page=${page}&per_page=100`)
        )
    }

    static Pages(courseId, page=1){
        return HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/pages?include[]=body&page=${page}&per_page=100`)
        )
    }

    static Tabs(courseId, page=1){
        return HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/tabs?page=${page}&per_page=100`)
        )
    }

    static UsersSelf(){
        return HTTPClient.get(
            CanvasAPIClient.formatURL("/users/self")
        )
    }
}