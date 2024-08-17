import Header from "../components/layout/Header.jsx";
import Main from "../components/layout/Main.jsx";
import Footer from "../components/layout/Footer.jsx";
import IconButton from "../components/shared/buttons/IconButton.jsx";
import {ArrowLeftIcon} from "@radix-ui/react-icons";
import {useContext} from "react";
import {PageRouterContext} from "../router/PageRouter.jsx";
import Pages from "../models/Pages.js";

function ExternalToolsPage()
{
  const pageRouterState = useContext(PageRouterContext);

  return (
    <>
      <Header>
        <IconButton animated={true} onClick={() => pageRouterState.setPage(Pages.page.MENU)}>
          <ArrowLeftIcon className="w-8 h-8" />
        </IconButton>
      </Header>
      <Main>
        <div>
          <p>External Tools... Coming Soon!</p>
        </div>
      </Main>
      <Footer></Footer>
    </>
  )
}

export default ExternalToolsPage;