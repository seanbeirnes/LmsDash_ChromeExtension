/**
 * Class to remove html tags, codes, entities, etc. to produce pure plain text.
 */
export default class HTMLSanitizer
{
  // Converts HTML to plaintext
  static sanitize(html)
  {
    const textItems = [];

    let tempString = "";

    for(let i = 0; i < html.length; i++)
    {
      if(html[i] === '<' && tempString)
      {
        // Add the plaintext element to array and reset for the tag element
        textItems.push(HTMLSanitizer.#cleanText(tempString));
        tempString = html[i];
      } else if(html[i] === '>' || i === html.length - 1)
      {
        // Ignore the tag element reset for next element
        tempString = ""
      } else
      {
        tempString += html[i]
      }
    }

    return textItems.join("");
  }

  // Cleans the text of HTML symbols and unnecessary ASCII characters
  static #cleanText(text)
  {
    if(text.includes("&")) text = HTMLSanitizer.#removeSymbols(text);
    if(text.includes("\n")) text = HTMLSanitizer.#removeNewLines(text);

    return text;
  }

  static #removeNewLines(text)
  {
    return text.replaceAll("\n", " ");
  }

  // Cleans text of HTML symbol codes, hex codes, and entities
  static #removeSymbols(text)
  {
    return text.replaceAll(/&[#\w]{2,17};/g, "");
  }
}