import Config from "../config/Config.js";

export default class Logger
{
  static log(message)
  {
    const date = new Date();
    console.log(date.toUTCString() + "      " + message);
  }

  static debug(filePath, message)
  {
    const date = new Date();
    if(Config.DEBUG_MODE) console.log(date.toUTCString() + "      " + filePath + "      " + message);
  }
}