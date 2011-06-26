// ==UserScript==
// @name          Drostie's FigHunter Chat Script
// @version       1.4
// @namespace     http://code.drostie.org/
// @include       http://www.fighunter.com/*
// @match         http://www.fighunter.com/*
// ==/UserScript==

/* PRELUDE: Contains a bunch of utilities to help with debugging. */

var script_name = "Drostie's Fig Hunter Utils";

var running = true, 
    local_window = window,
    storage = window.localStorage,
    jQuery = window.jQuery;
    
function sandbox(section, f) {
    "use strict";
    try { 
        if (running) {
            return f();
        }
    } catch (e) {
        running = false;
        alert("The '" + script_name + "' script generated an error:" + 
            "\nSection: " + section +
            "\nError: " + e
        );
    }
}

sandbox("test settings storage", function () {
    function storage_test() {
        storage.storage_test = 123;
        storage.storage_test += 1;
        delete storage.storage_test;
    }
    try {
        storage_test();
    } catch (e) {
        if (typeof unsafeWindow !== "undefined") {
            local_window = unsafeWindow;
            storage = unsafeWindow.localStorage;
            if (typeof window.jQuery === "undefined") {
                jQuery = unsafeWindow.jQuery;
            }
        }
        storage_test();
    }
});

// SCRIPT: the remainder of this file can be scanned with JSLint.

/*jslint white: false, onevar: true, undef: true, nomen: true, regexp: true, plusplus: true, bitwise: true, newcap: false, strict: true */
/*global jQuery, storage: true, alert, document, local_window, decodeURIComponent, running: true, sandbox */

//
var dchat = {}, // global namespace for chat script variables.
    $ = jQuery;

sandbox("init URL params", function () {
    "use strict";
    dchat.url_params = {};
    if (typeof local_window.location.search === "string") {
        local_window.location.search.slice(1).split("&").map(
            function (x) {
                x = x.split("=");
                x = [x[0], x.slice(1).join("=")].map(decodeURIComponent);
                dchat.url_params[x[0]] = x[1];
            }
        );
    }
    dchat.default_colors = {
        CYN: "[#4CD5FE]", GRN: "[#80a464]", BLU: "[#188BB6]", 
        RED: "[#cc4040]", PPL: "[#a5c]",    ORG: "[#d85]",    
        GRY: "[#aaa]",    BWN: "[#776655]", PNK: "[#f8f]",    
        GLD: "[#a9a954]", BLK: "[#585163]", WHT: "[#fff8f0]",    
        TQS: "[#2bc]",    LIM: "[#a0c444]", SKY: "[#ccccff]",    
        YEL: "[#cc4]",    BEG: "[#dca]",    YLT: "[#297529]",    
        NVY: "[#77a]",    SCR: "[#FF6450]", LLC: "[#b8a2c8]",    
        RYL: "[#8f8040]", SYS: "[#f90]"
    };
});

// stop if user is not logged in:
running = running && $("#topbar span").length > 0;

sandbox("init custom params", function () {
    "use strict";
    // e.g. :: storage.dchat_color = "[#d48933]";
});

// Every page gets the "Chat Options" menu.
sandbox("chat options menu", function () {
    "use strict";
    var topbar = $("#topbar"),
        theme = $("span", topbar).get(0).className.substring(0, 3),
        default_color = dchat.default_colors[theme],
        default_nicks = $("span a", topbar).text(),
        chat_opts_display = false,
        menu;
    
    // load color and nicks from storage.
    dchat.color = typeof storage.dchat_color === "string" ?
        storage.dchat_color : default_color;
    dchat.nicks = typeof storage.dchat_color === "string" ?
        storage.dchat_names : default_nicks;
    dchat.autocolor = storage.dchat_autocolor !== "false";

    menu = $(
        '<ul class="darkchoc logicalbox">' +
        '<li><label>Autocolor On?</label> <input id="dchat_autocolor" type="checkbox" /></li>' + 
        '<li><label>Color</label> <input id="dchat_color" type="text" /></li>' + 
        '<li style="display: none"><label>Nicks</label> <input id="dchat_nicks" type="text" /></li>' + 
        '<li><a id="dchat_hide" href="#"> - Hide - </a></li>' + 
        '</ul>'
    ).get(0);
    // The menu has inputs which receive text, but Pseudo has a set of 
    // keydown and keyup events on the document which focus the chat 
    // textarea. This stops those events from propagating up past the <ul>.
    function stop_propagation(event) {
        event.stopPropagation();
    }
    menu.addEventListener("keydown", stop_propagation, true);
    menu.addEventListener("keyup", stop_propagation, true);

    // HTML and CSS for the "Chat options" link and the menu and its items.
    $("a[href=?page=editstats]", topbar).before(
        '<a id="dchat_opts" href="#">Chat Options</a>&nbsp;&nbsp; | &nbsp;&nbsp;'
    );
    // There are two links that can toggle the display
    // of the "Chat Options" menu:
    function toggle_menu() {
        if (chat_opts_display) {
            $(menu).slideUp("slow");
            chat_opts_display = false;
        } else {
            $(menu).slideDown("slow");
            chat_opts_display = true;
        }
    }
    $("#dchat_opts").click(toggle_menu);
    $("#dchat_hide", menu).click(toggle_menu);
    // Styling for the menu items.
    $(menu).css({
        display: "none", position: "fixed", right: "90px", top: "12px", 
        "list-style-type": "none", "list-style-image": "none", 
        width: "150px", padding: "0.5em" 
    });
    $("li", menu).css({
        position: "relative", height: "20px", width: "130px", 
        "text-align": "center"
    });
    $("label", menu).css({position: "absolute", top: "3px", left: "0px"});
    $("#dchat_hide", menu).css({position: "relative", top: "5px"});
    $("input", menu).css({width: "90px", position: "absolute", right: "0px"});
    // bind events to the input elements created:
    function track(input, binding, default_value, type) {
        if (type === "checkbox") {
           input.checked = dchat[binding];
            $(input).change(function () {
                dchat[binding] = this.checked ?
                    default_value : this.checked;
                storage["dchat_" + binding] = dchat[binding].toString();
            });
        } else {
            input.value = dchat[binding];
            $(input).change(function () {
                dchat[binding] = this.value === "" ?
                    default_value : this.value;
                storage["dchat_" + binding] = dchat[binding];
            });
        }
    }
    $("input", menu).map(function () {
        switch (this.id) {
            case "dchat_color":
                track(this, "color", default_color);
            break;
            case "dchat_autocolor":
                track(this, "autocolor", "true", "checkbox");
            break;
            case "dchat_nicks":
                track(this, "nicks", default_nicks);
            break;
        }
    });
    document.body.appendChild(menu);
});

function chat_edit() {
    "use strict";
    function colorize(string) {
        // `either` detects either a color start or end tag;
        // `empty` detects a color tag containing only whitespace.
        if (dchat.autocolor === false) {
            return string;
        }
        var either = /\[\/?h\]|\[#[0-9a-f]{6}\]|\[\/#\]/gi,
            empty  = /\[#[0-9a-f]{6}\](\s*)\[\/#\]/gi,
            denest = function (x) {
                switch (x) {
                    case "[/#]":
                    case "[/h]":
                        return x + dchat.color;
                    case "[h]":
                        return "[/#][h][#845077]";
                    default:
                        return "[/#]" + x;
                }
            },
            tmp = dchat.color + string.replace(either, denest) + "[/#]";
        return tmp.replace(empty, "$1");
    }
    function handle_pm(string, fun) {
        var regex = /^(?:@[a-z0-9 ]+: )?/i,
            match = regex.exec(string)[0];
        return match + fun(string.slice(match.length));
    }
    var text = $("#input_area"),
        multimatch = null;

    // Enter key -- color overrides.
    text.keydown(function (event) {
        if (event.keyCode === 13) { // Enter
            try {
                this.value = handle_pm(this.value, function (v) {
                    var id;
                    if (v.slice(0, 4) === "/me ") {
                        id = $("#topbar span a").get(0).href
                            .match(/[?&]u=(\d+)/)[1];
                        v = "[u" + id + "] " + v.slice(4);
                    }
                    return colorize(v);
                });
            } catch (e) {
                alert(e);
            }
        }
    });
    
    // Tab key -- tab complete
    function tab_complete(name, params) {
        var p = params, 
            base = p.string.slice(0, p.start) + name;
        if (p.start === 0 || 
            (p.start === 1 && base.charAt(0) === "@")) {
            base += ': ';
        }
        p.target.value = base + p.string.slice(p.end);
        p.target.selectionStart = base.length;
        p.target.selectionEnd = base.length;
        p.target.focus();
    }
    text.keydown(function (event) {
        if (event.keyCode === 9) { // Tab
            if (multimatch === null) {
                var start, end, members, match, regex, params;
                end = this.selectionEnd;
                regex = /\b([a-z0-9]*?)$/i;
                match = this.value.substring(0, end)
                    .match(regex)[1].toLowerCase();
                start = end - match.length;
                params = { 
                    start: start, 
                    end: end, 
                    string: this.value,
                    target: this
                };
                members = $("#PeopleList span.nobr a")
                    .map(function () { return this.innerHTML; })
                    .filter(function () {
                        return (this.length >= match.length) &&  
                            this.slice(0, match.length).toLowerCase() === match;
                    });
                if (members.length > 1) {
                    multimatch = {
                        current: 0, 
                        members: members, 
                        params: params,
                        increment: function () {
                            this.current += 1;
                            this.current %= this.members.length;
                        },
                        get: function () {
                            return this.members[this.current];
                        }
                    };
                }
                if (members.length >= 1) {
                    tab_complete(members[0], params);
                }
            } 
        } else {
            multimatch = null;
        }
    });
    $("input.button").keydown(function (event) {
        if (event.keyCode === 9 && multimatch !== null) {
            multimatch.increment();
            tab_complete(multimatch.get(), multimatch.params);
        }
    });
}

function history_context() {
    "use strict";
    $("tr a.by").map(function () {
        var id, row, cell, link;
        id = this.getAttribute("onmouseover").match(/(\d+),this\);$/)[1];
        if (id === null) { 
            return;
        }
        link = document.createElement("a");
        link.innerHTML = "[Context]";
        link.setAttribute("href", "?page=comment_single&c=" + id);
        
        row = this;
        while (row.nodeName.toLowerCase() !== "tr") {
            row = row.parentNode;
        }
        cell = row.childNodes[0];
        cell.appendChild(document.createElement("br"));
        cell.appendChild(link);
    });
}

function user_rating(id) {
    "use strict";
    function sum(arr) {
        var x = 0;
        arr.map(function (n) { x += n; });
        return x;
    }
    function mean_rating(arr) {
        return sum(arr.map(function (x, i) {
            return x * (i - 3);
        })) / sum(arr);
    }
    function round(x) {
        return Math.round(10000 * x) / 10000;
    }
    function rating_dev(arr) {
        var m = mean_rating(arr),
            s = Math.sqrt(
            sum(arr.map(function (x, i) {
                return x * Math.pow(i - 3 - m, 2);
            })) / (sum(arr) - 1)
        ) / Math.sqrt(sum(arr));
        return round(m) + " ± " + round(s);
    }
    function reverse(x) {
        var y = [], i;
        for(i = 0; i < x.length; i += 1) {
            y.push(x[x.length - i - 1]);
        }
        return y;
    }
    $.get("http://www.fighunter.com/get7ratings.php",
        {db: "FHF2_accounts", sid: id}, function (data) {
            var x =  $("span", $(data)).map(function () {
                return this.innerHTML - 0;
            }),
                location = $("td.ar1")[0].parentNode.parentNode,
                row = $("tr", $('<table><tr><td class="ar1">' + 
                    'Actual rating:</td><td>' + rating_dev(reverse(x)) + 
                    '</td></tr></table>'))[0];
            location.appendChild(row);
    });
}
// branch based on location
switch (local_window.location.pathname) {
    case "/":
    case "/index.php":
        switch (dchat.url_params.page) {
            case "chat":
                sandbox("init chat_edit", chat_edit);
            break;
            case "history_comments":
                sandbox("add context links", history_context);
            break;
            case "userpage":
                sandbox("add real rating", function () {
                    "use strict";
                    user_rating(dchat.url_params.u);
                });
            break;
        }
    break;
    /* commented out until I can figure out how to get this working.
    case "forum_thread":
    case "forum":
        $("form textarea").blur(function () {
            this.value = colorize(this.value);
        });
    break;
    */
}
