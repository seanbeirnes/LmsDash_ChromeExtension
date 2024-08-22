import Logger from "../shared/utils/Logger.js";
import TaskRunner from "./TaskRunner.js";
import Task from "../shared/models/Task.js";

export default class TaskController
{
  static CACHED_COUNT_LIMIT = 5;

  constructor(appController)
  {
    this.appController = appController;
    this.nextId = 0;
    this.newTasks = [];
    this.runningTasks = [];
    this.finishedTasks = [];
  }

  enqueue(newTask)
  {
    const task = new Task(newTask.type, newTask.settingsData);
    task.setId(this.nextId++);
    this.newTasks.push(task);

    return task;
  }

  // Handle changes in task status and new tasks
  update()
  {
    this.#handleFinished();
    this.#handleRunning();
    this.#handleNew();
  }

  // Removes old tasks to prevent memory leaks
  #handleFinished()
  {
    // Do not run if below cache limit
    if(this.finishedTasks.length < TaskController.CACHED_COUNT_LIMIT) return;

    // Keep track of counts per task type
    let coursesScanCount = 0;

    // Updates counts of task types
    function updateCounts(task){
      switch(task.type)
      {
        case Task.type.coursesScan:
          coursesScanCount++;
          break;

        default:
          break;
      }
    }

    // Returns false if cache rule is met, defaults to true
    function shouldRemove(task)
    {
      switch(task.type)
      {
        case Task.type.coursesScan:
          if(coursesScanCount < 2) return false;
          break;

        default:
          break;
      }
      return true
    }

    // Sort tasks from oldest to newest
    const tasks = this.finishedTasks.sort((a, b) => a.timeFinished - b.timeFinished);

    // Iterate over array of tasks from newest to oldest (backwards loop so tasks can be removed)
    for(let i = tasks.length - 1; i >= 0; i--)
    {
      updateCounts(tasks[i]);
      if(shouldRemove(tasks[i])) tasks.splice(i, 1);
    }

    Logger.debug(__dirname, "Cleared old tasks.\n" + tasks.toString());
    if(tasks.length >= TaskController.CACHED_COUNT_LIMIT) console.warn("Tasks length exceeds cache limit. Total tasks cached: " + tasks.length);
  }

  // Removes finished tasks from running tasks array
  #handleRunning()
  {
    for(let i = this.runningTasks.length - 1 ; i >= 0; i--)
    {
      // Ignore running tasks
      if(this.runningTasks[i].status === Task.status.running) continue;

      // Move to finished
      const task = this.runningTasks[i];
      this.finishedTasks.push(task);
      this.runningTasks.splice(i, 1);
    }
  }

  // Runs tasks that are not started
  #handleNew()
  {
    // Count down so tasks added back do not get scanned again this round
    for(let i = this.newTasks.length - 1; i >= 0; i--)
    {
      // Run task
      let task = this.newTasks.shift();

      // Do not start process intensive tasks if more than one is running
      if(this.runningTasks.findIndex((task) => task.type === Task.type.coursesScan) >= 0 && task.type === Task.type.coursesScan)
      {
        this.newTasks.push(task);
      }

      const isRunning = TaskRunner.runTask(task, this.appController);
      if(isRunning)
      {
        this.runningTasks.push(task);
        Logger.debug(__dirname, "Started task: \n" + task.toString());
      } else
      {
        this.finishedTasks.push(task);
        Logger.debug(__dirname, "Failed to start task: \n" + task.toString());
      }
    }
  }

  getTaskById(id)
  {
    let index = this.newTasks.findIndex((task) => task.id === id);
    if(index !== -1) return this.newTasks[index];

    index = this.runningTasks.findIndex((task) => task.id === id);
    if(index !== -1) return this.runningTasks[index]

    index = this.finishedTasks.findIndex((task) => task.id === id);
    if(index !== -1) return this.finishedTasks[index];

    return null;
  }

  getTaskByUuid(uuid)
  {
    let index = this.newTasks.findIndex((task) => task.uuid === uuid);
    if(index !== -1) return this.newTasks[index];

    index = this.runningTasks.findIndex((task) => task.uuid === uuid);
    if(index !== -1) return this.runningTasks[index]

    index = this.finishedTasks.findIndex((task) => task.uuid === uuid);
    if(index !== -1) return this.finishedTasks[index];

    return null;
  }

  getTasksByType(type)
  {
    const tasks = [];

    this.newTasks.forEach((task) =>
    {
      if(task.type === type) tasks.push(task)
    });

    this.runningTasks.forEach((task) =>
    {
      if(task.type === type) tasks.push(task)
    });

    this.finishedTasks.forEach((task) =>
    {
      if(task.type === type) tasks.push(task)
    });

    if(tasks.length > 0) return tasks;

    return null;
  }

  stopTask(taskId)
  {
    if(taskId === null) return false;

    const task = this.getTaskById(taskId);
    if(!task)
    {
      console.warn("No task for received task id")
      return false;
    }

    task.controller.stop();
    return true;
  }
}