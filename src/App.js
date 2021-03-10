import React, { useState, useEffect } from 'react';

import './App.css';

import RepoCard from './components/repocard';

import { getTopGithubRepos, getRepoCommits } from './apis/github';

function App() {

  const [items, setItems] = useState([]);
  const [commits, setCommits] = useState({});
  
  useEffect(() => {
    getTopGithubRepos(100)
      .then(data => {
        setItems(data.items);
      })
  }, []);
  
  const viewCommits = (id, owner, repo) => {
    // Check if commits are loaded in state already    
    if (!commits[id]) {
      // Otherwise load them, then show them
      getRepoCommits(owner, repo)
        .then(data => {
          // Create copy of commits hash so it updates
          let commitsCopy = Object.assign({}, commits);
          commitsCopy[id] = data;
          
          setCommits(commitsCopy);
        });
    }
  }

  return (
    <div className="App">
      <div className="logo">
        <img width="300" src="logo.png" alt="Github Top 100 Starred Repos" />
      </div>
      
      <p className="instructions">Hover over any repo to view more information</p>
      
      <div className="repo-items">
        {items && items.map((item, index) => {
          return (            
            <RepoCard
              key={item.id}
              item={item}
              number={index+1}
              onViewCommits={viewCommits}
              commits={commits[item.id]}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
