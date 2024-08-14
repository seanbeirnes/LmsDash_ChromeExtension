import Scannable from "./Scannable.js";
import {CanvasRequest} from "../../../shared/models/CanvasRequest.js";
import Logger from "../../../shared/utils/Logger.js";

export default class Requester
{
  constructor(courseId, courseInfo, coursesScanController)
  {
    this.courseId = courseId;
    this.courseInfo = courseInfo;
    this.coursesScanController = coursesScanController;
  }

  // Makes the requests and updates items for an array of scannable
  async request(scannables)
  {
    const canvasRequests = [];

    // Clear previous items and build new request
    scannables.forEach((scannable) =>
    {
      // Ignore syllabus type
      if(scannable.type === Scannable.Type.SYLLABUS) return;

      const canvasRequest = this.#buildRequest(scannable);
      scannable.requestId = canvasRequest.id;
      canvasRequests.push(canvasRequest);
    })

    Logger.debug(__dirname, canvasRequests.toString());

    // Make the requests
    const responses = await this.coursesScanController.sendCanvasRequests(canvasRequests);

    // Update the items and check if last page
    scannables.forEach((scannable) =>
    {
      // Handle syllabus type
      if(scannable.type === Scannable.Type.SYLLABUS)
      {
        scannable.appendItem(this.courseInfo["syllabus_body"])
        return;
      }

      const response = responses.find((res) => res.id === scannable.requestId);

      // Update response items
      const responseData = JSON.parse(response.text);
      scannable.setItems(responseData);

      // Update isLastPage
      if(!response.link || !response.link.next) scannable.setIsLastPage(true);
    })

    return true;
  }

  #buildRequest(scannable)
  {
    switch(scannable.type)
    {
      case Scannable.Type.ANNOUNCEMENT:
        return new CanvasRequest(CanvasRequest.Get.Announcements, {
          courseId: this.courseId,
          page: scannable.page,
          perPage: 100
        })

      case Scannable.Type.ASSIGNMENT:
        return new CanvasRequest(CanvasRequest.Get.Assignments, {
          courseId: this.courseId,
          page: scannable.page,
          perPage: 100
        })

      case Scannable.Type.COURSE_NAV_LINK:
        return new CanvasRequest(CanvasRequest.Get.Tabs, {courseId: this.courseId, page: scannable.page, perPage: 100})

      case Scannable.Type.DISCUSSION:
        return new CanvasRequest(CanvasRequest.Get.Discussions, {
          courseId: this.courseId,
          page: scannable.page,
          perPage: 100
        })

      case Scannable.Type.FILE:
        return new CanvasRequest(CanvasRequest.Get.CourseFiles, {
          courseId: this.courseId,
          onlyNames: true,
          page: scannable.page,
          perPage: 100
        })

      case Scannable.Type.MODULE:
        return new CanvasRequest(CanvasRequest.Get.Modules, {
          courseId: this.courseId,
          page: scannable.page,
          perPage: 100
        })

      case Scannable.Type.MODULE_ITEM:
        return new CanvasRequest(CanvasRequest.Get.ModuleItems, {
          courseId: this.courseId,
          moduleId: scannable.id,
          page: scannable.page
        })

      case Scannable.Type.PAGE:
        return new CanvasRequest(CanvasRequest.Get.Pages, {
          courseId: this.courseId,
          includeBody: true,
          page: scannable.page,
          perPage: 100
        })

      default:
        throw new Error("Unhandled scannable type passed to request builder.");
    }
  }
}