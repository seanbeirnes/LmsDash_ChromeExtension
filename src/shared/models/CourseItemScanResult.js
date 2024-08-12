export default class CourseItemScanResult
{
  static type = {
    announcement: "announcement",
    assignment: "assignment",
    courseNavLink: "course-nav-link",
    discussion: "discussion",
    fileName: "file",
    moduleLink: "module-link",
    page: "page",
    syllabus: "syllabus",
    scanError: "scan-error",
  }

  constructor(type, id, name = "", matches = "", preview = "", url = "", published = null)
  {
    this.type = type;
    this.id = id;
    this.name = name;
    this.matches = matches;
    this.preview = preview;
    this.url = url;
    this.published = published;
  }
}