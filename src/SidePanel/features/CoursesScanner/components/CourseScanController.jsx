import CourseScanSelectItems from "./CourseScanSelectItems.jsx";
import {useState} from "react";
import PrimaryCardLayout from "../../../components/shared/cards/PrimaryCardLayout.jsx";
import CourseScanSelectSettings from "./CourseScanSelectSettings.jsx";
import CourseScanSelectSearchTerms from "./CourseScanSelectSearchTerms.jsx";
import CourseScanSelectCourse from "./CourseScanSelectCourse.jsx";
import Logger from "../../../../shared/utils/Logger.js";
import GenericErrorMessage from "../../../components/shared/error/GenericErrorMessage.jsx";
import AlertModal from "../../../components/modals/AlertModal.jsx";

const VIEW_STATE = {
  settings: "settings-view",
  progress: "progress-view",
  results: "results-view",
  error: "error"
}

const SETTINGS_VIEW_MODAL_TITLES = {
  startScanError: "Cannot Start Scan",
}

function CourseScanController()
{
  const [viewState, setViewState] = useState(VIEW_STATE.settings);
  const [scanType, setScanType] = useState(["single-course"]);
  const [courseIds, setCourseIds] = useState([]);
  const [searchTerms, setSearchTerms] = useState([""]);
  const [scannedItems, setScannedItems] = useState([]);
  const [settings, setSettings] = useState([]);
  const [settingsViewModalOptions, setSettingsViewModalOptions] = useState({
    title: SETTINGS_VIEW_MODAL_TITLES.startScanError,
    text: ""
  });

  function isScanReady()
  {
    let errorMessage = "";

    if(scannedItems.length < 1) errorMessage = "Please select at least one item type to scan.";
    if(searchTerms.length === 0 || searchTerms[0].length === 0) errorMessage = "Please add at least one search term for scanning.";
    if(scanType[0] === "single-course" && courseIds.length !== 1) errorMessage = "Please select a course.";
    if(scanType[0] === "term" && scanType.length < 2) errorMessage = "Please select a term.";
    if(scanType.length === 0) errorMessage = "Error: No scan type selected.";

    if(errorMessage)
    {
      setSettingsViewModalOptions(
        {
          title: SETTINGS_VIEW_MODAL_TITLES.startScanError,
          text: errorMessage,
        }
      )

      return false;
    }

    return true;
  }

  function handleRunScan()
  {
    Logger.debug(__dirname, `\n${scanType}\n${courseIds}\n${searchTerms}\n${scannedItems}\n${settings}`)

    if(!isScanReady()) return false;

    setViewState(VIEW_STATE.progress);
  }

  if(viewState === VIEW_STATE.progress)
  {
    return (
      <PrimaryCardLayout>
        <p>Progress view...</p>
      </PrimaryCardLayout>
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
      <>
        <PrimaryCardLayout>
          <CourseScanSelectCourse scanType={scanType} setScanType={setScanType} setCourseIds={setCourseIds}/>
          <CourseScanSelectSearchTerms searchTerms={searchTerms} setSearchTerms={setSearchTerms}/>
          <CourseScanSelectItems scannedItems={scannedItems} setScannedItems={setScannedItems} scanType={scanType}/>
          <CourseScanSelectSettings settings={settings} setSettings={setSettings} runScanCallback={handleRunScan}/>
        </PrimaryCardLayout>
        <AlertModal open={settingsViewModalOptions.text.length > 0}
                    title={settingsViewModalOptions.title}
                    actionCallback={() => setSettingsViewModalOptions(
                      {
                        title: "",
                        text: ""
                      }
                    )}>
          {settingsViewModalOptions.text}
        </AlertModal>
      </>
    )
  } else
  {
    return (
      <GenericErrorMessage/>
    )
  }
}

export default CourseScanController;