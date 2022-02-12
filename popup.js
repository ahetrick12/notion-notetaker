var copied_text = "";

function setText() {
  chrome.storage.local.get(["key"], (result) => {
    copied_text = result.key;
    document.getElementById("node-id").innerHTML = copied_text;
  });
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
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
  setText();
});
