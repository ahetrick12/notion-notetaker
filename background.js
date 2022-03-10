var validUrlPattern = /^((http|https|ftp):\/\/)/;
var copied_text = "";

//console.log("GOOD URL: " + tabs[0].url);
chrome.tabs.onActivated.addListener(injectScript);
chrome.tabs.onCreated.addListener(injectScript);
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
	if (changeInfo.status == "complete") {
		console.log("Loading complete");
		injectScript();
	}
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === "selected text sent") {
		chrome.storage.local.get(["key"], (result) => {
			copied_text = result.key;
			console.log("RECIEVED: " + copied_text);
		});
	}
});

function injectScript() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (validUrlPattern.test(tabs[0].url)) {
			let tabId = tabs[0].id;

			chrome.tabs.sendMessage(
				tabId,
				{ message: "are_you_there_content_script?" },
				function (msg) {
					msg = msg || {};

					if (!chrome.runtime.lastError) {
					} // Ignore lol

					if (msg.status != "yes") {
						chrome.scripting.insertCSS({
							target: { tabId: tabs[0].id },
							files: ["./styles.css"],
						});

						chrome.scripting.executeScript({
							target: { tabId: tabs[0].id },
							files: ["./textCapture.js"],
						});

						console.log("INJECTED INTO " + tabId);
					}
				}
			);
		} else {
			console.log("BAD URL");
		}
	});
}
