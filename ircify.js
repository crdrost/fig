/*global jQuery, $ */
function reverse(list) {
    "use strict";
    var x = [], i;
    for (i = list.length - 1; i >= 0; i -= 1) {
        x.push(list[i]);
    }
    return x;
}
reverse(jQuery(".chatmsg fieldset").map(function () {
    "use strict";
    var timestamp = jQuery("span.timestamp", this)[0],
        base = "[" + timestamp.innerHTML + "] <" + $("legend a", this)[0].innerHTML + "> ",
        flag = false,
        j;

    for (j = 0; j < this.childNodes.length; j += 1) {
        if (this.childNodes[j] === timestamp) {
            flag = j;
        }
    }
    var kid;
    for (j = flag + 1; j < this.childNodes.length; j += 1) {
        kid = this.childNodes[j];
        switch(kid.nodeName) {
            case "#text":
                base += kid.nodeValue;
                break;
            default:
                base += kid.innerHTML;
                break;
        }
    }
    return base;
})).join("~~~~")