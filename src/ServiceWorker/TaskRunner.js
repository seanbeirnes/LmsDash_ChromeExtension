import Task from "../shared/models/Task.js";
import Logger from "../shared/utils/Logger.js";
import CoursesScanController from "./features/CoursesScanner/CoursesScanController.js";

export default class TaskRunner
{
  static runTask(task, appController)
  {
    let isRunning = false;

    switch(task.type)
    {
      case Task.type.coursesScan:
        isRunning = TaskRunner.runCoursesScan(task, appController);
        break;

      default:
        Logger.debug(__dirname, "Task type not found. Could not run task: \n" + task.toString());
    }

    task.setTimeStarted();

    if(isRunning)
    {
      task.setStatus(Task.status.running);
    }
    else
    {
      task.setStatus(Task.status.failed)
      task.setTimeFinished();
    }

    return isRunning;
  }

  static runCoursesScan(task, appController)
  {
    task.controller = new CoursesScanController(task, appController);
    task.controller.start();

    Logger.debug(__dirname, "Running Courses Scan Task: " + task.toString());
    return true;
  }
}