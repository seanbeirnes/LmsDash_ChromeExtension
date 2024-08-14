/**
 * Holds the resulting data for a course scan
 */

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
    this.published = courseInfo["workflow_state"] === "available";
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
}