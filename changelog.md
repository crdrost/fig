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
