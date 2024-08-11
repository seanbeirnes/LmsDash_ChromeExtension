import Task from "../shared/models/Task.js";
import Logger from "../shared/utils/Logger.js";

export default class TaskRunner
{
  static runTask(task)
  {
    let isRunning = false;

    switch(task.type)
    {
      case Task.type.coursesScan:
        isRunning = TaskRunner.runCoursesScan(task);
        break;

      default:
        Logger.debug(__dirname, "Task type not found. Could not run task: \n" + JSON.stringify(task));
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

  static runCoursesScan(task)
  {
    Logger.debug(__dirname, "Running Courses Scan Task: " + JSON.stringify(task));

    return true;
  }
}