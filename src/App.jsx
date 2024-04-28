import { useState, useEffect, useRef } from 'react'
import axios from 'axios';

function App() {
  const myRef = useRef(null);
  const [info, setInfo] = useState("")
  const [currentTab, setCurrentTab] = useState(1);
  const [currentUrl, setCurrentUrl] = useState("");
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);

  const checkSpam = async () => {
    setLoad(true);
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log([tab][0].url);
    setCurrentUrl([tab][0].url);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        URL

      }
    })
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://www.ipqualityscore.com/api/json/url/VCAwWHMpf8tBh97hTODyAxEgbcKNBDxp/${encodeURIComponent([tab][0].url)}`,
      headers: {}
    };

    await axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data.risk_score));
        // alert(JSON.stringify(response.data.risk_score))
        setLoad(false);
        setShow(true);
        myRef.current.style.transform = `rotate(${response.data.risk_score * 1.8}deg)`;
        setInfo(JSON.stringify(response.data.risk_score));
        // myRef.current.style.transform = `rotate(${info * 1.8}deg)`;

      })
      .catch((error) => {
        console.log(error);
      });
    myRef.current.style.transform = `rotate(${info * 1.8}deg)`;

  }

  const checkProbability = async () => {
    setLoad(true);
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log([tab][0].url);
    setCurrentUrl([tab][0].url);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        URL

      }
    })
    let config = {
      method: 'get',
      url: `http://127.0.0.1:4444/predict?url=${encodeURIComponent([tab][0].url)}`,
    };

    await axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data.probability));
        // alert(JSON.stringify(response.data.risk_score))
        setLoad(false);
        setShow(true);
        myRef.current.style.transform = `rotate(${Math.floor(response.data.probability * 100 * 1.8)}deg)`;
        setInfo(JSON.stringify(Math.floor(response.data.probability * 100)));
        // // myRef.current.style.transform = `rotate(${info * 1.8}deg)`;

      })
      .catch((error) => {
        console.log(error);
      });
    myRef.current.style.transform = `rotate(${Math.floor(response.data.probability * 100 * 1.8)}deg)`;

  }


  return (
    <>
      <h1>Phishing Risk Score</h1>
      <div className={`card`}>
        <div className="tabs">
          <button className={`${currentTab === 1 ? "activeTab" : "notActiveTab"}`} onClick={() => setCurrentTab(1)}>ipqualityscore</button>
          <button className={`${currentTab === 2 ? "activeTab" : "notActiveTab"}`} onClick={() => setCurrentTab(2)}>our ml model</button>
        </div>
        <div className={`${currentTab === 1 ? "show" : "hide"}`}>
          <div className='btns'>

            <button onClick={() => checkSpam()}>
              Get Phishing Risk Score
            </button>
          </div>
          {
            load &&
            <div>
              <p>Loading...</p>
            </div>
          }
          {!load && show &&
            <>
              <p>
                URL : {currentUrl}
              </p>
              <p>
                Score : {info}
              </p>

            </>
          }
          <div className={`${show ? "show" : "hide"}`}>
            <div id="el" data-value={info}>
              <span id="needle" ref={myRef} style={{ transform: `rotate(${info * 1.8}deg)`, transitionDuration: "500ms" }}></span>
            </div>
            <strong>Risk Score</strong>
          </div>
        </div>
        <div className={`${currentTab === 2 ? "show" : "hide"}`}>
          <div className='btns'>
            <button onClick={() => checkProbability()}>
              Get Phishing Risk Probabilty from Model
            </button>
          </div>
          {
            load &&
            <div>
              <p>Loading...</p>
            </div>
          }
          {!load && show &&
            <>
              <p>
                URL : {currentUrl}
              </p>
              <p>
                Score : {info}
              </p>

            </>
          }
          <div className={`${show ? "show" : "hide"}`}>
            <div id="el" data-value={info}>
              <span id="needle" ref={myRef} style={{ transform: `rotate(${info * 1.8}deg)`, transitionDuration: "500ms" }}></span>
            </div>
            <strong>Risk Score</strong>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
