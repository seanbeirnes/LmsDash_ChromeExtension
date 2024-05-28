import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import {AppStateContext, UserInfoContext} from "../../App.jsx";
import {useContext, useState} from "react";
import {Utils} from "../../../shared/utils/Utils.js";

function MenuPage() {

  const [counter, setCounter] = useState(0);

  const appState = useContext(AppStateContext);
  const userInfo = useContext(UserInfoContext);

  async function updateCounter()
  {
    if(counter > 10) return;
    await Utils.sleep(250);
    setCounter(counter + 1);
  }

  updateCounter();

  return (
    <>
      <Header></Header>
      <main
        className="p-4 h-[calc(100vh-100px)] grid grid-cols-1 grid-rows-4 justify-items-center text-base text-gray-700 animate__animated animate__zoomIn">
        <div className="row-span-2 w-full max-w-96 flex flex-col justify-start gap-2">
          {(counter > 4) && (<button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 hover:shadow active:bg-blue-400 active:shadow-inner text-white rounded animate__animated animate__fadeIn">Scan Courses</button>) || (<div className="h-8 w-full"></div>)}
          {(counter > 6) && (<button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 hover:shadow active:bg-blue-400 active:shadow-inner text-white rounded animate__animated animate__fadeIn">External Tools</button>) || (<div className="h-8 w-full"></div>)}
          {(counter > 8) && (<button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 hover:shadow active:bg-blue-400 active:shadow-inner text-white rounded animate__animated animate__fadeIn">Admin Tools</button>) || (<div className="h-8 w-full"></div>)}
        </div>
        <p className="my-4 text-center">Welcome, {userInfo.fullName}!</p>
      </main>
      <Footer></Footer>
    </>
  )
}

export default MenuPage;