import {UserInfoContext, AppStateContext} from "../../App.jsx";
import {useContext} from "react";

function Footer()
{

  const appState = useContext(AppStateContext);
  const userInfo = useContext(UserInfoContext);

  function getColor()
  {
    if(!appState.isOnline) return "bg-red-600 text-red-100";
    if(!appState.hasTabs) return "bg-red-600 text-red-100";
    if(appState.isAdmin) return "bg-blue-800 text-blue-100";
    return "bg-blue-600 text-blue-100";
  }

  function getText()
  {
    if(!appState.isOnline) return "No internet connection detected";
    if(!appState.hasTabs) return "No Canvas tabs detected"
    if(!appState.isAdmin) return "Normal Mode";
    if(appState.isAdmin) return "Admin Mode";
  }

  return (
      <div className={`w-screen h-9 pl-4 pr-6 py-4 fixed bottom-0 flex flex-row items-center ${!appState.isOnline || !appState.hasTabs ? "justify-center" : "justify-between" } text-sm ${getColor()}`}>
        { (appState.isOnline && appState.hasTabs) &&
          <>
            <p className="hidden sm:block">{userInfo.fullName}</p>
            <p>{userInfo.lmsInstance}</p>
          </>
        }
        <p>{getText()}</p>
      </div>
  )
}

export default Footer;