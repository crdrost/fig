# Version 1.01 #
Version 1.01 is a project from 2011-01-23 and 2011-01-24.
## a ##
* Should avoid a bug introduced by GreaseMonkey 0.9.0. If it does, then this 
    would make this script Firefox 4-compatible.
* Refactored codebase. The biggest difference is that I am now using spaces 
    instead of tab characters, but there are minor ones too.
* The sandbox()-ed code will not run if the script is not 'running'. The script 
    right now stops running if it detects that you are not logged in, fixing a 
    bug where the script would complain if you weren't logged in.
* Errors should now give a small text string saying where they came from; the 
    code refactor has also broken the code up a bit to give more detail in this 
    regard.
## b ##
* Added this changelog.
* Removed a bug which would reset your color to mine, still in the script from
    a testing moment.


# Version 1.00b #

First release that I was advertising to Fig Hunters: added Chromium support, at 
least for the version that I was using. Should be complete with these features:

* Tab-complete: typing 'd' and then a tab key should autofill 'Drostie' when I 
    am in the room.
* Emotes: if you type /me at the beginning of a chat message, it should fill in 
    your [u####] tag.
* Autocoloring: In a "Chat Options" menu you can set a color, which will be 
    filled in automatically when you chat.

# Current Features #
* Tab-complete: other chatters' names can be completed by typing the first few 
  characters of their name and then pressing the tab key. If there are multiple 
  possibilities, keep pressing tab to cycle through them. (There may be bugs if 
  you hit enter or spacebar immediately after the tab-complete happens and the 
  submit button is hit prematurely; if you have a reliable way of reproducing 
  this bug, PM Drostie about it.)
* /me emotes: If your chat text begins with `/me`, the script will look up your 
  user ID and convert it to your profile link, which is how a lot of Fig 
  Hunters have been expressing their emotes.
* Autocoloring: One of the options available provides a color text. This color 
  is automatically applied to any text that you write. If you write your own 
  colors within a text, the script will automatically reformat your text so 
  that your own colors take priority. 

# How to Install #

On Firefox: install the [GreaseMonkey][gm] add-on and then visit this page:

>   [https://github.com/drostie/fig/raw/master/fighunter_chat.user.js][raw]

GreaseMonkey should automatically detect this as a valid user script and offer 
to install it. Do *not* click the .user.js link provided by GitHub above; it 
will be falsely autodetected by GreaseMonkey as a valid script, when in fact 
it links to an HTML-formatted document which is not valid as a GreaseMonkey 
script.

On Chrome: you won't need to install anything extra, just click the link above.

**How you know it's working**: On any Fig Hunter page, you should now see a 
little link by the "Edit Stats" page called "Chat Options". Click that and you 
will be able to select from the color you want to use for autocoloring. The 
other option, used for flashing the window title when someone says your name, 
is not yet implemented. 

# Legal Stuff #

Much of the codebase is a copy of jQuery and Sizzle, which are copyrighted by 
John Resig and the Dojo Foundation respectively, and are both used under the
open-source MIT License. The exact licenses used are provided as files here: 
jQuery.license and Sizzle.license, respectively.

To the extent possible by law, I hereby waive all copyright and any related 
rights to the remaining code under the Creative Commons Zero waiver/license, 
which you may read online at:

>    [http://creativecommons.org/publicdomain/zero/1.0/legalcode][cc]

This means that you may copy, distribute, modify, and use my code without any 
fear of lawsuits from me. As it says at the above URL, my code is provided 
with NO WARRANTIES OF ANY KIND. I do humbly request that you provide me some 
sort of attribution or credit if you use it; but I leave that decision up to 
you. 

[raw]: https://github.com/drostie/fig/raw/master/fighunter_chat.user.js
[fh]: http://www.fighunter.com/
[cc]: http://creativecommons.org/publicdomain/zero/1.0/legalcode
[gm]: https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/