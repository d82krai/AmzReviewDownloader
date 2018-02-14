flag = false;
filename = "";

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting == "download") {
            filename = request.filename;
            flag = true;
            try {
                chrome.downloads.download({
                    url: request.link,
                });
                sendResponse({
                    farewell: 'File: ' + filename + ' downloaded'
                });
            } catch (err) {
                alert("Error: " + err.message);
            }
        }
    });

chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
    if (flag) {
        flag = false;
        suggest({
            filename: filename
        });
    }
});

// listen for our browerAction to be clicked
chrome.browserAction.onClicked.addListener(function (tab) {
	// for the current tab, inject the "inject.js" file & execute it
	chrome.tabs.executeScript(tab.ib, {
		file: 'inject.js'
	});
});
