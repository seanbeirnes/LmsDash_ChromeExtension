import CourseItemScanResult from "../../../shared/models/CourseItemScanResult.js";
import Scannable from "./Scannable.js";
import Logger from "../../../shared/utils/Logger.js";
import CourseItem from "../../../shared/models/CourseItem.js";

/**
 * A static class responsible for scanning scannable items
 */
export default class Scanner
{
  // Takes in scannable.items, scannable.type
  static scanItems(scannableItems, itemType, scanSettings, courseInfo)
  {
    const scanResults = [];

    // Do not scan modules
    if(itemType === Scannable.Type.MODULE) return scanResults;

    scannableItems.forEach( (item) => {
      const result = Scanner.scan(item, itemType, scanSettings, courseInfo)
      if(result) scanResults.push(result);
    })

    return scanResults;
  }

  static scan(item, type, scanSettings, courseInfo)
  {
    ////// Ignore items based on scan settings and other criteria
    // Only scan module links
    if(type === Scannable.Type.MODULE_ITEM &&
      !(item["type"] === "File") || item["type"] === "ExternalUrl" || item["type"] === "ExternalTool") return null;

    ////// Prepare to scan
    const scanProperties = Scanner.#getScanProperties(item, type, scanSettings.lmsBaseUrl, courseInfo);

    ////// Scan
    const matches = new Set ();
    const previews = [];

    scanProperties.text.forEach((text) => {
      const results = Scanner.#scanText(text, scanSettings);
      results.matches.forEach((match) => matches.add(match));
      previews.push(results.preview);
    })

    scanProperties.html.forEach((html) => {
      const results = Scanner.#scanHtml(html, scanSettings);
      results.matches.forEach((match) => matches.add(match));
      previews.push(results.preview);
    })

    ////// Return results
    if(matches.size === 0) return null; // If no matches, return nothing

    const result = new CourseItemScanResult(
      type,
      scanProperties.id,
      scanProperties.name,
      scanProperties.url,
      scanProperties.published,
      Array.from(matches),
      previews);

    return result;
  }

  static #getScanProperties(item, type, baseUrl, courseInfo)
  {
    const courseId = courseInfo["id"];

    const properties = {
      type: null,
      id: null,
      name: null,
      url: null,
      published: null,
      text: [],
      html: []
    }

    switch(type)
    {
      case Scannable.Type.ANNOUNCEMENT:
        properties.type = CourseItem.Type.ANNOUNCEMENT;
        properties.id = item["id"];
        properties.name = item["title"];
        properties.url = item["html_url"];
        properties.published = item["published"];
        properties.text = [item["title"]];
        properties.html = [item["message"]];
        break;

      case Scannable.Type.ASSIGNMENT:
        properties.type = CourseItem.Type.ASSIGNMENT;
        properties.id = item["id"];
        properties.name = item["name"];
        properties.url = item["html_url"];
        properties.published = item["published"];
        properties.text = [item["name"]];
        properties.html = [item["description"]];
        break;

      case Scannable.Type.COURSE_NAV_LINK:
        properties.type = CourseItem.Type.COURSE_NAV_LINK;
        properties.id = item["id"];
        properties.name = item["label"];
        properties.url = item["full_url"];
        properties.published = item["hidden"] ? item["hidden"] : true;
        properties.text = [item["label"]];
        properties.html = [];
        break;

      case Scannable.Type.DISCUSSION:
        properties.type = CourseItem.Type.DISCUSSION;
        properties.id = item["id"];
        properties.name = item["title"];
        properties.url = item["html_url"];
        properties.published = item["published"];
        properties.text = [item["title"]];
        properties.html = [item["message"]];
        break;

      case Scannable.Type.FILE:
        properties.type = CourseItem.Type.FILE;
        properties.id = item["id"];
        properties.name = item["display_name"];
        properties.url = baseUrl + "/courses/" + courseId + "/files/" + item["id"];
        properties.published = true; // Not technically a property for files, but use to make sure it is scanned
        properties.text = [item["display_name"]];
        properties.html = [];
        break;

      case Scannable.Type.MODULE_ITEM:
        properties.type = CourseItem.Type.MODULE_LINK;
        properties.id = item["id"];
        properties.name = item["title"];
        properties.url = item["html_url"];
        properties.published = item["published"];
        properties.text = [item["title"]];
        properties.html = [];
        if(item["type"] === "ExternalTool" || item["type"] === "ExternalUrl") properties.text.push(item["external_url"]);
        break;

      case Scannable.Type.PAGE:
        properties.type = CourseItem.Type.PAGE;
        properties.id = item["page_id"];
        properties.name = item["title"];
        properties.url = item["html_url"];
        properties.published = item["published"];
        properties.text = [item["title"]];
        properties.html = [item["body"]];
        break;

      case Scannable.Type.SYLLABUS:
        properties.type = CourseItem.Type.SYLLABUS;
        properties.id = 0
        properties.name = "Syllabus";
        properties.url = baseUrl + "/courses/" + courseId + "/assignments/syllabus";
        properties.published = true;
        properties.text = [];
        properties.html = courseInfo["syllabus_body"] ? [courseInfo["syllabus_body"]] : [];
        break;
    }

    // Check if any properties are null
    if(!properties.type || !properties.id || !properties.name || !properties.url || !properties.published) console.warn("Null property in scan properties");

    Logger.debug(__dirname, "Scan Properties: \n" + JSON.stringify(properties));

    return properties;
  }

  // Scans plaintext
  static #scanText(text, scanSettings)
  {
    const matches = [];
    const preview = "";

    // Scan text for each searchTerm
    console.log("TO DO: Scan text for each search term", text)

    // Return results
    return {matches: matches, previews: preview};
  }

  // Scans html
  static #scanHtml(html, scanSettings)
  {
    const matches = [];
    const preview = "";

    // Scan html for each searchTerm
    console.log("TO DO: Scan html for each search term", html)

    // Return results
    return {matches: matches, preview: preview};
  }

}