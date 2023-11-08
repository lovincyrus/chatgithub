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
  try {
    const content = await githubApiRequest(
      `/repos/${owner}/${repo}/contents/${path}`
    )
    return content
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function get_issue_comments(
  owner: string,
  repo: string,
  issueNumber: number
) {
  try {
    const comments = await githubApiRequest(
      `/repos/${owner}/${repo}/issues/${issueNumber}/comments`
    )
    return comments
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function get_issues(owner: string, repo: string) {
  try {
    const issues = await githubApiRequest(`/repos/${owner}/${repo}/issues`)
    return issues
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function get_pull_request_comments(
  owner: string,
  repo: string,
  pullRequestNumber: number
) {
  try {
    const comments = await githubApiRequest(
      `/repos/${owner}/${repo}/pulls/${pullRequestNumber}/comments`
    )
    return comments
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function get_latest_pull_request(owner: string, repo: string) {
  try {
    const pullRequests = await githubApiRequest(
      `/repos/${owner}/${repo}/pulls?sort=created&direction=desc`
    )

    if (pullRequests.length > 0) {
      const latestPullRequest = pullRequests[0]

      return latestPullRequest
    } else {
      throw new Error('No pull requests found in the repository.')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function get_pull_requests(owner: string, repo: string) {
  try {
    const pullRequests = await githubApiRequest(`/repos/${owner}/${repo}/pulls`)
    return pullRequests
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function runFunction(name: string, args: any) {
  // Find the GitHub function with the given name
  const githubFunction = functions.find(func => func.name === name)

  if (!githubFunction) {
    throw new Error(`GitHub function '${name}' not found.`)
  }

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
    default:
      throw new Error(`Unsupported GitHub function '${name}'.`)
  }
}
