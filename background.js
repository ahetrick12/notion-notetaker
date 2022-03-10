//let active_tab_id = 0;
var copied_text = "";

try {
	chrome.tabs.onActivated.addListener(injectScript);
	chrome.tabs.onUpdated.addListener(injectScript);
} catch (error) {
	console.log(error);
}

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

			chrome.scripting.insertCSS({
				target: { tabId: tabId },
				files: ["./styles.css"],
			});

			chrome.scripting.executeScript({
				target: { tabId: tabId },
				files: ["./textCapture.js"],
			});
		});
	} catch (error) {
		console.log(error);
	}
}
