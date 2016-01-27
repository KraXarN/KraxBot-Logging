// SETUP

var botUserName = "enter-name";
var botPassword = "enter-password";
var botGuardCode = "enter-code";

// SOURCE CODE

var fs = require('fs');
var Steam = require('steam');
var request = require('request');

var curtime = 0;
var curhour = 0;
var curmin = 0;
var curhouri = 0;
var curmini = 0;
var curday = 0;

setInterval(function(){
	var date = new Date();
	curhouri = date.getHours();
	curmini = date.getMinutes();
	curday = date.getDay();

	if (curmini.toString().length == 1) { curmin = "0" + curmini; } else { curmin = curmini; }

	if (curhouri.toString().length == 1) { curhour = "0" + curhouri; } else { curhour = curhouri; }

	curtime = curhour + ":" + curmin;
}, 60000);

var bot = new Steam.SteamClient();
bot.logOn({
	accountName: botUserName,
	password: botPassword,
	authCode: botGuardCode,
	shaSentryfile: fs.readFileSync('sentryfile')
});

bot.on('sentry',function(sentryHash) {
  require('fs').writeFile('sentryfile',sentryHash,function(err) {
    if(err){
      console.log(err);
    } else {
      console.log('[S] Saved sentry file hash saved.');
    }
  });
});

bot.on('loggedOn', function() {
	console.log('[S] [' + curtime + '] Logged in!');
});

bot.on('loggedOff', function() {
	console.log('[S] [' + curtime + '] Logged out!');
});

bot.on('friend', function(userID, relationship) {

	try {
		var userName = bot.users[chatter].playerName;
	} catch(err) {
		console.log("[E] " . err);
		var userName = "Unknown";
	}

	if (relationship == Steam.EFriendRelationship.Friend) { // 3
		console.log("[S] [" + curtime + "] Now friends with " + userName + " ( " + userID + " )");
	}

	if (relationship == Steam.EFriendRelationship.Blocked) { // 1
		console.log("[S] [" + curtime + "] Blocked " + userName + " ( " + userID + " )");
	}

	if (relationship == Steam.EFriendRelationship.None) { // 0
		console.log("[S] [" + curtime + "] Removed friend " + userName + " ( " + userID + " )");
	}

	if (relationship == Steam.EFriendRelationship.Ignored) { // 5
		console.log("[S] [" + curtime + "] Ignored " + userName + " ( " + userID + " )");
	}

	if (relationship == Steam.EFriendRelationship.RequestRecipient) { // 2
		console.log("[S] [" + curtime + "] Recipient request from " + userName + " ( " + userID + " )");
	}

	if (relationship == Steam.EFriendRelationship.RequestInitiator) { // 4
		console.log("[S] [" + curtime + "] RequestInitiator from " + userName + " ( " + userID + " )");
	}

	if (relationship == Steam.EFriendRelationship.PendingInviter) { // 4
		console.log("[S] [" + curtime + "] Friend invite sent to " + userName + " ( " + userID + " )");
	}

	if (relationship == Steam.EFriendRelationship.IgnoredFriend) { // 6
		console.log("[S] [" + curtime + "] Ignored friend " + userName + " ( " + userID + " )");
	}

	if (relationship == Steam.EFriendRelationship.SuggestedFriend) { // 7
		console.log("[S] [" + curtime + "] Suggested " + userName + " ( " + userID + " )");
	}

});

bot.on('friendMsg', function(chatter, message, type) {

	if (message) {
		var name = bot.users[chatter].playerName;
		console.log('[F] [' + curtime + '] ' + name + ': ' + message);
	}

});

bot.on('error', function(e) {
	console.log('[E] [' + curtime + '] ' + e);
});

process.on('uncaughtException', function(err) {
	console.log('[E] [' + curtime + '] Caught exception: ' + err);
});
