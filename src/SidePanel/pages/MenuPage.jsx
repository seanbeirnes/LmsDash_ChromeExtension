import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import {AppStateContext, UserInfoContext} from "../App.jsx";
import {useContext, useState} from "react";
import {MagnifyingGlassIcon, RocketIcon, BackpackIcon} from "@radix-ui/react-icons";
import Main from "../components/layout/Main.jsx";

function MenuPage() {

  const appState = useContext(AppStateContext);
  const userInfo = useContext(UserInfoContext);

  const buttonClasses = "flex justify-center items-center gap-2 w-full px-4 py-2 bg-gray-50 hover:bg-white hover:text-blue-500 hover:shadow active:shadow-inner active:text-blue-400 text-blue-600 rounded animate__animated animate__fadeIn"
  return (
    <>
      <Header></Header>
      <Main>
        <div className="place-self-start p-4 w-full grid grid-cols-1 grid-flow-row justify-items-center">
          <h1 className="m-4 text-lg font-bold text-center">Welcome, {userInfo.fullName}!</h1>
          <div className="grid grid-cols-1 grid-flow-row gap-2 justify-items-center w-full max-w-lg">
            <button className={buttonClasses}><MagnifyingGlassIcon/>Scan Courses</button>
            <button className={buttonClasses}><RocketIcon/>External Tools</button>
            <button className={buttonClasses}><BackpackIcon/>Admin Tools</button>
          </div>
        </div>
      </Main>
      <Footer></Footer>
    </>
  )
}

export default MenuPage;