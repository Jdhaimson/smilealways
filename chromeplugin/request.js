chrome.webRequest.onBeforeRequest.addListener(function(details) {
    return detectRedirect(details);
}, {
    urls : ["<all_urls>"],
    types: ["main_frame","sub_frame"]
}, ["blocking"]);

// inject script into web site
chrome.tabs.executeScript(null, {
  code: "chrome.extension.sendRequest({ref: document.referrer}, function(response) {})"
}

function detectRedirect(details) {
    var url = details.url;
    
    if (url == null) {
        return;
    }
    
    var http = "http://";
    var https = "https://";
    var amazonurl = "www.amazon.com";
    // ignore links with these strings in them
    var filter = "(sa-no-redirect=)|(redirect=true)|(redirect.html)|(/gp/wishlist)|(aws.amazon.com)";
    
    // Don't try and redirect pages that are in our filter
    if (url.match(filter) != null) {
        return;
    }

    if (url.match(http + amazonurl) != null) {
        // If this is the non-secure link...
        return redirectToSmile(http, amazonurl);
        
    }  else if (url.match(https + amazonurl) != null) {
        // If this is the secure link...
        return redirectToSmile(https, amazonurl);
        
    }
}

function redirectToSmile(scheme, amazonurl) {
    var smileurl = "smile.amazon.com";
    return {
        // redirect to amazon smile append the rest of the url
        redirectUrl : scheme + smileurl + getRelativeRedirectUrl(amazonurl)
    };
}

function getRelativeRedirectUrl(amazonurl) {
    var relativeUrl = url.split(amazonurl)[1];
    var noRedirectIndicator = "sa-no-redirect=1";
    var paramStart = "?";
    if (relativeUrl && relativeUrl != paramStart) {
        return relativeUrl + "&" + noRedirectIndicator;
    }
    return paramStart + noRedirectIndicator;
}
