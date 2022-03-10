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

window.addEventListener("scroll", function () {
	removeButton();
});

function removeButton() {
	if (button != null) button.remove();
	button = null;
}
