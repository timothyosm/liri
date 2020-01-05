require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment');
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var nodeArgs = process.argv;
var userInput = "";
var nextUserInput = "";
for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        userInput = userInput + "%20" + nodeArgs[i];
    }
    else {
        userInput += nodeArgs[i];
    }
    console.log(userInput);
}
for (var i = 3; i < nodeArgs.length; i++) {
    nextUserInput = userInput.replace(/%20/g, " ");
}
var userCommand = process.argv[2];
console.log(userCommand);
console.log(process.argv);
runLiri();
function runLiri() {
    switch (userCommand) {
        case "concert-this":
            var queryURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp"
            request(queryURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var data = JSON.parse(body);
                    for (var i = 0; i < data.length; i++) {
                        console.log("Venue: " + data[i].venue.name);
                        if (data[i].venue.region == "") {
                            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);
                        } else {
                            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country);
                        }
                        var date = data[i].datetime;
                        date = moment(date).format("MM/DD/YYYY");
                        console.log("Date: " + date)
                        console.log("----------------")
                    }
                }
            });
            break;
        case "spotify-this-song":
            console.log("here");
            if (!userInput) {
                userInput = "The%20Sign";
                nextUserInput = userInput.replace(/%20/g, " ");
            }
            fs.appendFileSync("log.txt", nextUserInput + "\n----------------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });
            console.log(spotify);
            spotify.search({
                type: "track",
                query: userInput
            }, function (err, data) {
                if (err) {
                    console.log("Error occured: " + err)
                }
                var info = data.tracks.items
                for (var i = 0; i < info.length; i++) {
                    var albumObject = info[i].album;
                    var trackName = info[i].name
                    var preview = info[i].preview_url
                    var artistsInfo = albumObject.artists
                    for (var j = 0; j < artistsInfo.length; j++) {
                        console.log("Artist: " + artistsInfo[j].name)
                        console.log("Song Name: " + trackName)
                        console.log("Preview of Song: " + preview)
                        console.log("Album Name: " + albumObject.name)
                        console.log("----------------")
                    }
                }
            })
            break;
        case "movie-this":
            if (!userInput) {
                userInput = "Mr%20Nobody";
                nextUserInput = userInput.replace(/%20/g, " ");
            }
            var queryURL = "https://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy"
            request(queryURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var info = JSON.parse(body);
                    console.log("Title: " + info.Title)
                    console.log("Release Year: " + info.Year)
                    console.log("OMDB Rating: " + info.Ratings[0].Value)
                    console.log("Rating: " + info.Ratings[1].Value)
                    console.log("Country: " + info.Country)
                    console.log("Language: " + info.Language)
                    console.log("Plot: " + info.Plot)
                    console.log("Actors: " + info.Actors)
                }
            });

            break;
    }
}
if (userCommand == "do-what-it-says") {
    var fs = require("fs");
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }
        var textArr = data.split(",");
        userCommand = textArr[0];
        userInput = textArr[1];
        nextUserInput = userInput.replace(/%20/g, " ");
        runLiri();
    })
}

