/**
 * Class for validating the integrity of messages and other security-related methods.
 */
import Logger from "./Logger.js";

export default class Security
{
  static compare = {
    // Compares message signatures to determine validity
    messages: (message1, message2) =>
    {
      if(!message1 && !message2)
      {
        Logger.debug(__dirname, JSON.stringify(message1) + JSON.stringify(message2));
        throw new Error("Cannot compare null messages");
      }
      if(!message1 || !message2) return false;
      if(!message1.signature || !message2.signature) return false;

      return message1.signature === message2.signature;
    },
    // Ensures that all IDs in the original requests sent are in the received requests
    canvasRequests: (requests, responses) =>
    {
      if(!requests || !responses)
      {
        Logger.debug(__dirname, JSON.stringify(requests) + JSON.stringify(responses));
        throw new Error("Cannot compare null requests");
      }
      if(!requests.length !== !responses.length) return false;

      const reqIDs = []
      requests.forEach((request) => reqIDs.push(request.id));

      for(let i = reqIDs.length - 1; i >= 0; i--)
      {
        if(responses.findIndex((response) => response.id === reqIDs[i]) >= 0) reqIDs.pop();
      }

      return reqIDs.length === 0;
    },
    // Compares canvas request / response messages
    canvasRequestMessages: (requestMsg, responseMsg) =>
    {
      if(!Security.compare.messages(requestMsg, responseMsg)) throw new Error("Invalid message received!");
      if(!Security.compare.canvasRequests(requestMsg.data, responseMsg.data)) throw new Error("Invalid Canvas request received!");
      return true;
    }
  }

  // Creates a unique signature based on the text passed in, the current time, and the extension id
  static create = {
    signature: async (text) =>
    {
      const time = new Date().toISOString();

      return await Security.#sha256(text + time + chrome.runtime.id);
    }
  }

  // SHA 256 function
  static async #sha256(text)
  {
    const msgUint8 = new TextEncoder().encode(text); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    // convert bytes to hex string
    return hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}