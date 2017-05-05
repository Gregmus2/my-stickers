// chrome.storage.local.remove(['vkaccess_token'], function(){});
chrome.storage.local.get({'vkaccess_token': {}}, function(items) {
	console.log(items);
    if (typeof(items.vkaccess_token) == 'object'){
        var authUrl = 'https://oauth.vk.com/authorize?client_id=5637892&scope=messages,photos,offline&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token';
        chrome.tabs.create({url: authUrl,selected: true}, function(tab)       {
            var authTabId = tab.id;
            chrome.tabs.onUpdated.addListener(function tabUpdateListener(tabId, changeInfo) {
                if (tabId == authTabId && changeInfo.url != undefined && changeInfo.status == "loading") {
                    if (changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1) {
                        var start = changeInfo.url.indexOf('access_token')+13;
                        var length = changeInfo.url.indexOf('expires_in')-1-start;
                        var token = changeInfo.url.substr(start, length);
                        chrome.storage.local.set({'vkaccess_token': token}, function() {
                            console.log('save');
                            chrome.tabs.remove(authTabId, function(){});
                        });
                    }
                }
            });
        });
    }
});
