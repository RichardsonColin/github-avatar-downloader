const request = require('request');
const token = require('./secrets')

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

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  //console.log("Result:", result);

  result.forEach(function(each) {
    console.log(each.avatar_url);
  })
});