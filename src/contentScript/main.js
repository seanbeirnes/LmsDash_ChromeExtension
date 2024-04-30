class HTTPClient
{
    static async #getCsrfToken()
    {
        const cookie = await cookieStore.get({name: "_csrf_token", url: document.location.href});
        return decodeURIComponent(cookie.value);
    }

    static async get(url)
    {
        const response = await fetch( url=url, {
            method: "GET",
            mode: "cors",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              "X-Csrf-Token": await this.#getCsrfToken()
            }
        });

        return response;
    }

    static async put(url, data) 
    {
        const response = await fetch(url=url, {
            method: "PUT",
            mode: "cors",
            credentials: "same-origin",
            headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "X-Csrf-Token": await this.#getCsrfToken()
            },
            body: JSON.stringify(data)
        });

        return response;
    }
}

class CanvasAPIService
{
    static formatURL(url)
    {
        const baseURL = "https://" + document.location.host;
        return baseURL + "/api/v1" + url;
    }

    static Get = {
        UsersSelf: async function(){
            return HTTPClient.get(
                CanvasAPIService.formatURL("/users/self")
            )
        },
        Course: async function(courseId){
            return HTTPClient.get(
                CanvasAPIService.formatURL("/courses/" + courseId)
            )
        },
        CoursesUser: async function(){
            return HTTPClient.get(
                CanvasAPIService.formatURL("/courses")
            )
        },
        CoursesAccount: async function(page=1){
            return HTTPClient.get(
                CanvasAPIService.formatURL(`/accounts/1/courses?page=${page}&per_page=100`)
            )
        }
    }
}

chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) =>
    {
        if(message.type === 200 && message.target === 300)
        {
            let res = await CanvasAPIService.Get.CourseUser();
            console.log(res)
            alert(await JSON.stringify( await res.json()));
        }
    }
)