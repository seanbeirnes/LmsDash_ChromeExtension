import {useContext} from "react";
import {PageRouterContext} from "../router/PageRouter.jsx";
import Header from "../components/layout/Header.jsx";
import IconButton from "../components/shared/buttons/IconButton.jsx";
import {ArrowLeftIcon, GitHubLogoIcon} from "@radix-ui/react-icons";
import Main from "../components/layout/Main.jsx";
import Footer from "../components/layout/Footer.jsx";
import PrimaryCard from "../components/shared/cards/PrimaryCard.jsx";
import PrimaryCardLayout from "../components/shared/cards/PrimaryCardLayout.jsx";
import {AppStateContext, UserInfoContext} from "../App.jsx";
import Pages from "../models/Pages.js";
import Config from "../../shared/config/Config.js";

function AboutPage()
{
  const pageRouterState = useContext(PageRouterContext);
  const appState = useContext(AppStateContext);
  const userInfo = useContext(UserInfoContext);

  return (
    <>
      <Header>
        <IconButton animated={true} onClick={() => pageRouterState.setPage(Pages.page.MENU)}>
          <ArrowLeftIcon className="w-8 h-8"/>
        </IconButton>
      </Header>
      <Main>
        <PrimaryCardLayout fullWidth={false}>
          <PrimaryCard>
            <div
              className={`flex items-center justify-center animate__animated animate__fadeIn animate__faster`}>
              <img className="max-h-12" src="/img/icon-color.svg" alt="LMS Dash logo"/>
              <h2 className="text-blue-600 font-bold text-2xl">LMS Dash</h2>
            </div>
            <h3 className="font-bold text-lg">Current User</h3>
            <p className="text-sm"><span className="font-bold">Name: </span>{userInfo.fullName}</p>
            <p className="text-sm"><span className="font-bold">Email: </span>{userInfo.email}</p>
            <p className="text-sm"><span className="font-bold">ID: </span>{userInfo.sis_user_id}</p>
            <p className="text-sm"><span className="font-bold">Canvas Instance: </span><a
              className={"text-blue-600 hover:text-blue-500 active:text-blue-400"} href={userInfo.lmsInstance}
              target={"_blank"}>{userInfo.lmsInstance}</a></p>
            <br/>
            <h3 className={"font-bold text-lg"}>LMS Dash Creator</h3>
            <p className="text-sm"><span className="font-bold">Description: </span>{Config.APP_DESCRIPTION}</p>
            <p className="text-sm"><span className="font-bold">Version: </span>{Config.APP_VERSION}</p>
            <br/>
            <h3 className={"font-bold text-lg"}>LMS Dash Creator</h3>
            <a className={"flex items-center text-blue-600 hover:text-blue-500 active:text-blue-400"}
               href={"https://github.com/seanbeirnes"} target={"_blank"}>Sean Beirnes&nbsp;<GitHubLogoIcon/></a>

          </PrimaryCard>
        </PrimaryCardLayout>
      </Main>
      <Footer></Footer>
    </>
  )
}

export default AboutPage;