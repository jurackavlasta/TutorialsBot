function initializeCookieConsent() {

    document.getElementById("html").innerHTML += `<div id="cookieConsent">
    This website uses cookies to enhance your experience. By continuing to browse, you agree to the use of cookies. 
    <a href="/privacy-policy" style="color: #00aaff; text-decoration: underline;">Learn more</a>.
    <button id="acceptCookies">Accept</button>
    <button id="declineCookies">Decline</button>
</div>`;

    // Check if user has already consented
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        document.getElementById('cookieConsent').style.display = 'none';
        enableAnalytics(); // Function to enable Google Analytics
    }

    // Handle acceptance of cookies
    document.getElementById('acceptCookies').addEventListener('click', function () {
        localStorage.setItem('cookiesAccepted', 'true');
        document.getElementById('cookieConsent').style.display = 'none';
        enableAnalytics(); // Function to enable Google Analytics
    });

    // Handle decline of cookies
    document.getElementById('declineCookies').addEventListener('click', function () {
        localStorage.setItem('cookiesAccepted', 'false');
        document.getElementById('cookieConsent').style.display = 'none';
    });

    // Enable Google Analytics if cookies are accepted
    function enableAnalytics() {
        // Insert your Google Analytics script here
        console.log('Google Analytics enabled.');

        var script = document.createElement('script');
        script.src = "https://www.googletagmanager.com/gtag/js?id=G-KEFFF7S0YP";
        script.async = true;

        document.head.appendChild(script);

        script = document.createElement('script');
        script.innerHTML = `        
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }

        gtag('js', new Date());
        gtag('config', 'G-KEFFF7S0YP');`;

        document.head.appendChild(script);
    }
}
