import {useState, useEffect, createContext} from 'react'
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {Message} from '../shared/models/Message.js'
import {MessageListener} from '../shared/observers/MessageListener.js'
import PageRouter from "./router/PageRouter.jsx";
import AppStateModalController from "./controllers/AppStateModalController.jsx";

const queryClient = new QueryClient({});

export const AppStateContext = createContext({});
export const UserInfoContext = createContext({});

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

  const [userInfo, setUserInfo] = useState({
    timeChecked: 0,
    firstName: "",
    lastName: "",
    fullName: "",
    shortName: "",
    email: "",
    sis_user_id: "",
    lmsInstance: "",
  });

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
      if(appState.timeUpdated !== 0) return;
      // Let serviceWorker know the panel has been opened
      const response = await chrome.runtime.sendMessage(
        new Message(Message.Target.SERVICE_WORKER,
          Message.Sender.SIDE_PANEL,
          Message.Type.Task.Request.App.SET_PANEL_OPENED,
          "SidePanel was opened")
      );
      handleMessage(response);
    }

    const requestUserInfo = async () =>
    {
      if(userInfo.timeChecked !== 0 || !appState.hasTabs) return;

      // Request user info
      const response = await chrome.runtime.sendMessage(
        new Message(Message.Target.SERVICE_WORKER,
          Message.Sender.SIDE_PANEL,
          Message.Type.Task.Request.Info.USER,
          "User info request")
      );

      if(response.data === null) return;

      const userData = await JSON.parse(response.data[0].text);

      setUserInfo(() =>
        {
         return {
           timeChecked: Date.now(),
           firstName: userData.first_name,
           lastName: userData.last_name,
           fullName: userData.name,
           shortName: userData.short_name,
           email: userData.email,
           sis_user_id: userData.sis_user_id,
           lmsInstance: new URL(appState.activeTab.url).origin,
         }
        });
    }

    notifyIsOpened();
    requestUserInfo();

    const messageListener = new MessageListener(
      Message.Target.SIDE_PANEL,
      handleMessage
    );

    messageListener.listen();

    return () => messageListener.remove();
  }, [appState, userInfo]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppStateContext.Provider value={appState}>
        <UserInfoContext.Provider value={userInfo}>
         <div className="bg-gray-300">
            <AppStateModalController>
              <PageRouter></PageRouter>
            </AppStateModalController>
          </div>
        </UserInfoContext.Provider>
      </AppStateContext.Provider>
    </QueryClientProvider>
  )
}

export default App
