/**
 * Holds the resulting data for a course scan
 */

export default class CourseScanResult
{
  constructor(id, name, courseCode, sisCourseId, published, url, errors = null)
  {
    this.id = id;
    this.name = name;
    this.courseCode = courseCode;
    this.sisCourseId = sisCourseId;
    this.published = published;
    this.url = url;
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
    this.errors = errors;
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