import Header from "../layout/Header.jsx";
import RadialProgress from "../shared/progress/RadialProgress.jsx";
import {AppStateContext} from "../../App.jsx";
import {useContext, useState} from "react";

function LoadingPage({callback})
{
  const [isLoading, setIsLoading] = useState(true);
  const appState = useContext(AppStateContext);
  //callback();

  return (
    <>
      <Header></Header>
      <main className="p-4 flex flex-col items-center justify-center">
        <div className="h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center animate__animated animate__zoomIn">
          <img src="/img/icon-color.svg" className="w-48 md:w-64 max-w-lg "/>
          {isLoading && <RadialProgress text="Loading..." /> }
          {appState.timeUpdated}
          {appState.activeTab?.url}
        </div>
      </main>
    </>
  )
}

export default LoadingPage;