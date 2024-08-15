/**
 * Holds the resulting data for a course scan
 */
import CourseItem from "./CourseItem.js";

export default class CourseScanResult
{
  constructor()
  {
    this.id = null;
    this.name = null
    this.courseCode = null;
    this.sisCourseId = null;
    this.published = null;
    this.url = null;
    this.items = {
      announcement: [],
      assignment: [],
      courseNavLink: [],
      discussion: [],
      file: [],
      moduleLink: [],
      page: [],
      syllabus: []
    }
    this.errors = null;
  }

  // Sets the fields of the class from the courseInfo object
  setFields(courseInfo, baseUrl)
  {
    this.id = courseInfo["id"];
    this.name = courseInfo["name"];
    this.courseCode = courseInfo["course_code"];
    this.sisCourseId = courseInfo["sis_course_id"];
    // "available" courses are visible, "completed" courses are visible in read only state
    this.published = courseInfo["workflow_state"] === "available" || courseInfo["workflow_state"] === "completed";
    this.url = baseUrl + "/courses/" + this.id;
  }

  append = {
    announcement: (item) => this.items.announcement.push(item),
    assignment: (item) => this.items.assignment.push(item),
    courseNavLink: (item) => this.items.courseNavLink.push(item),
    discussion: (item) => this.items.discussion.push(item),
    file: (item) => this.items.file.push(item),
    moduleLink: (item) => this.items.moduleLink.push(item),
    page: (item) => this.items.page.push(item),
    syllabus: (item) => this.items.syllabus.push(item)
  }

  appendResults(scanResults)
  {
    for(let i = 0; i < scanResults.length; i++)
    {
      const scanResult = scanResults[i];
      if(!scanResult) continue; // Do not append null values

      switch(scanResult.type)
      {
        case CourseItem.Type.ANNOUNCEMENT:
          this.append.announcement(scanResult);
          break;

        case CourseItem.Type.ASSIGNMENT:
          this.append.assignment(scanResult);
          break;

        case CourseItem.Type.COURSE_NAV_LINK:
          this.append.courseNavLink(scanResult);
          break;

        case CourseItem.Type.DISCUSSION:
          this.append.discussion(scanResult);
          break;

        case CourseItem.Type.FILE:
          this.append.file(scanResult);
          break;

        case CourseItem.Type.MODULE_LINK:
          this.append.moduleLink(scanResult);
          break;

        case CourseItem.Type.PAGE:
          this.append.page(scanResult);
          break;

        case CourseItem.Type.SYLLABUS:
          this.append.syllabus(scanResult);
          break;

        default:
          throw new Error("Unrecognized item type for scan result")
      }
    }
  }
}