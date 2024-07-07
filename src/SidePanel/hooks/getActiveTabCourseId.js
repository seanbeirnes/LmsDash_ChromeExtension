export default function getActiveTabCourseId(activeTab) {
    const pattern = /courses\/(\d+)/
    const matches = activeTab?.url.match(pattern);
    if(matches && matches.length >= 2) return matches[1];
    return null;
}