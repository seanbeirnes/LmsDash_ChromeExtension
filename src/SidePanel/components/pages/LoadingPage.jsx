import Header from "../layout/Header.jsx";
import RadialProgress from "../shared/progress/RadialProgress.jsx";
import {AppStateContext} from "../../App.jsx";
import {useContext, useState} from "react";
import Footer from "../layout/Footer.jsx";
import {Utils} from "../../../shared/utils/Utils.js";

function LoadingPage({callback})
{
  const [isLoading, setIsLoading] = useState(true);
  const appState = useContext(AppStateContext);

  function getLoadingText()
  {
    if(appState.timeUpdated === 0) return "Loading...";
    if(!appState.isOnline) return "Waiting for internet...";
    if(!appState.hasTabs) return "Detecting Canvas tabs...";
    return "Ready to go!";
  }

  async function goToMenu()
  {
    if(isLoading)
    {
      if(getLoadingText() === "Ready to go!") setIsLoading(false);
      return;
    }

    if(isLoading) return;

    await Utils.sleep(1500);
    callback();
  }

  goToMenu();

  return (
    <>
      <Header></Header>
      <main className="p-4 h-[calc(100vh-100px)] flex flex-col items-center justify-center animate__animated animate__zoomIn">
          <img src="/img/icon-color.svg" className="w-48 md:w-64 max-w-lg "/>
          {isLoading && <RadialProgress text={getLoadingText()}/>}
          <div className="p-4 text-base text-gray-700">
            {!appState.hasTabs && <p className="p-8 animate-pulse">Please open or refresh a Canvas tab to begin</p>}
          </div>
      </main>
      <Footer></Footer>
    </>
  )
}

export default LoadingPage;