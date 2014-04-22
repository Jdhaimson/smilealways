chrome.webRequest.onBeforeRequest.addListener(function(details) {
    return detectRedirect(details);
}, {
    urls : ["<all_urls>"],
    types: ["main_frame","sub_frame"]
}, ["blocking"]);

function detectRedirect(details) {
    var url = details.url;
    var http = "http://";
    var https = "https://";
    var amazonurl = "www.amazon.com";
    var smileurl = "smile.amazon.com";
    // ignore links with these strings in them
    var redirecturl1 = "redirect=true";
    var redirecturl2 = "redirect.html";
    var wishlistaddurl = "/gp/wishlist";

    if (url != null) {
        
        // Don't try and redirect pages that will already be redirected
        if(url.match(redirecturl1) == null && url.match(redirecturl2) == null 
            && url.match(wishlistaddurl) == null) {

            // Check non-secure links
            if(url.match(http + amazonurl) != null) {
                return{
                    // redirect to amazon smile append the rest of the url
                    redirectUrl : http + smileurl + url.split(amazonurl)[1]
                };
            }

            // Check secure links
            else if (url.match(https + amazonurl) != null) {
                return{
                    // redirect to amazon smile url and append the rest of the url
                    redirectUrl : https + smileurl + url.split(amazonurl)[1]
                };
            }
        }
    }
}

