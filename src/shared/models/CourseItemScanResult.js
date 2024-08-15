/**
 * Holds the data for a course item that contained a match in the scan process.
 */

export default class CourseItemScanResult
{
  constructor(type, id, name, url, published, matches = [], preview = [], errors = [])
  {
    this.type = type;
    this.id = id;
    this.name = name;
    this.matches = matches;
    this.preview = preview;
    this.url = url;
    this.published = published;
    this.errors = errors;
  }
}