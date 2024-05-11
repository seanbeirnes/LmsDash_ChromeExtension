import { CanvasAPIClient } from "./CanvasAPIClient.js";
import { CanvasRequest } from "../shared/models/CanvasRequest.js";

export class RequestHandler
{
    constructor()
    {
        this.client = new CanvasAPIClient();
        this.queue = [];
    }

    enqueue(request)
    {
        this.queue.push(request);
    }

    enqueueList(requests)
    {
        requests.forEach( (req) => this.enqueue(req));
    }

    // Returns a dictionary key/value pair of the link header if it is not null
    #parseLinkHeader(linkHeader)
    {
        if(linkHeader == null)
        {
            return null;
        }

        const links = {}

        const list = linkHeader.split(",")

        list.forEach( (link) => {
            const LINK_PATTERN = /^<([\w\/\.&?:\[\]=]+)>;\srel="(\w+)"$/
            const matches = link.match(LINK_PATTERN)
            if(matches.length === 3)
            {
                links[matches[2]] = matches[1];
            }
            else
            {
                console.error("LMS Dash Error: Could not parse 'Link' header")
            }
        })

        if(Object.keys(links).length > 0)
        {
            return links;
        }

        return null;
    }

    async createRequest(request)
    {
        let response = null;
        switch(request.type)
        {
            case CanvasRequest.Get.Announcements:
                response = await this.client.Get.Announcements(request.params[0], 1 in request.params ? request.params[1] : 1); // courseID, page
                break;

            case CanvasRequest.Get.Assignments:
                response = await this.client.Get.Assignments(request.params[0], 1 in request.params ? request.params[1] : 1); // courseID, page
                break;

            case CanvasRequest.Get.Course:
                response = await this.client.Get.Course(request.params[0]); // courseID
                break;

            case CanvasRequest.Get.CoursesUser:
                response = await this.client.Get.CoursesUser();
                break;

            case CanvasRequest.Get.CoursesAccount:
                response = await this.client.Get.CoursesAccount(0 in request.params ? request.params[0] : 1); // page
                break;

            case CanvasRequest.Get.Discussions:
                response = await this.client.Get.Discussions(request.params[0], 1 in request.params ? request.params[1] : 1); // courseID, page
                break;

            case CanvasRequest.Get.Modules:
                response = await this.client.Get.Modules(request.params[0], 1 in request.params ? request.params[1] : 1); // courseID, page
                break;

            case CanvasRequest.Get.ModuleItems:
                response = await this.client.Get.ModuleItems(request.params[0], request.params[1], 2 in request.params ? request.params[2] : 1); // courseId, moduleId, page
                break;

            case CanvasRequest.Get.Pages:
                response = await this.client.Get.Pages(request.params[0], 1 in request.params ? request.params[1] : 1); // courseID, page
                break;
               
            case CanvasRequest.Get.Tabs:
                response = await this.client.Get.Tabs(request.params[0], 1 in request.params ? request.params[1] : 1); // courseID, page
                break;
                
            case CanvasRequest.Get.UsersSelf:
                response = await this.client.Get.UsersSelf();
                break;

            default:
                console.error("Error: invalid canvas get request type passed to RequestHandler")
        }

        return {id: request.id, 
            text: await response.text(), 
            bodyUsed: response.bodyUsed,
            link: this.#parseLinkHeader(response.headers.get("Link")),
            ok: response.ok,
            redirected: response.redirected,
            status: response.status, 
            statusText: response.statusText, 
            type: response.type
            };
    }

    async run()
    {
        let responses = [];

        while(this.queue.length > 0)
        {
            // Build a request batch
            const batch = []
            for(let i = 0; i < 25 && this.queue.length > 0; i++)
            {
                batch.push(this.queue[0]);
                this.queue.splice(0, 1);
            }

            const res = await Promise.all(
                batch.map(async (req) => await this.createRequest(req))
            );

            responses = responses.concat(res);
        }

        return responses;
    }
}