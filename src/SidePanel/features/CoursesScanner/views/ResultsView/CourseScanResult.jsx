import PrimaryCard from "../../../../components/shared/cards/PrimaryCard.jsx";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  CaretSortIcon
} from "@radix-ui/react-icons";
import {useState} from "react";
import CaretUnsortIcon from "../../../../components/shared/icons/CaretUnsortIcon.jsx";

function CourseScanResult({courseScanResults, defaultOpen = false})
{
  const [open, setOpen] = useState(defaultOpen);

  return (
    <PrimaryCard fixedWidth={false} minHeight={false} className="w-full">
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <div className="flex flex-row items-start gap-1">
          <h3 className="basis-full text-xl text-Left">
            <a href="#" target="_blank" title="Link to course"
               className="text-blue-600 hover:text-blue-500 hover:underline active:text-blue-400">Course title that is
              very exteremely very very (COURSE ID) long goes here</a>
          </h3>
          <Collapsible.Trigger
            className="text-blue-600 hover:text-blue-500 hover:bg-white hover:shadow-sm active:text-blue-400 active:shadow-inner">
            {open ?
              <CaretUnsortIcon className="w-9 h-9"/>
              :
              <CaretSortIcon className="w-9 h-9"/>}
          </Collapsible.Trigger>
        </div>
        <div
          className="w-full sm:w-fit flex flex-col sm:flex-row flex-wrap justify-start items-center content-center gap-2">
          <p
            className="w-full sm:w-fit px-2 py-1 text-sm text-green-600 bg-green-200 font-bold text-center rounded-full">Published</p>
          <p className="w-full sm:w-fit px-2 py-1 text-sm text-gray-400 bg-gray-100 text-center rounded-full"><span
            className="inline-block font-bold">Course Code: </span>AAA-1003-POL</p>
          <p className="w-full sm:w-fit px-2 py-1 text-sm text-gray-400 bg-gray-100 text-center rounded-full"><span
            className="inline-block font-bold">SIS ID: </span>1234567890</p>
        </div>
        <Collapsible.Content>
          <p>Assignments</p>
          <p>Discussions</p>
        </Collapsible.Content>
      </Collapsible.Root>
    </PrimaryCard>
  )
}

export default CourseScanResult;