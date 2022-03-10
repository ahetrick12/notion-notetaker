//let active_tab_id = 0;
var copied_text = "";

chrome.tabs.onActivated.addListener(injectScript);
chrome.tabs.onUpdated.addListener(injectScript);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === "selected text sent") {
		chrome.storage.local.get(["key"], (result) => {
			copied_text = result.key;
			console.log("RECIEVED: " + copied_text);
		});
	}
});

function injectScript(tabId) {
	try {
		chrome.tabs.get(tabId, async (current_tab_info) => {
			//active_tab_id = tabId;
			//if (!/^chrome:\/\//.test(current_tab_info.url)) {
			chrome.tabs.insertCSS(tabId, { file: "./styles.css" });
			chrome.tabs.executeScript(
				null,
				{ file: "./textCapture.js" },
				(_) => {
					let e = chrome.runtime.lastError;
					if (e !== undefined) {
						console.log(tabId, _, e);
					}
				}
			);
			//}
		});
	} catch (error) {
		console.log(error);
	}
}
