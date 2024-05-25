import {useState, useEffect} from 'react'
import {Message} from '../shared/models/Message.js'
import {MessageListener} from '../shared/observers/MessageListener.js'
import './App.css'

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
            alert(msg.data);
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
            <div>
                <img src="/img/icon-color.svg" alt="LMS Dash"/>
            </div>
            <h1>LMS Dash</h1>
            <div className="card">
                <button onClick={() =>
                {
                    const courseId = prompt("Enter course ID");
                    chrome.runtime.sendMessage(
                        new Message(Message.Target.SERVICE_WORKER, Message.Type.Task.Request.App.STATE, courseId)
                    )
                }
                }>
                    Click me!
                </button>
                <p>{message}</p>
            </div>
        </>
    )
}

export default App
