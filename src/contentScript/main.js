chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse)
    {
        alert(message);
    }
)