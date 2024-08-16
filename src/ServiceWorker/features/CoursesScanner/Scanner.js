import CourseItemScanResult from "../../../shared/models/CourseItemScanResult.js";
import Scannable from "./Scannable.js";
import Logger from "../../../shared/utils/Logger.js";
import CourseItem from "../../../shared/models/CourseItem.js";

/**
 * A static class responsible for scanning scannable items
 */
export default class Scanner
{
  static #maxPreviewLength = 20;

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
    // Only scan module links
    if(type === Scannable.Type.MODULE_ITEM && item["type"] !== "File" && item["type"] !== "ExternalUrl" && item["type"] !== "ExternalTool") return null;

    // Prepare to scan
    const scanProperties = Scanner.#getScanProperties(item, type, scanSettings.lmsBaseUrl, courseInfo);

    // If "only published items" setting, do not scan unpublished items
    if(scanSettings.settings.includes("only-published-items") && !scanProperties.published) return null;

    ////// Scan
    const matches = new Set ();
    let previews = [];

    scanProperties.text.forEach((text) => {
      const results = Scanner.#scanText(text, scanSettings);
      results.matches.forEach((match) => matches.add(match));
      previews = previews.concat(results.previews);
    })

    scanProperties.html.forEach((html) => {
      const results = Scanner.#scanHtml(html, scanSettings);
      results.matches.forEach((match) => matches.add(match));
      previews = previews.concat(results.previews);
    })

    ////// Return results
    if(matches.size === 0) return null; // If no matches, return nothing

    return new CourseItemScanResult(
      type,
      scanProperties.id,
      scanProperties.name,
      scanProperties.url,
      scanProperties.published,
      Array.from(matches),
      previews);
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
        properties.id = 1;
        properties.name = "Syllabus";
        properties.url = baseUrl + "/courses/" + courseId + "/assignments/syllabus";
        properties.published = true;
        properties.text = [];
        properties.html = courseInfo["syllabus_body"] ? [courseInfo["syllabus_body"]] : [];
        break;
    }

    // Check if any properties are null
    if(properties.type === null || properties.id === null || properties.name === null || properties.url === null || properties.published === null) console.warn("Null property in scan properties");

    Logger.debug(__dirname, "Scan Properties: \n" + JSON.stringify(properties));

    return properties;
  }

  // Scans plaintext
  static #scanText(text, scanSettings)
  {
    const isCaseSensitive = scanSettings.settings.includes("case-sensitive");
    const searchTerms = scanSettings.searchTerms;

    const matches = new Set(); // Use set so there are no duplicates
    const previews = []; // Each preview follows pattern ["preview before", "match","preview after"]

    // Handle "case-sensitive" setting
    text = isCaseSensitive ? text : text.toLowerCase();

    // Scan text for each searchTerm
    for(let i = 0; i < searchTerms.length; i++)
    {
      const searchTerm = isCaseSensitive ? searchTerms[i] : searchTerms[i].toLowerCase();

      // Get index of string match
      const index = text.indexOf(searchTerm);

      ////// If no match, go to next loop iteration
      if(index < 0) continue;

      ////// If match, create preview and add match
      matches.add(searchTerm);

      const maxPreviewLength = Scanner.#maxPreviewLength;
      const previewLeftStart = index - maxPreviewLength > 0 ? index - maxPreviewLength : 0;
      const previewRightStart = index + searchTerm.length;
      const previewRightEnd = previewRightStart + maxPreviewLength > text.length ? text.length : previewRightStart + maxPreviewLength;
      let previewLeft = text.substring(previewLeftStart, index);
      let previewRight = text.substring(previewRightStart, previewRightEnd);
      previewLeft = "..." + previewLeft;
      previewRight += "...";

      previews.push([previewLeft, searchTerm, previewRight]);
    }

    // Return results
    return {matches: Array.from(matches), previews: previews};
  }

  // Scans html as plainText or parses HTML to scan only the text
  static #scanHtml(html, scanSettings)
  {
    const includeHtml = scanSettings.settings.includes("include-html");

    // If "include-html" setting, scan full html string like regular text
    if(includeHtml) return Scanner.#scanText(html, scanSettings);

    const matches = new Set(); // Use set so there are no duplicates
    const previews = []; // Each preview follows pattern ["preview before", "match","preview after"]

    // Scan html for each searchTerm
    console.log("TO DO: Scan html for each search term")
    // handle "include html" and "case sensitive" settings... should be case insensitive by default

    // Return results
    return {matches: Array.from(matches), previews: previews};
  }

  static #htmlToText(html)
  {

  }
}