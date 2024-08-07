import Config from "../config/Config.js";

export default class Logger
{
  static log(module, message)
  {
    console.log(module + "\n" + message);
  }

  static debug(module, message)
  {
    if(Config.DEBUG_MODE) console.log(module + "\n" + message);
  }
}