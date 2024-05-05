import {HTTPClient} from "./HTTPClient.js";

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
    static async Announcements(courseId, page=1){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/discussion_topics?only_announcements=true&page=${page}&per_page=100`)
        )
    }

    static async Assignments(courseId, page=1){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/assignments?page=${page}&per_page=100`)
        )
    }

    static async Course(courseId){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL("/courses/" + courseId)
        )
    }

    static async CoursesUser(){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL("/courses?per_page=100")
        )
    }
    static async CoursesAccount(page=1){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/accounts/1/courses?page=${page}&per_page=100`)
        )
    }

    static async Discussions(courseId, page=1){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/discussion_topics?page=${page}&per_page=100`)
        )
    }

    static async Modules(courseId, page=1){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/modules?page=${page}&per_page=100`)
        )
    }

    static async ModuleItems(courseId, moduleId, page=1){
        return HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/modules/${moduleId}/items?page=${page}&per_page=100`)
        )
    }

    static async Pages(courseId, page=1){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/pages?include[]=body&page=${page}&per_page=100`)
        )
    }

    static async Tabs(courseId, page=1){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/tabs?page=${page}&per_page=100`)
        )
    }

    static async UsersSelf(){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL("/users/self")
        )
    }
}