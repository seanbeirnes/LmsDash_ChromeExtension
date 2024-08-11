import PrimaryCardLayout from "../../../components/shared/cards/PrimaryCardLayout.jsx";
import PrimaryCard from "../../../components/shared/cards/PrimaryCard.jsx";
import * as Progress from '@radix-ui/react-progress';
import ButtonPrimaryDanger from "../../../components/shared/buttons/ButtonPrimaryDanger.jsx";
import {useEffect, useState} from "react";

function ScanProgressView({stopScanCallback})
{
  const [progress, setProgress] = useState(50)

  useEffect(() =>
  {
    const timer = setTimeout(() => setProgress(88), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PrimaryCardLayout>
      <PrimaryCard fixedWidth={false} className="w-full">
        <div className="grid grid-cols-1 grid-flow-row start justify-start content-start gap-2">
          <h2 className="text-gray-700 text-xl text-center font-bold">Scanning course 1 of 2000</h2>
          <Progress.Root className="relative overflow-hidden bg-gray-200 rounded-full w-full h-6 shadow-inner"
                         style={{transform: "translateZ(0)"}}
                         value={progress}>
            <Progress.Indicator className="bg-blue-400 w-full h-full transition-transform duration-500 ease-in-out"
                                style={{transform: `translateX(-${100 - progress}%)`}}/>
            <span className="absolute top-0 w-full h-full text-center text-gray-700">{progress}%</span>
          </Progress.Root>
          <p className="text-gray-700 text-base text-left">Scanning pages in course 2023-AAA-3333-1OL</p>
        </div>
        <div className="justify-self-center self-end w-full max-w-sm">
          <ButtonPrimaryDanger onClick={stopScanCallback}>Stop Scan</ButtonPrimaryDanger>
        </div>
      </PrimaryCard>
    </PrimaryCardLayout>
  )
}

export default ScanProgressView;