import { ChatCompletionCreateParams } from 'openai/resources/chat/index'

export const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: 'get_repository_content',
    description:
      'Get the content of a file or directory in a GitHub repository.',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'The owner of the GitHub repository.'
        },
        repo: {
          type: 'string',
          description: 'The name of the GitHub repository.'
        },
        path: {
          type: 'string',
          description: 'The path to the file or directory in the repository.'
        }
      },
      required: ['owner', 'repo', 'path']
    }
  },
  {
    name: 'get_issue_comments',
    description: 'Get the comments on a GitHub issue.',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'The owner of the GitHub repository.'
        },
        repo: {
          type: 'string',
          description: 'The name of the GitHub repository.'
        },
        issue_number: {
          type: 'number',
          description: 'The number of the GitHub issue.'
        }
      },
      required: ['owner', 'repo', 'issue_number']
    }
  },
  {
    name: 'get_issues',
    description: 'Get the issues in a GitHub repository.',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'The owner of the GitHub repository.'
        },
        repo: {
          type: 'string',
          description: 'The name of the GitHub repository.'
        }
      },
      required: ['owner', 'repo']
    }
  },
  {
    name: 'get_pull_request_comments',
    description: 'Get the comments on a GitHub pull request.',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'The owner of the GitHub repository.'
        },
        repo: {
          type: 'string',
          description: 'The name of the GitHub repository.'
        },
        pull_request_number: {
          type: 'number',
          description: 'The number of the GitHub pull request.'
        }
      },
      required: ['owner', 'repo', 'pull_request_number']
    }
  },
  {
    name: 'get_pull_requests',
    description: 'Get the pull requests in a GitHub repository.',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'The owner of the GitHub repository.'
        },
        repo: {
          type: 'string',
          description: 'The name of the GitHub repository.'
        }
      },
      required: ['owner', 'repo']
    }
  },
  {
    name: 'get_latest_pull_request',
    description: 'Get the latest pull request in a GitHub repository.',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'The owner of the GitHub repository.'
        },
        repo: {
          type: 'string',
          description: 'The name of the GitHub repository.'
        }
      },
      required: ['owner', 'repo']
    }
  },
  {
    name: 'get_repository_details',
    description: 'Get details about a GitHub repository.',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'The owner of the GitHub repository.'
        },
        repo: {
          type: 'string',
          description: 'The name of the GitHub repository.'
        }
      },
      required: ['owner', 'repo']
    }
  },
  {
    name: 'get_user_details',
    description: 'Get details about a GitHub user.',
    parameters: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'The GitHub username of the user.'
        }
      },
      required: ['username']
    }
  },
  {
    name: 'list_user_repositories',
    description: 'List repositories owned by a GitHub user.',
    parameters: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'The GitHub username of the user.'
        }
      },
      required: ['username']
    }
  },
  {
    name: 'search_repositories',
    description: 'Search for GitHub repositories based on a query.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query for repositories.'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_repo_contributors',
    description: 'Get contributors of a GitHub repository.',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'The owner of the GitHub repository.'
        },
        repo: {
          type: 'string',
          description: 'The name of the GitHub repository.'
        }
      },
      required: ['owner', 'repo']
    }
  }
]

async function githubApiRequest(path: string, options = {}) {
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
  }

  const response = await fetch(`https://api.github.com${path}`, {
    headers,
    ...options
  })

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`)
  }

  return await response.json()
}

async function get_repository_content(
  owner: string,
  repo: string,
  path: string
) {
  const content = await githubApiRequest(
    `/repos/${owner}/${repo}/contents/${path}`
  )
  return content
}

async function get_issue_comments(
  owner: string,
  repo: string,
  issueNumber: number
) {
  const comments = await githubApiRequest(
    `/repos/${owner}/${repo}/issues/${issueNumber}/comments`
  )
  return comments
}

async function get_issues(owner: string, repo: string) {
  const issues = await githubApiRequest(`/repos/${owner}/${repo}/issues`)
  return issues
}

async function get_pull_request_comments(
  owner: string,
  repo: string,
  pullRequestNumber: number
) {
  const comments = await githubApiRequest(
    `/repos/${owner}/${repo}/pulls/${pullRequestNumber}/comments`
  )
  return comments
}

async function get_latest_pull_request(owner: string, repo: string) {
  const pullRequests = await githubApiRequest(
    `/repos/${owner}/${repo}/pulls?sort=created&direction=desc`
  )

  if (pullRequests.length > 0) {
    const latestPullRequest = pullRequests[0]

    return latestPullRequest
  }
}

async function get_pull_requests(owner: string, repo: string) {
  const pullRequests = await githubApiRequest(`/repos/${owner}/${repo}/pulls`)
  return pullRequests
}

async function get_repository_details(owner: string, repo: string) {
  const details = await githubApiRequest(`/repos/${owner}/${repo}`)
  return details
}

async function get_user_details(username: string) {
  const userDetails = await githubApiRequest(`/users/${username}`)
  return userDetails
}

async function list_user_repositories(username: string) {
  const repositories = await githubApiRequest(`/users/${username}/repos`)
  return repositories
}

async function search_repositories(query: string) {
  const encodedQuery = encodeURIComponent(query) // Ensure the query is properly encoded
  const searchResults = await githubApiRequest(
    `/search/repositories?q=${encodedQuery}`
  )
  return searchResults
}

async function get_repo_contributors(owner: string, repo: string) {
  const contributors = await githubApiRequest(
    `/repos/${owner}/${repo}/contributors`
  )
  return contributors
}

export async function runFunction(name: string, args: any) {
  switch (name) {
    case 'get_repository_content':
      return await get_repository_content(args.owner, args.repo, args.path)
    case 'get_issue_comments':
      return await get_issue_comments(args.owner, args.repo, args.issue_number)
    case 'get_issues':
      return await get_issues(args.owner, args.repo)
    case 'get_pull_request_comments':
      return await get_pull_request_comments(
        args.owner,
        args.repo,
        args.pull_request_number
      )
    case 'get_latest_pull_request':
      return await get_latest_pull_request(args.owner, args.repo)
    case 'get_pull_requests':
      return await get_pull_requests(args.owner, args.repo)
    case 'get_repository_details':
      return await get_repository_details(args.owner, args.repo)
    case 'get_user_details':
      return await get_user_details(args.username)
    case 'list_user_repositories':
      return await list_user_repositories(args.username)
    case 'search_repositories':
      return await search_repositories(args.query)
    case 'get_repo_contributors':
      return await get_repo_contributors(args.owner, args.repo)
    default:
      return null
  }
}
