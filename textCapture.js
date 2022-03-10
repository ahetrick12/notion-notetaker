var button = null;

window.addEventListener("click", function (e) {
	var textSelection = this.document.getSelection();
	var text = textSelection.toString();

	// Store selected text in local storage
	if (text !== "") {
		console.log("SELECTED: " + text);

		chrome.storage.local.set({ key: text }, () => {
			chrome.runtime.sendMessage({ message: "selected text sent" });
		});

		// Create popup button
		if (button == null) {
			button = document.createElement("div");
			button.className = "nn-popup-button";
			document.body.appendChild(button);
			button.innerText = "test123";
			button.setAttribute(
				"style",
				"position: fixed; top: 0px; left: 0px; z-index: 2147483642;"
			);
		}
	} else {
		removeButton();
	}
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// Message comes from background to see if a script  has already been injected
	if (request.message === "are_you_there_content_script?") {
		sendResponse({ status: "yes" });
	}
});

// Remove the button when you scroll, can't update its position in realtime
window.addEventListener("scroll", function () {
	removeButton();
});

function removeButton() {
	if (button != null) button.remove();
	button = null;
}
