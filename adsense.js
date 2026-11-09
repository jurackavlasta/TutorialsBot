var adSenseLoaded = false;

function addAdSence() {
    setTimeout(function () {
        var script = document.createElement('script');
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1253488304183553";
        script.async = true;
        script.setAttribute("data-ad-client", "ca-pub-1253488304183553");
        script.setAttribute("crossorigin", "anonymous");
    
        document.head.appendChild(script);
    }, 500);
}

window.onscroll = function () {
    if(!adSenseLoaded) {
        adSenseLoaded = true;
        addAdSence();
    }
};