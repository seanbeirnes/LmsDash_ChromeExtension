import {useState} from "react";
import LoadingPage from "../pages/LoadingPage.jsx";
import MenuPage from "../pages/MenuPage.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";

function PageRouter()
{
  const [page, setPage] = useState("LoadingPage")

  function renderPage(page)
  {
    switch(page)
    {
      case "LoadingPage":
        return <LoadingPage callback={() => setPage("MenuPage")} />

      case "MenuPage":
        return <MenuPage />

      default:
        return <ErrorPage></ErrorPage>
    }
  }

  return (
    <>
      {renderPage(page)}
    </>
  )
}

export default PageRouter;