import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("")

  useEffect( () => {
    function handleMessage(message, sender, sendResponse)
    {
        console.log(message);
        setMessage(message);
        chrome.runtime.onMessage.removeListener(handleMessage)
    }

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => handleMessage(message, sender, sendResponse))
  }, [])

  return (
    <>
      <div>
          <img src="/img/icon-color.svg" alt="LMS Dash" />
      </div>
      <h1>LMS Dash</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>{message}</p>
      </div>
    </>
  )
}

export default App
