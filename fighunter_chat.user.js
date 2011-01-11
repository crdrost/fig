// ==UserScript==
// @name           FigHunter Chat
// @namespace      http://code.drostie.org/
// @include        http://www.fighunter.com/index.php?page=chat
// ==/UserScript==
var params = {}, $ = unsafeWindow.jQuery;

var color = "[#70b32d]", 
	names = ["Drostie"]; // for eventual use in pinging a user when their name is used.

/*
// commented out until I figure out what I'm going to do with the 
// DOMNodeInserted events fired by #ChatMessages. 
(function () {
	// Ping notifications.
	var ping_names, 
		original_title = window.title, 
		focused = false,
		alert_interval = null;
	
	$(window).blur(function () {
		focused = false;
	});
	$(window).mousemove(function () {
		focused = true;
		if (alert_interval !== null) {
			clearInterval(alert_interval);
			alert_interval = null;
			window.title = original_title;
		}
	});

	ping_names = new RegExp(
		"\\b($1)\\b".replace("$1", names.join("|"))
	),
	
	
	function checker() {
		
	}
	var _name = "YOUR NAME",
	_re = RegExp("(" + _name + ".*?)\b", "gi"),
	_t = document.title,
	_fo = true,
	_w, _c;

	function _f() {
		$("fieldset:lt(8)").each(function () {
			var a = $(this).contents().last().text(),
				b;
			if (a.indexOf("<span") == -1) {
				b = a.replace(_re, "<span style="
				font - weight: bold;color: red ">$1</span>");
				if (b != a) {
					$(this).css("border-width", "3px").contents().last().remove();
					$(this).append(b);
					_fo || (_w = setInterval("_sw()", 1500))
				}
			}
		})
	}
	$(window).mousemove(function () {
		_fo = true;
		clearInterval(_w);
		document.title = _t
	});
	$(window).blur(function () {
		_fo = false
	});

	function _sw() {
		document.title = document.title == _t ? "New Message!" : _t
	}
	_c = setInterval("_f()", 500);

}());
// */

// Colors a string in the FigHunter BBCode for colors. Designed 
// to "de-nest" the colors, since my experiments suggested a 
// lack of support for colors nested within each other.
function colorize(string) {
	// `either` detects either a color start or end tag;
	// `empty` detects a color tag containing only whitespace.
	var either = /\[#[0-9a-f]{6}\]|\[\/#\]/gi,
		empty  = /\[#[0-9a-f]{6}\](\s*)\[\/#\]/gi,
		denest = function (x) {
			return "[/#]" + (x === "[/#]" ? color : x);
		},
		tmp = color + string.replace(either, denest) + "[/#]";	
	return tmp.replace(empty, "$1");
}
function handle_pm(string, fun) {
	var regex = /^(?:@[a-z0-9 ]+: )?/i,
		match = regex.exec(string)[0];
	return match + fun(string.slice(match.length));
}


GM_registerMenuCommand("Retrieve color", function () {
	alert(color);
});

function chat_edit(id) {
	var text = document.getElementById(id);

	// Enter key -- color overrides.
	text.addEventListener("keydown", function (event) {
		if (event.keyCode === 13) { // Enter
			try {
				text.value = handle_pm(text.value, function (v) {
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
	}, false);
	
	// Tab key -- tab complete
	var multimatch = false;
	function tab_complete(name, params) {
		var p = params, 
			base = p.string.slice(0, p.start) + name;
		if (p.start === 0 || 
			p.start === 1 && base.charAt(0) === "@") {
			base += ': ';
		}
		p.target.value = base + p.string.slice(p.end);
		p.target.selectionStart = base.length;
		p.target.selectionEnd = base.length;
		p.target.focus();
	}
	
	$("#input_area").keydown(function (event) {
		if (event.keyCode === 9) { // Tab
			if (multimatch === false) {
				var start, end, members, match, regex, params;
				end = this.selectionEnd;
				regex = /(?:^|[^a-z0-9])([a-z0-9]*?)$/i;
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
			multimatch = false;
		}
	});
	$("input.button").keydown(function (event) {
		if (event.keyCode === 9 && multimatch !== false) {
			multimatch.increment();
			tab_complete(multimatch.get(), multimatch.params);
		}
	});
}



// create the params[] associative array.
if (typeof window.location.search === "string") {
	window.location.search.slice(1).split("&").map(
		function (x) {
			x = x.split("=");
			params[x[0]] = x.slice(1).join("=");
		}
	);
}

// branch based on location
try {
	switch (window.location.pathname) {
		case "/":
		case "/index.php":
			switch (params.page) {
				case "chat":
					chat_edit("input_area");
				break;
			}
		break;
		case "forum_thread":
		case "forum":
			$("form textarea").blur(function () {
				this.value = colorize(this.value);
			});
		break;
	}
} catch (e) {
	alert(e);
}