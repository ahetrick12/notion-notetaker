/**
 * Global vars
 */

var button = null;

/**
 * Window + mouse listeners
 */

window.addEventListener("click", () => {
	var textSelection = this.document.getSelection();
	var text = textSelection.toString();
	var selectionRects =
		text == "" ? null : textSelection.getRangeAt(0).getClientRects();

	if (chrome.runtime.lastError) {
		// Ignore errors lol
	}

	// Store selected text in local storage
	if (button == null && text != "") {
		console.log("SELECTED: " + text);

		// Set selected text in storage for the background to retrieve
		chrome.storage.local.set({ key: text }, () => {
			// runtime.sendMessage since we are sending it from the content script to the application/extension page
			chrome.runtime.sendMessage({ message: "selected_text_sent" });
		});

		// Create popup button
		createButton(selectionRects);
	} else {
		removeButton();
	}
});

// Remove the button when you scroll, can't update its position in realtime
window.addEventListener("scroll", function () {
	removeButton();
});

/**
 * Message listeners
 */

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// Message comes from background to see if a script  has already been injected
	if (request.message === "are_you_there_content_script?") {
		sendResponse({ status: "yes" });
	}

	// "return true" makes the listener async
	return true;
});

/**
 * Helper functions
 */

function createButton(selectionRects) {
	button = document.createElement("div");
	button.className = "nn-popup-button";
	button.innerText = "test123";

	document.body.appendChild(button);

	button.setAttribute(
		"style",
		"position: fixed; top: " +
			selectionRects[0].top +
			"px; left: " +
			selectionRects[0].left +
			"px; z-index: 2147483642;"
	);
}

function removeButton() {
	if (button != null) button.remove();
	button = null;
}
