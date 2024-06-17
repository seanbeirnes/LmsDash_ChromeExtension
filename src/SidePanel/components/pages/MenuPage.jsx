import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import {AppStateContext, UserInfoContext} from "../../App.jsx";
import {useContext, useState} from "react";
import {Utils} from "../../../shared/utils/Utils.js";

function MenuPage() {

  const appState = useContext(AppStateContext);
  const userInfo = useContext(UserInfoContext);

  const buttonClasses = "w-full px-4 py-2 bg-gray-50 hover:bg-white hover:text-blue-500 hover:shadow active:shadow-inner active:text-blue-400 text-blue-600 font-bold animate__animated animate__fadeIn"
  return (
    <>
      <Header></Header>
      <main
        className="p-4 h-[calc(100vh-100px)] grid grid-cols-1 grid-rows-4 justify-items-center text-base text-gray-700 animate__animated animate__zoomIn">
        <div className="row-span-2 w-full max-w-96 flex flex-col justify-start gap-2">
          <button className={buttonClasses}>Scan Courses</button>
          <button className={buttonClasses}>External Tools</button>
          <button className={buttonClasses}>Admin Tools</button>
        </div>
        <p className="my-4 text-center">Welcome, {userInfo.fullName}!</p>
      </main>
      <Footer></Footer>
    </>
  )
}

export default MenuPage;