const TESTING = false;

// Load github public repos
export function getTopGithubRepos(count) {

  let url = `https://api.github.com/search/repositories?q=stars:%3E1&sort=stars&per_page=${count}`

  if (TESTING) {
    // Fixture for local testing
    url = 'http://localhost:3000/repositories.json'  
  }

  return fetch(url).then(response => response.json())

}

// Load repo commits
export function getRepoCommits(owner, repo) {

  let url = `https://api.github.com/repos/${owner}/${repo}/commits`

  if (TESTING) {
    // Fixture for local testing
    url = 'http://localhost:3000/commits.json'  
  }

  return fetch(url).then(response => response.json())

}
