var validUrlPattern = /^((http|https|ftp):\/\/)/;

// Script injection listeners
chrome.tabs.onActivated.addListener(injectScript);
chrome.tabs.onCreated.addListener(injectScript);
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
	// Only inject once page is fully loaded
	if (changeInfo.status == "complete") {
		console.log("Loading complete");
		injectScript();
	}
});

function injectScript() {
	// Get current tab info
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		// Only inject with valid URLs
		if (validUrlPattern.test(tabs[0].url)) {
			let tabId = tabs[0].id;

			// Check if script has already been injected by sending a message
			// If it is already present it will send back a "yes"
			chrome.tabs.sendMessage(
				tabId,
				{ message: "are_you_there_content_script?" },
				function (msg) {
					msg = msg || {};

					// Ignore errors lol
					if (chrome.runtime.lastError) {
					}

					// Inject scripts if no response
					if (msg.status != "yes") {
						runScriptInjection();
					}
				}
			);
		} else {
			console.log("BAD URL");
		}
	});
}

function runScriptInjection() {
	// All injection and insertion processes
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === "selected text sent") {
		chrome.storage.local.get(["key"], (result) => {
			let copied_text = result.key;
			console.log("RECIEVED: " + copied_text);
		});
	}
});
