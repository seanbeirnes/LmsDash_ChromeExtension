export default async function serializeCoursesScanResults(scanResults)
{
  return new Promise((resolve, reject) => {
    const headerRow = [
      "course_id",
      "course_name",
      "course_code",
      "course_sis_id",
      "course_published",
      "course_url",
      "type",
      "id",
      "name",
      "url",
      "published",
      "matches"];

    let results = [];
    results.push(headerRow);
    scanResults.forEach( (course) => {
      results = results.concat(serializeCourse(course));
    })

    const csvData = results.join("\n");
    resolve(csvData);
  })
}

function serializeCourse(course)
{
  const course_details = [
    formatText(course.id),
    formatText(course.name),
    course.courseCode ? formatText(course.courseCode) : "",
    course.sisCourseId ? formatText(course.sisCourseId) : "",
    course.published ? "TRUE" : "FALSE",
    course.url ? formatText(course.url) : ""];

  const results = [];

  course.items.announcement.forEach((item) => {
    results.push(course_details.concat(serializeCourseItem(item)).join(','));
  })
  course.items.assignment.forEach((item) => {
    results.push(course_details.concat(serializeCourseItem(item)).join(','));
  })
  course.items.courseNavLink.forEach((item) => {
    results.push(course_details.concat(serializeCourseItem(item)).join(','));
  })
  course.items.discussion.forEach((item) => {
    results.push(course_details.concat(serializeCourseItem(item)).join(','));
  })
  course.items.file.forEach((item) => {
    results.push(course_details.concat(serializeCourseItem(item)).join(','));
  })
  course.items.moduleLink.forEach((item) => {
    results.push(course_details.concat(serializeCourseItem(item)).join(','));
  })
  course.items.page.forEach((item) => {
    results.push(course_details.concat(serializeCourseItem(item)).join(','));
  })
  course.items.syllabus.forEach((item) => {
    results.push(course_details.concat(serializeCourseItem(item)).join(','));
  })
  return results;
}

function serializeCourseItem(courseItem)
{
  return [
    formatText(courseItem.type),
    formatText(courseItem.id),
    formatText(courseItem.name),
    courseItem.url ? formatText(courseItem.url) : "",
    courseItem.published ? "TRUE" : "FALSE",
    formatText(courseItem.matches.toString().replaceAll(/[\[\]]/g,"")),
  ]
}

function formatText(inputText)
{
  const text = String(inputText);
  if(!text.includes(",")) return text;
  if(text.includes("\"")) return `""${text}""`;
  return `"${text}"`
}