const request = require('request');
const token = require('./secrets');
const fs = require('fs');


console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  const options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      "Authorization": token.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    const repos = JSON.parse(body);
    //console.log(repos);
    cb(err, repos);
  });
}

function downloadImageByURL(url, filePath) {

  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .on('response', function (response) {
         console.log('Response Status Code: ', response.statusCode);
         console.log("Downloading...");
       })
       .pipe(fs.createWriteStream("avatars/" + filePath + ".jpg"))
       .on('finish', function () {
          console.log("Download complete!");
       });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);

  result.forEach(function(each) {
    const avatarUrl = each.avatar_url;
    const filePath = each.login;
    downloadImageByURL(avatarUrl, filePath);
  })
});



//downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")