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

    var expression = /(https?:\/\/)www\.amazon\.([a-z]{2,4})/gi;
    var regex = new RegExp(expression);
    // ignore links with these strings in them
    var filter = "(sa-no-redirect=)"
               + "|(redirect=true)"
               + "|(redirect.html)"
               + "|(r.html)"
               + "|(f.html)"
               + "|(/gp/dmusic/cloudplayer)"
               + "|(/gp/photos)"
               + "|(/gp/wishlist)"
               + "|(/ap/)"
               + "|(aws.amazon.[a-z]{2,4})"
               + "|(read.amazon.[a-z]{2,4})"
               + "|(login.amazon.[a-z]{2,4})"
               + "|(payments.amazon.[a-z]{2,4})"
               + "|(amazon.[a-z]{2,4}/clouddrive)";

    // Don't try and redirect pages that are in our filter
    if (url.match(filter) != null) {
        return;
    }

    var match = regex.exec(url);
    if (match != null) {
        // If this is the secure link...
        return redirectToSmile(match[1], 'www.amazon.' + match[2], url, match[2]);
    }

}

function redirectToSmile(scheme, amazonurl, url, tld) {
    var smileurl = "smile.amazon." + tld;
    return {
        // redirect to amazon smile append the rest of the url
        redirectUrl : scheme + smileurl + getRelativeRedirectUrl(amazonurl, url)
    };
}

function getRelativeRedirectUrl(amazonurl, url) {
    var relativeUrl = url.split(amazonurl)[1];
    var noRedirectIndicator = "sa-no-redirect=1";
    var paramStart = "?";
    var paramStartRegex = "\\" + paramStart;
    var newurl = null;

    // check to see if there are already GET variables in the url
    if (relativeUrl.match(paramStartRegex) != null) {
        newurl = relativeUrl + "&" + noRedirectIndicator;
    } else {
        newurl = relativeUrl + paramStart + noRedirectIndicator;
    }
    return newurl;
}
