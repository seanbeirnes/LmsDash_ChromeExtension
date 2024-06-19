import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import {AppStateContext, UserInfoContext} from "../App.jsx";
import {useContext, useState} from "react";
import {MagnifyingGlassIcon, RocketIcon, BackpackIcon} from "@radix-ui/react-icons";
import Main from "../components/layout/Main.jsx";

function MenuPage() {

  const motivatingSayings = [
    "Let's do this!",
    "Keep looking up!",
    "You've got this!",
    "Keep pushing forward!",
    "Let's make it happen!",
    "One step at a time!",
    "You are unstoppable!",
    "Keep up the great work!",
    "Dream big, act bigger!",
    "Today is your day!",
    "Keep moving, keep growing!",
    "Great things are coming!",
    "Stay focused and determined!",
    "Every effort counts!",
  ];

  const [saying, useSaying] = useState( () =>
  {
    const randomNumer = Math.floor(Math.random() * motivatingSayings.length);
    return motivatingSayings[randomNumer];
  });

  const appState = useContext(AppStateContext);
  const userInfo = useContext(UserInfoContext);

  const buttonClasses = "flex justify-start items-center gap-2 w-full px-4 py-2 bg-gray-50 hover:bg-white hover:text-blue-500 hover:shadow active:shadow-inner active:text-blue-400 text-blue-600 rounded animate__animated animate__fadeIn"
  return (
    <>
      <Header></Header>
      <Main>
        <div className="place-self-start p-4 w-full grid grid-cols-1 grid-flow-row justify-items-start">
          <h2 className="w-full mt-4 text-lg font-bold">Welcome {userInfo.fullName}</h2>
          <p className="mb-4 text-sm">{saying}</p>
          <div className="grid grid-cols-1 grid-flow-row gap-2 justify-items-center w-full max-w-lg">
            <button className={buttonClasses}><MagnifyingGlassIcon/>Course Scanner</button>
            {/*TO DO:
              - If user is not admin, they should only see "Scan Course" button if they have a course open in the active tab.
              - If user is admin, they should see a "Scan Courses" button that become a dropdown with "Scan this course" and "Scan courses in a term" options.
            */}
            {/*Admin only buttons go below this line*/}
            {appState.isAdmin && <button className={buttonClasses}><RocketIcon/>External Tools</button>}
            {appState.isAdmin && <button className={buttonClasses}><BackpackIcon/>Admin Tools</button>}
          </div>
        </div>
      </Main>
      <Footer></Footer>
    </>
  )
}

export default MenuPage;