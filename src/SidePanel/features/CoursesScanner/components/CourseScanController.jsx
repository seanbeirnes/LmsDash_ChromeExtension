import CourseScanSelectItems from "./CourseScanSelectItems.jsx";
import {useState} from "react";
import PrimaryCardLayout from "../../../components/shared/cards/PrimaryCardLayout.jsx";
import CourseScanSelectSettings from "./CourseScanSelectSettings.jsx";
import CourseScanSelectSearchTerms from "./CourseScanSelectSearchTerms.jsx";
import CourseScanSelectCourse from "./CourseScanSelectCourse.jsx";
import Logger from "../../../../shared/utils/Logger.js";

function CourseScanController()
{
  const [scanType, setScanType] = useState(["single-course"]);
  const [courseIds, setCourseIds] = useState([]);
  const [searchTerms, setSearchTerms] = useState([""]);
  const [scannedItems, setScannedItems] = useState([]);
  const [settings, setSettings] = useState([]);
  const [error, setError] = useState([]);

  return(
    <PrimaryCardLayout>
      <CourseScanSelectCourse scanType={scanType} setScanType={setScanType} setCourseIds={setCourseIds} />
      <CourseScanSelectSearchTerms searchTerms={searchTerms} setSearchTerms={setSearchTerms} />
      <CourseScanSelectItems scannedItems={scannedItems} setScannedItems={setScannedItems} scanType={scanType} />
      <CourseScanSelectSettings settings={settings} setSettings={setSettings} runScanCallback={ () => Logger.debug(__dirname,
        `${scanType}\n${courseIds}\n${searchTerms}\n${scannedItems}\n${settings}\n${error}`)
      }/>
    </PrimaryCardLayout>
  )
}

export default CourseScanController;