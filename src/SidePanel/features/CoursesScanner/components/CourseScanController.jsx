import {useState} from "react";
import PrimaryCardLayout from "../../../components/shared/cards/PrimaryCardLayout.jsx";
import GenericErrorMessage from "../../../components/shared/error/GenericErrorMessage.jsx";
import ScanSettingsView from "./ScanSettingsView.jsx";
import {VIEW_STATE} from "../enums/enums.js";
import Logger from "../../../../shared/utils/Logger.js";

function CourseScanController()
{
  const [viewState, setViewState] = useState(VIEW_STATE.settings);
  const [scanType, setScanType] = useState(["single-course"]);
  const [courseIds, setCourseIds] = useState([]);
  const [searchTerms, setSearchTerms] = useState([""]);
  const [scannedItems, setScannedItems] = useState([]);
  const [settings, setSettings] = useState([]);

  function runScanCallback()
  {
    Logger.debug(__dirname, `\n${scanType}\n${courseIds}\n${searchTerms}\n${scannedItems}\n${settings}`)
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
      <ScanSettingsView scanType={scanType}
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