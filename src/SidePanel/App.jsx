import {useState, useEffect} from 'react'
import {Message} from '../shared/models/Message.js'
import {MessageListener} from '../shared/observers/MessageListener.js'
import * as Popover from '@radix-ui/react-popover';
import ButtonPrimary from "./components/shared/ButtonPrimary.jsx";

function App()
{
    // const [count, setCount] = useState(0)
    const [message, setMessage] = useState("")

    // useEffect( () => {
    //   function handleMessage(message, sender, sendResponse)
    //   {
    //       console.log(message);
    //       setMessage(message);
    //       chrome.runtime.onMessage.removeListener(handleMessage)
    //   }

    //   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => handleMessage(message, sender, sendResponse))
    // }, [])

    useEffect(() =>
    {
        function handleMessage(msg)
        {
            console.log(msg.data);
            setMessage(msg.text);
        }
       const messageListener = new MessageListener(
         Message.Target.SIDE_PANEL,
         handleMessage
       );

        messageListener.listen();

        return () => messageListener.remove();
    }, [message])

    return (
        <>
            <div className="p-5 animate__animated animate__zoomIn">
                <img src="/img/icon-color.svg" alt="LMS Dash"/>
            </div>
            <h1>LMS Dash</h1>
            <div className="card">

                <p>{message}</p>

              <ButtonPrimary onClick={() =>
              {
                const courseId = prompt("Enter course ID");
                chrome.runtime.sendMessage(
                  new Message(Message.Target.SERVICE_WORKER, Message.Type.Task.Request.App.STATE, courseId)
                )
              }}>
                <span>Hello World!</span>
              </ButtonPrimary>
            </div>
        </>
    )
}

export default App
