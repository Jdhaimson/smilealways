/************************ REDIRECT CODE ***********************/
browser.webRequest.onBeforeRequest.addListener(function(details) {
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

    var domain = url_domain(url);
    var amazonurl = "www.amazon.com";
    var country = "com";
    if (domain.includes("amazon.de")) {
    	amazonurl = "www.amazon.de";
    	country = "de";
    }

    var https = "https://";
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
               + "|(aws.amazon.com)"
               + "|(read.amazon.com)"
               + "|(login.amazon.com)"
               + "|(payments.amazon.com)"
               + "|(amazon.com/clouddrive)"
               + "|(aws.amazon.de)"
               + "|(read.amazon.de)"
               + "|(login.amazon.de)"
               + "|(payments.amazon.de)"
               + "|(amazon.de/clouddrive)"
               + "|(http://)"; //all Amazon pages now redirect to HTTPS, also fixes conflict with HTTPS Everywhere extension

    // Don't try and redirect pages that are in our filter
    if (url.match(filter) != null) {
        return;
    }

    return redirectToSmile(https, amazonurl, url, country);
}

function redirectToSmile(scheme, amazonurl, url, country) {
    var smileurl = "smile.amazon.com";
    if (country === "de") {
    	smileurl = "smile.amazon.de";
    }
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

function url_domain(data) {
  var    a      = document.createElement('a');
         a.href = data;
  return a.hostname;
}