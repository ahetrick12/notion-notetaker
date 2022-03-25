/**
 * Global vars
 */

var copied_text = "";

/**
 * Listeners
 */

chrome.storage.onChanged.addListener(function (changes, namespace) {
	// Log changes to storage when storage is changed
	for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
		console.log(
			`Storage key "${key}" in namespace "${namespace}" changed.`,
			`Old value was "${oldValue}", new value is "${newValue}".`
		);

		if (key == "key") {
			setText();

			console.log("ONCHANGED: " + copied_text);
			break;
		}
	}
});

document.addEventListener("DOMContentLoaded", function () {
	// Set the text when the DOM is loaded
	setText();
});

/**
 * Helper functions
 */

function setText() {
	// Put stored text into the text box
	chrome.storage.local.get(["key"], (result) => {
		copied_text = result.key;
		document.getElementById("node-id").innerHTML = copied_text;
	});
}
