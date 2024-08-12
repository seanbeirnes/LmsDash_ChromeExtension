import Logger from "../shared/utils/Logger.js";
import TaskRunner from "./TaskRunner.js";
import Task from "../shared/models/Task.js";

export default class TaskController
{
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

  runTasks()
  {
    while(this.newTasks.length > 0)
    {
      const task = this.newTasks.shift();
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
}