import {useContext, useState} from "react";
import PrimaryCardLayout from "../../../components/shared/cards/PrimaryCardLayout.jsx";
import GenericErrorMessage from "../../../components/shared/error/GenericErrorMessage.jsx";
import SettingsView from "../views/SettingsView/SettingsView.jsx";
import {VIEW_STATE} from "../enums/enums.js";
import Logger from "../../../../shared/utils/Logger.js";
import ProgressView from "../views/ProgressView/ProgressView.jsx";
import {Message} from "../../../../shared/models/Message.js";
import Task from "../../../../shared/models/Task.js";
import {CoursesScanSettings} from "../../../../shared/models/CoursesScanSettings.js";
import {useMutation} from "@tanstack/react-query";
import {UserInfoContext} from "../../../App.jsx";

function CourseScanController()
{
  const userInfo = useContext(UserInfoContext);

  const [viewState, setViewState] = useState(VIEW_STATE.settings);
  const [scanType, setScanType] = useState(["single-course"]);
  const [courseIds, setCourseIds] = useState([]);
  const [searchTerms, setSearchTerms] = useState([""]);
  const [scannedItems, setScannedItems] = useState([]);
  const [settings, setSettings] = useState([]);

  const createTask = useMutation({
  mutationFn: async (scanSettings) => {
    const msgResponse = await chrome.runtime.sendMessage(
      new Message(Message.Target.SERVICE_WORKER,
        Message.Sender.SIDE_PANEL,
        Message.Type.Task.Request.NEW,
        "New course scan request",
        new Task(Task.type.coursesScan, scanSettings))
    )
    return msgResponse.data
  }
})

  function runScanCallback()
  {
    Logger.debug(__dirname, `\n${scanType}\n${courseIds}\n${searchTerms}\n${scannedItems}\n${settings}\n${userInfo.lmsInstance}`)
    createTask.mutate(new CoursesScanSettings(scanType, courseIds, searchTerms, scannedItems, settings, userInfo.lmsInstance));

    // Clear term id to prevent running scan again without a selected term in the UI
    if(scanType[0] === "term") setScanType(["term"]);

    setViewState(VIEW_STATE.progress);
  }

  function stopScanCallback()
  {
    Logger.debug(__dirname, "Stopping Scan");
    setViewState(VIEW_STATE.settings);
  }

  if(viewState === VIEW_STATE.progress)
  {
    return (
      <ProgressView stopScanCallback={stopScanCallback} />
    )
  } else if(viewState === VIEW_STATE.results)
  {
    return (
      <PrimaryCardLayout>
        <p>Results view...</p>
      </PrimaryCardLayout>
    )
  } else if(viewState === VIEW_STATE.settings)
  {
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
  } else
  {
    return (
      <GenericErrorMessage/>
    )
  }
}

export default CourseScanController;