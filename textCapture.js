// var text = "";
// var element = null;
var popup = null;

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
		if (popup == null) {
			popup = document.createElement("div");
			popup.className = "nn-popup-button";
			document.body.appendChild(popup);
			popup.innerText = "test123";
			popup.setAttribute(
				"style",
				"position: fixed; top: 0px; left: 0px; z-index: 2147483642;"
			);
		}
	} else {
		removePopup();
	}
});

window.addEventListener("scroll", function () {
	removePopup();
});

function removePopup() {
	if (popup != null) popup.remove();
	popup = null;
}
