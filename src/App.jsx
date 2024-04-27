import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [info, setInfo] = useState("url");
  const oneclick = async () =>{
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true});
    console.log([tab][0].url);
    setInfo([tab][0].url);
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => {
        // alert("Hello from extension");
      }
    })
  }


  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => oneclick()}>
          Info: {info}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
