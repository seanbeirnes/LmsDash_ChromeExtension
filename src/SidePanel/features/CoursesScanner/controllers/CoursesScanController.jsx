import {useContext, useEffect, useState} from "react";
import PrimaryCardLayout from "../../../components/shared/cards/PrimaryCardLayout.jsx";
import SettingsView from "../views/SettingsView/SettingsView.jsx";
import Logger from "../../../../shared/utils/Logger.js";
import ProgressView from "../views/ProgressView/ProgressView.jsx";
import {Message} from "../../../../shared/models/Message.js";
import Task from "../../../../shared/models/Task.js";
import {CoursesScanSettings} from "../../../../shared/models/CoursesScanSettings.js";
import {useMutation} from "@tanstack/react-query";
import {UserInfoContext} from "../../../App.jsx";
import ProgressSpinner from "../../../components/shared/progress/ProgressSpinner.jsx";
import useTasksByType from "../../../hooks/useTasksByType.js";

function CoursesScanController()
{
  const userInfo = useContext(UserInfoContext);

  // Controller state
  const [runningTaskId, setRunningTaskId] = useState(null);
  const [lastScannedTaskId, setLastScannedTaskId] = useState(null);
  const [completedTaskId, setCompletedTaskId] = useState(null);

  // Scan Settings
  const [scanType, setScanType] = useState(["single-course"]);
  const [courseIds, setCourseIds] = useState([]);
  const [searchTerms, setSearchTerms] = useState([""]);
  const [scannedItems, setScannedItems] = useState([]);
  const [settings, setSettings] = useState([]);

  // Find running tasks and previously completed tasks
  const {isPending, isError, data, error} = useTasksByType(Task.type.coursesScan);

  useEffect(() =>
  {
    if(data)
    {
      data.forEach( (task) => {
        if(runningTaskId === null && task.status === Task.status.running) setRunningTaskId(task.id);
        if(lastScannedTaskId === null && task.status === Task.status.complete) setLastScannedTaskId(task.id);
      })
    }

  }, [data, runningTaskId, lastScannedTaskId]);

  ////// FOR TESTING: Test Messages for getting Tasks
  // async function testMessages()
  // {
  //
  //   const taskById = await chrome.runtime.sendMessage(
  //     new Message(Message.Target.SERVICE_WORKER,
  //       Message.Sender.SIDE_PANEL,
  //       Message.Type.Task.Request.BY_ID,
  //       "Id",
  //       0)
  //   )
  //   console.log(taskById);
  // }
  //
  // testMessages();
  ////// END FOR TESTING

  const createTask = useMutation({
  mutationFn: async (scanSettings) => {
    const msgResponse = await chrome.runtime.sendMessage(
      new Message(Message.Target.SERVICE_WORKER,
        Message.Sender.SIDE_PANEL,
        Message.Type.Task.Request.NEW,
        "New course scan request",
        new Task(Task.type.coursesScan, scanSettings))
    )
    return msgResponse.data // returns
  },
    onSuccess: (task) => {if(task !== null) setRunningTaskId(task.id)}
})

  const stopTask = useMutation({
    mutationFn: async (taskId) => {
      const msgResponse = await chrome.runtime.sendMessage(
        new Message(Message.Target.SERVICE_WORKER,
          Message.Sender.SIDE_PANEL,
          Message.Type.Task.Request.STOP,
          "Stop scan task request",
          taskId)
      );
      return msgResponse.data
    },
    onSuccess: (success) => {if(success) setRunningTaskId(null)}
  })

  function runScanCallback()
  {
    Logger.debug(__dirname, `\n${scanType}\n${courseIds}\n${searchTerms}\n${scannedItems}\n${settings}\n${userInfo.lmsInstance}`)
    createTask.mutate(new CoursesScanSettings(scanType, courseIds, searchTerms, scannedItems, settings, userInfo.lmsInstance));

    // Clear term id to prevent running scan again without a selected term in the UI
    if(scanType[0] === "term") setScanType(["term"]);
  }

  function stopScanCallback()
  {
    Logger.debug(__dirname, "Stopping Scan");
    stopTask.mutate(runningTaskId);
  }

  // If waiting on Service Worker message
  if(isPending)
  {
    return (
      <ProgressSpinner />
    )
  }

  // If a scan is running
  if(runningTaskId !== null)
  {
    return (
      <ProgressView taskId={runningTaskId} stopScanCallback={stopScanCallback} />
    )
  }

  // If the scan is complete
  if(completedTaskId !== null)
  {
    return (
      <PrimaryCardLayout>
        <p>Results view...</p>
      </PrimaryCardLayout>
    )
  }

  // Otherwise, show the settings view
  return (
      <SettingsView scanType={scanType}
                    setScanType={setScanType}
                    courseIds={courseIds}
                    setCourseIds={setCourseIds}
                    searchTerms={searchTerms}
                    setSearchTerms={setSearchTerms}
                    scannedItems={scannedItems}
                    setScannedItems={setScannedItems}
                    settings={settings}
                    setSettings={setSettings}
                    runScanCallback={runScanCallback} />
    )
}

export default CoursesScanController;