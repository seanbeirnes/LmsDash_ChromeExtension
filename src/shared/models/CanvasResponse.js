
// Stores data for a Canvas API call response in a predefined data structure
export class CanvasResponse {
  constructor(id, text, bodyUsed, link, ok, redirected, status, statusText, type)
  {
    this.id = id;
    this.text = text;
    this.bodyUsed = bodyUsed;
    this.link = link;
    this.ok = ok;
    this.redirected = redirected;
    this.status = status;
    this.statusText = statusText;
    this.type = type;
  }
}
