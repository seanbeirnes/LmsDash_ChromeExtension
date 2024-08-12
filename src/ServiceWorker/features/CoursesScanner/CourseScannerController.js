import {CanvasRequest} from "../../../shared/models/CanvasRequest.js";
import Logger from "../../../shared/utils/Logger.js";
import CourseItemScanResult from "../../../shared/models/CourseItemScanResult.js";

export default class CourseScannerController
{
  constructor(scanIndex, courseId, scanSettings, coursesScanController)
  {
    this.scanIndex = scanIndex;
    this.courseId = courseId;
    this.scanSettings = scanSettings;
    this.coursesScanController = coursesScanController;
    this.results = {
      announcements: [],
      assignments: [],
      courseNavLinks: [],
      discussions: [],
      fileNames: [],
      moduleLinks: [],
      pages: [],
      syllabus: [],
    }
    this.courseInfo = null;
  }

  async collectCourseInfo()
  {
    const response = await this.coursesScanController.sendCanvasRequests([
      new CanvasRequest(
        CanvasRequest.Get.Course,
        {courseId: this.courseId, syllabusBody: this.scanSettings.scannedItems.includes("syllabus")})
    ])

    Logger.debug(__dirname, "Course info response: " + JSON.stringify(response))
    if(!response || !response[0] || !response[0].ok || !response[0].text) return false;

    this.courseInfo = JSON.parse(response[0].text);

    console.log(this.courseInfo);

    return true;
  }

  async getScannableItems(currentPages)
  {

    // Create the requests
    const requests = {
      announcement: currentPages.announcement > 0 ? new CanvasRequest(
          CanvasRequest.Get.Announcements,
          {courseId: this.courseId, page: currentPages.announcement, perPage: 100})
        : null,
      assignment: currentPages.assignment > 0 ? new CanvasRequest(
          CanvasRequest.Get.Assignments,
          {courseId: this.courseId, page: currentPages.assignment, perPage: 100})
        : null,
      courseNavLink: currentPages.courseNavLink > 0 ? new CanvasRequest(
          CanvasRequest.Get.Tabs,
          {courseId: this.courseId, page: currentPages.courseNavLink, perPage: 100})
        : null,
      discussion: currentPages.discussion > 0 ? new CanvasRequest(
          CanvasRequest.Get.Discussions, {courseId: this.courseId, page: currentPages.discussion, perPage: 100})
        : null,
      fileName: currentPages.fileName > 0 ? new CanvasRequest(
          CanvasRequest.Get.CourseFiles, {
            courseId: this.courseId,
            onlyNames: true,
            page: currentPages.fileName,
            perPage: 100
          })
        : null,
      page: currentPages.page > 0 ? new CanvasRequest(
          CanvasRequest.Get.Pages, {courseId: this.courseId, includeBody: true, page: currentPages.page, perPage: 100})
        : null
    }

    // Build the request array
    const requestTypes = Object.keys(requests);
    const canvasRequests = []
    requestTypes.forEach(requestType =>
    {
      if(requests[requestType]) canvasRequests.push(requests[requestType]);
    })
    Logger.debug(__dirname, canvasRequests.toString());

    // Check for empty request
    if(canvasRequests.length === 0) return null;

    // Send the requests
    const responses = await this.coursesScanController.sendCanvasRequests(canvasRequests);

    // Object to store response data
    const responseData = {
      announcement: null,
      assignment: null,
      courseNavLink: null,
      discussion: null,
      fileName: null,
      page: null
    }

    // Convert response data to hashmap
    requestTypes.forEach(requestType => {
      if(!requests[requestType]) return;

      const requestId = requests[requestType].id;
      const response = responses.find((res) => res.id === requestId);

      // Update page numbers or set to "-1" to indicate no more pages remain
      currentPages[requestType] = (!response.link || !response.link.next) ? -1 : ++currentPages[requestType];

      // Convert JSON to JS objects
      responseData[requestType] = JSON.parse(response.text);
    })

    return responseData
  }

  async scanCourseItems()
  {
    // TO-DO: Scan Syllabus if need
    console.log("TO DO: Scan Syllabus")

    // TO-DO: Scan module links
    console.log("TO DO: Scan module links")

    // Collect pages of scannable items and scan each item in each page until not pages remain
    // Page >= 1 needs scanning, -1 = done scanning or not in settings
    const currentPages = {
      announcement: this.scanSettings.scannedItems.includes(CourseItemScanResult.type.announcement) ? 1 : -1,
      assignment: this.scanSettings.scannedItems.includes(CourseItemScanResult.type.assignment) ? 1 : -1,
      courseNavLink: this.scanSettings.scannedItems.includes(CourseItemScanResult.type.courseNavLink) ? 1 : -1,
      discussion: this.scanSettings.scannedItems.includes(CourseItemScanResult.type.discussion) ? 1 : -1,
      fileName: this.scanSettings.scannedItems.includes(CourseItemScanResult.type.fileName) ? 1 : -1,
      page: this.scanSettings.scannedItems.includes(CourseItemScanResult.type.page) ? 1 : -1,
    }
    while((currentPages.announcement + currentPages.assignment + currentPages.courseNavLink + currentPages.discussion + currentPages.fileName + currentPages.page) > -6)
    {
      Logger.debug(__dirname, "Current pages: \n" + JSON.stringify(currentPages))
      // Get the next page of each scannable item category
      const scannableItems = await this.getScannableItems(currentPages);
      console.log(scannableItems);
      // Scan items

      // Update progress

    }
  }

  async run()
  {
    // Get course info
    const hasCourseInfo = await this.collectCourseInfo();
    if(!hasCourseInfo) return new CourseItemScanResult(CourseItemScanResult.type.scanError, this.courseId);
    this.#updateProgressData();

    // Scan course
    await this.scanCourseItems();

    return true;
  }


  #updateProgress(progress)
  {
    this.coursesScanController.task.setProgress(progress);
  }

  #updateProgressData()
  {
    this.coursesScanController.task.setProgressData([
      `Scanning course ${this.scanIndex + 1} of ${this.scanSettings.courseIds.length}`,
      `Scanning items in course ${this.courseInfo["name"]}`
    ]);
  }
}