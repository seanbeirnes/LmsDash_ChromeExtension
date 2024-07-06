import * as Select from "@radix-ui/react-select";
import {CheckIcon, ChevronDownIcon, ChevronUpIcon} from "@radix-ui/react-icons";
import {forwardRef} from "react";

function ScanModeDropdown({value, onChange}) {
 return (
   <Select.Root value={value} onValueChange={(value) => onChange(value)}>
     <Select.Trigger className={"inline-flex items-center justify-between rounded px-4 text-base leading-none h-9 gap-1 bg-white text-blue-600 hover:text-blue-500 active:text-blue-400 data-[placeholder]:text-gray-200 outline-none border-2 border-gray-200 shadow-inner"}>
       <Select.Value/>
       <Select.Icon>
         <ChevronDownIcon className="w-6 h-6"/>
       </ Select.Icon>
     </Select.Trigger>

     <Select.Portal>
       <Select.Content className={"overflow-hidden bg-white rounded shadow-md"}>
         <Select.ScrollUpButton className={"flex items-center justify-center h-6 bg-white text-blue-600 cursor-default"}>
         <ChevronUpIcon />
         </Select.ScrollUpButton>
         <Select.Viewport className={"p-1"}>
             <SelectItem value={"single-course"}>Single Course</SelectItem>
             <SelectItem value={"term"}>Term</SelectItem>
             <SelectItem value={"csv-import"} disabled>CSV Import</SelectItem>
         </Select.Viewport>
         <Select.ScrollDownButton  className={"flex items-center justify-center h-6 bg-white text-blue-600 cursor-default"}>
          <ChevronDownIcon />
         </Select.ScrollDownButton>
         <Select.Arrow />
       </Select.Content>
     </Select.Portal>
   </Select.Root>
 )
}

const SelectItem = forwardRef(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={
        "text-sm leading-none text-blue-600 rounded flex items-center h-6 pr-8 pl-6 relative select-none data-[disabled]:text-gray-200 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
      }
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

export default ScanModeDropdown;