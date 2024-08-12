import {Utils} from "../../../shared/utils/Utils.js";
import {Message} from "../../../shared/models/Message.js";
import {CanvasRequest} from "../../../shared/models/CanvasRequest.js";
import Logger from "../../../shared/utils/Logger.js";
import CourseScannerController from "./CourseScannerController.js";

export default class CoursesScanController
{
  constructor(task, appController)
  {
    this.appController = appController;
    this.task = task;
    this.scanSettings = task.settingsData;
    this.courseScanResults = [];
    this.running = false;
  }

  function

  start()
  {
    this.running = true;
    this.task.setProgressData(["Starting scan..."]);
    this.#run();

    return true;
  }

  stop()
  {
    this.running = false;
    this.task.setProgressData(["Stopping scan..."]);

  }

  async #run()
  {
    // If scan type is 'term', collect course ids
    this.task.setProgressData(["Gathering courses..."])
    if(this.scanSettings.scanType.includes("term")) await this.collectCourseIds()

    // for each course id, while running is true, scan coruse with that id
    for(let i = 0; i < this.scanSettings.courseIds.length; i++)
    {
      const courseScanController = new CourseScannerController(
        i,
        this.scanSettings.courseIds[i],
        this.scanSettings,
        this,
        );

      const scanResults = await courseScanController.run();
    }

    // update task results

    // stop
  }

  async collectCourseIds()
  {
    let hasNextLink = true;
    let page = 1;
    const courseIds = []

    while(hasNextLink)
    {
      const response = await this.sendCanvasRequests([
        new CanvasRequest(CanvasRequest.Get.CoursesByTermId, {termId: this.scanSettings.scanType[1], page: page, perPage: 100})
      ])
      const responseData = JSON.parse(response[0].text)
      responseData.forEach((courseObj) => courseIds.push(courseObj["id"]))

      if(!response[0].link || !response[0].link.next) hasNextLink = false;

      page++
    }

    this.scanSettings.courseIds = courseIds;

    Logger.debug(__dirname, "Collected course IDs for scanning: \n" + courseIds.toString());
  }

  async sendCanvasRequests(requests, counter = 0)
  {
    if(counter > 0) await Utils.sleep(Math.pow(10,counter))

    let tabId = this.appController.tabHandler.getTabId();

    if(!tabId) return null;

    const responseMsg = await chrome.tabs.sendMessage(
      tabId,
      new Message(Message.Target.TAB,
        Message.Sender.SERVICE_WORKER,
        Message.Type.Canvas.REQUESTS,
        "Canvas requests",
        requests)
    ).catch(e =>
    {
      if(counter < 4)
      {
        this.sendCanvasRequests(requests, ++counter);
      }
      else
      {
        console.warn("Content script not available:\n" + e)
      }
    });

    return responseMsg ? responseMsg.data : null;
  }
}