import { useState, useEffect, useRef } from 'react'
import axios from 'axios';

function App() {
  const myRef = useRef(null);
  const [info, setInfo] = useState("")
  const [previousUrl, setPreviousUrl] = useState("")
  useEffect(() => {
    chrome.storage.local.get(['url'], (result) => {
      console.log("result")
      if (result.url) {
        setInfo(result.url);
      }
    });

    const tabUpdatedHandler = (tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url !== info) {
        setInfo(tab.url);
        chrome.storage.local.set({ url: tab.url });
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
        myRef.current.style.transform = `rotate(${response.data.risk_score*1.8}deg)`;
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
        <div className='btns'>
          <button onClick={() => oneclick()}>
            Check spam
          </button>
          <button onClick={() => checkSpam()}>
            API Call
          </button>
        </div>
        <p>
          Score : {info}
        </p>
        <p>
          Previous Url: {previousUrl}
        </p>

        <div>
          <div id="el" data-value={info}>
            <span id="needle" ref={myRef}></span>
          </div>
          <strong>Risk Score</strong>
        </div>
      </div>
    </>
  )
}

export default App
