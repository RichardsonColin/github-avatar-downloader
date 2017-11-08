const token = require('dotenv').config();
const request = require('request');
const fs = require('fs');
const args = process.argv.slice(2);

//console.log("token", Object.keys(token.parsed)[0]);

if(args[0] === undefined) {
    throw "Need to enter an Github owner name."; // Error for missing Github owner name.
}
if(args[1] === undefined) {
    throw "Need to enter a Github repo name."; // Error for missing Github repo name.
}
if(token.error) {
  throw "The provided .env file cannot be accessed. Please provide a .env file."; // Error for missing .env file.
}
if(Object.keys(token.parsed)[0] !== "GITHUB_TOKEN") {
  throw "Please provide the proper token syntax; <GITHUB_TOKEN=token 'Github Token Number'>" // Error for improper .env file syntax.
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
    cb(err, body);
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
         console.log(`Downloading... ${url}`);
       })
       .pipe(fs.createWriteStream(filePath)).on('error', function(err) {
         if(err) {
          throw "Unfortunately, the specified folder doesn't exist." // Error if the requested write path folder doesn't exist.
         }
       })
       .on('finish', function () {
          console.log("Download complete!");
       });
}

// args are passed to complete the URL that will allow the callback function to retrieve and parse the body.
getRepoContributors(args[0], args[1], function(err, result) {
  console.log("Errors:", err);
  const repos = JSON.parse(result);
  console.log("repos", repos);

  if(repos.message === "Bad credentials") {
    throw "The provided token doesn't appear to work. Please enter it as GITHUB_TOKEN=token <token number>"; // Error for an incorrect token.
  }
  if(repos.message === "Not Found") {
    throw "The owner name or repo name is incorrect." // Error for an incorrect owner name or repo name.
  }

  // Cycles through each repoOwner's repoName's avatar_url and writes it to a file path.
  repos.forEach(function(each) {
    downloadImageByURL(each.avatar_url, `avatars/${each.login}.jpg`);
  });
});