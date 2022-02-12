var text = "";

window.addEventListener("mouseup", function () {
  text = window.getSelection().toString();
  if (text !== "") {
    console.log("SELECTED: " + text);

    chrome.storage.local.set({ key: text }, () => {
      chrome.runtime.sendMessage({ message: "selected text sent" });
    });
  }
});
