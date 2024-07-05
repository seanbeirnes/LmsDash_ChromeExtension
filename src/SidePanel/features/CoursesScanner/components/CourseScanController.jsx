import CourseScanSelectItems from "./CourseScanSelectItems.jsx";
import {useState} from "react";
import PrimaryCardLayout from "../../../components/shared/cards/PrimaryCardLayout.jsx";
import CourseScanSelectSettings from "./CourseScanSelectSettings.jsx";

function CourseScanController()
{
  const [scanType, setScanType] = useState([]);
  const [courseIds, setCourseIds] = useState([]);
  const [searchTerms, setSearchTerms] = useState([]);
  const [scannedItems, setScannedItems] = useState([
    "announcements",
    "assignments",
    "course-nav-links",
    "discussions",
    "module-links",
    "pages",
    "syllabus"
  ]);
  const [settings, setSettings] = useState([]);
  const [error, setError] = useState([]);

  return(
    <PrimaryCardLayout>
      <CourseScanSelectItems scannedItems={scannedItems} setScannedItems={setScannedItems} error={error}/>
      <CourseScanSelectSettings settings={settings} setSettings={setSettings} runScanCallback={ () => console.log(
        scanType,
        courseIds,
        searchTerms,
        scannedItems,
        settings,
        error) }/>
    </PrimaryCardLayout>
  )
}

export default CourseScanController;