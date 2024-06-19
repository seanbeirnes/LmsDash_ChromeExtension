import Header from "../components/layout/Header.jsx";
import Main from "../components/layout/Main.jsx";
import Footer from "../components/layout/Footer.jsx";
import {ArrowLeftIcon} from "@radix-ui/react-icons";
import IconButton from "../components/shared/buttons/IconButton.jsx";
import {useContext} from "react";
import {PageRouterContext} from "../router/PageRouter.jsx";

function CourseScannerPage()
{
  const pageRouterState = useContext(PageRouterContext);
  return (
    <>
      <Header>
        <IconButton animated={true} onClick={() => pageRouterState.setPage("MenuPage")}>
          <ArrowLeftIcon className="w-8 h-8" />
        </IconButton>
      </Header>
      <Main>
        <div>
          <p>Course Scanner... Coming Soon!</p>
        </div>
      </Main>
      <Footer></Footer>
    </>
  )
}

export default CourseScannerPage;