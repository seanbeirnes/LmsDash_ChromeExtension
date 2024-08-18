import PrimaryCardLayout from "../../../../components/shared/cards/PrimaryCardLayout.jsx";
import useTaskById from "../../../../hooks/useTaskById.js";
import ProgressSpinner from "../../../../components/shared/progress/ProgressSpinner.jsx";
import PrimaryCard from "../../../../components/shared/cards/PrimaryCard.jsx";
import * as Progress from "@radix-ui/react-progress";
import Task from "../../../../../shared/models/Task.js";
import ButtonPrimaryDanger from "../../../../components/shared/buttons/ButtonPrimaryDanger.jsx";
import ButtonPrimary from "../../../../components/shared/buttons/ButtonPrimary.jsx";
import {DownloadIcon} from "@radix-ui/react-icons";
import IconButton from "../../../../components/shared/buttons/IconButton.jsx";

function ResultsView({taskId, scanAgainCallback})
{
  const {isPending, isError, data, error} = useTaskById(taskId);

  if(isPending || !data)
  {
    return (
      <ProgressSpinner />
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
            <IconButton animated={false} onClick={handleDownloadClick} className="text-blue-500 hover:text-blue-400 hover:shadow active:text-blue-400 active:shadow-inner">
              <DownloadIcon className="w-10 h-10 p-1"/>
            </IconButton>
          </div>
        </div>
      </PrimaryCard>
      <p>{JSON.stringify(data)}</p>
    </PrimaryCardLayout>
  )
}

export default ResultsView;