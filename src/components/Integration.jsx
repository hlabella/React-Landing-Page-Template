// components/Integration.jsx
import React from "react";
import { useEffect } from "react";

export default function Integration() {

    useScript('https://cdn.belvo.io/belvo-widget-1-stable.js');
    return (
        <div className="integration-page">
        <h2>Integração Bancária</h2>
        <div id="belvo" />
        </div>
    );
}

// Hook
function useScript(src) {
    useEffect(
        () => {
            // Create script
            const node = document.createElement('script');
            node.src = src;
            node.type = 'text/javascript';
            node.async = true;
            node.onload = createWidget
            // Add script to document body
            document.body.appendChild(node);
        },
        [src] // Only re-run effect if script src changes
    )
}

// Insert the following code after useScript() function from Step 1.
async function createWidget() {
    // Function to call your server-side to generate the access_token and retrieve the your access token
      function getAccessToken() { 
      // Make sure to change /get-access-token to point to your server-side.
          return fetch('http://127.0.0.1:8000/belvo/token', {
                  method: 'GET'
              }) 
              .then(response => response.json())
              .then((data) => data)
              .catch(error => console.error('Error:', error))
      }
      const callback = () => {}
      const successCallbackFunction = (link, institution) => {
          // Do something with the link and institution,
          // such as associate it with your registered user in your database.
      }
      const onExitCallbackFunction = (data) => {
          // Do something with the exit data.
      }
      const onEventCallbackFunction = (data) => {
          // Do something with the exit data.
      }
      const config = {
  
          // Add your startup configuration here.
  
          callback: (link, institution) => successCallbackFunction(link, institution),
          onExit: (data) => onExitCallbackFunction(),
          onEvent: (data) => onEventCallbackFunction()
      }
      const { access } = await getAccessToken();
      window.belvoSDK.createWidget(access, config).build()
  }