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
    static async Announcements(courseId, page=1, perPage=10){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/discussion_topics?only_announcements=true&page=${page}&per_page=${perPage}`)
        )
    }

    static async Assignments(courseId, page=1, perPage=10){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/assignments?page=${page}&per_page=${perPage}`)
        )
    }

    static async Course(courseId, syllabusBody = false){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}${syllabusBody ? "/?include[]=syllabus_body" : ""}`)
        )
    }

    static async CourseFiles(courseId, onlyNames = true, page=1, perPage=1){
        return await HTTPClient.get(
          CanvasAPIClient.formatURL(`/courses/${courseId}/files?${onlyNames ? "only[]=names&" : ""}page=${page}&per_page=${perPage}`)
        )
    }

    static async CoursesUser(){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL("/courses?per_page=100")
        )
    }

    static async CoursesByAdminSearch(searchTerm, page=1, perPage=10){
        return await HTTPClient.get(
          CanvasAPIClient.formatURL(`/accounts/1/courses?search_term=${searchTerm}&page=${page}&per_page=${perPage}`)
        )
    }

    static async CoursesByTermId(termId, page=1, perPage=10){
        return await HTTPClient.get(
          CanvasAPIClient.formatURL(`/accounts/1/courses?enrollment_term_id=${termId}&page=${page}&per_page=${perPage}`)
        )
    }

    static async CoursesAccount(page=1, perPage=10){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/accounts/1/courses?page=${page}&per_page=${perPage}`)
        )
    }

    static async Discussions(courseId, page=1, perPage=10){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/discussion_topics?page=${page}&per_page=${perPage}`)
        )
    }

    static async Modules(courseId, page=1, perPage=10){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/modules?page=${page}&per_page=${perPage}`)
        )
    }

    static async ModuleItems(courseId, moduleId, page=1){
        return HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/modules/${moduleId}/items?page=${page}&per_page=100`)
        )
    }

    static async Pages(courseId, includeBody = false, page=1, perPage=10){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/pages?${includeBody ? "include[]=body&" : ""}page=${page}&per_page=${perPage}`)
        )
    }

    static async Tabs(courseId, page=1, perPage=10){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/courses/${courseId}/tabs?page=${page}&per_page=${perPage}`)
        )
    }

    static async TermsBySearch(searchTerm, page=1, perPage=10)
    {
        return await HTTPClient.get(
            CanvasAPIClient.formatURL(`/accounts/1/terms?term_name=${searchTerm}&page=${page}&per_page=${perPage}`)
        )
    }

    static async UsersSelf(){
        return await HTTPClient.get(
            CanvasAPIClient.formatURL("/users/self")
        )
    }
}