import {useState, useEffect, createContext} from 'react'
import {Message} from '../shared/models/Message.js'
import {MessageListener} from '../shared/observers/MessageListener.js'
import PageRouter from "./components/router/PageRouter.jsx";

export const AppStateContext = createContext({});

function App()
{
  const [appState, setAppState] = useState({
    activeTab: null,
    hasTabs: false,
    isAdmin: false,
    isOnline: false,
    timeChanged: 0,
    timeUpdated: 0,
  })

  useEffect(() =>
  {
    function handleMessage(msg)
    {
      if(msg.type !== Message.Type.Task.Response.App.STATE) return;
      setAppState(() =>
      {
        return {
          activeTab: msg.data.activeTab,
          hasTabs: msg.data.hasTabs,
          isAdmin: msg.data.isAdmin,
          isOnline: msg.data.isOnline,
          timeChanged: msg.data.timeChanged,
          timeUpdated: msg.data.timeUpdated,
        }
      });
    }

    const notifyIsOpened = async () =>
    {
      if(appState.timeUpdated !== 0) return false;
      // Let serviceWorker know the panel has been opened
      const response = await chrome.runtime.sendMessage(
        new Message(Message.Target.SERVICE_WORKER,
          Message.Sender.SIDE_PANEL,
          Message.Type.Task.Request.App.SET_PANEL_OPENED,
          "SidePanel was opened")
      );
      handleMessage(response);

      console.log(appState)
      return true;
    }

    notifyIsOpened()

    const messageListener = new MessageListener(
      Message.Target.SIDE_PANEL,
      handleMessage
    );

    messageListener.listen();

    return () => messageListener.remove();
  }, [appState]);

  return (
    <AppStateContext.Provider value={appState}>
      <div className="bg-gray-300">
        <PageRouter></PageRouter>
      </div>
    </AppStateContext.Provider>
  )
}

export default App
