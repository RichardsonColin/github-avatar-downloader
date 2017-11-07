require('dotenv').config();
const request = require('request');
//const token = require('./secrets');
const fs = require('fs');
const args = process.argv.slice(2);


// If the user doesn't enter the required arguements, errors are thrown.
if(args[0] === undefined) {
    throw "Need to enter an owner name.";
}
if(args[1] === undefined) {
    throw "Need to enter a repo name.";
}

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  const options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      "Authorization": process.env.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    const repos = JSON.parse(body);
    cb(err, repos);
  });
}

// Requests a URL and writes it to a specified file path.
function downloadImageByURL(url, filePath) {

  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .on('response', function (response) {
         console.log('Response Status Code: ', response.statusCode);
         console.log("Downloading...");
       })
       .pipe(fs.createWriteStream("avatars/test/" + filePath + ".jpg"))
       .on('finish', function () {
          console.log("Download complete!");
       });
}

// args are passed to complete the URL that will allow the callback function to retrieve and parse the body.
getRepoContributors(args[0], args[1], function(err, result) {
  console.log("Errors:", err);

  // Cycles through each repoOwner's repoName's avatar_url and writes it to a file path.
  result.forEach(function(each) {
    var avatarUrl = each.avatar_url;
    var filePath = each.login;
    downloadImageByURL(avatarUrl, filePath);
  });
});