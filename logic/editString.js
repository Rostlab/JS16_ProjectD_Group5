/*
edit the string:
- remove white space
- add #
so we get the hashtag name for the character
*/
function (text) {
	 /* body... */ 
	 return '#'+text.replace(/\s+/g, '')
}
