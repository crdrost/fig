// ==UserScript==
// @name           Drostie's Fig Hunter custom stylesheet
// @namespace      http://fig.drostie.org/
// @include        http://www.fighunter.com/*
// @include        http://www.fighunter.com/
// ==/UserScript==

function array(x) {
    return Array.prototype.slice.call(x, 0);
}
function add_class(e, c) {
    if (e.className === "") {
        e.className = c;
    } else if (e.className.search(new RegExp("\\b" + c + "\\b")) === -1) {
        e.className += " " + c;
    }
}
function remove_class(e, c) {
    e.className = e.className.split(" ").filter(function (x) {
        return x !== c;
    }).join(" ");
}

// Shift into mobile-mode when there's less than 700 px.
if (window.innerWidth <= 700) {
    add_class(document.body, "mobile-mode");
}
window.addEventListener('resize', function (x) {
    if (window.innerWidth <= 700) {
        add_class(document.body, "mobile-mode");
    } else {
        remove_class(document.body, "mobile-mode");
    }
});

// Hide words "PMs" and "Messages", leave only the numbers.
array(document.getElementById("user-controls").childNodes).map(function (x) {
    if (x.nodeName === "A") {
        x.innerHTML = (/^\s*(\d+|[a-z]+)/i).exec(x.textContent)[1];
    }
});

// Inject custom stylesheet
var ss = document.createElement("link");
    ss.setAttribute("rel", "stylesheet");
    ss.setAttribute("href", "http://fig.drostie.org/new_site_mod.css");

document.getElementsByTagName("head")[0].appendChild(ss);

// Hide ads after three seconds
setTimeout(function () {
    array(document.getElementsByTagName("iframe")).map(function (x) {
        x.style.display = "none";
    });
}, 3000);
