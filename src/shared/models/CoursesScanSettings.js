/**
 * Holds settings for a course scan
 */
export class CoursesScanSettings
{

  constructor(scanType, courseIds, searchTerms, scannedItems, settings, lmsBaseUrl)
  {
    this.scanType = scanType; // 'course' for single course or 'term' for term
    this.courseIds = courseIds; // ids of courses to scan
    this.searchTerms = searchTerms; // search terms to scan for
    this.scannedItems = scannedItems; // Canvas items to scan for
    this.settings = settings; // Additional settings
    this.lmsBaseUrl = lmsBaseUrl; // Base url of Canvas instance
  }
}