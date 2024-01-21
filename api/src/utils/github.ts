import { Octokit } from "@octokit/core";

export const fetchRepoInfo = async (owner: string, repo: string) => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const repoCollaboratorResponse = await octokit.request(
    `GET /repos/${owner}/${repo}/collaborators`,
    {
      owner,
      repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const commitsResponse = await octokit.request(
    `GET /repos/${owner}/${repo}/commits`,
    {
      owner,
      repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  const commitData = commitsResponse.data.map((commit) => ({
    id: commit.author.id,
  }));

  // count for every user, how many commits they have
  const commitCount = commitData.reduce((acc, curr) => {
    if (acc[curr.id]) {
      acc[curr.id] += 1;
    } else {
      acc[curr.id] = 1;
    }
    return acc;
  }, {});

  const issueOrPR = await octokit.request(
    `GET /repos/${owner}/${repo}/issues?state=all`,
    {
      owner,
      repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const countIssueOrPr = issueOrPR.data.reduce((acc, curr) => {
    if (acc[curr.user.id]) {
      acc[curr.user.id] += 1;
    } else {
      acc[curr.user.id] = 1;
    }
    return acc;
  }, {});

  const repoCollaborator = repoCollaboratorResponse.data.map(
    (collaborator) => ({
      userName: collaborator.login,
      avatar: collaborator.avatar_url,
      type: collaborator.type,
      id: collaborator.id,
      numberOfCommits: commitCount[collaborator.id],
      numberOfIssueOrPr: countIssueOrPr[collaborator.id],
    })
  );

  const repoInfo: any = await octokit.request(`GET /repos/${owner}/${repo}`, {
    owner,
    repo,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const repoInfoFormatted = {
    repoName: repoInfo.data.name,
    repoDescription: repoInfo.data.description,
    repoUrl: repoInfo.data.html_url,
    repoStars: repoInfo.data.stargazers_count,
    repoForks: repoInfo.data.forks_count,
    repoWatchers: repoInfo.data.watchers_count,
    repoOpenIssues: repoInfo.data.open_issues_count,
    visibility: repoInfo.private ? "private" : "public",
    topics: repoInfo.data.topics,
  };

  return { repoInfoFormatted, repoCollaborator };
};

export const fetchUserRepos = async (userId: string) => {
  const reposJson = await fetch(`https://api.github.com/users/${userId}/repos`);
  const repos = await reposJson.json();

  const reposFormatted = repos.map((repo: any) => ({
    name: repo.name,
    fullName: repo.full_name,
    private: repo.private,
    description: repo.description,
    url: repo.html_url,
  }));
  return reposFormatted;
};
