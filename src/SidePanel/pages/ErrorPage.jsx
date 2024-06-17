import Header from "../components/layout/Header.jsx";
import {BackpackIcon, MagnifyingGlassIcon, RocketIcon} from "@radix-ui/react-icons";
import Footer from "../components/layout/Footer.jsx";
import Main from "../components/layout/Main.jsx";

function ErrorPage() {
  return (
    <>
      <Header></Header>
      <Main>
        <div>
          <p className="my-4 text-gray-700 text-2xl font-bold text-center">¯\_(ツ)_/¯</p>
          <p className="my-4 text-gray-700 text-base text-center">Something went wrong...<br />Please reopen the extension</p>
        </div>
      </Main>
      <Footer></Footer>
    </>
  )
}

export default ErrorPage;