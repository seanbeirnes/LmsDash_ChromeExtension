import {Message} from '../shared/models/Message.js'
import {CanvasRequest} from "../shared/models/CanvasRequest.js";
import {AppStateController} from "./AppStateController.js";

// APP STARTUP TASKS //

// Sets the panel to open when clicking the extension's icon in Chrome
chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true})

const appStateController = new AppStateController();

// APP FIELDS
let counter = 0;
const tasks = []

function runTasks()
{
  return 0;
}

async function checkAppState(counter)
{
  const isChanged = appStateController.update();
  if (isChanged || counter === 1000) await appStateController.checkIsAdmin();

  if (isChanged)
  {
    chrome.runtime.sendMessage(new Message(
      Message.Target.SIDE_PANEL,
      Message.Type.Task.Response.App.STATE,
      "app state changed",
      appStateController.getState()
    )).catch(e =>
    {
      console.error("SidePanel not available:\n" + e)
    });

    console.log(appStateController.getState());
  }
}

async function run()
{
  if (tasks.length > 0) runTasks();

  await checkAppState(counter);

  if (counter >= 1000)
  {
    counter = 0
  } else
  {
    counter++
  }

  setTimeout(run, 1000);
}

chrome.runtime.onMessage.addListener((message, sender, response) =>
  {
    (async () =>
    {
      if (message.target === Message.Target.SERVICE_WORKER && message.type === Message.Type.Task.Request.App.STATE)
      {
        console.log(message.text, message.type)

        let tabId = appStateController.tabHandler.getTabId()

        if (tabId != null)
        {
          // Test requests
          const requests = [
            new CanvasRequest(CanvasRequest.Get.UsersSelf),
          ]

          const msg = new Message(Message.Target.TAB, Message.Type.Canvas.REQUESTS, "", requests)

          const res = await chrome.tabs.sendMessage(
            tabId,
            msg
          )

          console.log(res);
        }
      }

      // console.log(message);
      //
      // if(message.target === Message.Target.SERVICE_WORKER && message.type === Message.Type.Canvas.RESPONSES)
      // {
      //   const res = message.data
      //
      //   res.forEach(async (response) => console.log(await JSON.parse(response.text), response))
      //   chrome.runtime.sendMessage(new Message(Message.Target.SIDE_PANEL, Message.Type.Task.Response, "Response Received", {}));
      // }
    })();
  }
)

run();


// TO-DO:
/*
Convert RequestHandler response obj into a CanvasResponse model like CanvasMessage is?

*/