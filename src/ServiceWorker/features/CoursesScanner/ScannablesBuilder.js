import Scannable from "./Scannable.js";

export default class ScannablesBuilder
{
  // Creates the starting array of scannables from a scannedItems array in scanSettings
  static build(scannedItems)
  {
    const scannables = [];

    if(scannedItems.includes(Scannable.Type.ANNOUNCEMENT))
    {
      scannables.push(new Scannable(Scannable.Type.ANNOUNCEMENT));
    }

    if(scannedItems.includes(Scannable.Type.ASSIGNMENT))
    {
      scannables.push(new Scannable(Scannable.Type.ASSIGNMENT));
    }

    if(scannedItems.includes(Scannable.Type.COURSE_NAV_LINK))
    {
      scannables.push(new Scannable(Scannable.Type.COURSE_NAV_LINK));
    }

    if(scannedItems.includes(Scannable.Type.DISCUSSION))
    {
      scannables.push(new Scannable(Scannable.Type.DISCUSSION));
    }

    if(scannedItems.includes(Scannable.Type.FILE))
    {
      scannables.push(new Scannable(Scannable.Type.FILE));
    }

    if(scannedItems.includes(Scannable.Type.MODULE_LINK))
    {
      // Make a MODULE type to find modules first
      scannables.push(new Scannable(Scannable.Type.MODULE));
    }

    if(scannedItems.includes(Scannable.Type.PAGE))
    {
      scannables.push(new Scannable(Scannable.Type.PAGE));
    }

    if(scannedItems.includes(Scannable.Type.SYLLABUS))
    {
      const syllabus = new Scannable(Scannable.Type.SYLLABUS);

      // Syllabus data should already be in courseScannerController.courseInfo,
      // Set as last page so it is scanned only once
      syllabus.setIsLastPage(true);
      scannables.push(syllabus);
    }

    return scannables;
  }
}