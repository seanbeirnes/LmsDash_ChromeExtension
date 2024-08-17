import PrimaryCardLayout from "../../../../components/shared/cards/PrimaryCardLayout.jsx";
import SelectScannedCourses from "./SelectScannedCourses.jsx";
import SelectSearchTerms from "./SelectSearchTerms.jsx";
import SelectScannedItems from "./SelectScannedItems.jsx";
import SelectScanSettings from "./SelectScanSettings.jsx";
import AlertModal from "../../../../components/modals/AlertModal.jsx";
import {useState} from "react";

const SETTINGS_VIEW_MODAL_TITLES = {
  startScanError: "Cannot Start Scan",
}

function SettingsView({
                            scanType,
                            setScanType,
                            courseIds,
                            setCourseIds,
                            searchTerms,
                            setSearchTerms,
                            scannedItems,
                            setScannedItems,
                            settings,
                            setSettings,
                            runScanCallback
                          })
{
  const [settingsViewModalOptions, setSettingsViewModalOptions] = useState({
    title: SETTINGS_VIEW_MODAL_TITLES.startScanError,
    text: ""
  });

  function isScanReady()
  {
    let errorMessage = "";

    if(scannedItems.length < 1) errorMessage = "Please select at least one item type to scan.";
    if(searchTerms.length === 0 || searchTerms[0].trim().length === 0) errorMessage = "Please add at least one search term for scanning.";
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
    if(!isScanReady()) return false;
    runScanCallback();
    return true;
  }

  return (
    <>
      <PrimaryCardLayout>
        <SelectScannedCourses scanType={scanType} setScanType={setScanType} setCourseIds={setCourseIds}/>
        <SelectSearchTerms searchTerms={searchTerms} setSearchTerms={setSearchTerms}/>
        <SelectScannedItems scannedItems={scannedItems} setScannedItems={setScannedItems} scanType={scanType}/>
        <SelectScanSettings settings={settings} setSettings={setSettings} runScanCallback={handleRunScan}/>
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
}

export default SettingsView;