import PrimaryCard from "../../../components/shared/cards/PrimaryCard.jsx";
import ButtonPrimary from "../../../components/shared/buttons/ButtonPrimary.jsx";
import ScanModeDropdown from "./ScanModeDropdown.jsx";

function CourseScanSelectCourse({scanType, setScanType}) {
  function updateScanType(type)
  {
    console.log(type);
    setScanType([type]);
  }

  return (
    <PrimaryCard fixedWidth={true}>
      <div className="grid grid-cols-1 grid-flow-row start justify-start content-start gap-2">
        <h3 className="text-gray-700 text-xl text-center">Select Course(s)</h3>
        <div className={`flex flex-col gap-2`}>

          <ScanModeDropdown value={scanType[0]} onChange={updateScanType}/>
        </div>
      </div>
      <div className="self-end">
        <ButtonPrimary>
          <span>Select This Course</span>
        </ButtonPrimary>
      </div>
    </PrimaryCard>
  )
}

export default CourseScanSelectCourse;