import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import Main from "../components/layout/Main.jsx";
import GenericErrorMessage from "../components/shared/error/GenericErrorMessage.jsx";

function ErrorPage()
{
  return (
    <>
      <Header></Header>
      <Main>
        <GenericErrorMessage />
      </Main>
      <Footer></Footer>
    </>
  )
}

export default ErrorPage;