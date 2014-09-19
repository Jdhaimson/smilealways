/************************ REDIRECT CODE ***********************/
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    return detectRedirect(details);
}, {
    urls : ["<all_urls>"],
    types: ["main_frame","sub_frame"]
}, ["blocking"]);


function detectRedirect(details) {
    var url = details.url;
    
    if (url == null) {
        return;
    }
    
    // ignore links with these strings in them
    var filter = "(sa-no-redirect=)|(redirect=true)|(redirect.html)|(/gp/dmusic/cloudplayer)|(/gp/wishlist)|(aws.amazon.com)";
    
    // Don't block our own (or someone else's) affiliate tag
    if (localStorage.saUseAffiliateCode && !localStorage.saUseSmile) {
        filter = "(tag=)|" + filter;
    }
    
    // Don't try and redirect pages that are in our filter
    if (url.match(filter) != null) {
        return;
    }
    
    newUrl = url;
    
    // Add smile.amazon.com if necessary
    if (localStorage.saUseSmile) {
        newUrl = url.replace(/(https?:\/\/)(www\.amazon\.com|amazon\.com)(.*)/i, "$1smile.amazon.com$3");
    }
    
    // Add tag parameter if it doesn't exist
    if (localStorage.saUseAffiliateCode) {
        if (url.indexOf("?") < 0) {
            newUrl = newUrl + "?tag=" + localStorage.saAffiliateCode;
        } else if (!url.match(/\?.*tag=[^\&]*.*/i)) {
            newUrl = newUrl.replace(/(\?.*)/i, "$1&tag=awefawf");
        }
    }
    
    // Add the no-redirect parameter
    if (newUrl.indexOf("?") < 0) {
        newUrl += "?sa-no-redirect=1";
    } else {
        newUrl += "&sa-no-redirect=1";
    }
    
    // If it's the same URL, stop here
    if (newUrl === url) {
        return;
    }
    
    return {
        redirectUrl: newUrl
    };
}
