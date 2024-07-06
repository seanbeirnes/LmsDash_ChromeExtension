import { CanvasAPIClient } from "./CanvasAPIClient.js";
import { CanvasRequest } from "../shared/models/CanvasRequest.js";
import {CanvasResponse} from "../shared/models/CanvasResponse.js";

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
                response = await this.client.Get.Announcements(request.params.courseId, request.params.page);
                break;

            case CanvasRequest.Get.Assignments:
                response = await this.client.Get.Assignments(request.params.courseId, request.params.page);
                break;

            case CanvasRequest.Get.Course:
                response = await this.client.Get.Course(request.params.courseId);
                break;

            case CanvasRequest.Get.CoursesUser:
                response = await this.client.Get.CoursesUser();
                break;

            case CanvasRequest.Get.CoursesByAdminSearch:
                response = await this.client.Get.CoursesByAdminSearch(request.params.searchTerm, request.params.page, request.params.perPage);
                break;

            case CanvasRequest.Get.CoursesAccount:
                response = await this.client.Get.CoursesAccount(request.params.page, request.params.perPage);
                break;

            case CanvasRequest.Get.Discussions:
                response = await this.client.Get.Discussions(request.params.courseId, request.params.page);
                break;

            case CanvasRequest.Get.Modules:
                response = await this.client.Get.Modules(request.params.courseId, request.params.page);
                break;

            case CanvasRequest.Get.ModuleItems:
                response = await this.client.Get.ModuleItems(request.params.courseId, request.params.moduleId, request.params.page);
                break;

            case CanvasRequest.Get.Pages:
                response = await this.client.Get.Pages(request.params.courseId, request.params.page);
                break;
               
            case CanvasRequest.Get.Tabs:
                response = await this.client.Get.Tabs(request.params.courseId, request.params.page);
                break;

            case CanvasRequest.Get.TermsBySearch:
                response = await this.client.Get.TermsBySearch(request.params.searchTerm, request.params.page, request.params.perPage);
                break;

            case CanvasRequest.Get.UsersSelf:
                response = await this.client.Get.UsersSelf();
                break;

            default:
                console.error("Error: invalid canvas get request type passed to RequestHandler")
        }

        return new CanvasResponse(
          request.id,
          await response.text(),
          response.bodyUsed,
          this.#parseLinkHeader(response.headers.get("Link") ? response.headers.get("Link") : response.headers.get("link")),
          response.ok,
          response.redirected,
          response.status,
          response.statusText,
          response.type
        );
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