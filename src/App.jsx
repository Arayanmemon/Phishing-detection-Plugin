import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';

function App() {
  const [info, setInfo] = useState("");

  const oneclick = async () => {
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

  const checkSpam = async () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://www.ipqualityscore.com/api/json/url/VCAwWHMpf8tBh97hTODyAxEgbcKNBDxp/${encodeURIComponent(info)}`,
      headers: { }
    };
    
    await axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data.risk_score));
    })
    .catch((error) => {
      console.log(error);
    });

  }

  return (
    <>
      <h1>Phishing Site Detection</h1>
      <div className="card">
        <button onClick={() => oneclick()}>
          Check spam
        </button>
        <button onClick={() => checkSpam()}>
          API Call
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
