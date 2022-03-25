/**
 * Global vars
 */

var validUrlPattern = /^((http|https|ftp):\/\/)/;

/**
 * Tab listeners
 */

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

/**
 * Message listeners
 */

chrome.runtime.onMessage.addListener(function (request) {
	if (request.message === "selected_text_sent") {
		chrome.storage.local.get(["key"], (result) => {
			let copied_text = result.key;
			console.log("RECIEVED: " + copied_text);
		});
	}

	// "return true" makes the listener async
	return true;
});

/**
 * Script functions
 */

function injectScript() {
	// Get current tab info
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		// Only inject with valid URLs
		if (validUrlPattern.test(tabs[0].url)) {
			let tabId = tabs[0].id;

			// Check if script has already been injected by sending a message
			// If it is already present it will send back a "yes"
			// tabs.sendMessage sends message to content scripts in a specific tabId
			chrome.tabs.sendMessage(
				tabId,
				{ message: "are_you_there_content_script?" },
				function (msg) {
					msg = msg || {};

					if (chrome.runtime.lastError) {
						// Ignore errors lol
					}

					// Inject scripts if no response
					if (msg.status != "yes") {
						runScriptInjection(tabId);
					}
				}
			);
		} else {
			console.log("BAD URL");
		}
	});
}

function runScriptInjection(tabId) {
	// All injection and insertion processes
	chrome.scripting.insertCSS({
		target: { tabId: tabId },
		files: ["styles.css"],
	});

	chrome.scripting.executeScript({
		target: { tabId: tabId },
		files: ["foreground/text-capture.js"],
	});

	console.log("INJECTED INTO " + tabId);
}
