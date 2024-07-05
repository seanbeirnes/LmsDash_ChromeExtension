/**
 * Holds settings for a course scan
 */
export class CoursesScanSettings
{
  scanType = []; // 'course' for single course or 'term' for term
  courseIds = []; // ids of courses to scan
  searchTerms = []; // search terms to scan for
  scannedItems = []; // Canvas items to scan for
  settings = []; // Additional settings
}