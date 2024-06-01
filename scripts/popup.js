document
  .getElementById("api_key_form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById(
      "key_received"
    ).style = `color: green; display: block`;
    const API_KEY = document.getElementById("api_key_input").value;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (text) => {
          window.dispatchEvent(
            new CustomEvent("api_key_submitted", { detail: text })
          );
        },
        args: [API_KEY],
      });
    });
  });

const get_api_key = () => {
  return API_KEY;
};
