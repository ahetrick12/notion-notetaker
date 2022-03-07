let active_tab_id = 0;
var copied_text = "";

chrome.tabs.onActivated.addListener((tab) => {
	chrome.tabs.get(tab.tabId, async (current_tab_info) => {
		active_tab_id = tab.tabId;

		chrome.tabs.insertCSS(active_tab_id, { file: "./styles.css" });
		chrome.tabs.executeScript(null, { file: "./textCapture.js" }, () =>
			console.log("I injected textCapture.js into tab " + active_tab_id)
		);
	});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === "selected text sent") {
		chrome.storage.local.get(["key"], (result) => {
			copied_text = result.key;
			console.log("RECIEVED: " + copied_text);
		});
	}
});
