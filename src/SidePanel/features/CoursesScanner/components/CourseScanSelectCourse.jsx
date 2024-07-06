import PrimaryCard from "../../../components/shared/cards/PrimaryCard.jsx";
import ButtonPrimary from "../../../components/shared/buttons/ButtonPrimary.jsx";
import ScanModeDropdown from "./ScanModeDropdown.jsx";
import {useContext, useMemo} from "react";
import {AppStateContext} from "../../../App.jsx";
import SelectCourse from "./SelectCourse.jsx";

function CourseScanSelectCourse({scanType, setScanType, setCourseIds}) {
  const appState = useContext(AppStateContext);

  function updateActiveTabCourseId()
  {
    const pattern = /courses\/(\d+)/
    const matches = appState.activeTab?.url.match(pattern);
    if(matches && matches.length >= 2) return matches[1];
    return null;
  }
  const activeTabCourseId = useMemo(updateActiveTabCourseId, [appState]);

  function updateScanType(type)
  {
    setScanType([type]);
  }

  return (
    <PrimaryCard fixedWidth={true}>
      <div className="grid grid-cols-1 grid-flow-row start justify-start content-start gap-2">
        <h3 className="text-gray-700 text-xl text-center">Select Course(s)</h3>
        <div className={`flex flex-col gap-2`}>
          <ScanModeDropdown value={scanType[0]} onChange={updateScanType}/>
          {scanType[0] === "single-course" &&
            (
              <SelectCourse courseId={activeTabCourseId} setCourseIds={setCourseIds} />
            )}
        </div>
      </div>
    </PrimaryCard>
  )
}

export default CourseScanSelectCourse;