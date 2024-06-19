import {createContext, useState} from "react";
import LoadingPage from "../pages/LoadingPage.jsx";
import MenuPage from "../pages/MenuPage.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import {AppStateContext} from "../App.jsx";
import CourseScannerPage from "../pages/CourseScannerPage.jsx";
import ExternalToolsPage from "../pages/ExternalToolsPage.jsx";
import AdminToolsPage from "../pages/AdminToolsPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";

export const PageRouterContext = createContext({})

function PageRouter()
{
  const [page, setPage] = useState("LoadingPage")

  function renderPage(page)
  {
    switch(page)
    {
      case "AboutPage":
        return <AboutPage />;

      case "AdminToolsPage":
        return <AdminToolsPage />;

      case "CourseScannerPage":
        return <CourseScannerPage />;

      case "ExternalToolsPage":
        return <ExternalToolsPage />;

      case "LoadingPage":
        return <LoadingPage />

      case "MenuPage":
        return <MenuPage />

      default:
        return <ErrorPage></ErrorPage>
    }
  }

  return (
    <>
      <PageRouterContext.Provider value={{page: page, setPage: setPage}}>
        {renderPage(page)}
      </PageRouterContext.Provider>
    </>
  )
}

export default PageRouter;