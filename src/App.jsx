import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [info, setInfo] = useState("url");
  const oneclick = async () => {
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log([tab][0].url);
    setInfo([tab][0].url);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // alert("Hello from extension");
        return document.documentElement.outerHTML;
      }
    }, (result) => {

      const htmlContent = result[0].result;

      // Parse the HTML content to extract relevant information
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Example: Extracting title and HasTitle

      const title = doc.querySelector('title').innerText;
      const hasTitle = title.length > 0;
      // extracting lines of code
      const lines = htmlContent.split("\n").length;
      console.log("lines of code", lines);
      // Largest line length
      let max = 0;
      let maxLine = "";
      let linesOfCode = htmlContent.split("\n");
      linesOfCode.forEach(line => {
        if (line.length > max) {
          max = line.length;
          maxLine = line;
        }
      });
      console.log("max line length", max);
      // Url title match score
      const url = [tab][0].url;
      let urlTitleMatch = 0;
      let titleWords = title.split(" ");
      let urlWords = url.split("/");
      titleWords.forEach(word => {
        if (urlWords.includes(word)) {
          urlTitleMatch++;
        }
      });
      console.log("url title match", urlTitleMatch);
      // Domain title match score
      let domain = new URL(url).hostname;
      let domainScore = 0;
      let domainWords = domain.split(".");
      titleWords.forEach(word => {
        if (domainWords.includes(word)) {
          domainScore++;
        }
      });
      console.log("domain title match", domainScore);
      // Has Fav Icon
      let hasFavIcon = false;
      let favIcon = doc.querySelectorAll('link[rel="icon"]');
      if (favIcon.length > 0) {
        hasFavIcon = true;
      }
      console.log("has fav icon", hasFavIcon);
      //  Number of url redirect
      let redirect = 0;
      let redirectUrl = doc.querySelectorAll('meta[http-equiv="refresh"]');
      if (redirectUrl.length > 0) {
        redirect = redirectUrl.length;
      }
      console.log("redirect", redirect);
      // Number of Self Redirect
      let selfRedirect = 0;
      let selfRedirectUrl = doc.querySelectorAll('a');
      selfRedirectUrl.forEach(link => {
        if (link.href === [tab][0].url) {
          selfRedirect++;
        }
      });
      console.log("self redirect", selfRedirect);
      // Example: Extracting number of images

      const images = doc.querySelectorAll('img');
      const numberOfImages = images.length;
    
      // Example: Extracting number of CSS files
      const cssLinks = doc.querySelectorAll('link[rel="stylesheet"]');
      const numberOfCSSFiles = cssLinks.length;

      // You can extract other information similarly

      // Now you can use the extracted information as per your requirement
      console.log('Title:', title);
      console.log('Number of images:', numberOfImages);
      console.log('Number of CSS files:', numberOfCSSFiles);

      // Set the extracted information to your state or perform further actions
      setInfo(`Title: ${title}, Number of images: ${numberOfImages}, Number of CSS files: ${numberOfCSSFiles} , lines of code: ${lines}, max line length: ${max}, url title match: ${urlTitleMatch}, domain title match: ${domainScore}, has fav icon: ${hasFavIcon}, redirect: ${redirect}, self redirect: ${selfRedirect} `);

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
