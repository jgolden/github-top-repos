import { useState } from 'react';

import moment from 'moment';

function RepoCard(props) {

  const [loadedCommits, setLoadedCommits] = useState(false);

  const { item, commits } = props;
  
  const now = moment();
  
  const updatedDate = moment(item.pushed_at);
  
  // Filter to commits in last 24 hours
  const recentCommits = commits && commits.filter((commit) => {
    const commitDate = moment(commit.commit.author.date);
    
    return now.diff(commitDate, 'days') < 1;
  });
  
  const onMouseEnter = () => {
    if (!loadedCommits) {
      setLoadedCommits(true);
      props.onViewCommits(item.id, item.owner.login, item.name);
    }
  }

  return (
    <div className="repo-card"
      onMouseEnter={onMouseEnter}
    >
      <div className="card-body">
      
        <div className="name">
          {item.name}
        </div>
        
        <div className="url">
          <a href={item.html_url}>{item.html_url}</a>
        </div>
        
        <div className="stars">
          {Number(item.stargazers_count).toLocaleString()} 
          <img width="20" src="star.png" alt="stars" />
        </div>

      </div>
      
      <div className="card-details">
        
        <div className="updated">
          Last updated {updatedDate.format('MMM Do YYYY')}
        </div>
   
        <div className="commits">
          {recentCommits && recentCommits.map((commit) => {
            return (            
              <div
                key={commit.sha}
                className="commit"
              >
                <div className="message">
                  <span className="sha">{commit.sha.substring(0,6)}</span>
                  {' '}
                  {commit.commit.message.substring(0, 60)}
                </div>
                <div className="author">
                  by <strong>{commit.author ? commit.author.login : 'author' }</strong>
                  {' '}
                  {moment(commit.commit.author.date).fromNow()}
                </div>
              </div>
            );
          })}
        </div>
        
        {recentCommits && recentCommits.length === 0 &&
          <div>No recent commits</div> 
        }
        
      </div>

      <div className="number">{props.number}</div>
     
    </div>
  );
}

export default RepoCard;
