import PrimaryCard from "../../../components/shared/cards/PrimaryCard.jsx";
import ScanModeDropdown from "./ScanModeDropdown.jsx";
import {useContext} from "react";
import {AppStateContext} from "../../../App.jsx";
import SelectCourse from "./SelectCourse.jsx";
import SelectTerm from "./SelectTerm.jsx";

function CourseScanSelectCourse({scanType, setScanType, setCourseIds}) {
  const appState = useContext(AppStateContext);

  function updateScanType(type)
  {
    setScanType([type]);
    setCourseIds([]);
  }

  return (
    <PrimaryCard fixedWidth={true}>
      <div className="grid grid-cols-1 grid-flow-row start justify-start content-start gap-2">
        <h3 className="text-gray-700 text-xl text-center">{appState.isAdmin ? "Select Course(s)" : "Selected Course"}</h3>
        <div className={`flex flex-col gap-2`}>
          {appState.isAdmin && (<ScanModeDropdown value={scanType[0]} onChange={updateScanType}/>)}
          {scanType[0] === "single-course" &&
            (
              <SelectCourse courseId={appState.activeTabCourseId} setCourseIds={setCourseIds} />
            )}
          {scanType[0] === "term" &&
            (
              <SelectTerm setScanType={setScanType} />
            )}
        </div>
      </div>
    </PrimaryCard>
  )
}

export default CourseScanSelectCourse;