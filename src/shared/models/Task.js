export default class Task
{
  constructor(type, settingsData = null)
  {
    this.id = -1;
    this.uuid = crypto.randomUUID();
    this.type = type;
    this.status = Task.status.notStarted;
    this.timeCreated = Date.now();
    this.timeStarted = null;
    this.timeUpdated = Date.now();
    this.timeFinished = null;
    this.progress = 0;
    this.progressData = null;
    this.errorsData = null;
    this.settingsData = settingsData;
    this.resultsData = null;
    this.controller = null;
  }

  #updateTime()
  {
    this.timeUpdated = Date.now();
  }

  getId()
  {
    return this.id;
  }

  setId(id)
  {
    this.id = id;
  }

  getUuid()
  {
    return this.uuid;
  }

  getStatus()
  {
    return this.status;
  }

  setStatus(status)
  {
    this.status = status;
    this.#updateTime();
  }

  getTimes()
  {
    return {created: this.timeCreated, started: this.timeStarted, updated: this.timeUpdated, finished: this.timeFinished};
  }

  setTimeStarted()
  {
    this.timeStarted = Date.now();
    this.#updateTime();
  }

  setTimeFinished()
  {
    this.timeFinished = Date.now();
    this.#updateTime();
  }

  getProgress()
  {
    return this.progress;
  }

  setProgress(progress)
  {
    this.progress = progress;
    this.#updateTime();
  }

  getProgressData()
  {
    return this.progressData;
  }

  setProgressData(data)
  {
    this.progressData = data;
    this.#updateTime();
  }

  getErrorsData()
  {
    return this.errorsData;
  }

  setErrorsData(data)
  {
    this.errorsData = data;
    this.#updateTime();
  }

  getSettingsData()
  {
    return this.settingsData;
  }

  getResultsData()
  {
    return this.resultsData;
  }

  setResultsData(data)
  {
    this.resultsData = data;
    this.#updateTime();
  }

  toString() {
    return `ID: ${this.id}\n` +
      `UUID: ${this.uuid}\n` +
      `Type: ${this.type}\n` +
      `Status: ${this.status}\n` +
      `Time Created: ${new Date(this.timeCreated).toISOString()}\n` +
      `Time Started: ${this.timeStarted ? new Date(this.timeStarted).toISOString() : 'Not started'}\n` +
      `Time Updated: ${new Date(this.timeUpdated).toISOString()}\n` +
      `Time Finished: ${this.timeFinished ? new Date(this.timeFinished).toISOString() : 'Not finished'}\n` +
      `Progress: ${this.progress}\n` +
      `Progress Data: ${JSON.stringify(this.progressData)}\n` +
      `Errors Data: ${JSON.stringify(this.errorsData)}\n` +
      `Settings Data: ${JSON.stringify(this.settingsData)}\n` +
      `Results Data: ${JSON.stringify(this.resultsData)}`;
  }

  // STATIC ENUMS
  static type = {
    coursesScan: "courses-scan",
  }

  static status = {
    notStarted: "not-started",
    running: "running",
    paused: "paused",
    complete: "complete",
    failed: "failed"
  }
}