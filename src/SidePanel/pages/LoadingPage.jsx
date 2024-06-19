import Header from "../components/layout/Header.jsx";
import RadialProgress from "../components/shared/progress/RadialProgress.jsx";
import {AppStateContext, UserInfoContext} from "../App.jsx";
import {useContext, useEffect, useState} from "react";
import Footer from "../components/layout/Footer.jsx";
import {PageRouterContext} from "../router/PageRouter.jsx";
import Main from "../components/layout/Main.jsx";

function LoadingPage(props)
{
  const pageRouterState = useContext(PageRouterContext);
  const appState = useContext(AppStateContext);
  const userInfo = useContext(UserInfoContext);

  function isLoading()
  {
    if(appState.timeUpdated === 0) return true;
    if(!appState.isOnline) return true;
    if(!appState.hasTabs) return true;
    if(!userInfo.fullName) return true;

    return false;
  }

  useEffect(() =>
  {
    if(!isLoading()) pageRouterState.setPage("MenuPage");
  }, [appState, userInfo]);


  return (
    <>
      <Header animated={true}></Header>
      <Main animated={false}>
        <div className="w-full flex flex-col items-center">
          <img src="/img/icon-color.svg" className="w-48 md:w-64 max-w-lg"/>
          <div className="animate__animated animate__fadeIn animate__delay-4s">
            <RadialProgress text={"Getting things ready..."} />
          </div>
        </div>
      </Main>
      <Footer></Footer>
    </>
  )
}

export default LoadingPage;