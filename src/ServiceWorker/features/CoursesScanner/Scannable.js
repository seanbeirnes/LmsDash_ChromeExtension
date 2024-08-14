import CourseItem from "../../../shared/models/CourseItem.js";

/**
 * Interface for scannable items that can be used to track which "page" of
 * the paginated responses the scan is on for the item type.
 */

export default class Scannable
{

  static Type = {
    ANNOUNCEMENT: CourseItem.Type.ANNOUNCEMENT,
    ASSIGNMENT: CourseItem.Type.ASSIGNMENT,
    COURSE_NAV_LINK: CourseItem.Type.COURSE_NAV_LINK,
    DISCUSSION: CourseItem.Type.DISCUSSION,
    FILE: CourseItem.Type.FILE,
    MODULE: "module",
    MODULE_ITEM: "module-item",
    MODULE_LINK: CourseItem.Type.MODULE_LINK,
    PAGE: CourseItem.Type.PAGE,
    SYLLABUS: CourseItem.Type.SYLLABUS,
  }

  constructor(type, id = null)
  {
    this.type = type;
    this.items = [];
    this.page = 1;
    this.id = id;
    this.requestId = null;
    this.isLastPage = false;
  }

  incrementPage()
  {
    this.page++;
  }

  setId(id)
  {
    this.id = id;
  }

  setIsLastPage(isLastPage)
  {
    this.isLastPage = isLastPage;
  }

  setItems(scannableItems)
  {
    this.items = scannableItems;
  }

  clearItems()
  {
    this.items = [];
  }

  appendItem(scannableItem)
  {
    this.items.push(scannableItem);
  }

}