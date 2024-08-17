import {createContext, useState} from "react";
import LoadingPage from "../pages/LoadingPage.jsx";
import MenuPage from "../pages/MenuPage.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import CoursesScannerPage from "../pages/CoursesScannerPage.jsx";
import ExternalToolsPage from "../pages/ExternalToolsPage.jsx";
import AdminToolsPage from "../pages/AdminToolsPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import Pages from "../models/Pages.js";

export const PageRouterContext = createContext({})

function PageRouter()
{
  const [page, setPage] = useState(Pages.page.LOADING)

  function renderPage(page)
  {
    switch(page)
    {
      case Pages.page.ABOUT:
        return <AboutPage />;

      case Pages.page.ADMIN_TOOLS:
        return <AdminToolsPage />;

      case Pages.page.COURSES_SCANNER:
        return <CoursesScannerPage />;

      case Pages.page.EXTERNAL_TOOLS:
        return <ExternalToolsPage />;

      case Pages.page.LOADING:
        return <LoadingPage />

      case Pages.page.MENU:
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