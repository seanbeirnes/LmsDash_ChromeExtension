export class HTTPClient
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