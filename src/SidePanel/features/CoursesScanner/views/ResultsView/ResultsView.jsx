import PrimaryCardLayout from "../../../../components/shared/cards/PrimaryCardLayout.jsx";
import useTaskById from "../../../../hooks/useTaskById.js";
import ProgressSpinner from "../../../../components/shared/progress/ProgressSpinner.jsx";
import PrimaryCard from "../../../../components/shared/cards/PrimaryCard.jsx";
import * as Progress from "@radix-ui/react-progress";
import ButtonPrimary from "../../../../components/shared/buttons/ButtonPrimary.jsx";
import {DownloadIcon} from "@radix-ui/react-icons";
import IconButton from "../../../../components/shared/buttons/IconButton.jsx";
import CourseScanResult from "./CourseScanResult.jsx";
import * as Tooltip from "@radix-ui/react-tooltip";

function ResultsView({taskId, scanAgainCallback})
{
  const {isPending, isError, data, error} = useTaskById(taskId);

  if(isPending || !data)
  {
    return (
      <ProgressSpinner/>
    )
  }

  function handleDownloadClick()
  {
    console.log("TO DO: Export as CSV");
  }

  return (
    <PrimaryCardLayout>
      <PrimaryCard fixedWidth={false} minHeight={false} className="w-full">
        <div className="grid grid-cols-1 grid-flow-row start justify-start content-start gap-2">
          <h2
            className="text-gray-700 text-xl text-center font-bold">{data.progressData.length > 0 ? data.progressData[0] : " "}</h2>
          <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full w-full h-6 shadow-inner"
                         style={{transform: "translateZ(0)"}}
                         value={data.progress ? data.progress : 0}>
            <Progress.Indicator className="bg-blue-400 w-full h-full transition-transform duration-500 ease-in-out"
                                style={{transform: `translateX(-${100 - (data.progress ? data.progress : 0)}%)`}}/>
            <span
              className="absolute top-0 w-full h-full text-center text-gray-700">{data.progress ? data.progress : 0}%</span>
          </Progress.Root>
          <p
            className="text-gray-700 text-base text-left mb-4">{`Items found in ${data.resultsData.length} course(s).`}</p>
        </div>
        <div className="justify-self-center self-end w-full min-h16 flex justify-between items-center gap-4">
          <div className="hidden sm:block min-w-12">
          </div>
          <div className="w-full max-w-sm">
            <ButtonPrimary onClick={scanAgainCallback}>New Scan</ButtonPrimary>
          </div>
          <div>
            <Tooltip.Root>
              <IconButton animated={false} onClick={handleDownloadClick}
                          className="text-blue-500 hover:text-blue-400 hover:shadow active:text-blue-400 active:shadow-inner">
                <Tooltip.Trigger asChild>
                  <DownloadIcon className="w-10 h-10 p-1"/>
                </Tooltip.Trigger>
              </IconButton>
              <Tooltip.Content className="select-none p-2 bg-white rounded shadow-xl animate__animated animate__fadeIn"
                               sideOffset={0}
                               side={"bottom"}>
                Download results as CSV file
                <Tooltip.Arrow className="fill-white"/>
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
        </div>
      </PrimaryCard>
      {
        data.resultsData?.length < 1 ?
          <p className="text-lg text-gray-700 text-center font-bold">No scan results found.</p>
          :
          data.resultsData.map((course, index) =>
          {
            return <CourseScanResult id={course.id}
                                     name={course.name}
                                     courseCode={course.courseCode}
                                     sisCourseId={course.sisCourseId}
                                     published={course.published}
                                     url={course.url}
                                     items={course.items}
                                     defaultOpen={data.resultsData.length === 1}
                                     key={"course-id-"+ index} />
          })
      }
    </PrimaryCardLayout>
  )
}

export default ResultsView;