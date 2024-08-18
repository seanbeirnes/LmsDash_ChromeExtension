import PrimaryCardLayout from "../../../../components/shared/cards/PrimaryCardLayout.jsx";
import PrimaryCard from "../../../../components/shared/cards/PrimaryCard.jsx";
import * as Progress from '@radix-ui/react-progress';
import ButtonPrimaryDanger from "../../../../components/shared/buttons/ButtonPrimaryDanger.jsx";
import useTaskProgress from "../../../../hooks/useTaskProgress.js";
import ProgressSpinner from "../../../../components/shared/progress/ProgressSpinner.jsx";
import Task from "../../../../../shared/models/Task.js";
import {useEffect, useState} from "react";
import GenericErrorMessage from "../../../../components/shared/error/GenericErrorMessage.jsx";

function ProgressView({taskId, viewResultsCallback, stopScanCallback})
{
  const [scanError, setScanError] = useState(false);
  const [stoppingScan, setStoppingScan] = useState(false);
  const {isProgress, isError, data, error} = useTaskProgress(taskId, 500);

  useEffect(() =>
  {
    if(!data || !data.status) return;
    if(data.status === Task.status.complete) viewResultsCallback();
    if(data.status === Task.status.failed && !stoppingScan) setScanError(true);
  }, [data, viewResultsCallback]);

  function handleStopScanClick()
  {
    setStoppingScan(true);
    stopScanCallback();
  }

  if(scanError)
  {
    return (
      <GenericErrorMessage/>
    )
  }

  if(isProgress || !data || !data.progressData || data.progressData.length === 0 || data.progressData[0] === "Gathering courses...")
  {
    return (
      <PrimaryCardLayout>
        <PrimaryCard fixedWidth={false} minHeight={false} className="w-full min-h-52">
          <div className="self-stretch grid grid-cols-1 grid-flow-row justify-start content-start gap-2">
            <h2
              className="text-gray-700 text-xl text-center font-bold">{(data && data.progressData && data.progressData.length > 0) ? data.progressData[0] : "Fetching data..."}</h2>
          </div>
          <div className="flex justify-center">
            <ProgressSpinner/>
          </div>
          <div className="justify-self-center self-end w-full max-w-sm">
            <ButtonPrimaryDanger onClick={stopScanCallback}
                                 disabled={data && data.status ? data.status !== Task.status.running : false}>Stop
              Scan</ButtonPrimaryDanger>
          </div>
        </PrimaryCard>
      </PrimaryCardLayout>
    )
  }

  return (
    <PrimaryCardLayout>
      <PrimaryCard fixedWidth={false} minHeight={false} className="w-full min-h-52">
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
            className="text-gray-700 text-base text-left">{(data.progressData && data.progressData.length > 1) ? data.progressData[1] : " "}</p>
        </div>
        <div className="justify-self-center self-end w-full max-w-sm">
          <ButtonPrimaryDanger onClick={handleStopScanClick} disabled={data && data.status !== Task.status.running}>Stop
            Scan</ButtonPrimaryDanger>
        </div>
      </PrimaryCard>
    </PrimaryCardLayout>
  )
}

export default ProgressView;