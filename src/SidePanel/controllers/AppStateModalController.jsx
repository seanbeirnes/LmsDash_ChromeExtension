import {useContext} from "react";
import {AppStateContext} from "../App.jsx";
import MessageModal from "../components/modals/MessageModal.jsx";

function AppStateModalController(props) {

  function getModalSettings()
  {
    const appState = useContext(AppStateContext);

    if(!appState.isOnline) return {title: "No Internet Detected", text: "Please check your network connection."}
    if(!appState.hasTabs) return {title: "No Tabs Detected", text: "Please open or refresh a Canvas tab."};
    return null;
  }

  const modalSettings = getModalSettings();

  return (
    <>
      {modalSettings !== null && (<MessageModal title={modalSettings.title}>{modalSettings.text}</MessageModal>)}
      {props.children}
    </>
  )

}

export default AppStateModalController;