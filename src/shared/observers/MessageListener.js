export class MessageListener
{

  constructor(target, callback, args = null)
  {
    this.target = target;
    this.callback = callback;
    this.args = args;
  }

  listen()
  {
    // eslint-disable-next-line no-undef
    chrome.runtime.onMessage.addListener(
      this.handleMessage.bind(this)
    );
  }

  remove()
  {
    // eslint-disable-next-line no-undef
    chrome.runtime.onMessage.removeListener(
      this.handleMessage.bind(this)
    )
  }

  // Handles the message incoming from the chrome runtime message listener
  // Incoming message follows Message.js data structure
  handleMessage(message)
  {
    if(this.target !== message.target) return null;

    if (this.args !== null)
    {
      this.callback(message, this.args);
    } else
    {
      this.callback(message);
    }
  }
}