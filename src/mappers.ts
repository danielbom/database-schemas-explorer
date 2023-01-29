import { define } from 'src/lib/mapper'
import * as Github from 'src/github/types'
import * as Prisma from '@prisma/client'

export const mappers = {
  GithubRepository: {
    PrismaRepository: define<Github.Repository, Prisma.Repository>({
      id: (it) => it.id,
      name: (it) => it.name,
      owner: (it) => it.owner.login,
      full_name: (it) => it.full_name,
      html_url: (it) => it.html_url,
      description: (it) => it.description || null,
      url: (it) => it.url,
      contents_url: (it) => it.contents_url,
      created_at: (it) => new Date(it.created_at),
      updated_at: (it) => new Date(it.updated_at),
      pushed_at: (it) => new Date(it.pushed_at),
      size: (it) => it.size,
      stargazers_count: (it) => it.stargazers_count,
      watchers_count: (it) => it.watchers_count,
      language: (it) => it.language || null,
      forks_count: (it) => it.forks_count,
      archived: (it) => it.archived,
      disabled: (it) => it.disabled,
      open_issues_count: (it) => it.open_issues_count,
      license: (it) => it.license?.name || null,
      allow_forking: (it) => it.allow_forking,
      topics: (it) => (it.topics.length > 0 ? it.topics.join(',') : null),
      open_issues: (it) => it.open_issues,
      watchers: (it) => it.watchers,
      default_branch: (it) => it.default_branch,
      score: (it) => it.score,
      raw_request: (it) => JSON.stringify(it),
    }),
  },
  GithubTree: {
    PrismaFileTree: define<Github.Tree, Omit<Prisma.FilesTree, 'id' | 'repositoryId'>>({
      mode: (it) => it.mode,
      path: (it) => it.path,
      sha: (it) => it.sha,
      size: (it) => it.size || null,
      type: (it) => it.type,
      url: (it) => it.url!,
      content: () => null,
    }),
  },
}
