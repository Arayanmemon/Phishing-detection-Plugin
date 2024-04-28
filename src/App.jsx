import { useState, useEffect } from 'react'
import axios from 'axios';

function App() {
  const [info, setInfo] = useState("")
  useEffect(() => {
    const tabUpdatedHandler = (tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        const url = tab.url;
        // Now you can send a request to check the health of the URL
        setInfo(url);
      }
    };

    chrome.tabs.onUpdated.addListener(tabUpdatedHandler);


    return () => {
      chrome.tabs.onUpdated.removeListener(tabUpdatedHandler);
    };
  }, []);
  const oneclick = async () => {
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log([tab][0].url);
    setInfo([tab][0].url);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {

      }
    })
  }

  const checkSpam = async () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://www.ipqualityscore.com/api/json/url/VCAwWHMpf8tBh97hTODyAxEgbcKNBDxp/${encodeURIComponent(info)}`,
      headers: {}
    };

    await axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data.risk_score));
        // alert(JSON.stringify(response.data.risk_score))
        setInfo(JSON.stringify(response.data.risk_score));
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
        <p>
          Score : {info}
        </p>
      </div>
    </>
  )
}

export default App
