import PrimaryCard from "../../../components/shared/cards/PrimaryCard.jsx";
import * as Switch from '@radix-ui/react-switch';

function CourseScanSelectItems({scannedItems, setScannedItems})
{
  // TO-DO: Check if user has access to API for each of the items. If not, disabled it
  function handleSwitchChange(value)
  {
    const index = scannedItems.indexOf(value);
    if(index >= 0)
    {
      setScannedItems(scannedItems.filter(item => item !== value))
    }
    else
    {
      setScannedItems([...scannedItems, value]);
    }
  }

  const switchRootClasses = "relative w-8 h-5 bg-gray-200 data-[state='checked']:bg-blue-500 shadow-inner rounded-full";
  const switchThumbClasses = "block w-4 h-4 bg-white shadow-sm transition-all translate-x-0.5 data-[state='checked']:translate-x-[0.85rem] rounded-full";
  const switchLabelClasses = "text-base text-gray-700";

  return (
    <PrimaryCard fixedWidth={true}>
      <div className="grid grid-cols-1 grid-flow-row start justify-start content-start gap-2">
        <h3 className="text-gray-700 text-xl text-center">Scanned Items</h3>
        <div className="flex items-center gap-2">
          <Switch.Root id="announcements"
                       className={switchRootClasses}
                       checked={scannedItems.indexOf("announcements") >= 0}
                       onCheckedChange={() => handleSwitchChange("announcements")}>
            <Switch.Thumb className={switchThumbClasses}/>
          </Switch.Root>
          <label className={switchLabelClasses} htmlFor="announcements">
            Announcements
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Switch.Root id="assignments"
                       className={switchRootClasses}
                       checked={scannedItems.indexOf("assignments") >= 0}
                       onCheckedChange={() => handleSwitchChange("assignments")}>
            <Switch.Thumb className={switchThumbClasses}/>
          </Switch.Root>
          <label className={switchLabelClasses} htmlFor="assignments">
            Assignments
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Switch.Root id="course-nav-links"
                       className={switchRootClasses}
                       checked={scannedItems.indexOf("course-nav-links") >= 0}
                       onCheckedChange={() => handleSwitchChange("course-nav-links")}>
            <Switch.Thumb className={switchThumbClasses}/>
          </Switch.Root>
          <label className={switchLabelClasses} htmlFor="course-nav-links">
            Course Navigation Links
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Switch.Root id="discussions"
                       className={switchRootClasses}
                       checked={scannedItems.indexOf("discussions") >= 0}
                       onCheckedChange={() => handleSwitchChange("discussions")}>
            <Switch.Thumb className={switchThumbClasses}/>
          </Switch.Root>
          <label className={switchLabelClasses} htmlFor="discussions">
            Discussions
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Switch.Root id="file-names"
                       className={switchRootClasses}
                       checked={scannedItems.indexOf("file-names") >= 0}
                       onCheckedChange={() => handleSwitchChange("file-names")}>
            <Switch.Thumb className={switchThumbClasses}/>
          </Switch.Root>
          <label className={switchLabelClasses} htmlFor="file-names">
            File Names
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Switch.Root id="module-links"
                       className={switchRootClasses}
                       checked={scannedItems.indexOf("module-links") >= 0}
                       onCheckedChange={() => handleSwitchChange("module-links")}>
            <Switch.Thumb className={switchThumbClasses}/>
          </Switch.Root>
          <label className={switchLabelClasses} htmlFor="module-links">
            Module Links
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Switch.Root id="pages"
                       className={switchRootClasses}
                       checked={scannedItems.indexOf("pages") >= 0}
                       onCheckedChange={() => handleSwitchChange("pages")}>
            <Switch.Thumb className={switchThumbClasses}/>
          </Switch.Root>
          <label className={switchLabelClasses} htmlFor="pages">
            Pages
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Switch.Root id="syllabus"
                       className={switchRootClasses}
                       checked={scannedItems.indexOf("syllabus") >= 0}
                       onCheckedChange={() => handleSwitchChange("syllabus")}>
            <Switch.Thumb className={switchThumbClasses}/>
          </Switch.Root>
          <label className={switchLabelClasses} htmlFor="syllabus">
            Syllabus
          </label>
        </div>
      </div>
    </PrimaryCard>
  )
}

export default CourseScanSelectItems;